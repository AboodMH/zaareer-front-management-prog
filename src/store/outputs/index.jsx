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

export default function Output(){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [outputs, setOutputs] = useState([]);
    const [month, setMonth] = useState('');
    const [description,setDescription] = useState('');
    const [editDescriptionIsOpen,setEditDescriptionIsOpen] = useState([false,{}]);


    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post('http://127.0.0.1:8000/api/store/totalOutput',formData, config)
        .then(response => {
            setOutputs(response.data);
            setThisMonth(month);
            totalValue=0;
            totalQuantity=0;
            response.data.map((item,index)=>{
                totalValue+=item.totalValue;
                totalQuantity+=item.totalQuantity;
            });
        })
    }
    const fetchThisOutput = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/totalOutput',config).then(({ data }) => {
            setOutputs(data);
            totalValue=0;
            totalQuantity=0;
            data.map((item,index)=>{
                totalValue+=item.value;
                totalQuantity+=item.quantity;
            });
        });
    }
    useEffect(() => {
        fetchThisOutput();
      }, []);

    return(
        <>
            {editDescription(editDescriptionIsOpen,setEditDescriptionIsOpen,description,setDescription,t)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <Link to="/output/create" className='btn btn-outline-success'>{t("create")}</Link>
                <form className='d-flex' onSubmit={handleSubmit}>
                    <input type="submit" value={t("show")} class="btn btn-light border mx-2 px-4 py-1"/>
                    <input className='form-control' onChange={(e)=>{setMonth(e.target.value);}} type='month'/>
                </form>
            </div>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t('id')}</th>
                            <th>{t('client name')}</th>
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
                            outputs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.client_id}</td>
                                        <td>{item.client_name}</td>
                                        <td>{item.invoice_no}</td>
                                        <td>{(item.value).toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.description}</td>
                                        <td>{<Link to={'/output/details'} state={{ data: item }} className='btn btn-success'>{t("show")}</Link>}</td>
                                        <td>{<button onClick={()=>{setEditDescriptionIsOpen([true,item]);setDescription(item.description)}} className='btn btn-success'>{t("edit")} {t("description")}</button>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{thisMonth}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{totalValue.toFixed(2)}</td>
                            <td>{totalQuantity}</td>
                            <td></td>
                            <td></td>
                            <td></td>
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
        formData.append('client_name', editDescriptionIsOpen[1].client_name);
        formData.append('invoice_no', editDescriptionIsOpen[1].invoice_no);
        formData.append('description', description);
        formData.append('value', editDescriptionIsOpen[1].value);
        formData.append('quantity', editDescriptionIsOpen[1].quantity);
        
    
        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/store/totalOutput/${editDescriptionIsOpen[1].id}`, formData,config)
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