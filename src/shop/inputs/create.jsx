import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function CreateShopInput({shopName}){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [description, setDescription] = useState("");
    const [addInvoiceIsOpen, setAddInvoiceIsOpen] = useState(false);

    const create = async(e)=>{
        e.preventDefault();
        const formDataTotalInput=new FormData();
        formDataTotalInput.append('date', date);
        formDataTotalInput.append('invoice_no',invoiceNo);
        formDataTotalInput.append('description',description);
        formDataTotalInput.append('value',0);
        formDataTotalInput.append('quantity',0);

        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput`, formDataTotalInput,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1);
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
            <form className="p-4" onSubmit={create}>
                <div className="form-group mb-4">
                    <label for="date">{t("date")}</label>
                    <input onChange={(e)=>{setDate(e.target.value)}} type="date" className="form-control" placeholder={t("Enter date")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="invoice no">{t("invoice no")}</label>
                    <input onChange={(e)=>{setInvoiceNo(e.target.value)}} type="text" className="form-control" placeholder={t("Enter invoice no")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="description">{t("description")}</label>
                    <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")}/>
                </div>
                <div style={{textAlign:"center"}} className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start"> 
                        <button type="submit" className="btn btn-outline-success mx-4">{t("create")}</button>
                    </div>
                </div>
            </form>
        </>
    );
}
