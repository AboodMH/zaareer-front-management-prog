import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function CompanyPaymentCreate(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [method, setMethod] = useState('');
    const [companys, setcompanys] = useState([]);


    const fetchCompany = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/company',config).then(({ data }) => {
            setcompanys(data);
        });
    }

    useEffect(() => {
        fetchCompany();
    }, []);

    const create = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('date', date);
        formData.append('company_name', companyName);
        formData.append('amount', amount);
        formData.append('description', description);
        formData.append('payment_method', method);

        console.log(formData)
        
        await axios.post('http://127.0.0.1:8000/api/store/companyPayment', formData,config)
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
                    <input onChange={(e)=>{setDate(e.target.value)}} type="date" className="form-control"/>
                </div>
                <div className="form-group mb-4">
                    <label for="company name">{t("company name")}</label>
                    <select onChange={(e)=>{setCompanyName(e.target.value)}} type="text" className="form-select" placeholder={t("Enter company name")}>
                        <option value="">select company name</option>
                        {
                            companys.map((company, index) => {
                                return <option key={index} value={company.company_name}>{company.company_name}</option>
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
                    <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")}/>
                </div>
               <div className="form-group mb-4">
                    <label for="method">{t("method")}</label>
                    <input onChange={(e)=>{setMethod(e.target.value)}} type="text" className="form-control" placeholder={t("Enter method")}/>
                </div>
                <div className=" d-flex justify-content-start"> 
                    <button type="submit" className="btn btn-outline-success">{t("create")}</button>
                </div>
            </form>
        </>
    );
}