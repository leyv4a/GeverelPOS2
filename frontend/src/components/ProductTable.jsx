import React from 'react'
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

export default function ProductTable() {
  return (
    <Table 
    aria-label="POS TABLE">
    <TableHeader>
      <TableColumn>Cantidad</TableColumn>
      <TableColumn>Producto</TableColumn>
      <TableColumn>Unidad</TableColumn>
      <TableColumn>Impuesto</TableColumn>
      <TableColumn>Precio</TableColumn>
      <TableColumn>Subtotal</TableColumn>
    </TableHeader>
    <TableBody>
      <TableRow key="1">
        <TableCell>Tony Reichert</TableCell>
        <TableCell>CEO</TableCell>
        <TableCell>Active</TableCell>
        <TableCell>Active</TableCell>
        <TableCell>Active</TableCell>
        <TableCell>Active</TableCell>
      </TableRow>
      <TableRow key="2">
        <TableCell>Zoey Lang</TableCell>
        <TableCell>Technical Lead</TableCell>
        <TableCell>Paused</TableCell>
        <TableCell>Paused</TableCell>
        <TableCell>Paused</TableCell>
        <TableCell>Paused</TableCell>
      </TableRow>
      <TableRow key="3">
        <TableCell>Jane Fisher</TableCell>
        <TableCell>Senior Developer</TableCell>
        <TableCell>Active</TableCell>
        <TableCell>Active</TableCell>
        <TableCell>Active</TableCell>
        <TableCell>Active</TableCell>
      </TableRow>
      <TableRow key="4">
        <TableCell>William Howard</TableCell>
        <TableCell>Community Manager</TableCell>
        <TableCell>Vacation</TableCell>
        <TableCell>Vacation</TableCell>
        <TableCell>Vacation</TableCell>
        <TableCell>Vacation</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  )
}
