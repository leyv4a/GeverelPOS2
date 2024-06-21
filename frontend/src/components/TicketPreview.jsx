import React from 'react'
import {Button} from '@nextui-org/button'

export default function TicketPreview() {
  return (
  <div className='rounded bg-white p-5 flex flex-col gap-2'>
    <div className='flex gap-10 justify-start'>
      <div className='flex flex-col gap-4'>  
        <span>
          <strong>Subtotal:</strong>
        </span>
        <span>
          <strong>Descuento:</strong> 
        </span>
        <span>
         <strong>Impuesto:</strong> 
        </span>
        <span>
         <strong>Pago con:</strong>
        </span>
        <span>
         <strong>Total:</strong>
        </span>
        <span>
         <strong>Cambio:</strong>
        </span>
      </div>
      <div className='flex-col flex gap-4'>
        <span>
          $1203
        </span>
        <span>
         $0
        </span>
        <span>
         $0
        </span>
        <span>
         <input className='border' type='text'/>
        </span>
        <span>
         <strong>$1203</strong>
        </span>
        <span>
          <strong>$50</strong>
        </span>
      </div>
    </div>
     <Button className='font-bold ' variant='flat' radius='sm' color='success'>
     Procesar
   </Button>
   <Button className='font-bold' radius='sm' variant='flat' color='danger'>
     Cancelar
   </Button>
   </div>
  )
}
