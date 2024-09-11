import * as React from 'react';
import Modal from 'react-modal';
import axios from "axios";
import { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messageAuth, setMessageAuth] = useState(false);

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  const sendLogInInfo=async(e)=>{
    e.preventDefault();
    await axios.post('http://127.0.0.1:8000/api/login', formData)
        .then(({data})=>{
            console.log(data.message);
            localStorage.setItem("token", data["token"]);
            localStorage.setItem("userName", data["user"]["name"]);
            localStorage.setItem("isAuth", "true");
            window.location.href="/";
        }).catch(({response})=>{
            setMessageAuth(true);
            console.log(response.data.error);
        });
  };
  return (
    <>
    {messageUnauthScreen(messageAuth,setMessageAuth)}
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={sendLogInInfo}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">{t("sign in")}</h3>
          <div className="form-group mt-3">
            <label>{t("email address")}</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={(e)=>{setEmail(e.target.value)}}
            />
          </div>
          <div className="form-group mt-3">
            <label>{t("password")}</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={(e)=>{setPassword(e.target.value)}}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button  type="submit" className="btn btn-primary">
              {t("submit")}
            </button>
          </div>
          <p className="forgot-password text-right mt-2">
            <a href="#">{t("forgot password")}</a>
          </p>
        </div>
      </form>
    </div>
  </>
  )
}

function messageUnauthScreen(messageAuth,setMessageAuth){
  return(
      <>
      <Modal
        isOpen={messageAuth}
        onRequestClose={()=>setMessageAuth(false)}
        style={{
            overlay:{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content:{
                marginLeft:"22vw",
                alignSelf:"center",
                width:"50vw",
                height:"50vh",
            }
        }}
      >
          <div className='col' style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <img className='row' src='https://static.vecteezy.com/system/resources/previews/012/042/292/original/warning-sign-icon-transparent-background-free-png.png'  height={"150px"} width={"200px"}/>
              <h5 className='row' style={{color:"red",textAlign:"center"}}>This email or password is incorrect</h5>
              <button className='btn btn-success mt-4' onClick={()=>setMessageAuth(false)}>try again</button>
          </div>
      </Modal>
    </>
  );
}

