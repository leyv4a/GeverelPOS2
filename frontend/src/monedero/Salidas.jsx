import React from 'react'
import GenericTable from '../components/GenericTable';
import { ToastContainer, toast } from 'react-toastify';

export default function Salidas() {

  const [data, setData] = React.useState([])

  const [isFullTable, setIsFullTable] = React.useState(false)

  const getEgresos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/wallet/egreso`,{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Error al cargar los egresos');
      const data = await response.json();
      setData(data);
    } catch (error) {
      toast.error(error.message);
      console.log(error)
    }
  } 

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const columns = [
    // { uid: 'id', nombre: 'Id', sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: 'descripcion', nombre: 'Descripcion', sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: 'monto', nombre: 'Cantidad', sortable: false },
    { uid: 'fecha', nombre: 'Fecha', sortable: true },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];

  React.useEffect(() => {
    getEgresos();
  }, [])
  return (
    <div className='flex gap-6 max-h-[100%] p-5 sm:flex-row  flex-col'>
      <div className={isFullTable? 'hidden': 'sm:w-[50%] w-[80%]'}>
      <form  className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
      <h2 className='text-2xl text-center w-full'>Registrar egresos</h2>
      </form>
      </div>
      <div className={isFullTable? 'w-[100%]': 'sm:w-[50%] w-[80%]'}>
        <GenericTable data={data} columns={columns} isFullTable={isFullTable} handleFullTable={handleFullTable} />
      </div>
      <div>
        <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
