import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function ShopEmployeeCreate({shopName}){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [workType, setWorkType] = useState('');
    const [branch, setBranch] = useState('');
    const [salary, setSalary] = useState(0);
    const [offDays, setOffDays] = useState(0);
    const [workHours, setWorkHours] = useState(0);
    const [breakHours, setBreakHours] = useState(0);
    const [image, setImage] = useState('');

    const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    const create = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('employee_name', name);
        formData.append('employee_phone', phone);
        formData.append('work_type', workType);
        formData.append('branch', branch);
        formData.append('salary', salary);
        formData.append('off_days', offDays);
        formData.append('work_hours', workHours);
        formData.append('break_hours', breakHours);
        formData.append('image', image);

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/staff`, formData,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(`/shop/${shopName}/staff`);
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
                    <input onChange={(e)=>{setName(e.target.value)}} type="text" className="form-control" placeholder={t("Enter name")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="phone">{t("phone")}</label>
                    <input onChange={(e)=>{setPhone(e.target.value)}} type="text" className="form-control" placeholder={t("Enter phone")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="workType">{t("work type")}</label>
                    <select onChange={(e)=>{setWorkType(e.target.value)}} className="form-select">
                        <option value={""}>{t("select")} {t("work type")}</option>
                        <option value={"seller"}>{t("seller")}</option>
                        <option value={"casher"}>{t("casher")}</option>
                        <option value={"manager"}>{t("manager")}</option>
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label for="branch">{t("branch")}</label>
                    <select onChange={(e)=>{setBranch(e.target.value)}} type="text" className="form-select">
                        <option value={""}>{t("select")} {t("branch")}</option>
                        <option value={"shafa"}>{t("shafa")}</option>
                        <option value={"rsifah"}>{t("rsifah")}</option>
                        <option value={"sahab"}>{t("sahab")}</option>
                        <option value={"berain"}>{t("berain")}</option>
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label for="salary">{t("salary")}</label>
                    <input onChange={(e)=>{setSalary(e.target.value)}} type="number" className="form-control" placeholder={t("Enter salary")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="offDays">{t("off days")}</label>
                    <input onChange={(e)=>{setOffDays(e.target.value)}} type="number" className="form-control" placeholder={t("Enter off days")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="workHours">{t("work hours")}</label>
                    <input onChange={(e)=>{setWorkHours(e.target.value)}} type="number" className="form-control" placeholder={t("Enter work hours")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="breakHours">{t("break hours")}</label>
                    <input onChange={(e)=>{setBreakHours(e.target.value)}} type="number" className="form-control" placeholder={t("Enter break hours")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="image">{t("image")}</label>
                    <input onChange={changeHandler} type="file" className="form-control" name="image"/>
                </div>
                <div className=" d-flex justify-content-start"> 
                    <button type="submit" className="btn btn-outline-success">{t("create")}</button>
                </div>
            </form>
        </>
    );
}