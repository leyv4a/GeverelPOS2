import React from 'react'
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import GenericTable from '../components/GenericTable'
import { ToastContainer, toast } from 'react-toastify';
function AgregarCategorias() {


  const [categories, setCategories] = React.useState([])
  const [name, setName] = React.useState('');
  const [inicial, setInicial] = React.useState('');
  const [id, setId] = React.useState(0);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [editing, setEditing] = React.useState(false);

  const handleEditing = (item) => {
    setEditing(!editing)
    setName(item.nombre);
    setInicial(item.inicial);
    setId(item.id);
  }
  
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
     toast.error('Error en la comunicacion con la base de datos', {
       bodyClassName : 'text-foreground'
     });
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
      body: JSON.stringify({ name, inicial })
    });
    
    const result = await response.json();
    if (!response.ok ) {
      throw new Error(result.error || 'Error en la comunicación con la base de datos');
    }

    toast.success(result.message);
    getCategories();
    setName('');
    setInicial('');
  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsButtonLoading(false);
  }
 };

  const deleteCategoryById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/category/${id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ||result.message );
      
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }finally{
      getCategories();
    }
  }
  const updateCategoryById = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/category`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name, inicial })
      })
      if (!response.ok) {
        throw new Error('Error al actualizar la categoria.');
      }
      const result = await response.json();
      toast.success(result.message);  // Mostrar el mensaje recibido del servidor
      getCategories();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }finally{
      setName('');
      setId('');
      setInicial('');
      setIsButtonLoading(false);
      setEditing(false);
    }
  }
  
  const columns = [
    // { uid: 'id', nombre: 'Id', sortable: true },
    { uid: 'nombre', nombre: 'Nombre', sortable: true },
    { uid: 'inicial', nombre: 'Inicial', sortable: true },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];

React.useEffect(()=>{
getCategories();
},[])
  return (
    <>
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className={isFullTable? 'hidden':' w-[50%]' }>
        <form onSubmit={e => {editing ? updateCategoryById(e):createCategory(e)}} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
          <h2 className='text-2xl text-center'>Registrar nueva categoria</h2>
          <div className='flex gap-4'>
          <Input pattern="[A-Za-z\s]+" variant='underlined'  value={name} onChange={e =>{setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}} isRequired type="text" label="Nombre" size='sm' className=''/>
          <Input pattern="[A-Za-z]{1}" variant='underlined'  value={inicial} onChange={e =>{setInicial(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 1))}} isRequired type="text" label="Inicial" size='sm' className='max-w-[10vw]'/>
          </div>
          {editing? 
          <div className='flex gap-2'>
            <Button radius="sm" isLoading={isButtonLoading} color='primary' type='submit'className=" my-auto w-full">Editar</Button>
            <Button radius="sm" onClick={handleEditing} color='danger' className=" my-auto w-full " >Cancelar</Button>
          </div> 
        : <Button radius="sm" isLoading={isButtonLoading} color='primary' type='submit' className=" my-auto ">Agregar</Button>
        }
        </form>
      </div>
      <div className={isFullTable? 'w-[100%]' : 'w-[50%]'}>
        <GenericTable isFullTable={isFullTable} handleFullTable={handleFullTable}  columns={columns} data={categories} onDelete={deleteCategoryById} onEdit={true} handleEditing={handleEditing}/>
      </div>
      <div>
        <ToastContainer  position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
    </>
  )
}

export default AgregarCategorias;