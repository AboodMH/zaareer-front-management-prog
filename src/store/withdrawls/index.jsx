import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, redirect, Link} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let totalAmount=0;

export default function Withdrawl(){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const [withdrawlDate, setWithdrawlDate] = useState('');
    const [withdrawls, setWithdrawls] = useState([]);
    const [month, setMonth] = useState('');
    const [addWithdrawlIsOpen, setAddWithdrawlIsOpen] = useState(false);
    const [editWithdrawlIsOpen, setEditWithdrawlIsOpen] = useState([false,{}]);
    const [employeeName, setEmployeeName] = useState('');
    const [withdrawlAmount, setWithdrawlAmount] = useState(0);
    const [withdrawlDescription, setWithdrawlDescription] = useState('');
    const [staff, setStaff] = useState([]);


    const fetchStaff = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/staff',config).then(({ data }) => {
            setStaff(data);
        });
    }

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post('http://127.0.0.1:8000/api/store/withdrawl',formData, config)
        .then(response => {
            setWithdrawls(response.data);
            setThisMonth(month);
            totalAmount=0;
            response.data.map((item,index)=>{
                totalAmount+=item.amount;
            });
        })
    }
    const fetchThisWithdrawl = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/withdrawl',config).then(({ data }) => {
            setWithdrawls(data);
            totalAmount=0;
            data.map((item,index)=>{
                totalAmount+=item.amount;
            });
        });
    }
    useEffect(() => {
        fetchThisWithdrawl();
      }, []);

    return(
        <>
            {addWithdrawl(addWithdrawlIsOpen,setAddWithdrawlIsOpen,withdrawlDate,setWithdrawlDate,withdrawlAmount,withdrawlDescription,setWithdrawlAmount,setWithdrawlDescription,employeeName, setEmployeeName,staff,t)}
            {editWithdrawl(editWithdrawlIsOpen,setEditWithdrawlIsOpen,withdrawlDate,setWithdrawlDate,withdrawlAmount,withdrawlDescription,setWithdrawlAmount,setWithdrawlDescription,employeeName, setEmployeeName,staff,t)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <button className='btn btn-outline-success' onClick={()=>setAddWithdrawlIsOpen(true)}>{t("create")}</button>
                <form onSubmit={handleSubmit}>
                    <input type="submit" value={t("show")} class="btn btn-light border mx-2 px-4 py-1"/>
                    <input onChange={(e)=>{setMonth(e.target.value);}} type='month'/>
                </form>
            </div>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t("time")}</th>
                            <th>{t("casher")}</th>
                            <th>{t("id")}</th>
                            <th>{t("employee name")}</th>
                            <th>{t("amount")}</th>
                            <th>{t("description")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            withdrawls.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.time}</td>
                                        <td>{item.casher_name}</td>
                                        <td>{item.employee_id}</td>
                                        <td>{item.employee_name}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.description}</td>
                                        <td><button onClick={()=>{setEditWithdrawlIsOpen([true,item]);setWithdrawlDate(`${item.month}-${item.day}`);setWithdrawlAmount(item.amount);setWithdrawlDescription(item.description);setEmployeeName(item.employee_name)}} className='btn btn-success'>{t("edit")}</button></td>
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
                            <td></td>
                            <td>{totalAmount}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function addWithdrawl(addWithdrawlIsOpen,setAddWithdrawlIsOpen,withdrawlDate,setWithdrawlDate,withdrawlAmount,withdrawlDescription,setWithdrawlAmount,setWithdrawlDescription,employeeName,setEmployeeName,staff,t){
    const createWithdrawl = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('date',withdrawlDate);
        formData.append('casher_name', "server");
        formData.append('employee_name', employeeName);
        formData.append('amount', withdrawlAmount);
        formData.append('description', withdrawlDescription);

        console.log(formData)
        
        await axios.post('http://127.0.0.1:8000/api/store/withdrawl', formData,config)
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
          isOpen={addWithdrawlIsOpen}
          onRequestClose={()=>setAddWithdrawlIsOpen(false)}
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
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("withdrawls")}</h5>
                <form onSubmit={createWithdrawl}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="col-sm-10 mb-4">
                            <input type="date" className="form-control" onChange={(e)=>{setWithdrawlDate(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <select onChange={(e)=>{setEmployeeName(e.target.value)}} type="text" className="form-select" placeholder={t("Enter employee name")}>
                                <option value="">select employee name</option>
                                {
                                    staff.map((employee, index) => {
                                        return <option key={index} value={employee.employee_name}>{employee.employee_name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <input type="number" step={0.01} className="form-control" placeholder={t("amount")} onChange={(e)=>{setWithdrawlAmount(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10">
                            <input type="string" className="form-control" placeholder={t("description")} onChange={(e)=>{setWithdrawlDescription(e.target.value)}}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}

function editWithdrawl(editWithdrawlIsOpen,setEditWithdrawlIsOpen,withdrawlDate,setWithdrawlDate,withdrawlAmount,withdrawlDescription,setWithdrawlAmount,setWithdrawlDescription,employeeName,setEmployeeName,staff,t){
    const editWithdrawl = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', "PATCH");
        formData.append('date', withdrawlDate);
        formData.append('casher_name', "server");
        formData.append('employee_name', employeeName);
        formData.append('amount', withdrawlAmount)
        formData.append('description', withdrawlDescription)

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/store/withdrawl/${editWithdrawlIsOpen[1].id}`, formData,config)
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
          isOpen={editWithdrawlIsOpen[0]}
          onRequestClose={()=>setEditWithdrawlIsOpen([false,{}])}
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
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("withdrawls")}</h5>
                <form onSubmit={editWithdrawl}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="col-sm-10 mb-4">
                            <input type="date" className="form-control" value={withdrawlDate} onChange={(e)=>{setWithdrawlDate(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <lable>{employeeName}</lable>
                            <select onChange={(e)=>{setEmployeeName(e.target.value)}} type="text" className="form-select" placeholder={t("Enter employee name")}>
                                <option value="">change employee name</option>
                                {
                                    staff.map((employee, index) => {
                                        return <option key={index} value={employee.employee_name}>{employee.employee_name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <input type="number" step={0.01} className="form-control" value={withdrawlAmount} onChange={(e)=>{setWithdrawlAmount(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10">
                            <input type="string" className="form-control" value={withdrawlDescription} onChange={(e)=>{setWithdrawlDescription(e.target.value)}}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}

