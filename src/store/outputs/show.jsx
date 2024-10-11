import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation} from 'react-router-dom';
import * as React from 'react';
import axios from "axios";
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import ClipLoader from "react-spinners/ClipLoader";
import CheckIcon from '@mui/icons-material/Check';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let totalCartoon=0;
let total=0;

let shopName={
    'محل شفا بدران':'shafa',
    'محل رصيفة':'rsifah',
    'محل سحاب':'sahab',
    'محل بيرين':'berain',
};

export default function OutputDetails(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [outputs, setOutputs] = useState([]);
    const [productsData,setProductsData] = useState([]);
    const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState([false,{}]);
    const [totalOutput, setTotalOutput] = useState({});
    const [addProductIsOpen,setAddProductIsOpen] = useState(false);
    const [price, setPrice] = useState(0);
    const [buyPrice, setBuyPrice] = useState(0);
    const [productNo, setProductNo] = useState('');
    const [productName, setProductName] = useState('');
    const [packing, setPacking] = useState(0);
    const [cartoon,setCartoon] = useState(0);
    const [description,setDescription] = useState('لايوجد');
    const [getProducts,setGetProducts] = useState([]);
    const [productsOutputData,setProductsOutputData] = useState({});
    const [totalProductOutput,setTotalProductOutput] = useState({});
    const [shopTotalInput,setShopTotalInput] = useState({});
    const [loadingIsOpen, setLoadingIsOpen] = useState(false);
    const [reloadPageIsOpen,setReloadPageIsOpen] = useState(false);


    const location = useLocation();
    const invoiceNo=location.state.data.invoice_no;
    const month=location.state.data.month;
    const day=location.state.data.day;
    const clientId=location.state.data.client_id;
    const clientName=location.state.data.client_name;


    const fetchThisOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/output/${invoiceNo}`,config).then(({ data }) => {
            setOutputs(data);
            totalCartoon=0;
            total=0;
            data.map((item, index) => {
                totalCartoon+=item.cartoon;
                total+=item.price*item.packing*item.cartoon;
                console.log(totalCartoon);
                console.log(total);
            })});
    }

    const fetchTotalOutput=async()=>{
        await axios.get(`http://127.0.0.1:8000/api/store/totalOutput/${invoiceNo}`,config).then(({data})=>{
            setTotalOutput(data);
            console.log(data);
        });
    }

    const fetchProduct = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/product',config).then(({ data }) => {
            setProductsData(data);
            console.log(productsData);
        });
    }

    const fetchProductOutput = async (productNo) => {
        await axios.get(`http://127.0.0.1:8000/api/store/productOutput/getProduct/${productNo}`,config).then(({ data }) => {
            setProductsOutputData(data);
            console.log(data);            
        });
    }

    const fetchTotalProductOutput=async(invoiceNo)=>{
        await axios.get(`http://127.0.0.1:8000/api/store/totalProductOutput/${invoiceNo}`,config).then(({ data }) => {
            setTotalProductOutput(data);
            console.log(data.id);           
        });
    }

    const fetchShopTotalInput=async(invoiceNo,shopName)=>{
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput/${invoiceNo}`,config).then(({ data }) => {
            setShopTotalInput(data);
            console.log(data);            
        });
    }

    
    useEffect(() => {
        fetchThisOutput();
        fetchTotalOutput();
        fetchProduct();
        fetchTotalProductOutput(invoiceNo);
        if (shopName[clientName]) {
            fetchShopTotalInput(invoiceNo,shopName[clientName]);
        }
      }, []);


    return(
        <>
            {deleteConfirm(t,totalOutput,totalProductOutput,totalProductOutput,confirmDeleteIsOpen,setConfirmDeleteIsOpen,productsOutputData)}
            {addProduct(t,setLoadingIsOpen,setReloadPageIsOpen,month,day,invoiceNo,clientName,shopTotalInput,totalOutput,totalProductOutput,addProductIsOpen,setGetProducts,getProducts,productsData,setAddProductIsOpen,setProductNo,setProductName,setPrice,setBuyPrice,setPacking,setCartoon,setDescription,productNo,productName,price,buyPrice,packing,cartoon,description)}
            {loadingScreen(loadingIsOpen)}
            {reloadPage(t,reloadPageIsOpen,setReloadPageIsOpen)}
            <div class="table-responsive p-1">
                <div className="form-group mb-2">
                    <button onClick={()=>{setAddProductIsOpen(true);}} className="btn btn-success">{t("add product")}</button>
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
                                        <td>{<button onClick={()=>{setConfirmDeleteIsOpen([true,item]);fetchProductOutput(item.product_no)}} className='btn btn-danger'>{t("delete")}</button>}</td>
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
                            <th colSpan={10}>{totalCartoon}</th>
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

function deleteConfirm(t,totalOutput,totalProductOutput,confirmDeleteIsOpen,setConfirmDeleteIsOpen,productsOutputData) {
    const deleteItem=async(id)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/output/${id}`,config)
        .then(({ data }) => {
            console.log(data);
            setConfirmDeleteIsOpen([false,{}]);

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
        formDataTotalOutput.append('value',(totalOutput.value-(confirmDeleteIsOpen[1].price*confirmDeleteIsOpen[1].packing*confirmDeleteIsOpen[1].cartoon)).toFixed(2));
        formDataTotalOutput.append('discount',totalOutput.discount);
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

    const createProduct=async(e)=>{
        const formDataProduct = new FormData();
        formDataProduct.append('date', `${productsOutputData.month}-${productsOutputData.day}`);
        formDataProduct.append('company_name', productsOutputData.company_name);
        formDataProduct.append('product_no', productsOutputData.product_no);
        formDataProduct.append('product_name', productsOutputData.product_no);
        formDataProduct.append('invoice_no', productsOutputData.invoice_no);
        formDataProduct.append('buy_price', productsOutputData.buy_price);
        formDataProduct.append('sell_price', productsOutputData.sell_price);
        formDataProduct.append('cartoon', productsOutputData.cartoon);
        formDataProduct.append('packing', productsOutputData.packing);
        formDataProduct.append('description', productsOutputData.description);
        if (productsOutputData.image!=='') {
            formDataProduct.append('image', productsOutputData.image);
        }

        console.log(formDataProduct)
        
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

    const deleteProductOutput = async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/productOutput/${productsOutputData.id}`,config)
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

    const updateTotalProductOutput = async(e)=>{
        const formDataTotalProductOutput=new FormData();
        formDataTotalProductOutput.append('_method', 'PATCH');
        formDataTotalProductOutput.append('date',`${totalProductOutput.month}-${totalProductOutput.day}`);
        formDataTotalProductOutput.append('client_name',totalProductOutput.client_name);
        formDataTotalProductOutput.append('invoice_no',totalProductOutput.invoice_no);
        formDataTotalProductOutput.append('sell_value',(totalProductOutput.sell_value-(productsOutputData.sell_price*productsOutputData.packing*productsOutputData.cartoon)).toFixed(2));
        formDataTotalProductOutput.append('buy_value',(totalProductOutput.buy_value-(productsOutputData.buy_price*productsOutputData.packing*productsOutputData.cartoon)).toFixed(2));
        formDataTotalProductOutput.append('discount',totalProductOutput.discount);
        formDataTotalProductOutput.append('quantity',(totalProductOutput.quantity-productsOutputData.cartoon).toFixed(0));
        formDataTotalProductOutput.append('description',totalProductOutput.description);


        await axios.post(`http://127.0.0.1:8000/api/store/totalProductOutput/${totalProductOutput.id}`, formDataTotalProductOutput,config)
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
                <button onClick={()=>{deleteItem(confirmDeleteIsOpen[1].id);updateTotalOutput();createProduct();deleteProductOutput();updateTotalProductOutput()}} className='btn btn-danger row m-2'>{t("yes")}</button>
                <button onClick={()=>{setConfirmDeleteIsOpen([false,{}])}} className='btn btn-success row m-2'>{t("no")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function addProduct(t,setLoadingIsOpen,setReloadPageIsOpen,month,day,invoiceNo,clientName,shopTotalInput,totalOutput,totalProductOutput,addProductIsOpen,setGetProducts,getProducts,productsData,setAddProductIsOpen,setProductNo,setProductName,setPrice,setBuyPrice,setPacking,setCartoon,setDescription,productNo,productName,price,buyPrice,packing,cartoon,description) {
    const createOutput = async(e)=>{
        const formDataInput = new FormData();
        formDataInput.append('date', `${month}-${day}`);
        formDataInput.append('client_name',clientName);
        formDataInput.append('product_no', productNo);
        formDataInput.append('product_name', productName);
        formDataInput.append('invoice_no', invoiceNo);
        formDataInput.append('price', price);
        formDataInput.append('cartoon', cartoon);
        formDataInput.append('packing', packing);
        formDataInput.append('description', description);

        console.log(formDataInput)
        
        await axios.post('http://127.0.0.1:8000/api/store/output', formDataInput,config)
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

    const updateTotalOutput=async(e)=>{
        const formDataTotalOutput=new FormData();
        formDataTotalOutput.append('_method', 'PATCH');
        formDataTotalOutput.append('date',`${month}-${day}`);
        formDataTotalOutput.append('client_name',clientName);
        formDataTotalOutput.append('invoice_no',invoiceNo);
        formDataTotalOutput.append('description',totalOutput.description);
        formDataTotalOutput.append('value',totalOutput.value+(price*packing*cartoon));
        formDataTotalOutput.append('discount',totalOutput.discount);
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

    const createProductOutput = async(e)=>{
        const formDataProductOutput = new FormData();
        formDataProductOutput.append('date', `${month}-${day}`);
        formDataProductOutput.append('invoice_no', invoiceNo);
        formDataProductOutput.append('product_no', productNo);
        formDataProductOutput.append('client_name', clientName);
        formDataProductOutput.append('description', description);
        formDataProductOutput.append('cartoon', cartoon);
        
        await axios.post(`http://127.0.0.1:8000/api/store/productOutput`, formDataProductOutput,config)
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

    const updateTotalProductOutput = async(e)=>{
        const formDataTotalProductOutput=new FormData();
        formDataTotalProductOutput.append('_method', 'PATCH');
        formDataTotalProductOutput.append('date',`${month}-${day}`);
        formDataTotalProductOutput.append('client_name',clientName);
        formDataTotalProductOutput.append('invoice_no',invoiceNo);
        formDataTotalProductOutput.append('sell_value',(totalProductOutput.sell_value+(price*cartoon*packing)).toFixed(2));
        formDataTotalProductOutput.append('buy_value',(totalProductOutput.buy_value+(buyPrice*cartoon*packing)).toFixed(2));
        formDataTotalProductOutput.append('discount',totalProductOutput.discount);
        formDataTotalProductOutput.append('quantity',parseFloat(totalProductOutput.quantity)+parseFloat(cartoon));
        formDataTotalProductOutput.append('description',totalProductOutput.description);


        await axios.post(`http://127.0.0.1:8000/api/store/totalProductOutput/${totalProductOutput.id}`, formDataTotalProductOutput,config)
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

    const createShopInput = async(e)=>{
        const formDataShopInput = new FormData();
        formDataShopInput.append('date', `${month}-${day}`);
        formDataShopInput.append('product_no',productNo);
        formDataShopInput.append('product_name', productName);
        formDataShopInput.append('invoice_no', invoiceNo);
        formDataShopInput.append('price', price);
        formDataShopInput.append('cartoon', cartoon);
        formDataShopInput.append('packing', packing);
        formDataShopInput.append('description', description);
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName[clientName]}/input`, formDataShopInput,config)
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

    const updateShopTotalInput = async(e)=>{
        const formDataShopTotalInput=new FormData();
        formDataShopTotalInput.append('_method', 'PATCH');
        formDataShopTotalInput.append('date',`${month}-${day}`);
        formDataShopTotalInput.append('invoice_no',invoiceNo);
        formDataShopTotalInput.append('description',shopTotalInput.description);
        formDataShopTotalInput.append('value',(shopTotalInput.value+(price*cartoon*packing)).toFixed(2));
        formDataShopTotalInput.append('discount',shopTotalInput.discount);
        formDataShopTotalInput.append('quantity',parseFloat(shopTotalInput.quantity)+parseFloat(cartoon));

        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName[clientName]}/totalInput/${shopTotalInput.id}`, formDataShopTotalInput,config)
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

    const updateQNT=async(e)=>{
        const formEditQNT = new FormData();
        formEditQNT.append('product_no', productNo);
        formEditQNT.append('cartoon', cartoon);

        await axios.post(`http://127.0.0.1:8000/api/store/product/updateQNT`,formEditQNT,config).then(({ data }) => {
            console.log(data);
            setLoadingIsOpen(false);
            setReloadPageIsOpen(true);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });
    }

    const create=async(e)=>{
        setLoadingIsOpen(true);
        createOutput();
        updateTotalOutput();
        createProductOutput();
        updateTotalProductOutput();
        if (shopName[clientName]) {
            createShopInput();
            updateShopTotalInput();
        }
        updateQNT();
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"5%"}}>{t("choose product")}</h3>
            <div className="px-4 pt-4">
                <div className="form-group mb-4">
                    <input id="searchProduct" type="text" onChange={(e)=>{
                        listProduct(e,productsData,setGetProducts,getProducts);
                    }} style={{width:"100%",border:"1px solid LightGray",cursor:"pointer",height:"35px"}} placeholder={t("search products")}/>
                    <div id="productResult" className="mb-4" style={{display:"none",backgroundColor:"gray",height:"200px",overflowY:"scroll"}}>
                        {
                            getProducts.map((item,index)=>{
                                return(
                                    <div onClick={()=>{setProduct(setProductNo,setProductName,setPrice,setBuyPrice,setPacking,setCartoon,item)}} id={index} className="d-flex px-4" style={{borderBottom:"1px solid",cursor:"pointer"}}>
                                        <h6 className="px-2">product no: {item.product_no}</h6>
                                        <h6 className="px-2">product name: {item.product_name}</h6>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
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
                    <button onClick={()=>{create()}} className="btn btn-outline-success row mb-2">{t("create")}</button>
                    <button onClick={()=>{}} className="btn btn-outline-danger row">{t("cancel")}</button>
                </div>
            </div>
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

function setProduct(setProductNo,setProductName,setPrice,setBuyPrice,setPacking,setCartoon,item) {
    setProductNo(item.product_no);
    setProductName(item.product_name);
    setPrice(item.sell_price);
    setBuyPrice(item.buy_price);
    setPacking(item.packing);
    setCartoon(1);

    let searchProduct=document.querySelector('#searchProduct');
    searchProduct.value="";


    let productResult=document.querySelector('#productResult');
    productResult.style.display="none";
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
                <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10px",color:"green"}}>{t("The product has been added successfully.")}</h3>
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

