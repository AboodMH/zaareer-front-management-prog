import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function EditCompany(){
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const companyData=location.state.data;

    const navigate = useNavigate();
    const [name, setName] = useState(companyData.company_name);
    const [address, setAddress] = useState(companyData.company_address);
    const [phone, setPhone] = useState(companyData.company_phone);
    const [image, setImage] = useState("");
    const [discount, setDiscount] = useState(companyData.discount);

    const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    const create = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', "PATCH");
        formData.append('company_name', name);
        formData.append('company_address', address);
        formData.append('company_phone', phone);
        formData.append('discount', discount);
        if (image!=='') {
            formData.append('image', image);
        }

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/store/company/${companyData.id}`, formData,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1);
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
                    <label for="name">{t("name")}</label>
                    <input onChange={(e)=>{setName(e.target.value)}} type="text" className="form-control" value={name}/>
                </div>
                <div className="form-group mb-4">
                    <label for="name">{t("address")}</label>
                    <input onChange={(e)=>{setAddress(e.target.value)}} type="text" className="form-control" value={address}/>
                </div>
                <div className="form-group mb-4">
                    <label for="phone">{t("phone")}</label>
                    <input onChange={(e)=>{setPhone(e.target.value)}} type="text" className="form-control" value={phone}/>
                </div>
                <div className="form-group mb-4">
                    <label for="discount">{t("discount")}</label>
                    <input onChange={(e)=>{setDiscount(e.target.value)}} type="number" step={0.0001} className="form-control" value={discount}/>
                </div>
               <div className="form-group mb-4">
                    <label for="image">{t("image")}</label>
                    <input onChange={changeHandler} type="file" className="form-control" name="image"/>
                </div>
                <div className=" d-flex justify-content-start"> 
                    <button type="submit" className="btn btn-outline-success">{t("update")}</button>
                </div>
            </form>
        </>
    );
}