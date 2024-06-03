import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import GenericTable from '../components/GenericTable';
export default function RegistrarEntrada() {
  return (
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className="w-[50%]'">
        1
        </div>
      <div className="w-[50%]'">
        2
      </div>
      <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
