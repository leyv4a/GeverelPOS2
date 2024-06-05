import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import GenericTable from '../components/GenericTable';
import { Button, Input } from '@nextui-org/react';
export default function RegistrarEntrada() {

  const [producto, setProducto] = React.useState('');
  const [productoEncontrado, setProductoEncontrado] = React.useState('')
  const [codigo, setCodigo] = React.useState('');
  const [fecha, setFecha] = React.useState('');

  const [data, setData] = React.useState([]);
  const [isFullTable, setIsFullTable] = React.useState(false);

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const getEntradas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/transaction/entry',{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      if (!response.ok) throw new Error('Error al cargar las entradas');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error)
      toast.error('Error en la comunicacion con la base de datos', {
        bodyClassName : 'text-foreground'
      })
      
    }
  }
  //Se esta buscando por id cambiar el metodo en la api para buscar por codigo
  const getProductByCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/product/${codigo}`,{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      if (!response.ok) throw new Error('Error al buscar el producto');
      const producto = await response.json();
      setProductoEncontrado(producto[0].nombre);
      console.log(producto)
    } catch (error) {
      console.log(error.message)
      toast.error('Error en la comunicacion con la base de datos', {
        bodyClassName : 'text-foreground'
      })
      
    }
  }

  const columns = [
    // { uid: 'id', nombre: 'Id', sortable: true },
    { uid: 'nombre', nombre: 'Nombre', sortable: true },
    { uid: 'codigo', nombre: 'Codigo', sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: 'fecha', nombre: 'Fecha', sortable: true },
    { uid: 'motivo', nombre: 'Motivo', sortable: true },
    { uid: 'cantidad', nombre: 'Cantidad', sortable: false },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];

  React.useEffect(() => {
    getEntradas();
  }, [])
  React.useEffect(()=> {
    const date = new Date();
    setFecha(date.getFullYear())
    if (producto == '') {
      setFecha('')
    }
  }, [productoEncontrado])
  return (
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className={isFullTable? 'hidden': 'w-[50%]'}>
      <div className="flex w-full gap-4">
        <div className='flex'>
          <Input isRequired size='sm' variant='underlined' type="text" label="Producto" value={producto} onChange={e=> setProducto(e.target.value)}/>
          <Button size='lg' color="primary" radius='none' disableRipple onClick={e => getProductByCode(e)} >Buscar</Button>
        </div>
         <Input size='sm' variant='underlined' isReadOnly disabled value={fecha} label="Fecha" className='max-w-[40%]'/>
      </div>  
      {
        productoEncontrado != '' ? 
        <div className='flex w-full gap-4'>
            {`El producto es ${productoEncontrado}`}
        </div>
        :
        ''
      }
      </div>
      <div className={isFullTable? 'w-[100%]': 'w-[50%]'}>
        <GenericTable columns={columns} data={data} isFullTable={isFullTable} handleFullTable={handleFullTable}/>
      </div>
      <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
