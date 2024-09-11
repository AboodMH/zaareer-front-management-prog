import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function Client(){
    const { i18n, t } = useTranslation();
    const navigate=useNavigate();
    const [staff, setStaff] = useState([]);

    const fetchStaff = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/client',config).then(({ data }) => {setStaff(data);});
    }
    useEffect(() => {
        fetchStaff();
      }, []);

    return(
        <div className='p-2'>  
            <div class="d-flex justify-content-between mb-2" style={{alignItems:"center"}}>
                <Link to="/client/create" className='btn btn-outline-success'>{t("create")}</Link>
            </div>
            <div className="row row-cols-auto center">
                {staff.map((item,index)=>{
                    return(
                        <Link to="/client/details" state={{ data: item }} style={{textDecorationLine:"none",color:"black"}}>
                            <div className="card mb-3" style={{width:"17.9rem"}}>
                                <img height="200px" src={`http://127.0.0.1:8000/storage/storeClient/image/${item.image}`} alt='لا يوجد صوره لعرضها'/>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h6>{t("client name")}:</h6>
                                        <p>{item.client_name}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h6>{t("id")}</h6>
                                        <p>{item.client_id}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h6>{t("phone")}:</h6>
                                        <p>{item.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>  
    );
}

