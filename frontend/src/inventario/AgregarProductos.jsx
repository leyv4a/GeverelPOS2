import React from 'react'
import GenericTable from '../components/GenericTable';
import { ToastContainer, toast } from 'react-toastify';
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
export default function AgregarProductos() {

  //Guarda los productos que traera la api 
  const [products, setProducts] = React.useState([])
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  //Guardan los valores de los input para agregar un nuevo producto
  const [nombre, setNombre] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  //Este se debe agregar al registrar entrada nueva
  // const [stock, setStock] = React.useState('');
  const [stockMin, setStockMin] = React.useState('');
  const [codigo, setCodigo] = React.useState('');
  // const [] = React.useState('');
  // const [] = React.useState('');
  const resetFields = () => {
    setNombre('');
    setDescripcion('');
    setStockMin('');
    setCodigo('');
  }

  const [isFullTable, setIsFullTable] = React.useState(false);

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const getProducts = async () => {
    try {
    const response = await fetch(`http://localhost:3001/api/product`,{
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(!response.ok) throw new Error('Error al cargar los productos');
    const result = await response.json();
    setProducts(result);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }
  // nombre,categoriaId, descripcion,stock,stockMin, precioVenta, precioCompra, codigo
  const createProduct = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre,
          descripcion : descripcion,
          stockMin: stockMin,
          codigo: codigo
        })    
      });

      const result = await response.json();
      if (!response.ok) {
          throw new Error(result.error || 'Error en la comunicación con la base de datos');
      }

      toast.success(result.message);
      getProducts();
      resetFields();
    } catch (error) {
      toast.error(error.message);
    }finally{
      setIsButtonLoading(false);
    }
  }

  const columns = [ 
  { uid: 'id', nombre: 'Id', sortable: true },
  { uid: 'nombre', nombre: 'Nombre', sortable: true },
  { uid: 'categoria', nombre: 'Categoria', sortable: true },
  { uid: 'descripcion', nombre: 'Descripcion', sortable: false },
  { uid: 'stock', nombre: 'Stock', sortable: true },
  { uid: 'stockMin', nombre: 'Stock Min.', sortable: true },
  { uid: 'precioVenta', nombre: 'Precio', sortable: true },
  { uid: 'precioCompra', nombre: 'Precio (Compra)', sortable: true },
  { uid: 'codigo', nombre: 'Codigo', sortable: false },
  { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];
  React.useEffect(() => {
    getProducts();
  }, [])
  return (
    <>
      <div className='flex gap-6 p-5 max-h-[100%]'>
        <div className={isFullTable? 'hidden':' w-[50%]' }>
          <form onSubmit={e => { createProduct(e)}} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
          <h2 className='text-2xl text-center w-full'>Registrar nuevo producto</h2>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input errorMessage="Por favor rellene este campo." variant='underlined'  value={nombre} onChange={e =>{setNombre(e.target.value)}} isRequired type="text" label="Nombre" size='sm'/>
            <Input errorMessage="Por favor rellene este campo." variant='underlined' value={descripcion} onChange={e =>{setDescripcion(e.target.value)}} isRequired type="text" label="Descripcion" size='sm'/>
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input errorMessage="Por favor rellene este campo." variant='underlined'  value={codigo} onChange={e =>{setCodigo(e.target.value)}} isRequired type="text" label="Codigo" size='sm'/>
            <Input errorMessage="Por favor rellene este campo." variant='underlined' value={stockMin} onChange={e =>{setStockMin(e.target.value)}} isRequired type="text" label="Stock Min." size='sm'/>
          </div>
          <Button isLoading={isButtonLoading} color='primary' type='submit'  className="border my-auto " >Agregar</Button>
          </form>
        </div>
        <div className={isFullTable? 'w-[100%]' : 'w-[50%]'}>
          <GenericTable columns={columns} data={products} onDelete={'delete by id request'} isFullTable={isFullTable} handleFullTable={handleFullTable}/>
        </div>
        <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
        </div>
      </div>
    </>
  )
}
