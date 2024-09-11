import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function InputDetailsEdit(){
    const location = useLocation();
    const inputData=location.state.data;

    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState(`${inputData.month}-${inputData.day}`);
    const [companyName, setCompanyName] = useState(inputData.company_name);
    const [productNo, setProductNo] = useState(inputData.product_no);
    const [productName, setProductName] = useState(inputData.product_name);
    const [invoiceNo, setInvoiceNo] = useState(inputData.invoice_no);
    const [price, setPrice] = useState(inputData.price);
    const [cartoon, setCartoon] = useState(inputData.cartoon);
    const [packing, setPacking] = useState(inputData.packing);
    const [description, setDescription] = useState(inputData.description);
    const [image, setImage] = useState("");
    const [sellPrice,setSellPrice] = useState(0);
    const [totalInputData, setTotalInputData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [editSellPriceIsOpen,setEditSellPriceIsOpen] = useState(false);

    const fetchTotalInput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/totalInput/${inputData.invoice_no}`,config).then(({ data }) => {
            setTotalInputData(data);
        });
    }

    const fetchProduct=async(productNo)=>{
        await axios.get(`http://127.0.0.1:8000/api/store/product/${productNo}`,config).then(({data})=>{
            setProductData(data[0]);
            console.log(data);
        });
    }

    useEffect(() => {
        fetchTotalInput();
        fetchProduct(inputData.product_no);
        console.log(totalInputData);
        
      }, []);

      const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    
    return(
        <>
            {editSellPrice(t,navigate,totalInputData,inputData,productData,editSellPriceIsOpen,setEditSellPriceIsOpen,sellPrice,setSellPrice,date,companyName,productNo,productName,invoiceNo,price,cartoon,packing,description,image)}
            <div className="p-4">
                <div className="form-group mb-4">
                    <label for="date">{t("date")}</label>
                    <input onChange={(e)=>{setDate(e.target.value)}} type="date" value={date} className="form-control"/>
                </div>
                <div className="form-group mb-4">
                    <label for="company name">{t("company name")}</label>
                    <input onChange={(e)=>{setCompanyName(e.target.value)}} type="text" className="form-control" placeholder={t("Enter company name")} value={companyName}/>
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
                        <button onClick={()=>{setEditSellPriceIsOpen(true)}} type="submit" className="btn btn-outline-success mx-4">{t("update")}</button>
                    </div>
                </div>
            </div>
        </>
    );
}


function editSellPrice(t,navigate,totalInputData,inputData,productData,editSellPriceIsOpen,setEditSellPriceIsOpen,sellPrice,setSellPrice,date,companyName,productNo,productName,invoiceNo,price,cartoon,packing,description,image){
    
    const updateInput = async(e)=>{
        const formDataTotalInput = new FormData();
        formDataTotalInput.append('_method', 'PATCH');
        formDataTotalInput.append('date', date);
        formDataTotalInput.append('company_name',companyName);
        formDataTotalInput.append('invoice_no',invoiceNo);
        formDataTotalInput.append('description',totalInputData[0].description);
        formDataTotalInput.append('value',(totalInputData[0].value-((inputData.price*inputData.cartoon*inputData.packing)-(price*cartoon*packing))).toFixed(2));
        formDataTotalInput.append('quantity',totalInputData[0].quantity-(inputData.cartoon-cartoon));
        await axios.post(`http://127.0.0.1:8000/api/store/totalInput/${totalInputData[0].id}`, formDataTotalInput,config)
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
        formDataInput.append('date', date);
        formDataInput.append('company_name', companyName);
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
        
        await axios.post(`http://127.0.0.1:8000/api/store/input/${inputData.id}`, formDataInput,config)
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

        setSellPrice(productData.sell_price);

        const formDataProduct = new FormData();
        formDataProduct.append('_method', "PATCH");
        formDataProduct.append('date', date);
        formDataProduct.append('company_name', companyName);
        formDataProduct.append('product_no', productNo);
        formDataProduct.append('product_name', productName);
        formDataProduct.append('invoice_no', invoiceNo);
        formDataProduct.append('buy_price', price);
        formDataProduct.append('sell_price', sellPrice);
        formDataProduct.append('cartoon', cartoon);
        formDataProduct.append('packing', packing);
        formDataProduct.append('description', description);
        if (image!=='') {
            formDataProduct.append('image', image);
        }

        console.log(formDataProduct)
        
        await axios.post(`http://127.0.0.1:8000/api/store/product/${productData.id}`, formDataProduct,config)
        .then(({data})=>{
            console.log(data.message);
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
        <Modal
          isOpen={editSellPriceIsOpen}
          onRequestClose={()=>setEditSellPriceIsOpen(false)}
          style={{
              overlay:{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content:{
                  marginLeft:"22vw",
                  alignSelf:"center",
                  width:"50vw",
                  height:"70vh",
              }
          }}
        >
            <div className='col'>
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{`${t("add")} ${t("sell price")}`}</h5>
                <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="col-sm-10 mb-4">
                            <input onChange={(e)=>{setSellPrice(e.target.value)}} type="number" step={0.01} className="form-control" placeholder={t("value")} value={sellPrice}/>
                        </div>
                        <button onClick={()=>{updateInput()}} className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
            </div>
        </Modal>
      </>
    );
}
