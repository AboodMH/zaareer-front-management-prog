import './App.css';
import "./i18n.js";
import { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import * as React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import logo from  './images/logo.png';
import SellIcon from '@mui/icons-material/Sell';
import HomeIcon from '@mui/icons-material/Home.js';
import OutputIcon from '@mui/icons-material/Output.js';
import InputIcon from '@mui/icons-material/Input';
import MoneyIcon from '@mui/icons-material/Money';
import InventoryIcon from '@mui/icons-material/Inventory';
import SummarizeIcon from '@mui/icons-material/Summarize.js';
import PeopleIcon from '@mui/icons-material/People.js';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney.js';
import PaymentIcon from '@mui/icons-material/Payment';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StoreIcon from '@mui/icons-material/Store';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Login from './auth/login.js';
import Home from './home/index.js';
import Modal from 'react-modal';
import { LANGUAGES } from './constants/language.js';
import CreateInput from './store/inputs/create.jsx';
import InputImage from './store/inputs/image.jsx';
import InputDetails from './store/inputs/details.jsx';
import InputDetailsEdit from './store/inputs/editDetails.jsx';
import Input from './store/inputs/index.jsx';
import Expense from './store/expenses/index.jsx';
import Output from './store/outputs/index.jsx';
import OutputDetails from './store/outputs/show.jsx';
import CreateOutput from './store/outputs/create.jsx';
import OutputDetailsEdit from './store/outputs/editDetails.jsx';
import OutputImage from './store/outputs/image.jsx';
import Client from './store/clients/index.jsx';
import ClientDetails from './store/clients/show.jsx';
import ClientCreate from './store/clients/create.jsx';
import ClientEdit from './store/clients/edit.jsx';
import Payment from './store/client payments/index.jsx';
import PaymentCreate from './store/client payments/create.jsx';
import PaymentEdit from './store/client payments/edit.jsx';
import Withdrawl from './store/withdrawls/index.jsx';
import Staff from './store/staff/index.jsx';
import CreateEmployee from './store/staff/create.jsx';
import EditEmployee from './store/staff/edit.jsx';
import DetailStaff from './store/staff/show.jsx';
import Product from './store/products/index.jsx';
import Report from './store/reports/index.jsx';
import Company from './store/company/index.jsx';
import CompanyDetails from './store/company/show.jsx';
import EditCompany from './store/company/edit.jsx';
import CreateCompany from './store/company/create.jsx';
import CompanyPayment from './store/company-payments/index.jsx';
import CompanyPaymentCreate from './store/company-payments/create.jsx';
import CompanyPaymentEdit from './store/company-payments/edit.jsx';
import ShopExpense from './shop/expenses/index.jsx';
import CreateShopInput from './shop/inputs/create.jsx';
import ShopInput from './shop/inputs/index.jsx';
import ShopInputDetails from './shop/inputs/details.jsx';
import ShopInputDetailsEdit from './shop/inputs/editDetails.jsx';
import ShopInputDetailsImage from './shop/inputs/image.jsx';
import ShopWithdrawl from './shop/withdrawls/index.jsx';
import ShopStaff from './shop/staff/index.jsx';
import ShopEmployeeCreate from './shop/staff/create.jsx';
import ShopEditEmployee from './shop/staff/edit.jsx';
import ShopDetailStaff from './shop/staff/show.jsx';
import ShopReport from './shop/reports/index.jsx';
import ShopSells from './shop/sells/index.jsx';


let isAuth=localStorage.getItem('isAuth');
let userName=localStorage.getItem('userName');
let local_lang=localStorage.getItem("language");


export default function App() {
  const { i18n, t } = useTranslation();
  const [logoutScreenIsOpen, setLogoutScreenIsOpen] = useState(false);
  const [registerIsOpen, setRegisterIsOpen] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    localStorage.setItem("language",lang_code);
    let local_lang=localStorage.getItem("language");
    i18n.changeLanguage(local_lang);
    window.location.reload();
  };

  useEffect(() => {
    if (isAuth) {
      document.getElementById('sidebar').style.display = 'block';
      document.getElementById('navbar').style.display = 'block';
    }else{
      document.getElementById('sidebar').style.display = 'none';
      document.getElementById('navbar').style.display = 'none';
    }
  }, []);
  
  return (
      <Suspense fallback="loading">
        <Router>
          <>
            {register(registerIsOpen,setRegisterIsOpen,registerName,setRegisterName,password,setPassword,email,setEmail,t)}
            {logoutScreen(logoutScreenIsOpen,setLogoutScreenIsOpen,t)}
            <div style={{display:"flex",flexDirection:"row", direction:`${local_lang==='en' ?'ltr':'rtl'}`}}>
              <Sidebar id='sidebar' rootStyles={{backgroundColor:"rgb(180, 180, 170)",height:"100vh",position:"sticky",top:"0",}}>
                {
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  </div>
                  }
                <Menu>
                  <MenuItem style={{padding:"0"}} icon={<HomeIcon/>} component={<Link to="/"/>}>{t("main")}</MenuItem>
                  <SubMenu style={{padding:"0"}} icon={<StorefrontIcon/>} label={t("store")} >
                    <MenuItem style={{padding:"0"}} icon={<InputIcon/>} component={<Link to="/inputs"/>}>{t("inputs")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<OutputIcon/>} component={<Link to="/outputs"/>}>{t("outputs")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<MoneyIcon/>} component={<Link to="/expenses"/>}>{t("expenses")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<AttachMoneyIcon/>} component={<Link to="/withdrawls"/>}>{t("withdrawls")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<PaymentIcon/>} component={<Link to="/client/payments"/>}>{t("clients payments")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<PaymentIcon/>} component={<Link to="/company/payments"/>}>{t("companies payments")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<InventoryIcon/>} component={<Link to="/product"/>}>{t("products")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<SummarizeIcon/>} component={<Link to="/reports"/>}>{t("reports")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<PeopleIcon/>} component={<Link to="/staff"/>}>{t("staff")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<RequestQuoteIcon/>} component={<Link to="/clients"/>}>{t("clients")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<BusinessCenterIcon/>} component={<Link to="/company"/>}>{t("company")}</MenuItem>

                  </SubMenu>
                  <SubMenu style={{padding:"0"}} icon={<StoreIcon/>} label={t("shop 1")} >
                    <MenuItem style={{padding:"0"}} icon={<SellIcon/>} component={<Link to="/shop/shafa/sells"/>}>{t("sells")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<InputIcon/>} component={<Link to="/shop/shafa/inputs"/>}>{t("inputs")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<MoneyIcon/>} component={<Link to="/shop/shafa/expenses"/>}>{t("expenses")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<AttachMoneyIcon/>} component={<Link to="/shop/shafa/withdrawls"/>}>{t("withdrawls")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<PeopleIcon/>} component={<Link to="/shop/shafa/staff"/>}>{t("staff")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<SummarizeIcon/>} component={<Link to="/shop/shafa/reports"/>}>{t("reports")}</MenuItem>
                  </SubMenu>
                  <SubMenu style={{padding:"0"}} icon={<StoreIcon/>} label={t("shop 2")} >
                    <MenuItem style={{padding:"0"}} icon={<SellIcon/>} component={<Link to="/shop/rsifah/sells"/>}>{t("sells")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<InputIcon/>} component={<Link to="/shop/rsifah/inputs"/>}>{t("inputs")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<MoneyIcon/>} component={<Link to="/shop/rsifah/expenses"/>}>{t("expenses")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<AttachMoneyIcon/>} component={<Link to="/shop/rsifah/withdrawls"/>}>{t("withdrawls")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<PeopleIcon/>} component={<Link to="/shop/rsifah/staff"/>}>{t("staff")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<SummarizeIcon/>} component={<Link to="/shop/rsifah/reports"/>}>{t("reports")}</MenuItem>
                  </SubMenu>
                  <SubMenu style={{padding:"0"}} icon={<StoreIcon/>} label={t("shop 3")} >
                    <MenuItem style={{padding:"0"}} icon={<SellIcon/>} component={<Link to="/shop/sahab/sells"/>}>{t("sells")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<InputIcon/>} component={<Link to="/shop/sahab/inputs"/>}>{t("inputs")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<MoneyIcon/>} component={<Link to="/shop/sahab/expenses"/>}>{t("expenses")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<AttachMoneyIcon/>} component={<Link to="/shop/sahab/withdrawls"/>}>{t("withdrawls")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<PeopleIcon/>} component={<Link to="/shop/sahab/staff"/>}>{t("staff")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<SummarizeIcon/>} component={<Link to="/shop/sahab/reports"/>}>{t("reports")}</MenuItem>
                  </SubMenu>
                  <SubMenu style={{padding:"0"}} icon={<StoreIcon/>} label={t("shop 4")} >
                    <MenuItem style={{padding:"0"}} icon={<SellIcon/>} component={<Link to="/shop/berain/sells"/>}>{t("sells")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<InputIcon/>} component={<Link to="/shop/berain/inputs"/>}>{t("inputs")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<MoneyIcon/>} component={<Link to="/shop/berain/expenses"/>}>{t("expenses")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<AttachMoneyIcon/>} component={<Link to="/shop/berain/withdrawls"/>}>{t("withdrawls")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<PeopleIcon/>} component={<Link to="/shop/berain/staff"/>}>{t("staff")}</MenuItem>
                    <MenuItem style={{padding:"0"}} icon={<SummarizeIcon/>} component={<Link to="/shop/berain/reports"/>}>{t("reports")}</MenuItem>
                  </SubMenu>
                  <MenuItem onClick={()=>{setRegisterIsOpen(true)}} style={{padding:"0"}} icon={<HowToRegIcon/>} >{t("create new account")}</MenuItem>
                  <MenuItem onClick={()=>{setLogoutScreenIsOpen(true)}} style={{padding:"0"}} icon={<OutputIcon/>} rootStyles={{color:"red"}}>{t("logout")}</MenuItem>
                </Menu>
              </Sidebar>
              <div style={{display:"flex",flexDirection:"column",width:"100%"}}>
                <nav id='navbar' className="navbar navbar-expand-lg navbar-light bg-light" style={{position:"sticky",top:"0"}}>
                  <div className="container-fluid">
                    <a className="navbar-brand" style={{fontWeight:"bold",color:"red", cursor:"pointer"}}>{t("")}</a>
                    <div className='d-flex'>
                      <select className='form-select mx-2' defaultValue={i18n.language} onChange={onChangeLang}>
                        <option value="">{t("language")}</option>
                        {LANGUAGES.map(({ code, label }) => (
                            <option key={code} value={code}>{label}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </nav> 
                <Routes>
                  <Route path="/" element={isAuth ? <Home/> : <Login/>}/>
                  <Route path="/login" element={isAuth ? <Home/> : <Login/>}/>
                  <Route path="/inputs" element={isAuth ? <Input/> : <Login/>}/>
                  <Route path="/input/create" element={isAuth ? <CreateInput/> : <Login/>}/>
                  <Route path="/input/details" element={isAuth ? <InputDetails/> : <Login/>}/>
                  <Route path="/input/details/image" element={isAuth ? <InputImage/> : <Login/>}/>
                  <Route path="/input/details/edit" element={isAuth ? <InputDetailsEdit/> : <Login/>}/>
                  <Route path="/outputs" element={isAuth ? <Output/> : <Login/>}/>
                  <Route path="/output/details" element={isAuth ? <OutputDetails/> : <Login/>}/>
                  <Route path="/output/create" element={isAuth ? <CreateOutput/> : <Login/>}/>
                  <Route path="/output/details/edit" element={isAuth ? <OutputDetailsEdit/> : <Login/>}/>
                  <Route path="/output/details/image" element={isAuth ? <OutputImage/> : <Login/>}/>
                  <Route path="/expenses" element={isAuth ? <Expense/> : <Login/>}/>
                  <Route path="/withdrawls" element={isAuth ? <Withdrawl/> : <Login/>}/>
                  <Route path="/clients" element={isAuth ? <Client/> : <Login/>}/>
                  <Route path="/client/details" element={isAuth ? <ClientDetails/> : <Login/>}/>
                  <Route path="/client/create" element={isAuth ? <ClientCreate/> : <Login/>}/>
                  <Route path="/client/edit" element={isAuth ? <ClientEdit/> : <Login/>}/>
                  <Route path="/client/payments" element={isAuth ? <Payment/> : <Login/>}/>
                  <Route path="/client/payment/create" element={isAuth ? <PaymentCreate/> : <Login/>}/>
                  <Route path="/client/payment/edit" element={isAuth ? <PaymentEdit/> : <Login/>}/>
                  <Route path="/staff" element={isAuth ? <Staff/> : <Login/>}/>
                  <Route path="/staff/create" element={isAuth ? <CreateEmployee/> : <Login/>}/>
                  <Route path="/staff/edit" element={isAuth ? <EditEmployee/> : <Login/>}/>
                  <Route path="/staff/details" element={isAuth ? <DetailStaff/> : <Login/>}/>
                  <Route path="/product" element={isAuth ? <Product/> : <Login/>}/>
                  <Route path="/reports" element={isAuth ? <Report/> : <Login/>}/>
                  <Route path='/company' element={isAuth ? <Company/> : <Login/>}/>
                  <Route path='/company/create' element={isAuth ? <CreateCompany/> : <Login/>}/>
                  <Route path='/company/edit' element={isAuth ? <EditCompany/> : <Login/>}/>
                  <Route path='/company/details' element={isAuth ? <CompanyDetails/> : <Login/>}/>
                  <Route path='/company/payments' element={isAuth ? <CompanyPayment/> : <Login/>}/>
                  <Route path='/company/payment/create' element={isAuth ? <CompanyPaymentCreate/> :<Login/>}/>
                  <Route path='/company/payment/edit' element={isAuth ? <CompanyPaymentEdit/> :<Login/>}/>

                   // shafa shop
                  <Route path="/shop/shafa/sells" element={isAuth ? <ShopSells shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/inputs' element={isAuth ? <ShopInput shopName="shafa"/> :<Login/>}/>
                  <Route path='/shop/shafa/input/create' element={isAuth ? <CreateShopInput shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/input/details' element={isAuth ? <ShopInputDetails shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/input/details/edit' element={isAuth ? <ShopInputDetailsEdit shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/input/details/image' element={isAuth ? <ShopInputDetailsImage shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/expenses' element={isAuth ? <ShopExpense shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/withdrawls' element={isAuth ? <ShopWithdrawl shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/staff' element={isAuth ? <ShopStaff shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/staff/create' element={isAuth ? <ShopEmployeeCreate shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/staff/edit' element={isAuth ? <ShopEditEmployee shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/staff/details' element={isAuth ? <ShopDetailStaff shopName="shafa"/> : <Login/>}/>
                  <Route path='/shop/shafa/reports' element={isAuth ? <ShopReport shopName="shafa"/> : <Login/>}/>


                  // rsifah shop
                  <Route path="/shop/rsifah/sells" element={isAuth ? <ShopSells shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/inputs' element={isAuth ? <ShopInput shopName="rsifah"/> :<Login/>}/>
                  <Route path='/shop/rsifah/input/create' element={isAuth ? <CreateShopInput shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/input/details' element={isAuth ? <ShopInputDetails shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/input/details/edit' element={isAuth ? <ShopInputDetailsEdit shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/input/details/image' element={isAuth ? <ShopInputDetailsImage shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/expenses' element={isAuth ? <ShopExpense shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/withdrawls' element={isAuth ? <ShopWithdrawl shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/staff' element={isAuth ? <ShopStaff shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/staff/create' element={isAuth ? <ShopEmployeeCreate shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/staff/edit' element={isAuth ? <ShopEditEmployee shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/staff/details' element={isAuth ? <ShopDetailStaff shopName="rsifah"/> : <Login/>}/>
                  <Route path='/shop/rsifah/reports' element={isAuth ? <ShopReport shopName="rsifah"/> : <Login/>}/>


                  // berain shop
                  <Route path="/shop/berain/sells" element={isAuth ? <ShopSells shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/inputs' element={isAuth ? <ShopInput shopName="berain"/> :<Login/>}/>
                  <Route path='/shop/berain/input/create' element={isAuth ? <CreateShopInput shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/input/details' element={isAuth ? <ShopInputDetails shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/input/details/edit' element={isAuth ? <ShopInputDetailsEdit shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/input/details/image' element={isAuth ? <ShopInputDetailsImage shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/expenses' element={isAuth ? <ShopExpense shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/withdrawls' element={isAuth ? <ShopWithdrawl shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/staff' element={isAuth ? <ShopStaff shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/staff/create' element={isAuth ? <ShopEmployeeCreate shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/staff/edit' element={isAuth ? <ShopEditEmployee shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/staff/details' element={isAuth ? <ShopDetailStaff shopName="berain"/> : <Login/>}/>
                  <Route path='/shop/berain/reports' element={isAuth ? <ShopReport shopName="berain"/> : <Login/>}/>


                  // sahab shop
                  <Route path="/shop/sahab/sells" element={isAuth ? <ShopSells shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/inputs' element={isAuth ? <ShopInput shopName="sahab"/> :<Login/>}/>
                  <Route path='/shop/sahab/input/create' element={isAuth ? <CreateShopInput shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/input/details' element={isAuth ? <ShopInputDetails shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/input/details/edit' element={isAuth ? <ShopInputDetailsEdit shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/input/details/image' element={isAuth ? <ShopInputDetailsImage shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/expenses' element={isAuth ? <ShopExpense shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/withdrawls' element={isAuth ? <ShopWithdrawl shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/staff' element={isAuth ? <ShopStaff shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/staff/create' element={isAuth ? <ShopEmployeeCreate shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/staff/edit' element={isAuth ? <ShopEditEmployee shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/staff/details' element={isAuth ? <ShopDetailStaff shopName="sahab"/> : <Login/>}/>
                  <Route path='/shop/sahab/reports' element={isAuth ? <ShopReport shopName="sahab"/> : <Login/>}/>

                </Routes>
              </div>
            </div>
          </>
        </Router>
      </Suspense>                  
  );
}

function register(registerIsOpen,setRegisterIsOpen,registerName,setRegisterName,password,setPassword,email,setEmail,t){
  

  const formData = new FormData();
  formData.append('name', registerName);
  formData.append('email', email);
  formData.append('password', password);

  const sendRigisterInfo=async(e)=>{
    e.preventDefault();
    await axios.post('http://127.0.0.1:8000/api/register', formData)
        .then(({data})=>{
            console.log(data.message);
            setRegisterIsOpen(false);
        }).catch(({response})=>{
            console.log(response.data.error);
        });
  };
  return(
    <>
    <Modal
      isOpen={registerIsOpen}
      onRequestClose={()=>{setRegisterIsOpen(false)}}
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
      <div>
        <form onSubmit={sendRigisterInfo}>
          <div>
            <h3 >{t("sign up")}</h3>
            <div className="form-group mt-3">
              <label>{t("user name")}</label>
              <input
                type="name"
                className="form-control mt-1"
                placeholder="Enter name"
                onChange={(e)=>{setRegisterName(e.target.value)}}
              />
            </div>
            <div className="form-group mt-3">
              <label>{t("email address")}</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>
            <div className="form-group mt-3">
              <label>{t("password")}</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                {t("register")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  </>
  );
}

function logoutScreen(logoutScreenIsOpen,setLogoutScreenIsOpen,t) {
  return(
    <>
    <Modal
      isOpen={logoutScreenIsOpen}
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
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <h2 style={{display:"flex",justifyContent:"center"}}>{t("logout")}</h2>
            <button className='btn btn-danger' style={{marginTop:"50px",marginBottom:"20px"}} onClick={()=>{localStorage.removeItem('isAuth');localStorage.removeItem('userName');localStorage.removeItem('token');window.location.href="/login"}}>{t("logout")}</button>
            <button className='btn btn-success' onClick={()=>{setLogoutScreenIsOpen(false)}}>{t("cancel")}</button>
        </div>
    </Modal>
  </>
);
}

