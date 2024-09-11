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

let totalValue=0;

export default function ShopExpense({shopName}){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const [dateExpense, setDateExpense] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [month, setMonth] = useState('');
    const [addExpenseIsOpen, setAddExpenseIsOpen] = useState(false);
    const [editExpenseIsOpen, setEditExpenseIsOpen] = useState([false,{}]);
    const [expenseValue, setExpenseValue] = useState(0);
    const [expenseDescription, setExpenseDescription] = useState('');

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/expense`,formData, config)
        .then(response => {
            setExpenses(response.data);
            setThisMonth(month);
            totalValue=0;
            response.data.map((item,index) => {
                totalValue+=item.value;
            });
        })
    }
    const fetchThisExpense = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/expense`,config).then(({ data }) => {
            setExpenses(data);
            totalValue=0;
            data.map((item,index) => {
                totalValue+=item.value;
            });
        });
    }
    useEffect(() => {
        fetchThisExpense();
      }, []);

    return(
        <>
            {addExpense(shopName,dateExpense,setDateExpense,addExpenseIsOpen, setAddExpenseIsOpen,expenseValue,expenseDescription,setExpenseValue,setExpenseDescription,t)}
            {editExpense(shopName,dateExpense,setDateExpense,editExpenseIsOpen, setEditExpenseIsOpen,expenseValue,expenseDescription,setExpenseValue,setExpenseDescription,t)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <button className='btn btn-outline-success' onClick={()=>setAddExpenseIsOpen(true)}>{t("create")}</button>
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
                            <th>{t("value")}</th>
                            <th>{t("description")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expenses.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.value}</td>
                                        <td>{item.description}</td>
                                        <td><button onClick={()=>{setDateExpense(`${item.month}-${item.day}`);setEditExpenseIsOpen([true,item]);setExpenseValue(item.value);setExpenseDescription(item.description)}} className='btn btn-success'>{t("edit")}</button></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{thisMonth}</td>
                            <td>{totalValue}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function addExpense(shopName,dateExpense,setDateExpense,addExpenseIsOpen, setAddExpenseIsOpen,expenseValue,expenseDescription,setExpenseValue,setExpenseDescription,t){
    const createExpense = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('date', dateExpense);
        formData.append('value', expenseValue)
        formData.append('description', expenseDescription)

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/expense`, formData,config)
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
          isOpen={addExpenseIsOpen}
          onRequestClose={()=>setAddExpenseIsOpen(false)}
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
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("expenses")}</h5>
                <form onSubmit={createExpense}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="col-sm-10 mb-4">
                            <input type="date" className="form-control" onChange={(e)=>{setDateExpense(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <input type="number" step={0.01} className="form-control" placeholder={t("value")} onChange={(e)=>{setExpenseValue(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <select className="form-control" placeholder={t("description")} onChange={(e)=>{setExpenseDescription(e.target.value)}}>
                                <option value="">{t("description")}</option>
                                <option value="ماء">{t("water")}</option>
                                <option value="كهرياء">{t("electric")}</option>
                                <option value="الاجار">{t("rent")}</option>
                                <option value="انترنت">{t("internet")}</option>
                            </select>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <input type="text" className="form-control" placeholder={t("description")} onChange={(e)=>{setExpenseDescription(e.target.value)}}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}

function editExpense(shopName,dateExpense,setDateExpense,editExpenseIsOpen, setEditExpenseIsOpen,expenseValue,expenseDescription,setExpenseValue,setExpenseDescription,t){
    const createExpense = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', "PATCH");
        formData.append('date', dateExpense);
        formData.append('value', expenseValue)
        formData.append('description', expenseDescription)

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/expense/${editExpenseIsOpen[1].id}`, formData,config)
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
          isOpen={editExpenseIsOpen[0]}
          onRequestClose={()=>setEditExpenseIsOpen([false,{}])}
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
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("expenses")}</h5>
                <form onSubmit={createExpense}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="col-sm-10 mb-4">
                            <input type="date" step={0.01} className="form-control" value={dateExpense} onChange={(e)=>{setDateExpense(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <input type="number" step={0.01} className="form-control" value={expenseValue} onChange={(e)=>{setExpenseValue(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <h6>{expenseDescription}</h6>
                            <select className="form-control" placeholder={t("description")} onChange={(e)=>{setExpenseDescription(e.target.value)}}>
                                <option value="">{t("description")}</option>
                                <option value="ماء">{t("water")}</option>
                                <option value="كهرياء">{t("electric")}</option>
                                <option value="الاجار">{t("rent")}</option>
                                <option value="انترنت">{t("internet")}</option>
                            </select>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <input type="text" className="form-control" placeholder={t("description")} onChange={(e)=>{setExpenseDescription(e.target.value)}}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}

