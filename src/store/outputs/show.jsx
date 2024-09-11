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

let TotalCartoon=0;
let total=0;

export default function OutputDetails(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [outputs, setOutputs] = useState([]);
    const [productsData,setProductsData] = useState([]);
    const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState([false,{}]);
    const [totalOutput, setTotalOutput] = useState({});
    const [addProductIsOpen,setAddProductIsOpen] = useState(false);
    const [price, setPrice] = useState(0);
    const [productNo, setProductNo] = useState('');
    const [productName, setProductName] = useState('');
    const [packing, setPacking] = useState(0);
    const [cartoon,setCartoon] = useState(0);
    const [description,setDescription] = useState('');
    const [getProducts,setGetProducts] = useState([]);
    const location = useLocation();
    const invoiceNo=location.state.data.invoice_no;
    const month=location.state.data.month;
    const day=location.state.data.day;
    const clientId=location.state.data.client_id;
    const clientName=location.state.data.client_name;

    const fetchThisOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/output/${invoiceNo}`,config).then(({ data }) => {
            setOutputs(data);
            TotalCartoon=0;
            total=0;
            data.map((item, index) => {
                TotalCartoon+=item.cartoon;
                total+=item.price*item.packing*item.cartoon;
                console.log(TotalCartoon);
                console.log(total);
            })});
    }

    const fetchTotalOutput=async()=>{
        await axios.get(`http://127.0.0.1:8000/api/store/totalOutput/${invoiceNo}`,config).then(({data})=>{
            setTotalOutput(data[0]);
            console.log(data[0]);
        });
    }

    const fetchProduct = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/product',config).then(({ data }) => {
            setProductsData(data);
            console.log(productsData);
        });
    }

    
    useEffect(() => {
        fetchThisOutput();
        fetchTotalOutput();
        fetchProduct();
      }, []);


    return(
        <>
            {deleteConfirm(t,totalOutput,confirmDeleteIsOpen,setConfirmDeleteIsOpen)}
            {addProduct(t,totalOutput,addProductIsOpen,setGetProducts,getProducts,productsData,setAddProductIsOpen,setProductNo,setProductName,setPrice,setPacking,setCartoon,setDescription,productNo,productName,price,packing,cartoon,description)}
            <div class="table-responsive p-1">
                <div className="form-group mb-2">
                    <button onClick={()=>{setAddProductIsOpen(true)}} className="btn btn-success">{t("add product")}</button>
                </div>
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th colSpan={2}>{t("date")}</th>
                            <th colSpan={4}>{month}-{day}</th>
                            <th colSpan={2}>{t("invoice no")}</th>
                            <th colSpan={3}>{invoiceNo}</th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("id")}</th>
                            <th colSpan={4}>{clientId}</th>
                            <th colSpan={2}>{t("client name")}</th>
                            <th colSpan={3}>{clientName}</th>
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
                            <th>{t("edit")}</th>
                            <th>{t("delete")}</th>
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
                                        <td>{item.price}</td>
                                        <td>{item.cartoon}</td>
                                        <td>{item.packing}</td>
                                        <td>{(item.price*item.packing).toFixed(2)}</td>
                                        <td>{(item.price*item.packing*item.cartoon).toFixed(2)}</td>
                                        <td>{<Link to={'/output/details/image'} state={{ data: item.image }} className='btn btn-success'>{t("show")}</Link>}</td>
                                        <td>{<Link to={'/output/details/edit'} state={{ data: item }} className='btn btn-success'>{t("edit")}</Link>}</td>
                                        <td>{<button onClick={()=>{setConfirmDeleteIsOpen([true,item])}} className='btn btn-danger'>{t("delete")}</button>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={13}></th>
                        </tr>
                        <tr>
                            <th colSpan={3}>{t("total cartoon")}</th>
                            <th colSpan={10}>{TotalCartoon}</th>
                        </tr>
                        <tr>
                            <th colSpan={3}>{t("final total")}</th>
                            <th colSpan={10}>{total.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}

function deleteConfirm(t,totalOutput,confirmDeleteIsOpen,setConfirmDeleteIsOpen) {
    const deleteItem=async(id)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/output/${id}`,config)
        .then(({ data }) => {
            console.log(data);
            setConfirmDeleteIsOpen([false,{}]);
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
    }
    const updateTotalOutput=async(e)=>{
        const formDataTotalOutput=new FormData();
        formDataTotalOutput.append('_method', 'PATCH');
        formDataTotalOutput.append('date',`${totalOutput.month}-${totalOutput.day}`);
        formDataTotalOutput.append('client_name',totalOutput.client_name);
        formDataTotalOutput.append('invoice_no',totalOutput.invoice_no);
        formDataTotalOutput.append('description',totalOutput.description);
        formDataTotalOutput.append('value',totalOutput.value-(confirmDeleteIsOpen[1].price*confirmDeleteIsOpen[1].packing*confirmDeleteIsOpen[1].cartoon));
        formDataTotalOutput.append('quantity',totalOutput.quantity-confirmDeleteIsOpen[1].cartoon);

        await axios.post(`http://127.0.0.1:8000/api/store/totalOutput/${totalOutput.id}`,formDataTotalOutput,config).then(({data})=>{
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
          isOpen={confirmDeleteIsOpen[0]}
          onRequestClose={()=>setConfirmDeleteIsOpen([false,{}])}
          style={{
              overlay:{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content:{
                  marginLeft:"22vw",
                  alignSelf:"center",
                  width:"50vw",
                  height:"50vh",
              }
          }}
        >
          <div className='col'>
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("are you sure to delete thiis product?")}</h3>
            <div className='row p-2'>
                <button onClick={()=>{deleteItem(confirmDeleteIsOpen[1].id);updateTotalOutput()}} className='btn btn-danger row m-2'>{t("yes")}</button>
                <button onClick={()=>{setConfirmDeleteIsOpen([false,{}])}} className='btn btn-success row m-2'>{t("no")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function addProduct(t,totalOutput,addProductIsOpen,setGetProducts,getProducts,productsData,setAddProductIsOpen,setProductNo,setProductName,setPrice,setPacking,setCartoon,setDescription,productNo,productName,price,packing,cartoon,description) {
    const create = async(e)=>{
        e.preventDefault();
        const formDataInput = new FormData();
        formDataInput.append('date', `${totalOutput.month}-${totalOutput.day}`);
        formDataInput.append('client_name', totalOutput.client_name);
        formDataInput.append('product_no', productNo);
        formDataInput.append('product_name', productName);
        formDataInput.append('invoice_no', totalOutput.invoice_no);
        formDataInput.append('price', price);
        formDataInput.append('cartoon', cartoon);
        formDataInput.append('packing', packing);
        formDataInput.append('description', description);

        console.log(formDataInput)
        
        await axios.post('http://127.0.0.1:8000/api/store/output', formDataInput,config)
        .then(({data})=>{
            console.log(data.message);
            window.location.reload();
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });
    }

    const updateTotalOutput=async(e)=>{
        const formDataTotalOutput=new FormData();
        formDataTotalOutput.append('_method', 'PATCH');
        formDataTotalOutput.append('date',`${totalOutput.month}-${totalOutput.day}`);
        formDataTotalOutput.append('client_name',totalOutput.client_name);
        formDataTotalOutput.append('invoice_no',totalOutput.invoice_no);
        formDataTotalOutput.append('description',totalOutput.description);
        formDataTotalOutput.append('value',totalOutput.value+(price*packing*cartoon));
        formDataTotalOutput.append('quantity',parseFloat(totalOutput.quantity)+parseFloat(cartoon));

        await axios.post(`http://127.0.0.1:8000/api/store/totalOutput/${totalOutput.id}`,formDataTotalOutput,config).then(({data})=>{
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
          isOpen={addProductIsOpen}
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("choose product")}</h3>
            <div className="px-4 pt-4">
                <div className="form-group mb-4">
                    <input id="searchProduct" type="text" onChange={(e)=>{
                        listProduct(e,productsData,setGetProducts,getProducts);
                    }} style={{width:"100%",border:"1px solid LightGray",cursor:"pointer",height:"35px"}} placeholder={t("search products")}/>
                    <div id="productResult" className="mb-4" style={{display:"none",backgroundColor:"gray",height:"200px",overflowY:"scroll"}}>
                        {
                            getProducts.map((item,index)=>{
                                return(
                                    <div onClick={()=>{setProduct(setProductNo,setProductName,setPrice,setPacking,setCartoon,item)}} id={index} className="d-flex px-4" style={{borderBottom:"1px solid",cursor:"pointer"}}>
                                        <h6 className="px-2">product no: {item.product_no}</h6>
                                        <h6 className="px-2">product name: {item.product_name}</h6>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <form onSubmit={create}>
                <div className="px-4 pb-4">
                    <div className="form-group mb-4">
                        <label for="product no">{t("product no")}</label>
                        <input value={productNo} type="text" className="form-control" placeholder={t("Enter product no")}/>
                    </div>
                    <div className="form-group mb-4">
                        <label for="product name">{t("product name")}</label>
                        <input value={productName} type="text" className="form-control" placeholder={t("Enter product name")}/>
                    </div>
                    <div className="form-group mb-4">
                        <label for="price">{t("price")}</label>
                        <input value={price} type="number" step={0.01} className="form-control" placeholder={t("Enter price")}/>
                    </div>
                    <div className="form-group mb-4">
                        <label for="packing">{t("packing")}</label>
                        <input value={packing} type="number" className="form-control" placeholder={t("Enter packing")}/>
                    </div>
                    <div className="form-group mb-4">
                        <label for="cartoon">{t("cartoon")}</label>
                        <input onChange={(e)=>{setCartoon(e.target.value)}} value={cartoon} type="number" className="form-control" placeholder={t("Enter cartoon")}/>
                    </div>
                    <div className="form-group mb-4">
                        <label for="description">{t("description")}</label>
                        <input onChange={(e)=>{setDescription(e.target.value)}} value={description} type="text" className="form-control" placeholder={t("Enter description")}/>
                    </div>
                    <div className='row p-4'>
                        <button onClick={()=>{updateTotalOutput()}} className="btn btn-outline-success row mb-2">{t("create")}</button>
                        <button onClick={()=>{window.location.reload();}} className="btn btn-outline-danger row">{t("cancel")}</button>
                    </div>
                </div>
            </form>
          </div>
        </Modal>
      </>
    );
}

function listProduct(e,productsData,setGetProducts,getProducts) {
    let result=productsData.filter(check);
    function check(element){
        return element["product_no"].toLowerCase().startsWith(e.target.value.toLowerCase());
    }
    setGetProducts(result);
    console.log(getProducts);
    
    let productResult=document.querySelector('#productResult');
    e.target.value ? productResult.style.display="block" : productResult.style.display="none";
    e.target.value ? productResult.style.borderRadius="0 0 8px 8px" : productResult.style.borderRadius="none";
}

function setProduct(setProductNo,setProductName,setPrice,setPacking,setCartoon,item) {
    setProductNo(item.product_no);
    setProductName(item.product_name);
    setPrice(item.sell_price);
    setPacking(item.packing);
    setCartoon(item.cartoon);

    let searchProduct=document.querySelector('#searchProduct');
    searchProduct.value="";


    let productResult=document.querySelector('#productResult');
    productResult.style.display="none";
}

