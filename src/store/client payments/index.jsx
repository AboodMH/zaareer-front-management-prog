import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let totalAmount=0;

export default function Payment() {
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const navigate=useNavigate();
    const [payments, setPayments] = useState([]);
    const [month, setMonth] = useState("");

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post('http://127.0.0.1:8000/api/store/clientPayment',formData, config)
        .then(response => {
            setPayments(response.data);
            setThisMonth(month);
            totalAmount=0;
            response.data.map((item,index)=>{
                totalAmount+=item.amount;
            });
        })
    }

    const fetchClient = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/clientPayment',config).then(({ data }) => {
            setPayments(data);
            totalAmount=0;
            data.map((item,index)=>{
                totalAmount+=item.amount;
            });
        });
    }
    useEffect(() => {
        fetchClient();
      }, []);

    return(
        <div className='p-2'>
            <div class="d-flex justify-content-between mb-2" style={{alignItems:"center"}}>
            <Link to="/client/payment/create" className='btn btn-outline-success'>{t("create")}</Link>
            <form onSubmit={handleSubmit}>
                <input type="submit" value={t("show")} class="btn btn-light border mx-2 px-4 py-1"/>
                <input onChange={(e)=>{setMonth(e.target.value);}} type='month'/>
            </form>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t("id")}</th>
                            <th>{t("client name")}</th>
                            <th>{t("amount")}</th>
                            <th>{t("description")}</th>
                            <th>{t("payment method")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((item,index)=>{
                            return(
                                <tr> 
                                    <td>{item.month}-{item.day}</td>
                                    <td>{item.client_id}</td>
                                    <td>{item.client_name}</td>
                                    <td>{(item.amount).toFixed(2)}</td>
                                    <td>{item.description}</td>
                                    <td>{item.payment_method}</td>
                                    <td><Link to="/client/payment/edit" state={{ data: item }} type="button" class="btn btn-success">{t("edit")}</Link></td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{thisMonth}</td>
                            <td></td>
                            <td></td>
                            <td>{totalAmount.toFixed(2)}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}