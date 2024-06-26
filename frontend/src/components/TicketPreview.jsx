import React from 'react'
import {Button} from '@nextui-org/button'
import {Input} from '@nextui-org/input'

export default function TicketPreview({total, handleProcesar, handleCancelar}) {
const [cambio,setCambio] = React.useState('')

  return (
  <div className='rounded-lg border-2 border-slate-500/20 bg-white p-5 flex flex-col gap-2'>
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
          ${total ||0}
        </span>
        <span>
         $0
        </span>
        <span>
         $0
        </span>
        <span>
         <input className='border max-w-[70%] px-1' value={cambio} onChange={e => setCambio(e.target.value.replace(/[^0-9.]/g, ''))} type='text'/>
         {/* <Input classNames="p-0 m-0" isRequired size='sm' variant='underlined' value={cambio} onChange={e => setCambio(e.target.value.replace(/[^0-9.]/g, ''))} type="text" className='max-w-[70%]'/> */}
        </span>
        <span>
         <strong> ${total ||0}</strong>
        </span>
        <span>
          <strong>${!cambio? '0' : cambio-total}</strong>
        </span>
      </div>
    </div>
     <Button className='font-bold ' onPress={e=> {handleProcesar(e)}} variant='flat' radius='sm' color='success'>
     Procesar
   </Button>
   <Button onPress={e => {handleCancelar()}} className='font-bold' radius='sm' variant='flat' color='danger'>
     Cancelar
   </Button>
   </div>
  )
}
