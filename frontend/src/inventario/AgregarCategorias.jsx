import React from 'react'
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import GenericTable from '../components/GenericTable'
import { ToastContainer, toast } from 'react-toastify';
function AgregarCategorias() {

  const [categories, setCategories] = React.useState([])
  const [name, setName] = React.useState('');
  const [id, setId] = React.useState(0);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [editing, setEditing] = React.useState(false);
  const handleEditing = (id, nombre) => {
    setEditing(!editing)
    setName(nombre);
    setId(id);
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
      body: JSON.stringify({ name })
    });
    
    const result = await response.json();
    if (!response.ok ) {
      throw new Error(result.error || 'Error en la comunicación con la base de datos');
    }

    toast.success(result.message);
    getCategories();
    setName('');
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
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la categoria.');
      }
       
    const result = await response.json();
    toast.success(result.message);  // Mostrar el mensaje recibido del servidor
      getCategories();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  const updateCategoryById = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/category`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name })
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
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className={isFullTable? 'hidden':' w-[50%]' }>
        <form onSubmit={e => {editing ? updateCategoryById(e):createCategory(e)}} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
          <h2 className='text-2xl text-center'>Registrar nueva categoria</h2>
          <Input errorMessage="Por favor rellene este campo." variant='underlined'  value={name} onChange={e =>{setName(e.target.value)}} isRequired type="text" label="Nombre" size='sm' className=''/>
          {editing? 
          <div className='flex gap-2'>
            <Button isLoading={isButtonLoading} color='primary' type='submit'className="border my-auto w-full">Editar</Button>
            <Button onClick={()=> handleEditing()} color='danger' className="border my-auto w-full " >Cancelar</Button>
          </div> 
        : <Button isLoading={isButtonLoading} color='primary' type='submit' className="border my-auto ">Agregar</Button>
        }
          
        </form>
      </div>
      <div className={isFullTable? 'w-[100%]' : 'w-[50%]'}>
        <GenericTable isFullTable={isFullTable} handleFullTable={handleFullTable}  columns={columns} data={categories} onDelete={deleteCategoryById} onDetails={false} handleEditing={handleEditing}/>
      </div>
      <div>
        <ToastContainer  position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
    </>
  )
}

export default AgregarCategorias;