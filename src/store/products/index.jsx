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

export default function Product(){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [products, setproducts] = useState([]);
    const [data, setData] = useState({});
    const [searchProduct, setSearchProduct] = useState([]);
    const [month, setMonth] = useState('');
    const [productDesc, setProductDesc] = useState('');

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        formData.append('description',productDesc);
        axios.post('http://127.0.0.1:8000/api/store/product',formData, config)
        .then(response => {
            setData(response.data);
            setproducts(response.data);
            setSearchProduct(response.data);
        })
    }
    const fetchThisInput = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/product',config).then(({ data }) => {
            setData(data);
            setproducts(data);
            setSearchProduct(data);
        });
    }
    useEffect(() => {
        fetchThisInput();
        console.log(products);
        
      }, []);

    return(
        <>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <form onSubmit={handleSubmit} className='d-flex'>
                    <input type="submit" value={t("show")} className="mx-2 btn btn-light border px-4 py-1"/>
                    <input className=' form-control' onChange={(e)=>{setMonth(e.target.value);}} type='month'/>
                    <select className='mx-2 form-select' onChange={(e)=>{setProductDesc(e.target.value)}}>
                        <option value="">{t("all")}</option>
                        <option value="new product">{t("new product")}</option>
                        <option value="old product">{t("old product")}</option>
                    </select>
                    <input className='form-control' placeholder={t("invoice no")} onChange={(e)=>{filterTheData('invoice_no',e.target.value.toLowerCase(),data,setproducts,searchProduct);}} type='text'/>
                    <input className='mx-2 form-control' placeholder={t("product no")} onChange={(e)=>{filterTheData('product_no',e.target.value.toLowerCase(),data,setproducts,searchProduct);}} type='text'/>
                    <input className='form-control' placeholder={t("product name")} onChange={(e)=>{filterTheData('product_name',e.target.value.toLowerCase(),data,setproducts,searchProduct);}} type='text'/>
                    <input className='mx-2 form-control' placeholder={t("company name")} onChange={(e)=>{filterTheData('company_name',e.target.value.toLowerCase(),data,setproducts,searchProduct);}} type='text'/>
                </form>
            </div>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t("company name")}</th>
                            <th>{t("product no")}</th>
                            <th>{t("product name")}</th>
                            <th>{t("invoice no")}</th>
                            <th>{t("buy price")}</th>
                            <th>{t("sell price")}</th>
                            <th>{t("quantity")}</th>
                            <th>{t("packing")}</th>
                            <th>{t("description")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.company_name}</td>
                                        <td>{item.product_no}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.invoice_no}</td>
                                        <td>{item.buy_price}</td>
                                        <td>{item.sell_price}</td>
                                        <td>{item.cartoon}</td>
                                        <td>{item.packing}</td>
                                        <td>{item.description}</td>
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

function filterTheData(searchType,value,data,setInputs,searchProducts){
    let result=data.filter(check);
    function check(element){
        return element[searchType].toLowerCase().startsWith(value);
    }
    if (value) {
        setInputs(result);
    }else{
        setInputs(searchProducts);
    }
}

