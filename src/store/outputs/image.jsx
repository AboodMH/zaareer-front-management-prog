import { useLocation } from 'react-router-dom';

export default function OutputImage(){
    const location = useLocation();
    const image=location.state.data;

    return (
        <div style={{display:"flex",justifyContent:"center",marginTop:"10px"}}>
            <img height={"70%"} width={"70%"} src={`http://127.0.0.1:8000/storage/storeOutput/image/${image}`} alt=""/>
        </div>
    );
}