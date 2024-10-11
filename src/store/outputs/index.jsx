import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next';
import ClipLoader from "react-spinners/ClipLoader";
import CheckIcon from '@mui/icons-material/Check';


let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let totalValue=0;
let totalQuantity=0;

let shopName={
    'محل شفا بدران':'shafa',
    'محل رصيفة':'rsifah',
    'محل سحاب':'sahab',
    'محل بيرين':'berain',
};

export default function Output(){
    const date=new Date();
    const [thisMonth, setThisMonth] = useState(`${date.getFullYear()}-${date.getMonth()+1}`);
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [outputs, setOutputs] = useState([]);
    const [description,setDescription] = useState('');
    const [discount, setDiscount] = useState(0);
    const [editDescriptionIsOpen,setEditDescriptionIsOpen] = useState([false,{}]);
    const [confirmDeleteIsOpen,setConfirmDeleteIsOpen] = useState([false,{}]);
    const [productsOutputData,setProductsOutputData] = useState([]);
    const [totalProductOutput,setTotalProductOutput] = useState({});
    const [totalOutput, setTotalOutput] = useState({});
    const [outputDelete, setOutputDelete] = useState([]);
    const [loadingIsOpen, setLoadingIsOpen] = useState(false);
    const [reloadPageIsOpen,setReloadPageIsOpen] = useState(false);
    const [shopTotalInput,setShopTotalInput] = useState({});
    const [shopInput,setShopInput] = useState([]);



    let month=localStorage.getItem('month');


    const handleSubmit=(e)=>{
        const formData = new FormData();
        formData.append('_method', 'GET');
        formData.append('month',month);
        axios.post('http://127.0.0.1:8000/api/store/totalOutput',formData, config)
        .then(response => {
            setOutputs(response.data);
            setThisMonth(month);
            totalValue=0;
            totalQuantity=0;
            response.data.map((item,index)=>{
                totalValue+=item.value;
                totalQuantity+=item.quantity;
            });
        })
    }

    const fetchThisOutput = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/totalOutput',config).then(({ data }) => {
            setOutputs(data);
            totalValue=0;
            totalQuantity=0;
            data.map((item,index)=>{
                totalValue+=item.value;
                totalQuantity+=item.quantity;
            });
        });
    }

    const fetchProductOutput = async (invoice) => {
        await axios.get(`http://127.0.0.1:8000/api/store/productOutput/${invoice}`,config).then(({ data }) => {
            setProductsOutputData(data);
            console.log(data);            
        });
    }

    const fetchTotalProductOutput=async(invoiceNo)=>{
        await axios.get(`http://127.0.0.1:8000/api/store/totalProductOutput/${invoiceNo}`,config).then(({ data }) => {
            setTotalProductOutput(data);
            console.log(data);            
        });
    }

    const fetchTotalOutput=async(invoiceNo)=>{
        await axios.get(`http://127.0.0.1:8000/api/store/totalOutput/${invoiceNo}`,config).then(({data})=>{
            setTotalOutput(data);
            console.log(data);
        });
    }

    const fetchOutput=async(invoiceNo)=>{
        await axios.get(`http://127.0.0.1:8000/api/store/output/${invoiceNo}`,config).then(({data})=>{
            setOutputDelete(data);
            console.log(data);
        });
    }

    const fetchShopTotalInput=async(invoiceNo,shopName)=>{
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput/${invoiceNo}`,config).then(({ data }) => {
            setShopTotalInput(data);
            console.log(data);            
        });
    }

    const fetchShopInput=async(invoiceNo,shopName)=>{
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/input/${invoiceNo}`,config).then(({ data }) => {
            setShopInput(data);
            console.log(data);           
        });
    }

    const fetchShop=(invoiceNo,clientName)=>{
        if (shopName[clientName]) {
            fetchShopInput(invoiceNo,shopName[clientName]);
            fetchShopTotalInput(invoiceNo,shopName[clientName]);
        }
    }

    useEffect(() => {
        handleSubmit();
      }, []);



    return(
        <>
            {editDescription(editDescriptionIsOpen,setEditDescriptionIsOpen,description,setDescription,discount, setDiscount,t)}
            {deleteConfirm(t,shopInput,shopTotalInput,totalOutput,totalProductOutput,confirmDeleteIsOpen,setConfirmDeleteIsOpen,productsOutputData,outputDelete,setLoadingIsOpen,setReloadPageIsOpen)}
            {loadingScreen(loadingIsOpen)}
            {reloadPage(t,reloadPageIsOpen,setReloadPageIsOpen)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}}>
                <Link to="/output/create" className='btn btn-outline-success'>{t("create")}</Link>
                <form className='d-flex' onSubmit={handleSubmit}>
                    <input type="submit" value={t("show")} class="btn btn-light border mx-2 px-4 py-1"/>
                    <input className='form-control' value={month} onChange={(e)=>{localStorage.setItem('month',e.target.value);}} type='month'/>
                </form>
            </div>
            <div class="table-responsive p-1">
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{t("date")}</th>
                            <th>{t('id')}</th>
                            <th>{t('client name')}</th>
                            <th>{t("invoice no")}</th>
                            <th>{t("value")}</th>
                            <th>{t("discount")}</th>
                            <th>{t("value after discount")}</th>
                            <th>{t("quantity")}</th>
                            <th>{t("description")}</th>
                            <th>{t("details")}</th>
                            <th>{t("edit")}</th>
                            <th>{t("delete")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            outputs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.month}-{item.day}</td>
                                        <td>{item.client_id}</td>
                                        <td>{item.client_name}</td>
                                        <td>{item.invoice_no}</td>
                                        <td>{(item.value).toFixed(2)}</td>
                                        <td>{item.discount}</td>
                                        <td>{item.value-item.discount}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.description}</td>
                                        <td>{<Link to={'/output/details'} state={{ data: item }} className='btn btn-success'>{t("show")}</Link>}</td>
                                        <td>{<button onClick={()=>{setEditDescriptionIsOpen([true,item]);setDescription(item.description);setDiscount(item.discount)}} className='btn btn-success'>{t("edit")}</button>}</td>
                                        <td>{<button onClick={()=>{setConfirmDeleteIsOpen([true,item]);fetchProductOutput(item.invoice_no);fetchTotalProductOutput(item.invoice_no);fetchTotalOutput(item.invoice_no);fetchOutput(item.invoice_no);fetchShop(item.invoice_no,item.client_name)}} className='btn btn-danger'>{t("delete")}</button>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>{thisMonth}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{totalValue.toFixed(2)}</td>
                            <td></td>
                            <td></td>
                            <td>{totalQuantity}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}
function editDescription(editDescriptionIsOpen,setEditDescriptionIsOpen,description,setDescription,discount, setDiscount,t){
    const edit = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('date', `${editDescriptionIsOpen[1].month}-${editDescriptionIsOpen[1].day}`);
        formData.append('client_name', editDescriptionIsOpen[1].client_name);
        formData.append('invoice_no', editDescriptionIsOpen[1].invoice_no);
        formData.append('description', description);
        formData.append('value', editDescriptionIsOpen[1].value);
        formData.append('discount', discount);
        formData.append('quantity', editDescriptionIsOpen[1].quantity);
        
    
        console.log(formData)
        
        await axios.post(`http://127.0.0.1:8000/api/store/totalOutput/${editDescriptionIsOpen[1].id}`, formData,config)
        .then(({data})=>{
            console.log(data.message);
            window.location.reload();
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
        <Modal
          isOpen={editDescriptionIsOpen[0]}
          onRequestClose={()=>setEditDescriptionIsOpen([false,{}])}
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
                <h5 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("edit")}</h5>
                <form onSubmit={edit}>
                    <div className="form-group row" style={{display:"flex",justifyContent:"center"}}>
                        <div className="form-group mb-4">
                            <label for="discount">{t("discount")}</label>
                            <input onChange={(e)=>{setDiscount(e.target.value)}} type="number" step={0.01} className="form-control" placeholder={t("Enter discount")} value={discount}/>
                        </div>
                        <div className="form-group mb-4">
                            <label for="description">{t("description")}</label>
                            <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")} value={description}/>
                        </div>
                        <button className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
                </form>
            </div>
        </Modal>
      </>
    );
}

function deleteConfirm(t,shopInput,shopTotalInput,totalOutput,totalProductOutput,confirmDeleteIsOpen,setConfirmDeleteIsOpen,productsOutputData,outputDelete,setLoadingIsOpen,setReloadPageIsOpen) {
    const deleteItem=async(data)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/output/${data.id}`,config)
        .then(({ data }) => {
            console.log(data);
            setLoadingIsOpen(false);
            setReloadPageIsOpen(true);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const deleteTotalOutput=async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/totalOutput/${totalOutput.id}`,config).then(({data})=>{
            console.log(data.message);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });
    }

    const createProduct=async(data)=>{
        const formDataProduct = new FormData();
        formDataProduct.append('date', `${data.month}-${data.day}`);
        formDataProduct.append('company_name', data.company_name);
        formDataProduct.append('product_no', data.product_no);
        formDataProduct.append('product_name', data.product_name);
        formDataProduct.append('invoice_no', data.invoice_no);
        formDataProduct.append('buy_price', data.buy_price);
        formDataProduct.append('sell_price', data.sell_price);
        formDataProduct.append('cartoon', data.cartoon);
        formDataProduct.append('packing', data.packing);
        formDataProduct.append('description', data.description);
        if (data.image!=='') {
            formDataProduct.append('image', data.image);
        }
        
        
        await axios.post('http://127.0.0.1:8000/api/store/product', formDataProduct,config)
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

    const deleteProductOutput = async(data)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/productOutput/${data.id}`,config)
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

    const deleteTotalProductOutput = async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/totalProductOutput/${totalProductOutput.id}`,config)
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

    const deleteShopInput=async(id)=>{
        await axios.delete(`http://127.0.0.1:8000/api/shop/${shopName[totalOutput.client_name]}/input/${id}`,config)
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

    const deleteShopTotalInput=async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/shop/${shopName[totalOutput.client_name]}/totalInput/${shopTotalInput.id}`,config)
        .then(({data})=>{
            console.log(data.message);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors);
            } else {
                console.log(response.data.message);
            }
        });
    }

    const deleteAll=()=>{
        setLoadingIsOpen(true);

        deleteTotalOutput();
        deleteTotalProductOutput();

        productsOutputData.map((data,index)=>{
            deleteProductOutput(data);
            createProduct(data);
        });

        if (shopName[totalOutput.client_name]) {
            shopInput.map((item,index)=>{
                deleteShopInput(item.id);
            });
            deleteShopTotalInput();
        }
        outputDelete.map((data,index)=>{
            deleteItem(data);
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("are you sure to delete thiis invoice?")}</h3>
            <div className='row p-2'>
                <button onClick={()=>{deleteAll()}} className='btn btn-danger row m-2'>{t("yes")}</button>
                <button onClick={()=>{setConfirmDeleteIsOpen([false,{}])}} className='btn btn-success row m-2'>{t("no")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function loadingScreen(loadingIsOpen) {
    return (
      <div className="sweet-loading">
        <Modal
            isOpen={loadingIsOpen}
            style={{
                content:{
                    marginLeft:"22vw",
                    alignSelf:"center",
                    alignContent:"center",
                    width:"50vw",
                    height:"50vh",
                    border:"none",
                }
            }}
          >
            <div style={{display:"flex",justifyContent:"center"}}>
                <ClipLoader
                    color={"#000000"}
                    loading={loadingIsOpen}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </Modal>
      </div>
    );
}

function reloadPage(t,reloadPageIsOpen,setReloadPageIsOpen) {
    return(
        <>
        <Modal
          isOpen={reloadPageIsOpen}
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
            <div className='col justify-content-between'>
                <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10px",color:"green"}}>{t("The invoice has been deleted successfully.")}</h3>
                <div style={{display:"flex",justifyContent:"center", color:"green", fontSize:"100px"}}>
                    <CheckIcon style={{fontSize:"200px"}}/>
                </div>
                <div className='row' style={{paddingLeft:"150px",paddingRight:"150px"}}>
                    <button onClick={()=>{setReloadPageIsOpen(false);window.location.reload()}} className='btn btn-success m-2'>{t("ok")}</button>
                </div>
          </div>
        </Modal>
      </>
    );
}
