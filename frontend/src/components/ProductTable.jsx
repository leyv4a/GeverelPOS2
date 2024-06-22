import React from 'react'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

export default function ProductTable({data}) {
  const columns = [
    {
      key: "cantidad",
      label: "Cantidad",
    },{
      key: "nombre",
      label: "Producto",
    },
    {
      key: "unidad",
      label: "Unidad",
    },
    {
      key: "precioVenta",
      label: "Precio",
    }, {
      key: "subtotal",
      label: "Subtotal",
    }
  ];

  return (
    <Table 
    aria-label="POS TABLE">
    <TableHeader columns={columns}>
    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
    </TableHeader>
    <TableBody emptyContent={"Aun no hay productos en el carrito"} items={data}>
    {(item,key) => (
          <TableRow key={key}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
    </TableBody>
  </Table>
  )
}
