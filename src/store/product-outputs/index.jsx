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

export default function ProductOutputs(){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [outputs, setOutputs] = useState([]);


    let month=localStorage.getItem('month');


    const handleSubmit=(e)=>{
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post('http://127.0.0.1:8000/api/store/totalProductOutput',formData, config)
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
        await axios.get('http://127.0.0.1:8000/api/store/totalProductOutput',config).then(({ data }) => {
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
        handleSubmit();
      }, []);

    return(
        <> 
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <form className='d-flex' onSubmit={handleSubmit}>
                    <input type="submit" value={t("show")} class="btn btn-light border mx-2 px-4 py-1"/>
                    <input className='form-control' value={month} onChange={(e)=>{localStorage.setItem('month',e.target.value);}} type='month'/>
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
                            <th>{t("buy value")}</th>
                            <th>{t("sell value")}</th>
                            <th>{t("discount")}</th>
                            <th>{t("value after discount")}</th>
                            <th>{t("quantity")}</th>
                            <th>{t("description")}</th>
                            <th>{t("details")}</th>
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
                                        <td>{(item.buy_value).toFixed(2)}</td>
                                        <td>{(item.sell_value).toFixed(2)}</td>
                                        <td>{(item.discount).toFixed(2)}</td>
                                        <td>{(item.sell_value-item.discount).toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.description}</td>
                                        <td>{<Link to={'/productOutputs/details'} state={{ data: item }} className='btn btn-success'>{t("show")}</Link>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
}