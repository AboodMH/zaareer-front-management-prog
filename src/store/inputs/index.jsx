import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let totalValue=0;
let totalQuantity=0;

export default function Input(){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const [data, setData] = useState({});
    const [searchInputs, setSearchInputs] = useState([]);
    const [editDescriptionIsOpen, setEditDescriptionIsOpen] = useState([false,{}]);
    const [description,setDescription] = useState('');


    let month=localStorage.getItem('month');


    const handleSubmit=(e)=>{
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post('http://127.0.0.1:8000/api/store/totalInput',formData, config)
        .then(response => {
            setInputs(response.data);
            setSearchInputs(response.data);
            setThisMonth(month);
            totalValue=0;
            totalQuantity=0;
            response.data.map((item, index) => {
                totalValue += item.value;
                totalQuantity += item.quantity;
            });
        })
    }
    const fetchThisInput = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/totalInput',config).then(({ data }) => {
            setData(data);
            setInputs(data);
            setSearchInputs(data);
            totalValue=0;
            totalQuantity=0;
            data.map((item, index) => {
                totalValue += item.value;totalQuantity += item.quantity;
            })
        });
    }

    useEffect(() => {
        handleSubmit();
      }, []);

    return(
        <>
            {editDescription(editDescriptionIsOpen,setEditDescriptionIsOpen,description,setDescription,t)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
            <Link to="/input/create" className='btn btn-outline-success'>{t("create")}</Link>
                <form onSubmit={handleSubmit} className='d-flex'>
                    <input type="submit" value={t("show")} className="btn btn-light border px-4 py-1"/>
                    <input className='mx-2 form-control' value={month} onChange={(e)=>{localStorage.setItem('month',e.target.value);}} type='month'/>
                    <input className='form-control' placeholder={t("invoice no")} onChange={(e)=>{filterTheData('invoice_no',e.target.value.toLowerCase(),data,setInputs,searchInputs);}} type='text'/>
                </form>
            </div>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t("id")}</th>
                            <th>{t("company name")}</th>
                            <th>{t("invoice no")}</th>
                            <th>{t("value")}</th>
                            <th>{t("quantity")}</th>
                            <th>{t("description")}</th>
                            <th>{t("details")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            inputs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.company_id}</td>
                                        <td>{item.company_name}</td>
                                        <td>{item.invoice_no}</td>
                                        <td>{(item.value).toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.description}</td>
                                        <td>{<Link to={'/input/details'} state={{ data: item }} className='btn btn-success'>{t("show")}</Link>}</td>
                                        <td>{<button onClick={()=>{setEditDescriptionIsOpen([true,item]);setDescription(item.description)}} className='btn btn-success'>{t("edit")} {t("description")}</button>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{thisMonth}</td>
                            <td>-----</td>
                            <td>-----</td>
                            <td>-----</td>
                            <td>{totalValue.toFixed(2)}</td>
                            <td>{totalQuantity}</td>
                            <td>-----</td>
                            <td>-----</td>
                            <td>-----</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function editDescription(editDescriptionIsOpen,setEditDescriptionIsOpen,description,setDescription,t){
    const edit = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('date', `${editDescriptionIsOpen[1].month}-${editDescriptionIsOpen[1].day}`);
        formData.append('company_name', editDescriptionIsOpen[1].company_name);
        formData.append('invoice_no', editDescriptionIsOpen[1].invoice_no);
        formData.append('description', description);
        formData.append('value', editDescriptionIsOpen[1].value);
        formData.append('quantity', editDescriptionIsOpen[1].quantity);
        
        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/store/totalInput/${editDescriptionIsOpen[1].id}`, formData,config)
        .then(({data})=>{
            console.log(data.message);
            window.location.reload();
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
        <Modal
          isOpen={editDescriptionIsOpen[0]}
          onRequestClose={()=>setEditDescriptionIsOpen([false,{}])}
          style={{
              overlay:{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content:{
                  marginLeft:"22vw",
                  alignSelf:"center",
                  width:"50vw",
                  height:"70vh",
              }
          }}
        >
            <div className='col'>
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("description")}</h5>
                <form onSubmit={edit}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="form-group mb-4">
                            <label for="description">{t("description")}</label>
                            <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")} value={description}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}

function filterTheData(searchType,value,data,setInputs,searchProducts){
    let result=data.filter(check);
    function check(element){
        return element[searchType].startsWith(value);
    }
    if (value) {
        setInputs(result);
    }else{
        setInputs(searchProducts);
    }
}