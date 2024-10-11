import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let totalCartoon=0;
let totalSellPrice=0;
let totalBuyPrice=0;

export default function ProductOutputsDetails(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [outputs, setOutputs] = useState([]);

    const location = useLocation();
    const invoiceNo=location.state.data.invoice_no;
    const month=location.state.data.month;
    const day=location.state.data.day;
    const clientId=location.state.data.client_id;
    const clientName=location.state.data.client_name;

    const fetchThisOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/productOutput/${invoiceNo}`,config).then(({ data }) => {
            setOutputs(data);
            totalCartoon=0;
            totalSellPrice=0;
            totalBuyPrice=0;
            data.map((item, index) => {
                totalCartoon+=item.cartoon;
                totalSellPrice+=item.sell_price*item.packing*item.cartoon;
                totalBuyPrice+=item.buy_price*item.packing*item.cartoon;
                console.log(totalCartoon);
                console.log(totalSellPrice);
            })
        });
    }

    useEffect(() => {
        fetchThisOutput();
      }, []);

      return (
        <>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th colSpan={2}>{t("date")}</th>
                            <th colSpan={4}>{month}-{day}</th>
                            <th colSpan={2}>{t("invoice no")}</th>
                            <th colSpan={4}>{invoiceNo}</th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("id")}</th>
                            <th colSpan={4}>{clientId}</th>
                            <th colSpan={2}>{t("client name")}</th>
                            <th colSpan={4}>{clientName}</th>
                        </tr>
                        <tr>
                            <th>{t("product no")}</th>
                            <th>{t("product name")}</th>
                            <th>{t("description")}</th>
                            <th>{t("sell price")}</th>
                            <th>{t("buy price")}</th>
                            <th>{t("cartoon")}</th>
                            <th>{t("packing")}</th>
                            <th>{t("sell price cartoon")}</th>
                            <th>{t("buy price cartoon")}</th>
                            <th>{t("total sell price")}</th>
                            <th>{t("total buy price")}</th>
                            <th>{t("image")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            outputs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.product_no}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.sell_price}</td>
                                        <td>{item.buy_price}</td>
                                        <td>{item.cartoon}</td>
                                        <td>{item.packing}</td>
                                        <td>{(item.sell_price*item.packing).toFixed(2)}</td>
                                        <td>{(item.buy_price*item.packing).toFixed(2)}</td>
                                        <td>{(item.sell_price*item.packing*item.cartoon).toFixed(2)}</td>
                                        <td>{(item.buy_price*item.packing*item.cartoon).toFixed(2)}</td>
                                        <td>{<Link to={'/product/output/image'} state={{ data: item.image }} className='btn btn-success'>{t("show")}</Link>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={12}></th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("total cartoon")}</th>
                            <th colSpan={10}>{totalCartoon}</th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("final total to sell price")}</th>
                            <th colSpan={10}>{totalSellPrice.toFixed(2)}</th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("final total to buy price")}</th>
                            <th colSpan={10}>{totalBuyPrice.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
      );
}