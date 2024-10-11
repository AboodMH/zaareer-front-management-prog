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
let fullCash=0;
let fullCard=0;
let fullExpenses=0;
let fullWithdrawls=0;
let fullAmountInBox=0;
let fullDeference=0;


export default function ShopSells({shopName}){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const [month, setMonth] = useState('');
    const [sells, setSells] = useState([]);
    const [addSellsIsOpen, setAddSellsIsOpen] = useState(false);
    const [editSellsIsOpen, setEditSellsIsOpen] = useState(false);
    const [sellsDate, setSellsDate] = useState('');
    const [sellCash, setSellCash] = useState('');
    const [sellCard, setSellCard] = useState('');
    const [totalExpense, setTotalExpense] = useState('');
    const [totalWithdrawl, setTotalWithdrawl] = useState('');
    const [amountInBox, setAmountInBox] = useState('');
    const [editId, setEditId] = useState('');

    const handleSubmit=(event)=>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/sell`,formData, config)
        .then(response => {
            setThisMonth(month);
            setSells(response.data);
            fullCash=0;
            fullCard=0;
            fullExpenses=0;
            fullWithdrawls=0;
            fullAmountInBox=0;
            fullDeference=0;
            (response.data).map((item,index)=>{
                fullCash+=item.sell_cash;
                fullCard+=item.sell_card;
                fullExpenses+=item.total_expense;
                fullWithdrawls+=item.total_withdrawl;
                fullAmountInBox+=item.amount_in_box;
                fullDeference+=item.difference_in_box;
            });
        })
    }
    const fetchThisSells = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/sell`,config).then(({ data }) => {
            setSells(data);
            fullCash=0;
            fullCard=0;
            fullExpenses=0;
            fullWithdrawls=0;
            fullAmountInBox=0;
            fullDeference=0;
            data.map((item,index)=>{
                fullCash+=item.sell_cash;
                fullCard+=item.sell_card;
                fullExpenses+=item.total_expense;
                fullWithdrawls+=item.total_withdrawl;
                fullAmountInBox+=item.amount_in_box;
                fullDeference+=item.difference_in_box;
            });
        });
    }
    useEffect(() => {
        fetchThisSells();
      }, []);

    return(
        <>
            {addSells(t,shopName,addSellsIsOpen,setAddSellsIsOpen,sellsDate,sellCash,sellCard,totalExpense,totalWithdrawl,amountInBox,setSellsDate,setSellCash,setSellCard,setTotalExpense,setTotalWithdrawl,setAmountInBox)}
            {editSells(t,shopName,editId,editSellsIsOpen,setEditSellsIsOpen,sellsDate,sellCash,sellCard,totalExpense,totalWithdrawl,amountInBox,setSellsDate,setSellCash,setSellCard,setTotalExpense,setTotalWithdrawl,setAmountInBox)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <button className='btn btn-outline-success' onClick={()=>{setAddSellsIsOpen(true)}}>{t("create")}</button>
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
                            <th>{t("sell cash")}</th>
                            <th>{t("sell card")}</th>
                            <th>{t("total expense")}</th>
                            <th>{t("total withdrawl")}</th>
                            <th>{t("final total")}</th>
                            <th>{t("amount in box")}</th>
                            <th>{t("difference in box")}</th>
                            <th>{t("total sales")}</th>
                            <th>{t("total paid")}</th>
                            <th>{t("total net sales")}</th>
                            <th>{t("edit")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sells.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.sell_cash}</td>
                                        <td>{item.sell_card}</td>
                                        <td>{item.total_expense}</td>
                                        <td>{item.total_withdrawl}</td>
                                        <td>{item.final_total}</td>
                                        <td>{item.amount_in_box}</td>
                                        <td>{item.difference_in_box}</td>
                                        <td>{item.total_sell+item.difference_in_box}</td>
                                        <td>{item.total_withdrawl+item.total_expense}</td>
                                        <td>{item.sell_card+item.amount_in_box}</td>
                                        <td><button className='btn btn-success' onClick={()=>{setEditSellsIsOpen(true);setEditId(item.id);setSellsDate(`${item.month}-${item.day}`);setSellCash(item.sell_cash);setSellCard(item.sell_card);setTotalExpense(item.total_expense);setTotalWithdrawl(item.total_withdrawl);setAmountInBox(item.amount_in_box)}}>{t('edit')}</button></td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total</th>
                            <th>{fullCash}</th>
                            <th>{fullCard}</th>
                            <th>{fullExpenses}</th>
                            <th>{fullWithdrawls}</th>
                            <th>{fullCash-fullExpenses-fullWithdrawls}</th>
                            <th>{fullAmountInBox}</th>
                            <th>{fullDeference}</th>
                            <th>{fullCash+fullCard+fullDeference}</th>
                            <th>{fullExpenses+fullWithdrawls}</th>
                            <th>{fullCard+fullAmountInBox}</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function addSells(t,shopName,addSellsIsOpen,setAddSellsIsOpen,sellsDate,sellCash,sellCard,totalExpense,totalWithdrawl,amountInBox,setSellsDate,setSellCash,setSellCard,setTotalExpense,setTotalWithdrawl,setAmountInBox){
    const createSells = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('date', sellsDate);
        formData.append('sell_cash', sellCash);
        formData.append('sell_card', sellCard);
        formData.append('total_expense', totalExpense);
        formData.append('total_withdrawl', totalWithdrawl);
        formData.append('amount_in_box', amountInBox);

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/sell`, formData,config)
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

    const getExpenseWithdrawl=async(e)=>{
        e.preventDefault();

        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/expense/${sellsDate}`,config)
        .then(({data})=>{
            setTotalExpense(data);
            console.log(totalExpense);
            console.log(sellsDate);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });

        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/withdrawl/${sellsDate}`,config)
        .then(({data})=>{
            setTotalWithdrawl(data);
            console.log(totalWithdrawl);
            console.log(sellsDate);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });

    }

    return(
        <>
        <Modal
          isOpen={addSellsIsOpen}
          onRequestClose={()=>setAddSellsIsOpen(false)}
          style={{
              overlay:{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content:{
                  marginLeft:"22vw",
                  alignSelf:"center",
                  width:"50vw",
                  height:"80vh",
              }
          }}
        >
            <div className='col'>
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("expenses")}</h5>
                <form onSubmit={getExpenseWithdrawl}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <label className="col-sm-10 col-form-label">{t('date')}</label>
                        <div className="col-sm-10 mb-4 d-flex">
                            <input type="date" className="form-control" onChange={(e)=>{setSellsDate(e.target.value)}}/>
                            <button className="btn btn-success mx-2">{t("confirm")}</button>
                        </div>
                    </div>
                </form>
                <form onSubmit={createSells}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('sell cash')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setSellCash(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('sell card')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setSellCard(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('total expense')}</label>
                            <input type="number" step={0.01} className="form-control" value={totalExpense}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('total withdrawl')}</label>
                            <input type="number" step={0.01} className="form-control" value={totalWithdrawl}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('final total')}</label>
                            <input type="number" step={0.01} className="form-control" value={sellCash-totalExpense-totalWithdrawl}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('amount in box')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setAmountInBox(e.target.value)}}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('amount in box')}</label>
                            <input type="number" step={0.01} className="form-control" value={amountInBox-(sellCash-totalExpense-totalWithdrawl)}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}

function editSells(t,shopName,editId,editSellsIsOpen,setEditSellsIsOpen,sellsDate,sellCash,sellCard,totalExpense,totalWithdrawl,amountInBox,setSellsDate,setSellCash,setSellCard,setTotalExpense,setTotalWithdrawl,setAmountInBox){
    const createSells = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method','PATCH');
        formData.append('date', sellsDate);
        formData.append('sell_cash', sellCash);
        formData.append('sell_card', sellCard);
        formData.append('total_expense', totalExpense);
        formData.append('total_withdrawl', totalWithdrawl);
        formData.append('amount_in_box', amountInBox);

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/sell/${editId}`, formData,config)
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
          isOpen={editSellsIsOpen}
          onRequestClose={()=>{setEditSellsIsOpen(false);window.location.reload()}}
          style={{
              overlay:{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content:{
                  marginLeft:"22vw",
                  alignSelf:"center",
                  width:"50vw",
                  height:"80vh",
              }
          }}
        >
            <div className='col'>
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("expenses")}</h5>
                <form onSubmit={createSells}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('date')}</label>
                            <input type="date" className="form-control" onChange={(e)=>{setSellsDate(e.target.value)}} value={sellsDate}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('sell cash')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setSellCash(e.target.value)}} value={sellCash}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('sell card')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setSellCard(e.target.value)}} value={sellCard}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('total expense')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setTotalExpense(e.target.value)}} value={totalExpense}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('total withdrawl')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setTotalWithdrawl(e.target.value)}} value={totalWithdrawl}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('final total')}</label>
                            <input type="number" step={0.01} className="form-control" value={sellCash-totalExpense-totalWithdrawl}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('amount in box')}</label>
                            <input type="number" step={0.01} className="form-control" onChange={(e)=>{setAmountInBox(e.target.value)}} value={amountInBox}/>
                        </div>
                        <div className="col-sm-10 mb-4">
                            <label className="col-form-label">{t('difference in box')}</label>
                            <input type="number" step={0.01} className="form-control" value={amountInBox-(sellCash-totalExpense-totalWithdrawl)}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}
