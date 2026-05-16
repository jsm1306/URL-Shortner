import React,{useState} from 'react'
import Response from '../../Components/UrlShortner/Response'
import Input from '../../Components/UrlShortner/Input'

export default function ShortenUrl() {
 const [response,setResponse] = useState(null)

 const resetForm = () => {
   setResponse(null);
 };

 return (
   <div>
     {
       response ? (
         <>
           <Response response={response} />
           <div style={{ textAlign: 'center', marginTop: '20px' }}>
             <button 
               onClick={resetForm}
               style={{
                 padding: '10px 20px',
                 backgroundColor: '#28a745',
                 color: 'white',
                 border: 'none',
                 borderRadius: '4px',
                 cursor: 'pointer',
                 fontSize: '16px'
               }}
             >
               Create Another URL
             </button>
           </div>
         </>
       ) : <Input setResponse={setResponse} />
     }
   </div>
 )
}
