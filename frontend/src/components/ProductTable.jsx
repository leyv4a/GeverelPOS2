import React from 'react'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Button, Input} from "@nextui-org/react";
import { FaTrash } from "react-icons/fa";

export default function ProductTable({data, handleEditarCantidad,handleRemove}) {
  const columns = [
    {
      key: "cantidad",
      label: "Cantidad",
    },{
      key: "nombre",
      label: "Producto",
    },
    {
      key: "precioVenta",
      label: "Precio",
    }, {
      key: "subtotal",
      label: "Subtotal",
    }
    , {
      key: "acciones",
      label: "Acciones",
    }
  ];



  return (
    <Table 
    aria-label="POS TABLE">
    <TableHeader columns={columns}>
    {(column) => ( 
      column.key === 'cantidad' ?  
      <TableColumn className='w-[150px]' key={column.key}>{column.label}</TableColumn>
      :
      <TableColumn className='' key={column.key}>{column.label}</TableColumn>)}
    </TableHeader>
    {/* <TableBody emptyContent={"Aun no hay productos en el carrito"} items={data}>
    {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === 'acciones' ? (
                  <Button size="sm" color="error" isIconOnly className="text-xl text-danger"  onClick={() => handleRemove(item.id)}>
                    <FaTrash/>
                  </Button>
                ) : columnKey === 'cantidad' ? (
                  <>
                  <Input size='sm' className='max-w-[130px]' variant='underlined' type="number" value={item.cantidad} onChange={(e) => handleEditarCantidad(item.id, e.target.value)} />
                  </>
                ): columnKey === 'precioVenta'  ? (
                  <>
                  ${getKeyValue(item, columnKey)}
                  </>
                ): columnKey === 'subtotal' ? (
                  <>
                  ${getKeyValue(item, columnKey)}
                  </>
                ):

                 (
                 <p className='capitalize'>{getKeyValue(item, columnKey)}</p>
                )}
              </TableCell>
            )}
          </TableRow>
        )}
    </TableBody> */}
    <TableBody emptyContent={"Aun no hay productos en el carrito"} items={data}>
  {data.map(item => (
    <TableRow key={item.id}>
      {columns.map(column => (
        <TableCell key={column.key}>
          {column.key === 'acciones' ? (
            <Button size="sm" color="error" isIconOnly className="text-xl text-danger" onClick={() => handleRemove(item.id)}>
              <FaTrash/>
            </Button>
          ) : column.key === 'cantidad' ? (
            <Input size='sm' className='max-w-[130px]' type='number' variant='underlined' value={item.cantidad}
             onChange={(e) => handleEditarCantidad(item.id, e.target.value, item.unidad)} 
             />
          ) : column.key === 'precioVenta' || column.key === 'subtotal'  ? (
            `$${(getKeyValue(item, column.key)).toFixed(2)}`
          ) : (
            <p className='capitalize'>{getKeyValue(item, column.key)}</p>
          )}
        </TableCell>
      ))}
    </TableRow>
  ))}
</TableBody>
  </Table>
  )
}
