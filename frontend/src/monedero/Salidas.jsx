import React from 'react'
import GenericTable from '../components/GenericTable';

export default function Salidas() {

  const [data, setData] = React.useState([])

  const [isFullTable, setIsFullTable] = React.useState(false)

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const columns = [
    // { uid: 'id', nombre: 'Id', sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: 'descripcion', nombre: 'Descripcion', sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: 'cantidad', nombre: 'Cantidad', sortable: false },
    { uid: 'fecha', nombre: 'Fecha', sortable: true },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];

  return (
    <div className='flex gap-6 max-h-[100%] p-5 sm:flex-row  flex-col'>
      <div className={isFullTable? 'w-[100%]': 'sm:w-[50%] w-[80%]'}>Formulario</div>
      <div className={isFullTable? 'w-[100%]': 'sm:w-[50%] w-[80%]'}>
        <GenericTable data={data} columns={columns} handleFullTable={handleFullTable} />
      </div>
    </div>
  )
}
