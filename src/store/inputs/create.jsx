import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function CreateInput(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [companyName, setCompanyName] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [description, setDescription] = useState("");
    const [isAllFilledIsOpen,setIsAllFilledIsOpen] = useState(false);
    const [company, setCompany] = useState([]);

    const fetchCompany = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/company',config).then(({ data }) => {setCompany(data);});
    }
    useEffect(() => {
        fetchCompany();
      }, []);

      const createTotalInput = async(e)=>{
        e.preventDefault();
        const formDataTotalInput=new FormData();
        formDataTotalInput.append('date',date);
        formDataTotalInput.append('company_name',companyName);
        formDataTotalInput.append('invoice_no',invoiceNo);
        formDataTotalInput.append('description',description);
        formDataTotalInput.append('value',0);
        formDataTotalInput.append('quantity',0);

        await axios.post('http://127.0.0.1:8000/api/store/totalInput', formDataTotalInput,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1);
        }).catch(({response})=>{
            if(response.status ==422) {
                console.log(response.data.errors);
            }else{
                console.log(response.data.message);
            }
        });
    }

    
    return(
        <>
            {isAllFilled(t,isAllFilledIsOpen,setIsAllFilledIsOpen)}
            <form className="p-4" onSubmit={createTotalInput}>
                <div className="form-group mb-4">
                    <label for="date">{t("date")}</label>
                    <input onChange={(e)=>{setDate(e.target.value)}} type="date" className="form-control"/>
                </div>
                <div className="form-group mb-4">
                    <label for="company name">{t("company name")}</label>
                    <select onChange={(e)=>{setCompanyName(e.target.value)}} type="text" className="form-select">
                        <option value="">{t("select company")}</option>
                        {
                            company.map((item, index) => {
                                return <option key={index} value={item.company_name}>{item.company_name}</option>
                            })
                        }
                    </select>
                </div>
                <div className="form-group mb-4">
                    <label for="invoice no">{t("invoice no")}</label>
                    <input onChange={(e)=>{setInvoiceNo(e.target.value)}} type="text" className="form-control" placeholder={t("Enter invoice no")}/>
                </div>
                <div className="form-group mb-4">
                    <label for="description">{t("description")}</label>
                    <input onChange={(e)=>{setDescription(e.target.value)}} type="text" className="form-control" placeholder={t("Enter description")}/>
                </div>
                <div style={{textAlign:"center"}} className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start"> 
                        <button onClick={()=>{date==='' || companyName==='' || invoiceNo==='' || description==='' ? setIsAllFilledIsOpen(true) : setIsAllFilledIsOpen(false)}} className="btn btn-outline-success mx-4">{t("create")}</button>
                    </div>
                </div>
            </form>
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