import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function ClientCreate(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState('');

    const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    const create = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('client_name', name);
        formData.append('phone', phone);
        if (image!=='') {
            formData.append('image', image);
        }

        console.log(formData)
        
        await axios.post('http://127.0.0.1:8000/api/store/client', formData,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        })
    }
    return(
        <>
            <form className="p-4" onSubmit={create}>
                <div className="form-group mb-4">
                    <label for="name">{t("name")}</label>
                    <input onChange={(e)=>{setName(e.target.value)}} type="text" className="form-control" placeholder={t("Enter name")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="phone">{t("phone")}</label>
                    <input onChange={(e)=>{setPhone(e.target.value)}} type="text" className="form-control" placeholder={t("Enter phone")}/>
                </div>
               <div className="form-group mb-4">
                    <label for="image">{t("image")}</label>
                    <input onChange={changeHandler} type="file" className="form-control" name="image"/>
                </div>
                <div className=" d-flex justify-content-start"> 
                    <button type="submit" className="btn btn-outline-success">{t("create")}</button>
                </div>
            </form>
        </>
    );
}