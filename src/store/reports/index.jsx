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


export default function Report(){
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
        axios.post(`http://127.0.0.1:8000/api/store/report`,formData, config)
        .then(response => {
            setFullData(response.data);
            reportData(year,response.data);
        });
        setTableYear(year);
    }
    const fetchThisReportData = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/report`,config).then(({ data }) => {
            setFullData(data);
            reportData(year,data);
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
                        <input className='form-control' onChange={(e)=>{setYear(e.target.value);}} type='text' value={year}/>
                    </form>
                </div>
            </div>
            <div class="table-responsive" ref={(el) => (componentRef = el)}>
                <table class="table table-striped table-bordered table-hover" id="shopTable">
                    <thead>
                        <tr>
                            <th>{t("month")}</th>
                            <th>{t("inputs")}</th>
                            <th>{t("outputs")}</th>
                            <th>{t("difference")}</th>
                            <th>{t("expenses")}</th>
                            <th>{t("water")}</th>
                            <th>{t("electric")}</th>
                            <th>{t("rent")}</th>
                            <th>{t("internet")}</th>
                            <th>{t("local expenses")}</th>
                            <th>{t("salaries")}</th>
                            <th>{t("companies payments")}</th>
                            <th>{t("clients payments")}</th>
                            <th>{t("net")}</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {
                            reportArray.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.month}</td>
                                        <td>{item.inputs}</td>
                                        <td>{item.outputs}</td>
                                        <td>{(item.inputs-item.outputs).toFixed(2)}</td>
                                        <td>{item.expenses}</td>
                                        <td>{item.water}</td>
                                        <td>{item.electric}</td>
                                        <td>{item.rent}</td>
                                        <td>{item.internet}</td>
                                        <td>{item.localExpenses}</td>
                                        <td>{item.salaries}</td>
                                        <td>{item.companiesPayments}</td>
                                        <td>{item.clientsPayments}</td>
                                        <td>{(item.clientsPayments-item.expenses-item.salaries-item.companiesPayments).toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{tableYear}</td>
                            <td>{fullReportArray.fullInputs}</td>
                            <td>{fullReportArray.fullOutputs}</td>
                            <td>{fullReportArray.fullExpenses}</td>
                            <td>{fullReportArray.fullWater}</td>
                            <td>{fullReportArray.fullElectric}</td>
                            <td>{fullReportArray.fullRent}</td>
                            <td>{fullReportArray.fullInternet}</td>
                            <td>{fullReportArray.fullLocalExpenses}</td>
                            <td>{fullReportArray.fullSalaries}</td>
                            <td>{fullReportArray.fullCompaniesPayments}</td>
                            <td>{fullReportArray.fullClientsPayments}</td>
                            <td>{(fullReportArray.fullClientsPayments-fullReportArray.fullExpenses-fullReportArray.fullSalaries-fullReportArray.fullCompaniesPayments).toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

function reportData(year,data){
    let inputs=0;
    let inputsQuantity=0;
    let outputs=0;
    let outputsQuantity=0;
    let expenses=0;
    let water=0;
    let electric=0;
    let rent=0;
    let internet=0;
    let localExpenses=0;
    let salaries=0;
    let companiesPayments=0;
    let clientsPayments=0;

    let fullInputs=0;
    let fullInputsQuantity=0;
    let fullOutputs=0;
    let fullOutputsQuantity=0;
    let fullExpenses=0;
    let fullWater=0;
    let fullElectric=0;
    let fullRent=0;
    let fullInternet=0;
    let fullLocalExpenses=0;
    let fullSalaries=0;
    let fullCompaniesPayments=0;
    let fullClientsPayments=0;

    for (let i=1; i <=12; i++) {
        (data.inputs).map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                inputs+=item.value;
                inputsQuantity+=item.quantity;
                fullInputs+=item.value;
                fullInputsQuantity+=item.quantity;
            }
        });
        (data.outputs).map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                outputs+=item.value;
                outputsQuantity+=item.quantity;
                fullOutputs+=item.value;
                fullOutputsQuantity+=item.quantity;
            }
        });
        (data.expenses).map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                expenses+=item.value;
                fullExpenses+=item.value;
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
                    localExpenses+=item.value;
                    fullLocalExpenses+=item.value;
                }
            }
        });
        (data.withdrawls).map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                salaries+=item.amount;
                fullSalaries+=item.amount;
            }
        });
        (data.companiesPayments).map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                companiesPayments+=item.amount;
                fullCompaniesPayments+=item.amount;
            }
        });
        (data.clientsPayments).map((item,index)=>{
            if(item.month===`${year}-${i<10 ? `0${i}` : i}`){
                clientsPayments+=item.amount;
                fullClientsPayments+=item.amount;
            }
        });

        reportArray[i]={
            month: `${year}-${i<10 ? `0${i}` : i}`,
            inputs: inputs.toFixed(2),
            inputsQuantity: inputsQuantity,
            outputs: outputs.toFixed(2),
            outputsQuantity: outputsQuantity,
            expenses: expenses.toFixed(2),
            water: water.toFixed(2),
            electric: electric.toFixed(2),
            rent: rent.toFixed(2),
            internet: internet.toFixed(2),
            localExpenses: localExpenses.toFixed(2),
            salaries: salaries.toFixed(2),
            companiesPayments: companiesPayments.toFixed(2),
            clientsPayments: clientsPayments.toFixed(2),
        };
        inputs=0;
        inputsQuantity=0;
        outputs=0;
        outputsQuantity=0;
        expenses=0;
        water=0;
        electric=0;
        rent=0;
        internet=0;
        localExpenses=0
        salaries=0;
        companiesPayments=0;
        clientsPayments=0;

    }
    fullReportArray={
        "fullInputs": fullInputs.toFixed(2),
        "fullInputsQuantity": fullInputsQuantity,
        "fullOutputs": fullOutputs.toFixed(2),
        "fullOutputsQuantity": fullOutputsQuantity,
        "fullExpenses": fullExpenses.toFixed(2),
        "fullWater": fullWater.toFixed(2),
        "fullElectric": fullElectric.toFixed(2),
        "fullRent": fullRent.toFixed(2),
        "fullInternet": fullInternet.toFixed(2),
        "fullLocalExpenses": fullLocalExpenses.toFixed(2),
        "fullSalaries": fullSalaries.toFixed(2),
        "fullCompaniesPayments": fullCompaniesPayments.toFixed(2),
        "fullClientsPayments": fullClientsPayments.toFixed(2),
        
    }
}

