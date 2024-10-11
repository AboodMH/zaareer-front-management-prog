import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate,useLocation} from 'react-router-dom';
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

export default function ShopInput({shopName}){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const [data, setData] = useState({});
    const [searchInputs, setSearchInputs] = useState([]);
    const [month, setMonth] = useState('');
    const [editDescriptionIsOpen, setEditDescriptionIsOpen] = useState([false,{}]);
    const [description,setDescription] = useState("");

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput`,formData, config)
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
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput`,config).then(({ data }) => {setData(data);setInputs(data);setSearchInputs(data);totalValue=0;totalQuantity=0;data.map((item, index) => {totalValue += item.value;totalQuantity += item.quantity;})});
    }
    useEffect(() => {
        fetchThisInput();
      }, []);

    return(
        <>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <form>
                    <input className='form-control' placeholder={t("invoice no")} onChange={(e)=>{filterTheData('invoice_no',e.target.value.toLowerCase(),data,setInputs,searchInputs);}} type='text'/>
                </form>
                <form onSubmit={handleSubmit} className='d-flex'>
                    <input type="submit" value={t("show")} className="btn btn-light border px-4 py-1"/>
                    <input className='mx-2 form-control' onChange={(e)=>{setMonth(e.target.value);}} type='month'/>
                </form>
            </div>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t("invoice no")}</th>
                            <th>{t("value")}</th>
                            <th>{t("quantity")}</th>
                            <th>{t("description")}</th>
                            <th>{t("details")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            inputs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.invoice_no}</td>
                                        <td>{(item.value).toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.description}</td>
                                        <td>{<Link to={`/shop/${shopName}/input/details`} state={{ data: item }} className='btn btn-success'>{t("show")}</Link>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{thisMonth}</td>
                            <td>-----</td>
                            <td>{totalValue.toFixed(2)}</td>
                            <td>{totalQuantity}</td>
                            <td>-----</td>
                            <td>-----</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
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