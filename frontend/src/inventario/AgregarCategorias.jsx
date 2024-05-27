import React from 'react'
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import GenericTable from '../components/GenericTable'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
export default function AgregarCategorias() {

  const [categories, setCategories] = React.useState([])
  const [name, setName] = React.useState('')
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  
  const [isFullTable, setIsFullTable] = React.useState(false);

const handleFullTable = () => {
  setIsFullTable(!isFullTable);
}
 
 const getCategories = async() => {
  try {
    const response = await fetch('http://localhost:3001/api/category', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(!response.ok) throw new Error('Error al cargar categorías');
    const data = await response.json();
    setCategories(data)
  } catch (error) {
    console.log(error)
    //  toast.error('Error al cargar categorías', {
    //    bodyClassName : 'text-foreground'
    //  });
  }
 }

 const createCategory = async (e) => {
  e.preventDefault();
  setIsButtonLoading(true);
  try {
    const response = await fetch('http://localhost:3001/api/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      throw new Error('Error en la comunicación con la base de datos');
    }

    // const data = await response.json();
    // toast.success('Categoría creada correctamente');
    getCategories();
    setName('');
  } catch (error) {
    // toast.error('Error al crear categoría');
    console.error('There was a problem with the fetch operation:', error);
  } finally {
    setIsButtonLoading(false);
  }
 };

  const deleteCategoryById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/category/${id}`, {
        method: 'DELETE',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la categoria.');
      }
      console.log(response)
      // toast.success('Categoría eliminada correctamente');
      getCategories();
    } catch (error) {
      console.log(error);
      // toast.error(error);
    }
  }
  
  const columns = [
    { uid: 'id', nombre: 'Id', sortable: true },
    { uid: 'nombre', nombre: 'Nombre', sortable: true },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];

React.useEffect(()=>{
getCategories();
},[])
  return (
    <>
    <div>
      asd
    </div>
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className={isFullTable? 'hidden':' w-[50%]' }>
        <form onSubmit={e => {createCategory(e)}} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
          <h2 className='text-2xl text-center'>Registrar nueva categoria</h2>
          <Input errorMessage="Por favor rellene este campo." variant='underlined'  value={name} onChange={e =>{setName(e.target.value)}} isRequired type="text" label="Nombre" size='sm' className=''/>
          <Button isLoading={isButtonLoading} color='primary' type='submit'  className="border my-auto " >Agregar</Button>
        </form>
      </div>
      <div className={isFullTable? 'w-[100%]' : 'w-[50%]'}>
        <GenericTable isFullTable={isFullTable} handleFullTable={handleFullTable}  columns={columns} data={categories} onDelete={deleteCategoryById}/>
      </div>
      <div>
        {/* <ToastContainer  position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/> */}
      </div>
    </div>
    </>
  )
}
