import React from 'react'
// import TableComponent from '../components/TableComponent'
import GenericTable from '../components/GenericTable'
import { productColumns, products } from '../components/data.js';
export default function AgregarCategorias() {
  return (
    <>
    <div className='flex gap-2 max-h-[100%]'>
      <div className="bg-primary w-[50%]">
        lorem200
      </div>
      <div className="w-[50%]">
        <GenericTable  columns={productColumns} data={products}/>
      </div>
    </div>
    </>
  )
}
