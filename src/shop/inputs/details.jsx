import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let totalCartoon=0;
let total=0;

export default function ShopInputDetails({shopName}){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const [productNo, setProductNo] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState(0);
    const [packing, setPacking] = useState(0);
    const [cartoon, setCartoon] = useState(0);
    const [description, setDescription] = useState('لايوجد');
    const [image, setImage] = useState('');


    const location = useLocation();
    const totalInputData=location.state.data;
    const invoiceNo=location.state.data.invoice_no;
    const month=location.state.data.month;
    const day=location.state.data.day;

    const fetchThisInput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/input/${invoiceNo}`,config).then(({ data }) => {
            setInputs(data);
            totalCartoon=0;
            total=0;
            data.map((item, index) => {
                totalCartoon+=item.cartoon;
                total+=item.price*item.packing*item.cartoon;
                console.log(cartoon);
                console.log(total);
            })});
    }

    useEffect(() => {
        fetchThisInput();
    }, []);
      

    return(
        <>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th colSpan={1}>{t("date")}</th>
                            <th colSpan={3}>{month}-{day}</th>
                            <th colSpan={1}>{t("invoice no")}</th>
                            <th colSpan={4}>{invoiceNo}</th>
                        </tr>
                        <tr>
                            <th>{t("product no")}</th>
                            <th>{t("product name")}</th>
                            <th>{t("description")}</th>
                            <th>{t("price")}</th>
                            <th>{t("cartoon")}</th>
                            <th>{t("packing")}</th>
                            <th>{t("cartoon price")}</th>
                            <th>{t("total")}</th>
                            <th>{t("image")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            inputs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.product_no}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.description}</td>
                                        <td>{(item.price).toFixed(2)}</td>
                                        <td>{item.cartoon}</td>
                                        <td>{item.packing}</td>
                                        <td>{(item.price*item.packing).toFixed(2)}</td>
                                        <td>{(item.price*item.packing*item.cartoon).toFixed(2)}</td>
                                        <td>{<Link to={`/shop/${shopName}/input/details/image`} state={{ data: item.image }} className='btn btn-success'>{t("show")}</Link>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={9}></th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("total cartoon")}</th>
                            <th colSpan={7}>{totalCartoon}</th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("final total")}</th>
                            <th colSpan={7}>{total.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

