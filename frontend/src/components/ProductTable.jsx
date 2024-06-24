import React from 'react'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Button, Input} from "@nextui-org/react";

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
    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
    </TableHeader>
    <TableBody emptyContent={"Aun no hay productos en el carrito"} items={data}>
    {(item,key) => (
          <TableRow key={key}>
            {(columnKey) => (
              <TableCell>
                {columnKey === 'acciones' ? (
                  <Button size="sm" color="error" onClick={() => handleRemove(item.id)}>
                    Eliminar
                  </Button>
                ) : columnKey === 'cantidad' ? (
                  <>
                  <Input type="number" value={item.cantidad} onChange={(e) => handleEditarCantidad(item.id, e.target.value)} />
                  </>
                ):
                 (
                  getKeyValue(item, columnKey)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
    </TableBody>
  </Table>
  )
}
