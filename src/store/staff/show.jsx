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

let employeeArray=[];
let total_salary=0;
let total_deduction=0;
let total_bonus=0;
let total_amount=0;
let total_absence=0;
let total_delay=0;
let total_over_time=0;


export default function DetailStaff(){
    const { i18n, t } = useTranslation();
    const location = useLocation();

    let date=new Date();
    let thisMonth='';
    const thisYear=date.getFullYear();
    date.getMonth()+1<10 ? thisMonth=`0${date.getMonth()+1}` : thisMonth=date.getMonth()+1;
    const employeeData=location.state.data;
    let componentRef=useRef();

    const [withdrawl, setWithdrawl] = useState([]);
    const [workHour, setWorkHour] = useState([]);
    const [month, setMonth] = useState(`${thisYear}-${thisMonth}`);
    

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post(`http://127.0.0.1:8000/api/store/staff/${employeeData.employee_id}`,formData, config)
        .then(response => {
            setWithdrawl(response.data['withdrawl']);
            setWorkHour(response.data['workHour']);
            employeeSalary(response.data['withdrawl'],response.data['workHour'],month,employeeData);
        })
    }
    const fetchThisEmployeeData = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/staff/${employeeData.employee_id}`,config).then(({ data }) => {setWithdrawl(data['withdrawl']);setWorkHour(data['workHour']);employeeSalary(data['withdrawl'],data['workHour'],month,employeeData)});
    }
    useEffect(() => {
        fetchThisEmployeeData();
      }, []);

    return (
        <div className='p-1'>
            {employeeDataTable(employeeData,t)}
           {employeeSalaryTable(componentRef,month,setMonth,handleSubmit,t)}
        </div>
    );
}

function employeeDataTable(employeeData,t){
    return (
        <>
            <img class="mb-3" src={`http://127.0.0.1:8000/storage/storeStaff/image/${employeeData.image}`} alt='لا يوجد صوره لعرضها' height="100px"/>
            <div class="table-responsive">
                <table class="table table-striped table-bordered table-hover" id="shopTable">
                    <thead>
                        <tr>
                            <th>{t("id")}</th>
                            <th>{t("employee name")}</th>
                            <th>{t("phone")}</th>
                            <th>{t("work type")}</th>
                            <th>{t("branch")}</th>
                            <th>{t("salary")}</th>
                            <th>{t("off days")}</th>
                            <th>{t("work hours")}</th>
                            <th>{t("break hours")}</th>
                            <th>{t("total salary")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{employeeData.employee_id}</td>
                            <td>{employeeData.employee_name}</td>
                            <td>{employeeData.employee_phone}</td>
                            <td>{employeeData.work_type}</td>
                            <td>{employeeData.branch}</td>
                            <td>{employeeData.salary}</td>
                            <td>{employeeData.off_days}</td>
                            <td>{employeeData.work_hours}</td>
                            <td>{employeeData.break_hours}</td>
                            <td>{total_salary}</td>
                            <td><Link to="/staff/edit" state={{ data: employeeData }} type="button" class="btn btn-success" style={{height: "auto"}}>{t("edit")}</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function employeeSalaryTable(componentRef,month,setMonth,handleSubmit,t){
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
                            <th>{t("withdrawls")}</th>
                            <th>{t("description")}</th>
                            <th>{t("start")}</th>
                            <th>{t("end")}</th>
                            <th>{t("absence")}</th>
                            <th>{t("delay")}</th>
                            <th>{t("deduction")}</th>
                            <th>{t("description")}</th>
                            <th>{t("bonus")}</th>
                            <th>{t("description")}</th>
                            <th>{t("over_time")}</th>
                            <th>{t("description")}</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {
                            employeeArray.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.day}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.amount_description}</td>
                                        <td>{item.start}</td>
                                        <td>{item.end}</td>
                                        <td>{item.absence}</td>
                                        <td>{item.delay}</td>
                                        <td>{item.deduction}</td>
                                        <td>{item.deduction_description}</td>
                                        <td>{item.bonus}</td>
                                        <td>{item.bonus_description}</td>
                                        <td>{item.over_time}</td>
                                        <td>{item.over_time_description}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>{month}</th>
                            <th colSpan={2}>{total_amount}</th>
                            <th></th>
                            <th></th>
                            <th>{total_absence}</th>
                            <th>{total_delay}</th>
                            <th colSpan={2}>{total_deduction}</th>
                            <th colSpan={2}>{total_bonus}</th>
                            <th colSpan={2}>{total_over_time}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function employeeSalary(withdrawl,workHour,month,employeeData){
    let day='';
    let amount=0;
    let amount_description='';
    let start='';
    let end='';
    let absence='';
    let delay_hours=0;
    let deduction=0;
    let deduction_description='';
    let bonus=0;
    let bonus_description='';
    let over_time=0;
    let over_time_description='';
    total_salary=0;
    total_deduction=0;
    total_bonus=0;
    total_amount=0;
    total_absence=0;
    total_delay=0;
    total_over_time=0;

    for (let i=1; i <=31; i++) {
        day=`${month}-${i<10 ? `0${i}` : i}`;
        withdrawl.map((item,index) => {
            if (item.day == `${i<10 ? `0${i}` : i}`) {
                amount += item.amount;
                amount_description = item.description;
                total_amount+=item.amount;
            }
        })
        workHour.map((item,index) => {
            if (item.day == `${i<10 ? `0${i}` : i}`) {
                start = item.start;
                end = item.end;
                absence = item.absence;
                delay_hours = item.delay_hours;
                deduction=item.deduction;
                deduction_description=item.deduction_description;
                bonus=item.bonus;
                bonus_description=item.bonus_description;
                over_time=item.over_time;
                over_time_description=item.over_time_description;
                total_deduction+=item.deduction;
                total_bonus+=item.deduction;
                total_delay+=delay_hours;
                total_over_time+=over_time;

                if (item.absence ==='absent') {
                    total_absence+=item.absence;
                }
            }
        })
        console.log(total_amount);
        employeeArray[i]={
            'amount':amount,
            'amount_description':amount_description,
            'start':start,
            'end':end,
            'absence':absence,
            'delay_hours':delay_hours,
            'deduction':deduction,
            'deduction_description':deduction_description,
            'bonus':bonus,
            'bonus_description':bonus_description,
            'over_time':over_time,
            'over_time_description':over_time_description,
            'day':day,
        };
        day='';
        amount=0;
        amount_description='';
        start='';
        end='';
        absence='';
        delay_hours=0;
        deduction=0;
        deduction_description='';
        bonus=0;
        bonus_description='';
        over_time=0;
        over_time_description='';
    }

    if (total_absence<=employeeData.off_days) {
        total_salary=employeeData.salary-total_amount-total_deduction-(total_delay*employeeData.salary/30/employeeData.work_hours)+total_bonus+(total_over_time*employeeData.salary/30/employeeData.work_hours*2);
    }else{
        total_salary=employeeData.salary-total_amount-total_deduction-(total_delay*employeeData.salary/30/employeeData.work_hours)-((total_absence-employeeData.off_days)*employeeData/30)+total_bonus+(total_over_time*employeeData.salary/30/employeeData.work_hours*2);
    }
}

