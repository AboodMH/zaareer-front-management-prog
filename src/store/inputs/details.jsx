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

export default function InputDetails(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const [inputData, setInputData] = useState({});
    const [productNo, setProductNo] = useState('');
    const [productName, setProductName] = useState('');
    const [cartoon, setCartoon] = useState(0);
    const [packing, setPacking] = useState(0);
    const [price, setPrice] = useState(0);
    const [sellPrice, setSellPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [addProductIsOpen,setAddProductIsOpen] = useState(false);
    const [isAllFilledIsOpen,setIsAllFilledIsOpen] = useState(false);
    const [addSellPriceIsOpen,setAddSellPriceIsOpen] = useState(false);
    const [isSellPriceFillIsOpen,setIsSellPriceFillIsOpen] = useState(false);
    const [confirmDeleteIsOpen,setConfirmDeleteIsOpen] = useState([false,{}]);
    const [productId, setProductId] = useState(0);
    const location = useLocation();
    const invoiceNo=location.state.data.invoice_no;
    const month=location.state.data.month;
    const day=location.state.data.day;

    const fetchThisInput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/store/input/${invoiceNo}`,config).then(({ data }) => {setInputs(data);
            totalCartoon=0;
            total=0;
            data.map((item, index) => {
                totalCartoon+=item.cartoon;
                total+=item.price*item.packing*item.cartoon;
                console.log(totalCartoon);
                console.log(total);
            })});
    }

    const fetchTotalInput=async()=>{
        await axios.get(`http://127.0.0.1:8000/api/store/totalInput/${invoiceNo}`,config).then(({data})=>{
            setInputData(data[0]);
            console.log(data[0]);
        });
    }

    const fetchProduct=async(productNo)=>{
        await axios.get(`http://127.0.0.1:8000/api/store/product/${productNo}`,config).then(({data})=>{
            setProductId(data[0].id);
            console.log(data);
        });
    }

    useEffect(() => {
        fetchThisInput();
        fetchTotalInput();
      }, []);

    return(
        <>
            {addProduct(t,addProductIsOpen,setAddProductIsOpen,setIsAllFilledIsOpen,setAddSellPriceIsOpen,productNo,setProductNo,productName,setProductName,price,setPrice,cartoon,setCartoon,packing,setPacking,description,setDescription,image,setImage)}
            {addSellPrice(inputData,setIsSellPriceFillIsOpen,addSellPriceIsOpen,setAddSellPriceIsOpen,setSellPrice,productNo,productName,price,sellPrice,cartoon,packing,description,image,navigate,t)}
            {isAllFilled(t,isAllFilledIsOpen,setIsAllFilledIsOpen)}
            {isSellPriceFill(t,isSellPriceFillIsOpen,setIsSellPriceFillIsOpen)}
            {deleteConfirm(t,inputData,productId,confirmDeleteIsOpen,setConfirmDeleteIsOpen)}
            <div class="table-responsive p-1">
                <div className="form-group mb-2">
                    <button onClick={()=>{setAddProductIsOpen(true)}} className="btn btn-success">{t("add product")}</button>
                </div>
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th colSpan={1}>{t("date")}</th>
                            <th colSpan={4}>{month}-{day}</th>
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
                            <th>{t("edit")}</th>
                            <th>{t("delete")}</th>
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
                                        <td>{<Link to={'/input/details/image'} state={{ data: item.image }} className='btn btn-success'>{t("show")}</Link>}</td>
                                        <td>{<Link to={'/input/details/edit'} state={{ data: item }} className='btn btn-success'>{t("edit")}</Link>}</td>
                                        <td>{<button onClick={()=>{setConfirmDeleteIsOpen([true,item]);fetchProduct(item.product_no)}} className='btn btn-danger'>{t("delete")}</button>}</td>
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

function addProduct(t,addProductIsOpen,setAddProductIsOpen,setIsAllFilledIsOpen,setAddSellPriceIsOpen,productNo,setProductNo,productName,setProductName,price,setPrice,cartoon,setCartoon,packing,setPacking,description,setDescription,image,setImage) {
    const changeHandler = (e)=>{
        e.preventDefault();
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
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
                <div className="form-group mb-4">
                    <label for="product no">{t("product no")}</label>
                    <input onChange={(e)=>{setProductNo(e.target.value)}} type="text" className="form-control" placeholder={t("Enter product no")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="product name">{t("product name")}</label>
                    <input onChange={(e)=>{setProductName(e.target.value)}} type="text" className="form-control" placeholder={t("Enter product name")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="price">{t("price")}</label>
                    <input onChange={(e)=>{setPrice(e.target.value)}} type="number" step={0.01} className="form-control" placeholder={t("Enter price")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="packing">{t("packing")}</label>
                    <input onChange={(e)=>{setPacking(e.target.value)}} type="number" className="form-control" placeholder={t("Enter packing")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="cartoon">{t("cartoon")}</label>
                    <input onChange={(e)=>{setCartoon(e.target.value)}} type="number" className="form-control" placeholder={t("Enter cartoon")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="description">{t("description")}</label>
                    <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="image">{t("image")}</label>
                    <input onChange={changeHandler} type="file" className="form-control" name="image"/>
                 </div>
                <div style={{textAlign:"center"}} className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start"> 
                        <button onClick={()=>{productNo==='' || productName==='' || price==='' || packing==='' || cartoon==='' || description==='' ? setIsAllFilledIsOpen(true) : setAddSellPriceIsOpen(true)}} className="btn btn-outline-success mx-4">{t("create")}</button>
                    </div>
                </div>
          </div>
        </Modal>
      </>
    );
}

function isAllFilled(t,isAllFilledIsOpen,setIsAllFilledIsOpen) {
    return(
        <>
        <Modal
          isOpen={isAllFilledIsOpen}
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("fill all field to create invoice!")}</h3>
            <div className='row p-2'>
                <button onClick={()=>{setIsAllFilledIsOpen(false)}} className='btn btn-success row m-2'>{t("ok")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function addSellPrice(inputData,setIsSellPriceFillIsOpen,addSellPriceIsOpen,setAddSellPriceIsOpen,setSellPrice,productNo,productName,price,sellPrice,cartoon,packing,description,image,navigate,t){
    const createInput = async(e)=>{
        const formDataInput = new FormData();
        formDataInput.append('date', `${inputData.month}-${inputData.day}`);
        formDataInput.append('company_name', inputData.company_name);
        formDataInput.append('product_no', productNo);
        formDataInput.append('product_name', productName);
        formDataInput.append('invoice_no', inputData.invoice_no);
        formDataInput.append('price', price);
        formDataInput.append('cartoon', cartoon);
        formDataInput.append('packing', packing);
        formDataInput.append('description', description);
        if (Image!=='') {
            formDataInput.append('image', image);
        }

        await axios.post('http://127.0.0.1:8000/api/store/input', formDataInput,config)
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
    
    const create = async(e)=>{
        const formDataProduct = new FormData();
        formDataProduct.append('date', `${inputData.month}-${inputData.day}`);
        formDataProduct.append('company_name', inputData.company_name);
        formDataProduct.append('product_no', productNo);
        formDataProduct.append('product_name', productName);
        formDataProduct.append('invoice_no', inputData.invoice_no);
        formDataProduct.append('buy_price', price);
        formDataProduct.append('sell_price', sellPrice);
        formDataProduct.append('cartoon', cartoon);
        formDataProduct.append('packing', packing);
        formDataProduct.append('description', description);
        if (image!=='') {
            formDataProduct.append('image', image);
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

    const updateTotalInput=async(e)=>{
        const formDataTotalInput=new FormData();
        formDataTotalInput.append('_method', 'PATCH');
        formDataTotalInput.append('date',`${inputData.month}-${inputData.day}`);
        formDataTotalInput.append('company_name',inputData.company_name);
        formDataTotalInput.append('invoice_no',inputData.invoice_no);
        formDataTotalInput.append('description',inputData.description);
        formDataTotalInput.append('value',inputData.value+(price*packing*cartoon));
        formDataTotalInput.append('quantity',parseFloat(inputData.quantity)+parseFloat(cartoon));

        await axios.post(`http://127.0.0.1:8000/api/store/totalInput/${inputData.id}`,formDataTotalInput,config).then(({data})=>{
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
          isOpen={addSellPriceIsOpen}
          onRequestClose={()=>setAddSellPriceIsOpen(false)}
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
                            <input type="number" step={0.01} className="form-control" placeholder={t("value")} onChange={(e)=>{setSellPrice(e.target.value)}}/>
                        </div>
                        <button onClick={()=>{sellPrice===0 ? setIsSellPriceFillIsOpen(true) : createInput();sellPrice===0 ? setIsSellPriceFillIsOpen(true) :updateTotalInput();sellPrice===0 ? setIsSellPriceFillIsOpen(true) :create()}} className="btn btn-success" style={{width:"70%",marginTop:"30px"}}>{t("confirm")}</button>
                    </div>
            </div>
        </Modal>
      </>
    );
}

function isSellPriceFill(t,isSellPriceFillIsOpen,setIsSellPriceFillIsOpen) {
    return(
        <>
        <Modal
          isOpen={isSellPriceFillIsOpen}
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
            <h3 className='row' style={{display:"flex",justifyContent:"center",marginBottom:"10%"}}>{t("fill sell price to add product!")}</h3>
            <div className='row p-2'>
                <button onClick={()=>{setIsSellPriceFillIsOpen(false)}} className='btn btn-success row m-2'>{t("ok")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

function deleteConfirm(t,inputData,productId,confirmDeleteIsOpen,setConfirmDeleteIsOpen) {

    const deleteItem=async(id)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/input/${id}`,config)
        .then(({ data }) => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
    }



    const deleteProduct=async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/store/product/${productId}`,config)
        .then(({ data }) => {
            console.log(data);
            setConfirmDeleteIsOpen([false,{}]);
            window.location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    const updateTotalInput=async(e)=>{
        const formDataTotalInput=new FormData();
        formDataTotalInput.append('_method', 'PATCH');
        formDataTotalInput.append('date',`${inputData.month}-${inputData.day}`);
        formDataTotalInput.append('company_name',inputData.company_name);
        formDataTotalInput.append('invoice_no',inputData.invoice_no);
        formDataTotalInput.append('description',inputData.description);
        formDataTotalInput.append('value',inputData.value-(confirmDeleteIsOpen[1].price*confirmDeleteIsOpen[1].packing*confirmDeleteIsOpen[1].cartoon));
        formDataTotalInput.append('quantity',parseFloat(inputData.quantity)-parseFloat(confirmDeleteIsOpen[1].cartoon));

        await axios.post(`http://127.0.0.1:8000/api/store/totalInput/${inputData.id}`,formDataTotalInput,config).then(({data})=>{
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
                <button onClick={()=>{deleteItem(confirmDeleteIsOpen[1].id);deleteProduct();updateTotalInput()}} className='btn btn-danger row m-2'>{t("yes")}</button>
                <button onClick={()=>{setConfirmDeleteIsOpen([false,{}])}} className='btn btn-success row m-2'>{t("no")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

