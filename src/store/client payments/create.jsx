import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function PaymentCreate(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [clientName, setClientName] = useState('');
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [method, setMethod] = useState('');
    const [clients, setClients] = useState([]);


    const fetchClient = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/client',config).then(({ data }) => {setClients(data);});
    }

    useEffect(() => {
        fetchClient();
    }, []);

    const create = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('date', date);
        formData.append('client_name', clientName);
        formData.append('amount', amount);
        formData.append('description', description);
        formData.append('payment_method', method);

        console.log(formData)
        
        await axios.post('http://127.0.0.1:8000/api/store/clientPayment', formData,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1);
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
            <form className="p-4" onSubmit={create}>
                <div className="form-group mb-4">
                    <label className="form-label" htmlFor="date">{t('date')}</label>
                    <input onChange={(e)=>{setDate(e.target.value)}} type="date" className="form-control" placeholder={t("Enter date")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="client name">{t("client name")}</label>
                    <select onChange={(e)=>{setClientName(e.target.value)}} type="text" className="form-select" placeholder={t("Enter client name")}>
                        <option value="">select client name</option>
                        {
                            clients.map((client, index) => {
                                return <option key={index} value={client.client_name}>{client.client_name}</option>
                            })
                        }
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label for="amount">{t("amount")}</label>
                    <input onChange={(e)=>{setAmount(e.target.value)}} type="number" step={0.01} className="form-control" placeholder={t("Enter amount")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="description">{t("description")}</label>
                    <select onChange={(e)=>{setDescription(e.target.value)}} className="form-select" id="description">
                        <option value="">{t("choose description")}</option>
                        <option value="دائن">{t("creditor")}</option>
                        <option value="مدين">{t("debtor")}</option>
                    </select>
                </div>
               <div className="form-group mb-4">
                    <label for="method">{t("payment method")}</label>
                    <input onChange={(e)=>{setMethod(e.target.value)}} type="text" className="form-control" placeholder={t("Enter method")}/>
                </div>
                <div className=" d-flex justify-content-start"> 
                    <button type="submit" className="btn btn-outline-success">{t("create")}</button>
                </div>
            </form>
        </>
    );
}