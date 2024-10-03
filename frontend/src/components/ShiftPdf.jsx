// import React from 'react'
// import html2pdf from 'html2pdf.js/dist/html2pdf.min';
  
 

 const ShiftPdf = () => {
  return (
  <>
  {/* <TableDate/>
  <TableProducts/> */}
    <h1>JSX to PDF Convert Example</h1>
    <h2>Hello React</h2> 
  </>
);

}

const TableDate = () => {
  return (
    <table>
      <thead>
        <tr className="flex gap-2 justify-between">
          <th className="">Fecha:</th>
          <td>12/12/2002</td>
        </tr>
        <tr className="flex gap-2 justify-between">
          <th className="">Vendedor:</th>
          <td>Gabriel Leyva</td>
        </tr>
      </thead>
    </table>
  );
};
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
const TableProducts = () => {
  const columns = [
    {
      key: "producto",
      label: "Producto",
    },
    {
      key: "cantidad",
      label: "Cantidad",
    },
    {
      key: "ganancia",
      label: "Ganancia",
    },
  ];
  const rows = [
    {
      key: "1",
      producto: "Tomate",
      cantidad: "30kg",
      ganancia: "$540",
    },
    {
      key: "2",
      producto: "Cilantro",
      cantidad: "15U",
      ganancia: "$150",
    },
    {
      key: "3",
      producto: "Pimienta",
      cantidad: "30U",
      ganancia: "$40",
    },
  ];

  return (
    <div className="flex flex-col -mb-2 w-full">
    <h2 className="text-xl font-bold text-center z-10 leading-3">
        3 Productos del dia
    </h2>
    <Table shadow="none" radius="none">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
};

export default ShiftPdf;