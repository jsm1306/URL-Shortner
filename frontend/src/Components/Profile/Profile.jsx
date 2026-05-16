import { Avatar } from '@mantine/core'
import React from 'react'


export default function Profile() {


   const dummy = {
       name: "J. Sindhu",
       email: "sindhu.j1729@gmail.com",
       id: "1234567890",
       avatar: "https://avatars.githubusercontent.com/u/1234567890?v=4"
   }


 return (
   <div>
     <Avatar src={dummy.avatar} />
     <h2>{dummy.name}</h2>
     <p>{dummy.email}</p>
     <p>ID: {dummy.id}</p>
   </div>
 )
}
