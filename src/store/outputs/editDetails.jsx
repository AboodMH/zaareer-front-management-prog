import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';
import ClipLoader from "react-spinners/ClipLoader";
import CheckIcon from '@mui/icons-material/Check';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};


let shopName={
    'محل شفا بدران':'shafa',
    'محل رصيفة':'rsifah',
    'محل سحاب':'sahab',
    'محل بيرين':'berain',
};


Modal.setAppElement('#root');


export default function OutputDetailsEdit(){
    const location = useLocation();
    const outputData=location.state.data;

    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState(`${outputData.month}-${outputData.day}`);
    const [clientName, setClientName] = useState(outputData.client_name);
    const [productNo, setProductNo] = useState(outputData.product_no);
    const [productName, setProductName] = useState(outputData.product_name);
    const [invoiceNo, setInvoiceNo] = useState(outputData.invoice_no);
    const [price, setPrice] = useState(outputData.price);
    const [cartoon, setCartoon] = useState(outputData.cartoon);
    const [packing, setPacking] = useState(outputData.packing);
    const [description, setDescription] = useState(outputData.description);
    const [image, setImage] = useState("");
    const [products, setProducts] = useState([]);
    const [getProducts, setGetProducts] = useState([]);
    const [changeProduct, setChangeProduct] = useState({});
    const [pastProduct, setPastProduct] = useState({});
    const [totalOutput, setTotalOutput] = useState({});
    const [productOutput, setProductOutput] = useState({});
    const [totalProductOutput, setTotalProductOutput] = useState({});
    const [shopInput, setShopInput] = useState({});
    const [shopTotalInput, setShopTotalInput] = useState({});
    const [buyPrice, setBuyPrice] = useState(productOutput.buy_price);

    const [loadingIsOpen, setLoadingIsOpen] = useState(false);
    const [reloadPageIsOpen,setReloadPageIsOpen] = useState(false);
    const [isCartoonFoundIsOpen,setIsCartoonFoundIsOpen] = useState([false,'']);



    const fetchProduct = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/product',config).then(({ data }) => {
            setProducts(data);
            console.log(data);
            
        });
    }

    const fetchChangeProduct = async (productNo) => {
        await axios.get(`http://127.0.0.1:8000/api/store/product/${productNo}`,config).then(({ data }) => {
            setChangeProduct(data);
            console.log(data);
            
        });
    }

    const fetchPastProduct = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/product/${outputData.product_no}`,config).then(({ data }) => {
            setPastProduct(data);
            console.log(data);
            
        });
    }

    const fetchTotalOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/totalOutput/${invoiceNo}`,config).then(({ data }) => {
            setTotalOutput(data);
            console.log(data);
            
        });
    }

    const fetchProductOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/productOutput/${outputData.invoice_no}`,config).then(({ data }) => {
            data.map((item,index)=>{
                if(item.product_no === outputData.product_no){
                    setProductOutput(item);
                    setBuyPrice(item.buy_price);
                    console.log(item);
                }
            });
        });
    }

    const fetchTotalProductOutput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/totalProductOutput/${invoiceNo}`,config).then(({ data }) => {
            setTotalProductOutput(data);
            console.log(data.discount);
            setLoadingIsOpen(false);
        });
    }

    const fetchShopInput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName[clientName]}/input/${outputData.invoice_no}`,config).then(({ data }) => {
            data.map((item,index)=>{
                if (item.product_no===outputData.product_no) {
                    setShopInput(item);
                    console.log('shop');
                    console.log(item);
                }
            });
        });
    }

    const fetchShopTotalInput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName[clientName]}/totalInput/${invoiceNo}`,config).then(({ data }) => {
            setShopTotalInput(data);
            console.log(data);
        });
    }

    const fetchData=()=>{
        setLoadingIsOpen(true);
        if (shopName[clientName]) {
            fetchShopInput();
            fetchShopTotalInput();
        }
        fetchProduct();
        fetchPastProduct();
        fetchTotalOutput();
        fetchProductOutput();
        fetchTotalProductOutput();
    }


    useEffect(() => {
        fetchData();
    }, []);


    const editOutput=async(e)=>{
        const formDataOutput = new FormData();
        formDataOutput.append('_method', 'PATCH');
        formDataOutput.append('date', date);
        formDataOutput.append('client_name', clientName);
        formDataOutput.append('product_no', productNo);
        formDataOutput.append('product_name', productName);
        formDataOutput.append('invoice_no', invoiceNo);
        formDataOutput.append('price', price);
        formDataOutput.append('cartoon', cartoon);
        formDataOutput.append('packing', packing);
        formDataOutput.append('description', description);

        console.log(formDataOutput)
        
        await axios.post(`http://127.0.0.1:8000/api/store/output/${outputData.id}`, formDataOutput,config)
        .then(({data})=>{
            console.log(data.message);
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

    const editTotalOutput = async(e)=>{
        const formDataTotalOutput=new FormData();
        formDataTotalOutput.append('_method', 'PATCH');
        formDataTotalOutput.append('date',date);
        formDataTotalOutput.append('client_name',clientName);
        formDataTotalOutput.append('invoice_no',invoiceNo);
        formDataTotalOutput.append('description',totalOutput.description);
        formDataTotalOutput.append('value',(totalOutput.value-((outputData.price*outputData.packing*outputData.cartoon)-(price*packing*cartoon))).toFixed(2));
        formDataTotalOutput.append('discount',totalOutput.discount);
        formDataTotalOutput.append('quantity',(totalOutput.quantity-(outputData.cartoon-cartoon)));

        await axios.post(`http://127.0.0.1:8000/api/store/totalOutput/${totalOutput.id}`, formDataTotalOutput,config)
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

    const editTotalProductOutput = async(e)=>{
        const formDataTotalProductOutput=new FormData();
        formDataTotalProductOutput.append('_method', 'PATCH');
        formDataTotalProductOutput.append('date', date);
        formDataTotalProductOutput.append('client_name',totalProductOutput.client_name);
        formDataTotalProductOutput.append('invoice_no',totalProductOutput.invoice_no);
        formDataTotalProductOutput.append('sell_value',(totalProductOutput.sell_value-((productOutput.sell_price*productOutput.packing*productOutput.cartoon)-(price*packing*cartoon))).toFixed(2));
        formDataTotalProductOutput.append('buy_value',(totalProductOutput.buy_value-((productOutput.buy_price*productOutput.packing*productOutput.cartoon)-(buyPrice*packing*cartoon))).toFixed(2));
        formDataTotalProductOutput.append('discount',totalProductOutput.discount);
        formDataTotalProductOutput.append('quantity',(totalProductOutput.quantity-(productOutput.cartoon-cartoon)).toFixed(0));
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

    const createPastProduct=async(cartoon)=>{
        const formDataProduct = new FormData();
        formDataProduct.append('date', date);
        formDataProduct.append('company_name', productOutput.company_name);
        formDataProduct.append('product_no', productOutput.product_no);
        formDataProduct.append('product_name', productOutput.product_name);
        formDataProduct.append('invoice_no', productOutput.invoice_no);
        formDataProduct.append('buy_price', productOutput.buy_price);
        formDataProduct.append('sell_price', productOutput.sell_price);
        formDataProduct.append('cartoon', cartoon);
        formDataProduct.append('packing', productOutput.packing);
        formDataProduct.append('description', productOutput.description);
        if (productOutput.image!=='') {
            formDataProduct.append('image', productOutput.image);
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

    const createNewProductOutput = async(e)=>{
        const formDataProductOutput = new FormData();
        formDataProductOutput.append('date', date);
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

    const deletePastProductOutput = async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/productOutput/${productOutput.id}`,config)
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

    const editShopInput = async(e)=>{
        const formDataShopInput = new FormData();
        formDataShopInput.append('_method', 'PATCH');
        formDataShopInput.append('date', date);
        formDataShopInput.append('product_no', productNo);
        formDataShopInput.append('product_name', productName);
        formDataShopInput.append('invoice_no', invoiceNo);
        formDataShopInput.append('price', price);
        formDataShopInput.append('cartoon', cartoon);
        formDataShopInput.append('packing', packing);
        formDataShopInput.append('description', description);
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName[clientName]}/input/${shopInput.id}`, formDataShopInput,config)
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

    const editShopTotalInput = async(e)=>{
        const formDataShopTotalInput=new FormData();
        formDataShopTotalInput.append('_method', 'PATCH');
        formDataShopTotalInput.append('date',date);
        formDataShopTotalInput.append('invoice_no',invoiceNo);
        formDataShopTotalInput.append('description',description);
        formDataShopTotalInput.append('value',(shopTotalInput.value-((shopInput.price*shopInput.packing*shopInput.cartoon)-(price*packing*cartoon))).toFixed(2));
        formDataShopTotalInput.append('discount',shopTotalInput.discount);
        formDataShopTotalInput.append('quantity',shopTotalInput.quantity-(shopInput.cartoon-cartoon));

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

    const updateQNT=async(productNo,cartoon)=>{
        const formEditQNT = new FormData();
        formEditQNT.append('product_no', productNo);
        formEditQNT.append('cartoon', cartoon);

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

    const edit=async(e)=>{
        e.preventDefault();
        
        if (cartoon>0) {
            if (outputData.product_no===productNo && outputData.cartoon==cartoon) {
                navigate('/outputs');
            }else{
                if (outputData.product_no===productNo) {
                    console.log('same product');
                    if (Object.keys(pastProduct).length!==0) {
                        console.log('product found');
                        if (pastProduct.cartoon-(cartoon-outputData.cartoon)>=0) {
                            console.log('cartoon available');
                            setLoadingIsOpen(true);
                            createNewProductOutput();
                            if (shopName[clientName]) {
                                console.log(shopName[clientName]);
                                editShopInput();
                                editShopTotalInput();
                            }

                            updateQNT(productNo,parseInt(cartoon-outputData.cartoon));
                            
                            editTotalProductOutput();
                            editTotalOutput();
                            deletePastProductOutput();
                            editOutput();
                        }else{
                            setIsCartoonFoundIsOpen([true,productNo]);
                        }
                    }else{
                        console.log('product not found');
                        if (outputData.cartoon-cartoon>0) {
                            console.log('edit and add product');
                            setLoadingIsOpen(true);

                            createPastProduct(outputData.cartoon-cartoon);
                            createNewProductOutput();

                            if (shopName[clientName]) {
                                console.log(shopName[clientName]);
                                editShopInput();
                                editShopTotalInput();
                            }

                            editTotalProductOutput();
                            editTotalOutput();
                            deletePastProductOutput();
                            editOutput();
                        }else{
                            setIsCartoonFoundIsOpen([true,productNo]);
                        }
                    }
                }else{
                    console.log('not same product');
                    if (changeProduct.cartoon-cartoon>=0) {
                        console.log('cartoon available');
                        setLoadingIsOpen(true);

                        createPastProduct(outputData.cartoon);
                        createNewProductOutput();

                        if (shopName[clientName]) {
                            console.log(shopName[clientName]);
                            editShopInput();
                            editShopTotalInput();
                        }
                        updateQNT(productNo,cartoon);

                        editTotalProductOutput();
                        editTotalOutput();
                        deletePastProductOutput();
                        editOutput();
                    }else{
                        setIsCartoonFoundIsOpen([true,productNo]);
                    }
                }
            }
        }else{
            console.log('cartoon<=0');
            setIsCartoonFoundIsOpen([true,productNo]);
        }
    }


    return(
        <>
            {isCartoonFound(t,isCartoonFoundIsOpen,setIsCartoonFoundIsOpen)}
            {loadingScreen(loadingIsOpen)}
            {reloadPage(t,navigate,reloadPageIsOpen,setReloadPageIsOpen)}
            <div className="form-group mb-4">
                <label for="product no">{productNo}</label>
                <input id="searchProduct" type="text" onChange={(e)=>{
                    listProduct(e,products,setGetProducts,getProducts);
                }} style={{width:"100%",border:"1px solid LightGray",cursor:"pointer",height:"35px"}} placeholder={t("search products")}/>
                <div id="productResult" className="mb-4" style={{display:"none",backgroundColor:"gray",height:"200px",overflowY:"scroll"}}>
                    {
                        getProducts.map((item,index)=>{
                            return(
                                <div onClick={()=>{setProduct(setProductNo,setProductName,setPrice,setPacking,setImage,item);fetchChangeProduct(item.product_no);fetchData();setBuyPrice(item.buy_price);console.log(item.buy_price);
                                }} id={index} className="d-flex px-4" style={{borderBottom:"1px solid",cursor:"pointer"}}>
                                    <h6 className="px-2">product no: {item.product_no}</h6>
                                    <h6 className="px-2">product name: {item.product_name}</h6>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="form-group mb-4">
                <label for="cartoon">{t("cartoon")}</label>
                <input onChange={(e)=>{setCartoon(e.target.value)}} type="number" className="form-control" placeholder={t("Enter cartoon")} value={cartoon}/>
            </div>
            <form onSubmit={edit}>
                <div style={{textAlign:"center"}} className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start"> 
                        <button type="submit" className="btn btn-outline-danger mx-4">{t("update")}</button>
                        <button onClick={()=>navigate('/outputs')} type="submit" className="btn btn-outline-success">{t("cancel")}</button>
                    </div>
                </div>
            </form>
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

function setProduct(setProductNo,setProductName,setPrice,setPacking,setImage,item) {
    setProductNo(item.product_no);
    setProductName(item.product_name);
    setPrice(item.sell_price);
    setPacking(item.packing);
    setImage(item.image);

    let searchProduct=document.querySelector('#searchProduct');
    searchProduct.value="";


    let productResult=document.querySelector('#productResult');
    productResult.style.display="none";
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

function reloadPage(t,navigate,reloadPageIsOpen,setReloadPageIsOpen) {
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
                    <button onClick={()=>{setReloadPageIsOpen(false);navigate('/outputs')}} className='btn btn-success m-2'>{t("ok")}</button>
                </div>
          </div>
        </Modal>
      </>
    );
}
