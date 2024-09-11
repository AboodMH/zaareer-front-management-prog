import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function ShopEditEmployee({shopName}){
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const employeeData=location.state.data;

    const navigate = useNavigate();
    const [name, setName] = useState(employeeData.employee_name);
    const [phone, setPhone] = useState(employeeData.employee_phone);
    const [workType, setWorkType] = useState(employeeData.work_type);
    const [branch, setBranch] = useState(employeeData.branch);
    const [salary, setSalary] = useState(employeeData.salary);
    const [offDays, setOffDays] = useState(employeeData.off_days);
    const [workHours, setWorkHours] = useState(employeeData.work_hours);
    const [breakHours, setBreakHours] = useState(employeeData.break_hours);
    const [image, setImage] = useState('');

    const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    const create = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('employee_name', name);
        formData.append('employee_phone', phone);
        formData.append('work_type', workType);
        formData.append('branch', branch);
        formData.append('salary', salary);
        formData.append('off_days', offDays);
        formData.append('work_hours', workHours);
        formData.append('break_hours', breakHours);
        if (image !=='') {
            formData.append('image', image);
        }

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/staff/${employeeData.id}`, formData,config)
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
                    <input onChange={(e)=>{setName(e.target.value)}} type="text" className="form-control" value={name}/>
                </div>
                <div className="form-group mb-4">
                    <label for="phone">{t("phone")}</label>
                    <input onChange={(e)=>{setPhone(e.target.value)}} type="text" className="form-control" value={phone}/>
                </div>
                <div className="form-group mb-4">
                    <div className="d-flex justify-content-between">
                        <label for="workType">{t("work type")}</label>
                        <h5>{t(`${workType}`)}</h5>
                    </div>
                    <select onChange={(e)=>{setWorkType(e.target.value)}} id="workType" className="form-select">
                        <option value={""}>{t("select")} {t("work type")}</option>
                        <option value={"seller"}>{t("seller")}</option>
                        <option value={"casher"}>{t("casher")}</option>
                        <option value={"manager"}>{t("manager")}</option>
                    </select>
                </div>
                <div className="form-group mb-4">
                <div className="d-flex justify-content-between">
                        <label for="branch">{t("branch")}</label>
                        <h5>{t(`${branch}`)}</h5>
                    </div>
                    <select onChange={(e)=>{setBranch(e.target.value)}} id="branch" className="form-select">
                        <option value={""}>{t("select")} {t("branch")}</option>
                        <option value={"shafa"}>{t("shafa")}</option>
                        <option value={"rsifah"}>{t("rsifah")}</option>
                        <option value={"sahab"}>{t("sahab")}</option>
                        <option value={"berain"}>{t("berain")}</option>
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label for="salary">{t("salary")}</label>
                    <input onChange={(e)=>{setSalary(e.target.value)}} type="number" className="form-control" value={salary}/>
                </div>
                <div className="form-group mb-4">
                    <label for="offDays">{t("off days")}</label>
                    <input onChange={(e)=>{setOffDays(e.target.value)}} type="number" className="form-control" value={offDays}/>
                </div>
                <div className="form-group mb-4">
                    <label for="workHours">{t("work hours")}</label>
                    <input onChange={(e)=>{setWorkHours(e.target.value)}} type="number" className="form-control" value={workHours}/>
                </div>
                <div className="form-group mb-4">
                    <label for="breakHours">{t("break hours")}</label>
                    <input onChange={(e)=>{setBreakHours(e.target.value)}} type="number" className="form-control" value={breakHours}/>
                </div>
                <div className="form-group mb-4">
                    <label for="image">{t("image")}</label>
                    <input onChange={changeHandler} type="file" className="form-control" name="image"/>
                </div>
                <div className=" d-flex justify-content-start"> 
                    <button type="submit" className="btn btn-outline-success btn-lg">{t("update")}</button>
                </div>
            </form>
        </>
    );
}