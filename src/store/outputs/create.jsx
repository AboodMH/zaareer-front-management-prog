import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Modal from 'react-modal';

let token=localStorage.getItem('token');

const config = {
    headers: { Authorization: `Bearer ${token}` }
};

export default function CreateOutput(){
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [clientName, setClientName] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [description, setDescription] = useState("");
    const [clients, setClients] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [isAllFilledIsOpen, setIsAllFilledIsOpen] = useState(false);

    const createTotalOutput = async(e)=>{
        e.preventDefault();
        const formDataTotalOutput=new FormData();
        formDataTotalOutput.append('date',date);
        formDataTotalOutput.append('client_name',clientName);
        formDataTotalOutput.append('invoice_no',invoiceNo);
        formDataTotalOutput.append('description',description);
        formDataTotalOutput.append('value',0);
        formDataTotalOutput.append('quantity',0);

        await axios.post('http://127.0.0.1:8000/api/store/totalOutput', formDataTotalOutput,config)
        .then(({data})=>{
            console.log(data.message);
            navigate(-1);
        }).catch(({response})=>{
            if (response.status ==422) {
                console.log(response.data.errors)
            } else {
                console.log(response.data.message)
            }
        });
    }

    const fetchClient = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/client',config).then(({ data }) => {
            setClients(data);
        });
    }

    const fetchProduct = async () => {
        await axios.get('http://127.0.0.1:8000/api/store/product',config).then(({ data }) => {
            setProductsData(data);
            console.log(productsData);
        });
    }

    useEffect(() => {
        fetchClient();
        fetchProduct();
    }, []);

    return(
        <>
            {isAllFilled(t,isAllFilledIsOpen,setIsAllFilledIsOpen)}
            <form onSubmit={createTotalOutput}>
                <div className="px-4 py-4">
                    <div className="form-group mb-4">
                        <label for="date">{t("date")}</label>
                        <input onChange={(e)=>{setDate(e.target.value)}} value={date} type="date" className="form-control" placeholder={t("Enter date")}/>
                    </div>
                    <div className="form-group mb-4">
                        <label for="client name">{t("client name")}</label>
                        <select onChange={(e)=>{setClientName(e.target.value)}} className="form-select" placeholder={t("Enter client name")}>
                            <option value="">{t("select client name")}</option>
                            {clients.map((client, index) => (
                                <option key={index} value={client.client_name}>{client.client_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-4">
                        <label for="invoice no">{t("invoice no")}</label>
                        <input onChange={(e)=>{setInvoiceNo(e.target.value)}} value={invoiceNo} type="text" className="form-control" placeholder={`${t("Enter")} ${t("invoice no")}`}/>
                    </div>
                    <div className="form-group mb-4">
                        <label for="description">{t("description")}</label>
                        <input onChange={(e)=>{setDescription(e.target.value)}} value={description} type="text" className="form-control" placeholder={t("Enter description")}/>
                    </div>
                    <div>
                        <button onClick={()=>{date==='' || clientName==='' || invoiceNo==='' || description==='' ? setIsAllFilledIsOpen(true) : setIsAllFilledIsOpen(false)}} className="btn btn-success">{t("create")}</button>
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
