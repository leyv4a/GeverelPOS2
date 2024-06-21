import React from 'react'
import { FaCashRegister } from "react-icons/fa";
import TicketPreview from '../components/TicketPreview';
import {Input} from "@nextui-org/react";

export default function Tienda() {
  return (
    <div className='w-full h-screen p-5 bg-slate-100'>
      <h2 className='text-4xl flex gap-2 mb-2'>
       <FaCashRegister/> PUNTO DE VENTA
      </h2>
      <div className='flex w-[50%] mb-2'>
        <Input type='text' color='primary' radius='none' size='sm' label={"Codigo"} variant='borderer' />
      </div>
       <div className="flex gap-6 max-h-[100%] sm:flex-row  flex-col">
        <div className='w-[70%]'>TABLA DE PRODUCTOS</div>
        <div className='w-[30%]'>
          <TicketPreview />
          <div className='flex items-center h-[50%]'>
          <img width={'100%'} src='https://geverel.com/Geverel-Software.webp'/>
          </div>
        </div>
       </div>
    </div>
  )
}
