import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function CompanyPaymentEdit(){
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const paymentData=location.state.data;

    const navigate = useNavigate();
    const [date, setDate] = useState(`${paymentData.month}-${paymentData.day}`);
    const [companyName, setCompanytName] = useState(paymentData.company_name);
    const [amount, setAmount] = useState(paymentData.amount);
    const [description, setDescription] = useState(paymentData.description);
    const [method, setMethod] = useState(paymentData.payment_method);
    const [company, setCompany] = useState([]);


    const fetchcompany = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/company',config).then(({ data }) => {setCompany(data);});
    }

    useEffect(() => {
        fetchcompany();
    }, []);

    const create = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', "PATCH");
        formData.append('date', date);
        formData.append('company_name', companyName);
        formData.append('amount', amount);
        formData.append('description', description);
        formData.append('payment_method', method);

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/store/companyPayment/${paymentData.id}`, formData,config)
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
                    <label for="date">{t("date")}</label>
                    <input onChange={(e)=>{setDate(e.target.value)}} type="date" className="form-control" value={date}/>
                </div>
                <div className="form-group mb-4">
                    <div className="d-flex justify-content-between">
                        <label for="company name">{t("company name")}</label>
                        <lable>{companyName}</lable>
                    </div>
                    <select onChange={(e)=>{setCompanytName(e.target.value)}} type="text" className="form-select" placeholder={t("Enter company name")}>
                        <option value="">change company name</option>
                        {
                            company.map((company, index) => {
                                return <option key={index} value={company.company_name}>{company.company_name}</option>
                            })
                        }
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label for="amount">{t("amount")}</label>
                    <input onChange={(e)=>{setAmount(e.target.value)}} type="number" step={0.01} className="form-control" value={amount}/>
                </div>
                <div className="form-group mb-4">
                    <label for="description">{t("description")}</label>
                    <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" value={description}/>
                </div>
               <div className="form-group mb-4">
                    <label for="method">{t("method")}</label>
                    <input onChange={(e)=>{setMethod(e.target.value)}} type="text" className="form-control" value={method}/>
                </div>
                <div className=" d-flex justify-content-start"> 
                    <button type="submit" className="btn btn-outline-success">{t("update")}</button>
                </div>
            </form>
        </>
    );
}