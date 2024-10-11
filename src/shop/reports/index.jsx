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

let reportArray=[];
let fullReportArray=[];


export default function ShopReport({shopName}){
    const { i18n, t } = useTranslation();

    let date=new Date();
    let thisMonth='';
    const thisYear=date.getFullYear();
    date.getMonth()+1<10 ? thisMonth=`0${date.getMonth()+1}` : thisMonth=date.getMonth()+1;
    let componentRef=useRef();

    const [year, setYear]=useState(thisYear);
    const [tableYear,setTableYear]=useState(thisYear);
    const [fullData, setFullData]=useState([]);
    

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('year',year);
        axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/report`,formData, config)
        .then(response => {
            setFullData(response.data);
            reportData(year,response.data.inputs,response.data.sells,response.data.expenses);
        });
        setTableYear(year);
    }
    const fetchThisReportData = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/report`,config).then(({ data }) => {
            setFullData(data);
            reportData(year,data.inputs,data.sells,data.expenses);
            console.log(data);
            
        });
    }
    useEffect(() => {
        fetchThisReportData();
        console.log(reportArray);
        
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
                        <input onChange={(e)=>{setYear(e.target.value);}} type='text' value={year}/>
                    </form>
                </div>
            </div>
            <div class="table-responsive" ref={(el) => (componentRef = el)}>
                <table class="table table-striped table-bordered table-hover" id="shopTable">
                    <thead>
                        <tr>
                            <th>{t("month")}</th>
                            <th>{t("sells")}</th>
                            <th>{t("expenses")}</th>
                            <th>{t("water")}</th>
                            <th>{t("electric")}</th>
                            <th>{t("rent")}</th>
                            <th>{t("internet")}</th>
                            <th>{t("other")}</th>
                            <th>{t("salaries")}</th>
                            <th>{t("net sells")}</th>
                            <th>{t("inputs")}</th>
                            <th>{t("inputs quantity")}</th>
                            <th>{t("final total")}</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {
                            reportArray.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.month}</td>
                                        <td>{item.sells}</td>
                                        <td>{item.expenses}</td>
                                        <td>{item.water}</td>
                                        <td>{item.electric}</td>
                                        <td>{item.rent}</td>
                                        <td>{item.internet}</td>
                                        <td>{item.others}</td>
                                        <td>{item.salaries}</td>
                                        <td>{item.netSells}</td>
                                        <td>{(item.inputs).toFixed(2)}</td>
                                        <td>{item.inputsQuantity}</td>
                                        <td>{(item.netSells-item.inputs).toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{tableYear}</td>
                            <td>{fullReportArray.fullSells}</td>
                            <td>{fullReportArray.fullExpenses}</td>
                            <td>{fullReportArray.fullWater}</td>
                            <td>{fullReportArray.fullElectric}</td>
                            <td>{fullReportArray.fullRent}</td>
                            <td>{fullReportArray.fullInternet}</td>
                            <td>{fullReportArray.fullOthers}</td>
                            <td>{fullReportArray.fullSalaries}</td>
                            <td>{fullReportArray.fullNetSells}</td>
                            <td>{fullReportArray.fullInputs}</td>
                            <td>{fullReportArray.fullInputsQuantity}</td>
                            <td>{(fullReportArray.fullNetSells-fullReportArray.fullInputs).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

function reportData(year,totalInputs,totalSells,totalExpenses){
    let sells=0;
    let netSells=0;
    let inputs=0;
    let inputsQuantity=0;
    let expenses=0;
    let water=0;
    let electric=0;
    let rent=0;
    let internet=0;
    let others=0;
    let salaries=0;

    let fullSells=0;
    let fullNetSells=0;
    let fullInputs=0;
    let fullInputsQuantity=0;
    let fullExpenses=0;
    let fullWater=0;
    let fullElectric=0;
    let fullRent=0;
    let fullInternet=0;
    let fullOthers=0;
    let fullSalaries=0;

    for (let i=1; i <=12; i++) {
        totalInputs.map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                inputs+=item.value;
                inputsQuantity+=item.quantity;
                fullInputs+=item.value;
                fullInputsQuantity+=item.quantity;
            }
        });
        totalSells.map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                sells+=item.total_sell;
                fullSells+=item.total_sell;
                netSells+=item.amount_in_box;
                fullNetSells+=item.amount_in_box;
                expenses+=item.total_expense;
                fullExpenses+=item.total_expense;
                salaries+=item.total_withdrawl;
                fullSalaries+=item.total_withdrawl;
            }
        });
        totalExpenses.map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                if (item.description==="ماء") {
                    water+=item.value;
                    fullWater+=item.value;
                }else if(item.description==="كهرباء"){
                    electric+=item.value;
                    fullElectric+=item.value;
                }else if(item.description==="الاجار"){
                    rent+=item.value;
                    fullRent+=item.value;
                }else if(item.description==="انترنت"){
                    internet+=item.value;
                    fullInternet+=item.value;
                }else{
                    others+=item.value;
                    fullOthers+=item.value;
                }
            }
        });

        reportArray[i]={
            month: `${year}-${i<10 ? `0${i}` : i}`,
            sells: sells,
            netSells: netSells,
            inputs: inputs,
            inputsQuantity: inputsQuantity,
            expenses: expenses,
            water: water,
            electric: electric,
            rent: rent,
            internet: internet,
            others: others,
            salaries: salaries,
            
        };
        sells=0;
        netSells=0;
        inputs=0;
        inputsQuantity=0;
        expenses=0;
        water=0;
        electric=0;
        rent=0;
        internet=0;
        others=0;
        salaries=0;

    }
    fullReportArray={
        "fullSells":fullSells,
        "fullNetSells":fullNetSells,
        "fullInputs": fullInputs.toFixed(2),
        "fullInputsQuantity": fullInputsQuantity,
        "fullExpenses": fullExpenses,
        "fullWater": fullWater,
        "fullElectric": fullElectric,
        "fullRent": fullRent,
        "fullInternet": fullInternet,
        "fullLocalExpenses": fullOthers,
        "fullSalaries": fullSalaries,
        
    }
}

