import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import GenericTable from '../components/GenericTable';
export default function RegistrarEntrada() {

  const [isFullTable, setIsFullTable] = React.useState(false);

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const columns = [
    // { uid: 'id', nombre: 'Id', sortable: true },
    { uid: 'nombre', nombre: 'Nombre', sortable: true },
    { uid: 'codigo', nombre: 'Codigo', sortable: true },
    { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: 'motivo', nombre: 'Motivo', sortable: true },
    { uid: 'cantidad', nombre: 'Cantidad', sortable: false },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];
  return (
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className={isFullTable? 'hidden': 'w-[50%]'}>
        1
        </div>
      <div className={isFullTable? 'w-[100%]': 'w-[50%]'}>
        <GenericTable columns={columns} data={[]} isFullTable={isFullTable} handleFullTable={handleFullTable}/>
      </div>
      <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
