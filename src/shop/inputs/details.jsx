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

export default function ShopInputDetails({shopName}){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([]);
    const [addInputIsOpen,setAddInputIsOpen] = useState(false);
    const [isAllFilledIsOpen,setIsAllFilledIsOpen] = useState(false);
    const [productNo, setProductNo] = useState('');
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState(0);
    const [packing, setPacking] = useState(0);
    const [cartoon, setCartoon] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [confirmDeleteIsOpen,setConfirmDeleteIsOpen] = useState([false,{}]);
    const location = useLocation();
    const totalInputData=location.state.data;
    const invoiceNo=location.state.data.invoice_no;
    const month=location.state.data.month;
    const day=location.state.data.day;

    const fetchThisInput = async () => {
        await axios.get(`http://127.0.0.1:8000/api/shop/${shopName}/input/${invoiceNo}`,config).then(({ data }) => {
            setInputs(data);
            totalCartoon=0;
            total=0;
            data.map((item, index) => {
                totalCartoon+=item.cartoon;
                total+=item.price*item.packing*item.cartoon;
                console.log(cartoon);
                console.log(total);
            })});
    }
    useEffect(() => {
        fetchThisInput();
    }, []);
      

    return(
        <>
            {addInput(t,shopName,addInputIsOpen,setAddInputIsOpen,setIsAllFilledIsOpen,totalInputData,setProductNo,setProductName,setPrice,setPacking,setCartoon,setDescription,setImage,productNo,productName,price,packing,cartoon,description,image)}
            {isAllFilled(t,isAllFilledIsOpen,setIsAllFilledIsOpen)}
            {deleteConfirm(t,shopName,totalInputData,confirmDeleteIsOpen,setConfirmDeleteIsOpen)}
            <div class="table-responsive p-1">
                <div className="form-group mb-2">
                    <button onClick={()=>{setAddInputIsOpen(true)}} className="btn btn-success">{t("add product")}</button>
                </div>
                <table class="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th colSpan={1}>{t("date")}</th>
                            <th colSpan={5}>{month}-{day}</th>
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
                                        <td>{<Link to={`/shop/${shopName}/input/details/image`} state={{ data: item.image }} className='btn btn-success'>{t("show")}</Link>}</td>
                                        <td>{<Link to={`/shop/${shopName}/input/details/edit`} state={{ data: item }} className='btn btn-success'>{t("edit")}</Link>}</td>
                                        <td>{<button onClick={()=>{setConfirmDeleteIsOpen([true,item])}} className='btn btn-danger'>{t("delete")}</button>}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={11}></th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("total cartoon")}</th>
                            <th colSpan={9}>{totalCartoon}</th>
                        </tr>
                        <tr>
                            <th colSpan={2}>{t("final total")}</th>
                            <th colSpan={9}>{total.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
}


function addInput(t,shopName,addInputIsOpen,setAddInputIsOpen,setIsAllFilledIsOpen,totalInputData,setProductNo,setProductName,setPrice,setPacking,setCartoon,setDescription,setImage,productNo,productName,price,packing,cartoon,description,image) {
    const changeHandler = (e)=>{
        setImage(e.target.files[0]);
        console.log(e.target.files[0])
    }

    const create = async(e)=>{
        const formDataInput = new FormData();
        formDataInput.append('date', `${totalInputData.month}-${totalInputData.day}`);
        formDataInput.append('product_no', productNo);
        formDataInput.append('product_name', productName);
        formDataInput.append('invoice_no', totalInputData.invoice_no);
        formDataInput.append('price', price);
        formDataInput.append('cartoon', cartoon);
        formDataInput.append('packing', packing);
        formDataInput.append('description', description);
        if (image!=='') {
            formDataInput.append('image', image);
        }

        console.log(formDataInput)
        
        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/input`, formDataInput,config)
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

        const formDataTotalInput=new FormData();
        formDataTotalInput.append('_method', 'PATCH');
        formDataTotalInput.append('date',`${totalInputData.month}-${totalInputData.day}`);
        formDataTotalInput.append('invoice_no',totalInputData.invoice_no);
        formDataTotalInput.append('description',totalInputData.description);
        formDataTotalInput.append('value',(totalInputData.value+(price*packing*cartoon)).toFixed(2));
        formDataTotalInput.append('quantity',parseFloat(totalInputData.quantity)+parseFloat(cartoon));

        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput/${totalInputData.id}`,formDataTotalInput,config).then(({data})=>{
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
          isOpen={addInputIsOpen}
          onRequestClose={()=>setAddInputIsOpen(false)}
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
                        <button onClick={()=>{productNo==='' || productName==='' || price==='' || packing==='' || cartoon==='' || description==='' ? setIsAllFilledIsOpen(true) : create()}} className="btn btn-outline-success mx-4">{t("create")}</button>
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

function deleteConfirm(t,shopName,totalInputData,confirmDeleteIsOpen,setConfirmDeleteIsOpen) {

    const deleteItem=async(e)=>{
        await axios.delete(`http://127.0.0.1:8000/api/shop/${shopName}/input/${confirmDeleteIsOpen[1].id}`,config)
        .then(({ data }) => {
            window.location.reload();
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    const updateTotalInput=async(e)=>{
        const formDataTotalInput=new FormData();
        formDataTotalInput.append('_method', 'PATCH');
        formDataTotalInput.append('date',`${totalInputData.month}-${totalInputData.day}`);
        formDataTotalInput.append('invoice_no',totalInputData.invoice_no);
        formDataTotalInput.append('description',totalInputData.description);
        formDataTotalInput.append('value',(totalInputData.value-(confirmDeleteIsOpen[1].price*confirmDeleteIsOpen[1].packing*confirmDeleteIsOpen[1].cartoon)).toFixed(2));
        formDataTotalInput.append('quantity',parseFloat(totalInputData.quantity)-parseFloat(confirmDeleteIsOpen[1].cartoon));

        await axios.post(`http://127.0.0.1:8000/api/shop/${shopName}/totalInput/${totalInputData.id}`,formDataTotalInput,config).then(({data})=>{
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
                <button onClick={()=>{deleteItem();updateTotalInput()}} className='btn btn-danger row m-2'>{t("yes")}</button>
                <button onClick={()=>{setConfirmDeleteIsOpen([false,{}])}} className='btn btn-success row m-2'>{t("no")}</button>
            </div>
          </div>
        </Modal>
      </>
    );
}

