import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import ReactToPrint from "react-to-print";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let companyArray=[];
let totalGoodsValue=0;
let totalGoodsQuantity=0;
let totalPayment=0;


export default function CompanyDetails(){
    const { i18n, t } = useTranslation();
    const location = useLocation();

    let date=new Date();
    let thisMonth='';
    const thisYear=date.getFullYear();
    date.getMonth()+1<10 ? thisMonth=`0${date.getMonth()+1}` : thisMonth=date.getMonth()+1;
    const companyData=location.state.data;
    let componentRef=useRef();

    const [total, setTotal] = useState(0);
    const [month, setMonth] = useState(`${thisYear}-${thisMonth}`);

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post(`http://127.0.0.1:8000/api/store/company/${companyData.id}`,formData, config)
        .then(response => {
            setTotal(response.data['total']);
            setMonth(response.data['month']);
            company(response.data['output'],response.data['payment'],companyData,response.data['month']);
        })
    }
    

    const fetchThiscompanyData = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/company/${companyData.id}`,config).then(({ data }) => {
            setTotal(data['total']);
            setMonth(data['month']);
            company(data['inputs'],data['payments'],companyData,data['month']);
        });
    }
    useEffect(() => {
        fetchThiscompanyData();
      }, []);

    return (
        <div className='p-1'>
            {companyDataTable(companyData,total,t)}
            {companyTable(componentRef,month,setMonth,handleSubmit,t)}
        </div>
    );
}

function companyDataTable(companyData,total,t){
    return (
        <>
            <img class="mb-3" src={`http://127.0.0.1:8000/storage/storeCompany/image/${companyData.image}`} alt='لا يوجد صوره لعرضها' height="100px"/>
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover" id="shopTable">
                    <thead>
                        <tr>
                            <th>{t("id")}</th>
                            <th>{t("company name")}</th>
                            <th>{t("company address")}</th>
                            <th>{t("phone")}</th>
                            <th>{t("discount")}</th>
                            <th>{t("amount")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{companyData.company_id}</td>
                            <td>{companyData.company_name}</td>
                            <td>{companyData.company_address}</td>
                            <td>{companyData.company_phone}</td>
                            <td>{companyData.discount}</td>
                            <td>{total.toFixed(2)}</td>
                            <td><Link to="/company/edit" state={{ data: companyData }} type="button" class="btn btn-success" style={{height: "auto"}}>{t("edit")}</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function companyTable(componentRef,month,setMonth,handleSubmit,t){
    return (
        <>
            <div class="d-flex justify-content-between mb-2" style={{alignItems:"center"}}>
                <ReactToPrint
                    trigger={() => {
                        return <button className='btn btn-outline-success'>{t("print")}</button>;
                    }}
                    content={() => componentRef}
                />
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                    <form onSubmit={handleSubmit}>
                        <input type="submit" value={t("show")} class="btn btn-light border mx-2 px-4 py-1"/>
                        <input onChange={(e)=>{setMonth(e.target.value);}} type='month'/>
                    </form>
                </div>
            </div>
            <div class="table-responsive" ref={(el) => (componentRef = el)}>
                <table class="table table-striped table-bordered table-hover" id="shopTable">
                    <thead>
                        <tr>
                            <th>{t("day")}</th>
                            <th>{t("goods value")}</th>
                            <th>{t("goods quantity")}</th>
                            <th>{t("payments")}</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {
                            companyArray.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.day}</td>
                                        <td>{(item.goodsValue).toFixed(2)}</td>
                                        <td>{item.goodsQuantity}</td>
                                        <td>{(item.payment).toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>{month}</th>
                            <th>{totalGoodsValue}</th>
                            <th>{totalGoodsQuantity}</th>
                            <th>{totalPayment}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function company(inputs,payments,companyData,month){
    let day='';
    let goodsValue=0;
    let goodsQuantity=0;
    let payment=0;
    totalGoodsValue=0;
    totalGoodsQuantity=0;
    totalPayment=0;

    for (let i=1; i <=31; i++) {
        day=`${month}-${i<10 ? `0${i}` : i}`;
        inputs.map((item,index) => {
            if (item.day == `${i<10 ? `0${i}` : i}`) {
                goodsValue += item.value;
                totalGoodsValue+=item.value;
                goodsQuantity+=item.quantity;
                totalGoodsQuantity+=item.quantity;
            }
        })
        payments.map((item,index) => {
            if (item.day == `${i<10 ? `0${i}` : i}`) {
                payment += item.amount;
                totalPayment+=item.amount;
            }
        })

        companyArray[i]={
            'day':day,
            'goodsValue':goodsValue,
            'goodsQuantity':goodsQuantity,
            'payment':payment,
            'totalGoodsValue':totalGoodsValue,
            'totalGoodsQuantity':totalGoodsQuantity,
            'totalPayment':totalPayment
        };
        day='';
        goodsValue=0;
        goodsQuantity=0;
        payment=0;

    }

}
