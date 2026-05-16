import { Button, TextInput } from '@mantine/core'
import React, { useState } from 'react'
import Service from '../../utils/http.js'


export default function Input({setResponse}) {
   const service = new Service();
   const [payload, setPayload] = useState(
       {
           "originalUrl": "",
           "expiresAt": "",
           "title": "",
           "customUrl": ""
       }
   )

   const generateShortCode = async ()=>{
       try {
           console.log("Sending payload:", payload);
           const response = await service.post("s", payload);
           console.log("Response received:", response);
           setResponse(response);
       } catch (error) {
           console.error("Error generating short URL:", error);
           alert("Error: " + (error.response?.data?.message || error.message || "Failed to shorten URL"));
       }
   }
  
   return (
       <div style={{ maxWidth: 600, margin: '40px auto', padding: '20px' }}>
           <h1 style={{ fontSize: '48px', marginBottom: '40px', textAlign: 'left' }}>
               Shorten Your URL Here
           </h1>

           <div style={{ marginBottom: '20px' }}>
               <TextInput
                   label="Original URL"
                   withAsterisk
                   placeholder="Paste Original URL"
                   value={payload.originalUrl}
                   onChange={(e) => {
                       setPayload({ ...payload, originalUrl: e.target.value })
                   }}
               />
           </div>

           <div style={{ marginBottom: '20px' }}>
               <TextInput
                   label="Customize your link ( Optional )"
                   placeholder="Customize your link"
                   value={payload.customUrl}
                   onChange={(e) => {
                       setPayload({ ...payload, customUrl: e.target.value })
                   }}
               />
           </div>

           <div style={{ marginBottom: '20px' }}>
               <TextInput
                   label="Title ( Optional )"
                   placeholder="Title of URL"
                   value={payload.title}
                   onChange={(e) => {
                       setPayload({ ...payload, title: e.target.value })
                   }}
               />
           </div>

           <div style={{ marginBottom: '30px' }}>
               <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                   Date of Expiry ( Optional )
               </label>
               <input
                   type="date"
                   value={payload.expiresAt}
                   onChange={(e) => {
                       setPayload({ ...payload, expiresAt: e.target.value })
                   }}
                   style={{
                       width: '100%',
                       padding: '10px',
                       border: '1px solid #ddd',
                       borderRadius: '4px',
                       fontSize: '16px',
                       boxSizing: 'border-box'
                   }}
               />
           </div>

           <Button 
               fullWidth
               disabled={payload.originalUrl === ""} 
               onClick={generateShortCode} 
               variant="filled" 
               color="blue"
               size="lg"
           >
               Generate And Shorten URL
           </Button>
       </div>
   )
}
