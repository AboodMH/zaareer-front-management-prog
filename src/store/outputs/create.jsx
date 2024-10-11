import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import axios from "axios";
import { useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import CheckIcon from '@mui/icons-material/Check';



let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

let total=0;
let totalCartoon=0;
let invoiceNo='';

let shopName={
    'محل شفا بدران':'shafa',
    'محل رصيفة':'rsifah',
    'محل سحاب':'sahab',
    'محل بيرين':'berain',
};


Modal.setAppElement('#root');


export default function Home() {
    const { i18n, t } = useTranslation();
    const [confirmDeleteIsOpen,setConfirmDeleteIsOpen] = useState([false,{}]);
    const [deleteItemIsOpen,setDeleteItemIsOpen] = useState(false);
    const [addProductIsOpen,setAddProductIsOpen] = useState(false);
    const [outputs, setOutputs] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [getProducts,setGetProducts] = useState([]);
    const [productNo, setProductNo] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState(0);
    const [packing, setPacking] = useState(0);
    const [cartoon, setCartoon] = useState(0);
    const [clients, setClients] = useState([]);
    const [addInvoiceIsOpen, setAddInvoiceIsOpen] = useState(false);
    const [description,setDescription] = useState('ذمم');
    const [isClearAllDataIsOpen, setIsClearAllDataIsOpen] = useState(false);
    const [isSetClientNameIsOpen,setIsSetClientNameIsOpen] = useState(false);
    const [productAdd, setProductAdd] = useState({});
    const [productSold,setProductSold] = useState({});
    const [isCartoonFoundIsOpen,setIsCartoonFoundIsOpen] = useState([false,'']);
    const [addDiscountIsOpen,setAddDiscountIsOpen] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [loadingIsOpen, setLoadingIsOpen] = useState(false);
    const [reloadPageIsOpen,setReloadPageIsOpen] = useState(false);

    const clientId=localStorage.getItem('clientId');
    const clientName=localStorage.getItem('clientName');
    const date=localStorage.getItem('date');
    const selectedShop=localStorage.getItem('selectedShop');
    const totalBuyPrice=localStorage.getItem('totalBuyPrice');


    const fetchThisOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/storeTemporaryOutput`,config).then(({ data }) => {
            setOutputs(data);
            totalCartoon=0;
            total=0;
            if (data) {
                data.map((item, index) => {
                    totalCartoon+=item.cartoon;
                    total+=item.price*item.packing*item.cartoon;
                    console.log(totalCartoon);
                    console.log(total);
                });
            }
        });
    }

    const fetchInvoiceNumber = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/invoiceNumber`,config).then(({ data }) => {
            invoiceNo=data;
        });
    }

    const fetchProduct = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/product',config).then(({ data }) => {
            setProductsData(data);
            console.log(productsData);
        });
    }

    const fetchClients = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/client',config).then(({ data }) => {
            setClients(data);
            console.log(productsData);
        });
    }



    useEffect(() => {
        fetchThisOutput();
        fetchProduct();
        fetchClients();
        fetchInvoiceNumber();
        console.log('totalBuyPrice');
        console.log(totalBuyPrice);
        
    }, []);


    const setClientNameAndId = (e)=>{
        localStorage.setItem('clientName',e.target.value);
        clients.map((client, index) => {
            if(client.client_name===e.target.value){
                localStorage.setItem('clientId',client.client_id);
            }
        });
        if (e.target.value==='محل شفا بدران' || e.target.value==='محل رصيفة' || e.target.value==='محل سحاب' || e.target.value==='محل بيرين') {
            localStorage.setItem('selectedShop',e.target.value);
        }
        window.location.reload();
    }

    const clearAllData = async(e)=>{
        localStorage.setItem('clientName','');
        localStorage.setItem('clientId','');
        localStorage.setItem('date','');
        localStorage.setItem('selectedShop','');
        localStorage.setItem('totalBuyPrice',0);

        await axios.delete(`http://127.0.0.1:8000/api/store/storeTemporaryOutput/1`,config)
            .then(({ data }) => {
                console.log(data);
                setConfirmDeleteIsOpen([false,{}]);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });


        window.location.reload();
    }

    return(
        <>
            {deleteConfirm(t,cartoon,totalBuyPrice,confirmDeleteIsOpen,setConfirmDeleteIsOpen)}
            {deleteItem(t,cartoon,totalBuyPrice,deleteItemIsOpen,setDeleteItemIsOpen,outputs)}
            {addProduct(t,totalBuyPrice,setIsCartoonFoundIsOpen,productSold,setProductSold,productAdd,setProductAdd,date,clientName,invoiceNo,addProductIsOpen,setAddProductIsOpen,getProducts,setGetProducts,productsData,setProductNo,setProductName,setPrice,setPacking,setCartoon,productNo,productName,price,packing,cartoon)}
            {addInvoice(t,addInvoiceIsOpen,setAddInvoiceIsOpen,setAddDiscountIsOpen,setDescription)}
            {addDiscount(t,totalBuyPrice,setLoadingIsOpen,setReloadPageIsOpen,addDiscountIsOpen,setAddDiscountIsOpen,discount,setDiscount,outputs,date,clientName,selectedShop,invoiceNo,total,totalCartoon,description)}
            {isClearAllData(t,clearAllData,isClearAllDataIsOpen,setIsClearAllDataIsOpen)}
            {isSetClientName(t,isSetClientNameIsOpen,setIsSetClientNameIsOpen)}
            {isCartoonFound(t,isCartoonFoundIsOpen,setIsCartoonFoundIsOpen)}
            {loadingScreen(loadingIsOpen)}
            {reloadPage(t,reloadPageIsOpen,setReloadPageIsOpen)}
            <div class="table-responsive p-1">
                <div className="form-group mb-2 d-flex justify-content-between">
                    <div className='d-flex'>
                        <select onChange={setClientNameAndId} className='form-select'>
                            <option value="">{t("client name")}</option>
                            {
                                clients.map((client, index) => {
                                    return <option key={index} value={client.client_name}>{client.client_name}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div>
                        <button onClick={()=>{clientName && date ? setAddProductIsOpen(true) : setIsSetClientNameIsOpen(true)}} className="btn btn-success">{t("add product")}</button>
                        <button onClick={()=>{outputs.length===0 ? setAddInvoiceIsOpen(false) : setAddInvoiceIsOpen(true)}} className="btn btn-primary mx-2">{t("create invoice")}</button>
                        <button onClick={()=>{outputs.length===0 ? setIsClearAllDataIsOpen(false) : setIsClearAllDataIsOpen(true)}} className='btn btn-danger'>{t('clear all')}</button>
                        <button onClick={()=>{outputs.length===0 ? setDeleteItemIsOpen(false) : setDeleteItemIsOpen(true)}} className='btn btn-danger mx-2'>{t('delete item')}</button>
                    </div>
                </div>
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th colSpan={1}>{t("date")}</th>
                            <th colSpan={4}>
                                <input className='form-control' onChange={(e)=>{localStorage.setItem('date',e.target.value);window.location.reload();}} value={date} type='date'/>
                            </th>
                            <th colSpan={1}>{t("invoice no")}</th>
                            <th colSpan={4}>{invoiceNo}</th>
                        </tr>
                        <tr>
                            <th colSpan={1}>{t("client name")}</th>
                            <th colSpan={4}>{clientName}</th>
                            <th colSpan={1}>{t("id")}</th>
                            <th colSpan={4}>{clientId}</th>
                        </tr>
                        <tr>
                            <th>{t("product no")}</th>
                            <th>{t("product name")}</th>
                            <th>{t("price")}</th>
                            <th>{t("cartoon")}</th>
                            <th>{t("packing")}</th>
                            <th>{t("cartoon price")}</th>
                            <th>{t("total")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            outputs.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.product_no}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.cartoon}</td>
                                        <td>{item.packing}</td>
                                        <td>{(item.price*item.packing).toFixed(2)}</td>
                                        <td>{(item.price*item.packing*item.cartoon).toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={10}></th>
                        </tr>
                        <tr>
                            <th colSpan={1}>{t("total cartoon")}</th>
                            <th colSpan={9}>{totalCartoon}</th>
                        </tr>
                        <tr>
                            <th colSpan={1}>{t("final total")}</th>
                            <th colSpan={9}>{total.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}


function deleteConfirm(t,cartoon,totalBuyPrice,confirmDeleteIsOpen,setConfirmDeleteIsOpen) {
    const del=async(id)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/storeTemporaryOutput/${id}`,config)
        .then(({ data }) => {
            console.log(data);
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const reduceBuyPrice = async (productNo) => {
        await axios.get(`http://127.0.0.1:8000/api/store/product/${productNo}`,config).then(({ data }) => {
            localStorage.setItem('totalBuyPrice',totalBuyPrice-(data.buy_price*data.packing*cartoon));
            console.log(data);
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
                <button onClick={()=>{reduceBuyPrice(confirmDeleteIsOpen[1].product_no);del(confirmDeleteIsOpen[1].id)}} className='btn btn-danger row m-2'>{t("yes")}</button>
                <button onClick={()=>{setConfirmDeleteIsOpen([false,{}])}} className='btn btn-success row m-2'>{t("no")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function deleteItem(t,cartoon,totalBuyPrice,deleteItemIsOpen,setDeleteItemIsOpen,outputs){
    const del=async(id)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/storeTemporaryOutput/delete/${id}`,config)
        .then(({ data }) => {
            console.log(data);
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
    }
    const reduceBuyPrice = async (productNo) => {
        await axios.get(`http://127.0.0.1:8000/api/store/product/${productNo}`,config).then(({ data }) => {
            localStorage.setItem('totalBuyPrice',totalBuyPrice-(data.buy_price*data.packing*cartoon));
            console.log(data);
        });
    }
    return(
        <>
        <Modal
          isOpen={deleteItemIsOpen}
          onRequestClose={()=>{setDeleteItemIsOpen(false)}}
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("Choose product")}</h3>
            <table class="table table-striped table-bordered table-hover">
                <tbody>
                    {
                        outputs.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.product_no}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.cartoon}</td>
                                    <td>{item.packing}</td>
                                    <td>{(item.price*item.packing).toFixed(2)}</td>
                                    <td>{(item.price*item.packing*item.cartoon).toFixed(2)}</td>
                                    <td><button onClick={()=>{reduceBuyPrice(item.product_no);del(item.id)}} className='btn btn-danger'>{t('delete')}</button></td>
                                </tr>
                            );
                        })
                    }
                </tbody>
                </table>
          </div>
        </Modal>
      </>
    );
}

function addProduct(t,totalBuyPrice,setIsCartoonFoundIsOpen,productSold,setProductSold,productAdd,setProductAdd,date,clientName,invoiceNo,addProductIsOpen,setAddProductIsOpen,getProducts,setGetProducts,productsData,setProductNo,setProductName,setPrice,setPacking,setCartoon,productNo,productName,price,packing,cartoon) {
    
    const fetchTemporaryProduct = async (productNo) => {
        await axios.get(`http://127.0.0.1:8000/api/store/storeTemporaryOutput/${productNo}`,config).then(({ data }) => {
            setProductAdd(data);
            console.log(Object.keys(productAdd).length);
        });
    }

    const fetchProductSoldAndBuyPrice = async (productNo) => {
        await axios.get(`http://127.0.0.1:8000/api/store/product/${productNo}`,config).then(({ data }) => {
            setProductSold(data);
            console.log(cartoon);
        });
    }

    const create = async(e)=>{
        if (Object.keys(productAdd).length===0) {
            if (productSold.cartoon-cartoon>=0) {
                const formDataOutput = new FormData();
                formDataOutput.append('date', `${date}`);
                formDataOutput.append('client_name', clientName);
                formDataOutput.append('product_no', productNo);
                formDataOutput.append('product_name', productName);
                formDataOutput.append('invoice_no', invoiceNo);
                formDataOutput.append('price', price);
                formDataOutput.append('cartoon', cartoon);
                formDataOutput.append('packing', packing);
                formDataOutput.append('description', 'لايوجد');

                localStorage.setItem('totalBuyPrice', (parseFloat(totalBuyPrice)+(productSold.buy_price*productSold.packing*cartoon)).toFixed(2));

                console.log(formDataOutput);
                await axios.post('http://127.0.0.1:8000/api/store/storeTemporaryOutput', formDataOutput,config)
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
            }else{
                setIsCartoonFoundIsOpen([true,productSold.product_no])
            }
        }else{
            if (productSold.cartoon-productAdd['cartoon']-cartoon>=0) {
                const formDataOutput = new FormData();
                formDataOutput.append('_method', `PATCH`);
                formDataOutput.append('date', `${date}`);
                formDataOutput.append('client_name', clientName);
                formDataOutput.append('product_no', productNo);
                formDataOutput.append('product_name', productName);
                formDataOutput.append('invoice_no', invoiceNo);
                formDataOutput.append('price', price);
                formDataOutput.append('cartoon', parseInt(productAdd['cartoon'])+parseInt(cartoon));
                formDataOutput.append('packing', packing);
                formDataOutput.append('description', 'لايوجد');

                localStorage.setItem('totalBuyPrice', (parseFloat(totalBuyPrice)+(productSold.buy_price*productSold.packing*cartoon)).toFixed(2));
                
                await axios.post(`http://127.0.0.1:8000/api/store/storeTemporaryOutput/${productAdd['id']}`, formDataOutput,config)
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
            }else{
                setIsCartoonFoundIsOpen([true,productSold.product_no])
            }
        }
    }

    return(
        <>
        <Modal
            isOpen={addProductIsOpen}
            onRequestClose={()=>setAddProductIsOpen(false)}
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
                                    <div onClick={()=>{setProduct(setProductNo,setProductName,setPrice,setPacking,setCartoon,item);fetchTemporaryProduct(item.product_no);fetchProductSoldAndBuyPrice(item.product_no)}} id={index} className="d-flex px-4" style={{borderBottom:"1px solid",cursor:"pointer"}}>
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
                <div className='row p-4'>
                    <button onClick={()=>{create()}} className="btn btn-outline-success row mb-2">{t("create")}</button>
                    <button onClick={()=>{window.location.reload();}} className="btn btn-outline-danger row">{t("cancel")}</button>
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

function setProduct(setProductNo,setProductName,setPrice,setPacking,setCartoon,item) {
    setProductNo(item.product_no);
    setProductName(item.product_name);
    setPrice(item.sell_price);
    setPacking(item.packing);
    setCartoon(1);

    let searchProduct=document.querySelector('#searchProduct');
    searchProduct.value="";


    let productResult=document.querySelector('#productResult');
    productResult.style.display="none";
}

function addInvoice(t,addInvoiceIsOpen,setAddInvoiceIsOpen,setAddDiscountIsOpen,setDescription){

    return(
        <>
        <Modal
          isOpen={addInvoiceIsOpen}
          onRequestClose={()=>setAddInvoiceIsOpen(false)}
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("add any description you want")}</h3>
            <div className="px-4 pb-4">
                <div className="form-group mb-4">
                    <label for="description">{t("description")}</label>
                    <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")}/>
                </div>
                <div className='row p-4'>
                    <button onClick={()=>setAddDiscountIsOpen(true)} className="btn btn-outline-success row mb-2">{t("create")}</button>
                    <button onClick={()=>{window.location.reload();}} className="btn btn-outline-danger row">{t("cancel")}</button>
                </div>
            </div>
          </div>
        </Modal>
      </>
    );
}

function addDiscount(t,totalBuyPrice,setLoadingIsOpen,setReloadPageIsOpen,addDiscountIsOpen,setAddDiscountIsOpen,discount,setDiscount,outputs,date,clientName,selectedShop,invoiceNo,total,totalCartoon,description){
    
    const createTotalOutput = async(e)=>{
        const formDataTotalOutput=new FormData();
        formDataTotalOutput.append('date',date);
        formDataTotalOutput.append('client_name',clientName);
        formDataTotalOutput.append('invoice_no',invoiceNo);
        formDataTotalOutput.append('description',description);
        formDataTotalOutput.append('value',total.toFixed(2));
        formDataTotalOutput.append('discount',discount);
        formDataTotalOutput.append('quantity',totalCartoon);

        await axios.post('http://127.0.0.1:8000/api/store/totalOutput', formDataTotalOutput,config)
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

    const createOutput = async(data)=>{
        const formDataOutput = new FormData();
        formDataOutput.append('date', date);
        formDataOutput.append('client_name', clientName);
        formDataOutput.append('product_no', data.product_no);
        formDataOutput.append('product_name', data.product_name);
        formDataOutput.append('invoice_no', invoiceNo);
        formDataOutput.append('price', data.price);
        formDataOutput.append('cartoon', data.cartoon);
        formDataOutput.append('packing', data.packing);
        formDataOutput.append('description', data.description);

        console.log(formDataOutput)
        
        await axios.post('http://127.0.0.1:8000/api/store/output', formDataOutput,config)
        .then(({data})=>{
            console.log(data.message);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });

        const formEditQNT = new FormData();
        formEditQNT.append('product_no', data.product_no);
        formEditQNT.append('cartoon', data.cartoon);

        await axios.post(`http://127.0.0.1:8000/api/store/product/updateQNT`,formEditQNT,config).then(({ data }) => {
            console.log(data);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });

    }

    const createShopTotalInput = async(e)=>{
        const formDataShopTotalInput=new FormData();
        formDataShopTotalInput.append('date',date);
        formDataShopTotalInput.append('invoice_no',invoiceNo);
        formDataShopTotalInput.append('description',description);
        formDataShopTotalInput.append('value',total.toFixed(2));
        formDataShopTotalInput.append('discount',discount);
        formDataShopTotalInput.append('quantity',totalCartoon);

        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName[selectedShop]}/totalInput`, formDataShopTotalInput,config)
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

    const createShopInput = async(data)=>{
        const formDataShopInput = new FormData();
        formDataShopInput.append('date', date);
        formDataShopInput.append('product_no', data.product_no);
        formDataShopInput.append('product_name', data.product_name);
        formDataShopInput.append('invoice_no', invoiceNo);
        formDataShopInput.append('price', data.price);
        formDataShopInput.append('cartoon', data.cartoon);
        formDataShopInput.append('packing', data.packing);
        formDataShopInput.append('description', data.description);
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName[selectedShop]}/input`, formDataShopInput,config)
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

    const createTotalProductOutput = async(e)=>{
        const formDataTotalProductOutput=new FormData();
        formDataTotalProductOutput.append('date',date);
        formDataTotalProductOutput.append('client_name',clientName);
        formDataTotalProductOutput.append('invoice_no',invoiceNo);
        formDataTotalProductOutput.append('sell_value',total.toFixed(2));
        formDataTotalProductOutput.append('buy_value',totalBuyPrice);
        formDataTotalProductOutput.append('discount',discount);
        formDataTotalProductOutput.append('quantity',totalCartoon);
        formDataTotalProductOutput.append('description',description);


        await axios.post(`http://127.0.0.1:8000/api/store/totalProductOutput`, formDataTotalProductOutput,config)
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

    const createProductOutput = async(data)=>{
        const formDataProductOutput = new FormData();
        formDataProductOutput.append('date', date);
        formDataProductOutput.append('invoice_no', invoiceNo);
        formDataProductOutput.append('product_no', data.product_no);
        formDataProductOutput.append('client_name', clientName);
        formDataProductOutput.append('description', data.description);
        formDataProductOutput.append('cartoon', data.cartoon);
        
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

    const deleteData=async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/storeTemporaryOutput/1`,config)
        .then(({ data }) => {
            console.log(data);
            setLoadingIsOpen(false);
            setReloadPageIsOpen(true);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const addOutputAndMakeInvoice=(e)=>{
        e.preventDefault();
        setLoadingIsOpen(true);
        outputs.map((data,index)=>{
            console.log(data);
            if (selectedShop!=='') {
                createShopInput(data);
            }
            createProductOutput(data);
            createOutput(data);
        });
        createTotalOutput();
        if (selectedShop!=='') {
            createShopTotalInput();
        }
        createTotalProductOutput();
        deleteData();
        localStorage.setItem('clientName','');
        localStorage.setItem('clientId','');
        localStorage.setItem('date','');
        localStorage.setItem('selectedShop','');
        localStorage.setItem('totalBuyPrice',0);
    }

    return(
        <>
        <Modal
          isOpen={addDiscountIsOpen}
          onRequestClose={()=>setAddDiscountIsOpen(false)}
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("if you want to add a discount write the value here...")}</h3>
            <div className='row p-2'>
                <div className="form-group mb-4">
                    <label for="discount">{t("discount")}</label>
                    <input onChange={(e)=>setDiscount(e.target.value)} value={discount} type="number" step={0.01} className="form-control" placeholder={t("Enter discount")}/>
                </div>
                <button onClick={addOutputAndMakeInvoice} className='btn btn-success row m-2'>{t("create")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function isClearAllData(t,clearAllData,isClearAllDataIsOpen,setIsClearAllDataIsOpen) {
    return(
        <>
        <Modal
          isOpen={isClearAllDataIsOpen}
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("Are you sure from clear all data?")}</h3>
            <div className='row p-2'>
                <button onClick={clearAllData} className='btn btn-danger row m-2'>{t("ok")}</button>
                <button onClick={()=>{setIsClearAllDataIsOpen(false)}} className='btn btn-success row m-2'>{t("cancel")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function isSetClientName(t,isSetClientNameIsOpen,setIsSetClientNameIsOpen){
    return(
        <>
        <Modal
          isOpen={isSetClientNameIsOpen}
          style={{
            overlay:{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content:{
                marginLeft:"22vw",
                alignSelf:"center",
                width:"50vw",
                height:"40vh",
            }
        }}
        >
            <div className='col'>
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("select client and set date")}</h3>
            <div className='row p-2'>
                <button onClick={()=>setIsSetClientNameIsOpen(false)} className='btn btn-success row m-2'>{t("ok")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function isCartoonFound(t,isCartoonFoundIsOpen,setIsCartoonFoundIsOpen){
    return(
        <>
        <Modal
          isOpen={isCartoonFoundIsOpen[0]}
          style={{
            overlay:{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content:{
                marginLeft:"22vw",
                alignSelf:"center",
                width:"50vw",
                height:"40vh",
            }
        }}
        >
            <div className='col'>
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10px"}}>{t("There is not enough quantity of this product")}</h3>
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"5%"}}>{isCartoonFoundIsOpen[1]}</h3>
            <div className='row p-2'>
                <button onClick={()=>setIsCartoonFoundIsOpen([false,''])} className='btn btn-success row m-2'>{t("ok")}</button>
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
                <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10px",color:"green"}}>{t("The invoice has been registered successfully.")}</h3>
                <div style={{display:"flex",justifyContent:"center", color:"green", fontSize:"100px"}}>
                    <CheckIcon style={{fontSize:"200px"}}/>
                </div>
                <div className='row' style={{paddingLeft:"150px",paddingRight:"150px"}}>
                    <button onClick={()=>{window.location.reload()}} className='btn btn-success m-2'>{t("ok")}</button>
                </div>
          </div>
        </Modal>
      </>
    );
}
