import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function ShopInputDetailsEdit({shopName}){
    const location = useLocation();
    const inputData=location.state.data;

    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState(`${inputData.month}-${inputData.day}`);
    const [productNo, setProductNo] = useState(inputData.product_no);
    const [productName, setProductName] = useState(inputData.product_name);
    const [invoiceNo, setInvoiceNo] = useState(inputData.invoice_no);
    const [price, setPrice] = useState(inputData.price);
    const [cartoon, setCartoon] = useState(inputData.cartoon);
    const [packing, setPacking] = useState(inputData.packing);
    const [description, setDescription] = useState(inputData.description);
    const [image, setImage] = useState("");
    const [totalInputData, setTotalInputData] = useState([]);

    const fetchTotalInput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput/${inputData.invoice_no}`,config).then(({ data }) => {
            setTotalInputData(data);
        });
    }
    useEffect(() => {
        fetchTotalInput();
        console.log(totalInputData);
        
      }, []);

    const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    const create = async(e)=>{
        e.preventDefault();

        const formDataTotalInput = new FormData();
        formDataTotalInput.append('_method', 'PATCH');
        formDataTotalInput.append('date', date);
        formDataTotalInput.append('invoice_no',invoiceNo);
        formDataTotalInput.append('description',totalInputData[0].description);
        formDataTotalInput.append('value',totalInputData[0].value-((inputData.price*inputData.cartoon*inputData.packing)-(price*cartoon*packing)));
        formDataTotalInput.append('quantity',totalInputData[0].quantity-(inputData.cartoon-cartoon));
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput/${totalInputData[0].id}`, formDataTotalInput,config)
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

        const formDataInput = new FormData();
        formDataInput.append('_method', 'PATCH');
        formDataInput.append('date',date);
        formDataInput.append('product_no', productNo);
        formDataInput.append('product_name', productName);
        formDataInput.append('invoice_no', invoiceNo);
        formDataInput.append('price', price);
        formDataInput.append('cartoon', cartoon);
        formDataInput.append('packing', packing);
        formDataInput.append('description', description);
        if (image !=='') {
            formDataInput.append('image', image);
        }

        console.log(formDataInput)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/input/${inputData.id}`, formDataInput,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1, {state:{data:inputData},replace:false});

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
                    <input onChange={(e)=>{setDate(e.target.value)}} type="text" className="form-control" placeholder={t("Enter date")} value={date}/>
                </div>
                <div className="form-group mb-4">
                    <label for="invoice no">{t("invoice no")}</label>
                    <input onChange={(e)=>{setInvoiceNo(e.target.value)}} type="text" className="form-control" placeholder={t("Enter invoice no")} value={invoiceNo}/>
                </div>
                <div className="form-group mb-4">
                    <label for="product no">{t("product no")}</label>
                    <input onChange={(e)=>{setProductNo(e.target.value)}} type="text" className="form-control" placeholder={t("Enter product no")} value={productNo}/>
                </div>
                <div className="form-group mb-4">
                    <label for="product name">{t("product name")}</label>
                    <input onChange={(e)=>{setProductName(e.target.value)}} type="text" className="form-control" placeholder={t("Enter product name")} value={productName}/>
                </div>
                <div className="form-group mb-4">
                    <label for="description">{t("description")}</label>
                    <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")} value={description}/>
                </div>
                <div className="form-group mb-4">
                    <label for="price">{t("price")}</label>
                    <input onChange={(e)=>{setPrice(e.target.value)}} type="number" step={0.01} className="form-control" placeholder={t("Enter price")} value={price}/>
                </div>
                <div className="form-group mb-4">
                    <label for="cartoon">{t("cartoon")}</label>
                    <input onChange={(e)=>{setCartoon(e.target.value)}} type="number" className="form-control" placeholder={t("Enter cartoon")} value={cartoon}/>
                </div>
                <div className="form-group mb-4">
                    <label for="packing">{t("packing")}</label>
                    <input onChange={(e)=>{setPacking(e.target.value)}} type="number" className="form-control" placeholder={t("Enter packing")} value={packing}/>
                </div>
                <div className="form-group mb-4">
                    <label for="image">{t("image")}</label>
                    <input onChange={changeHandler} type="file" className="form-control" name="image"/>
                </div>
                <div style={{textAlign:"center"}} className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start"> 
                        <button type="submit" className="btn btn-outline-success mx-4">{t("update")}</button>
                    </div>
                </div>
            </form>
        </>
    );
}
