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

let clientArray=[];
let totalGoodsValue=0;
let totalGoodsQuantity=0;
let totalPayment=0;


export default function ClientDetails(){
    const { i18n, t } = useTranslation();
    const location = useLocation();

    let date=new Date();
    let thisMonth='';
    const thisYear=date.getFullYear();
    date.getMonth()+1<10 ? thisMonth=`0${date.getMonth()+1}` : thisMonth=date.getMonth()+1;
    const clientData=location.state.data;
    let componentRef=useRef();

    const [output, setOutput] = useState([]);
    const [payment, setPayment] = useState([]);
    const [total, setTotal] = useState([]);
    const [month, setMonth] = useState(`${thisYear}-${thisMonth}`);
    

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post(`http://127.0.0.1:8000/api/store/client/${clientData.client_id}`,formData, config)
        .then(response => {
            setOutput(response.data['output']);
            setPayment(response.data['payment']);
            setTotal((response.data['total']).toFixed(2));
            setMonth(response.data['month']);
            client(response.data['output'],response.data['payment'],clientData,response.data['month']);
        })
    }
    const fetchThisclientData = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/client/${clientData.client_id}`,config).then(({ data }) => {
            setOutput(data['output']);
            setPayment(data['payment']);
            setTotal(data['total'].toFixed(2));
            setMonth(data['month']);
            client(data['output'],data['payment'],clientData,data['month'])});
    }
    useEffect(() => {
        fetchThisclientData();
      }, []);

    return (
        <div className='p-1'>
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
            <img class="mb-3" src={`http://127.0.0.1:8000/storage/storeClient/image/${clientData.image}`} alt='لا يوجد صوره لعرضها' height="100px"/>
            <div ref={(el) => (componentRef = el)}>
                {clientDataTable(clientData,total,t)}
                {clientTable(componentRef,month,setMonth,handleSubmit,t)}
            </div>
        </div>
    );
}

function clientDataTable(clientData,total,t){
    return (
        <>
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover" id="shopTable">
                    <thead>
                        <tr>
                            <th>{t("id")}</th>
                            <th>{t("client name")}</th>
                            <th>{t("phone")}</th>
                            <th>{t("amount due")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{clientData.client_id}</td>
                            <td>{clientData.client_name}</td>
                            <td>{clientData.phone}</td>
                            <td>{total}</td>
                            <td><Link to="/client/edit" state={{ data: clientData }} type="button" class="btn btn-success" style={{height: "auto"}}>{t("edit")}</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function clientTable(componentRef,month,setMonth,handleSubmit,t){
    return (
        <>
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover" id="shopTable">
                    <thead>
                        <tr>
                            <th>{t("day")}</th>
                            <th>{t("goods value")}</th>
                            <th>{t("goods quantity")}</th>
                            <th>{t("payments")}</th>
                            <th>{t("description")}</th>
                            <th>{t("payment method")}</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {
                            clientArray.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.day}</td>
                                        <td>{item.goodsValue}</td>
                                        <td>{item.goodsQuantity}</td>
                                        <td>{item.payment}</td>
                                        <td>{item.description}</td>
                                        <td>{item.paymentMethod}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>{month}</th>
                            <th>{totalGoodsValue.toFixed(2)}</th>
                            <th>{totalGoodsQuantity}</th>
                            <th>{totalPayment.toFixed(2)}</th>
                            
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function client(outputs,payments,clientData,month){
    let day='';
    let goodsValue=0;
    let goodsQuantity=0;
    let payment=0;
    let description='';
    let paymentMethod='';
    totalGoodsValue=0;
    totalGoodsQuantity=0;
    totalPayment=0;

    for (let i=1; i <=31; i++) {
        day=`${month}-${i<10 ? `0${i}` : i}`;
        outputs.map((item,index) => {
            if (item.day == `${i<10 ? `0${i}` : i}`) {
                goodsValue+= item.value;
                totalGoodsValue+=item.value;
                goodsQuantity+=item.quantity;
                totalGoodsQuantity+=item.quantity;
            }
        })
        payments.map((item,index) => {
            if (item.day == `${i<10 ? `0${i}` : i}`) {
                payment += item.amount;
                totalPayment+=item.amount;
                description=item.description;
                paymentMethod=item.payment_method;
            }
        })

        clientArray[i]={
            'day':day,
            'goodsValue':goodsValue,
            'goodsQuantity':goodsQuantity,
            'payment':payment,
            'description':description,
            'paymentMethod':paymentMethod,
            'totalGoodsValue':totalGoodsValue,
            'totalGoodsQuantity':totalGoodsQuantity,
            'totalPayment':totalPayment
        };
        day='';
        goodsValue=0;
        goodsQuantity=0;
        payment=0;
        description='';
        paymentMethod='';

    }

}

