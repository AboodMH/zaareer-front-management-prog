import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import { useTranslation } from 'react-i18next';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function OutputDetailsEdit(){
    const location = useLocation();
    const outputData=location.state.data;

    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState(`${outputData.month}-${outputData.day}`);
    const [clientName, setClientName] = useState(outputData.client_name);
    const [barcode, setBarcode] = useState(outputData.barcode);
    const [productNo, setProductNo] = useState(outputData.product_no);
    const [productName, setProductName] = useState(outputData.product_name);
    const [invoiceNo, setInvoiceNo] = useState(outputData.invoice_no);
    const [price, setPrice] = useState(outputData.price);
    const [cartoon, setCartoon] = useState(outputData.cartoon);
    const [packing, setPacking] = useState(outputData.packing);
    const [description, setDescription] = useState(outputData.description);
    const [image, setImage] = useState("");
    const [clients, setClients] = useState([]);
    const [totalOutputData, setTotalOuutputData] = useState([]);

    const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    const fetchTotalOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/totalOutput/${outputData.invoice_no}`,config).then(({ data }) => {
            setTotalOuutputData(data);
        });
    }

    const fetchClient = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/client',config).then(({ data }) => {setClients(data);});
    }

    useEffect(() => {
        fetchClient();
        fetchTotalOutput();
    }, []);

    const create = async(e)=>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('date', date);
        formData.append('client_name', clientName);
        formData.append('invoice_no', invoiceNo);
        formData.append('description', totalOutputData[0].description);
        formData.append('value', (totalOutputData[0].value-((outputData.price*outputData.cartoon*outputData.packing)-(price*cartoon*packing))).toFixed(2));
        formData.append('quantity', totalOutputData[0].quantity-(outputData.cartoon-cartoon));
        

        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/store/totalOutput/${outputData.id}`, formData,config)
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


        const formDataOutput = new FormData();
        formDataOutput.append('_method', 'PATCH');
        formDataOutput.append('date', date);
        formDataOutput.append('client_name', clientName);
        formDataOutput.append('barcode', barcode);
        formDataOutput.append('product_no', productNo);
        formDataOutput.append('product_name', productName);
        formDataOutput.append('invoice_no', invoiceNo);
        formDataOutput.append('price', price);
        formDataOutput.append('cartoon', cartoon);
        formDataOutput.append('packing', packing);
        formDataOutput.append('description', description);
        if (image !=='') {
            formDataOutput.append('image', image);
        }

        console.log(formDataOutput)
        
        await axios.post(`http://127.0.0.1:8000/api/store/output/${outputData.id}`, formDataOutput,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1, {state:{data:outputData},replace:false});

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
                    <input onChange={(e)=>{setDate(e.target.value)}} type="date" value={date} className="form-control"/>
                </div>
                <div className="form-group mb-4">
                    <div className="d-flex justify-content-between">
                        <label for="client name">{t("client name")}</label>
                        <lable>{clientName}</lable>
                    </div>
                    <select onChange={(e)=>{setClientName(e.target.value)}} type="text" className="form-select" placeholder={t("Enter client name")}>
                        <option value="">change client name</option>
                        {
                            clients.map((client, index) => {
                                return <option key={index} value={client.client_name}>{client.client_name}</option>
                            })
                        }
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label for="barcode">{t("barcode")}</label>
                    <input onChange={(e)=>{setBarcode(e.target.value)}} type="text" className="form-control" placeholder={t("Enter barcode")} value={barcode}/>
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
