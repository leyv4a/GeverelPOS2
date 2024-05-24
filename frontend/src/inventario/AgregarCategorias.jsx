import React from 'react'
import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";
import GenericTable from '../components/GenericTable'
import { productColumns, products } from '../components/data.js';
export default function AgregarCategorias() {
  return (
    <>
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className="w-[50%]">
        <div className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
          <h2 className='text-2xl text-center'>Registrar nueva categoria</h2>
          <Input variant='underlined'  isRequired type="text" label="Nombre" size='sm' className=''/>
          <Button color='primary' className="border my-auto " >Agregar</Button>
        </div>
      </div>
      <div className="w-[50%]">
        <GenericTable  columns={productColumns} data={products}/>
      </div>
    </div>
    </>
  )
}
