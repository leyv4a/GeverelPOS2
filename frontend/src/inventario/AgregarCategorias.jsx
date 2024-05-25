import React from 'react'
import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";
import GenericTable from '../components/GenericTable'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function AgregarCategorias() {

  const [categories, setCategories] = React.useState([])
  const [name, setName] = React.useState('')

 
 const getCategories = async() => { await fetch('http://localhost:3001/api/category', {
   method: 'GET',
   mode: 'cors',
   headers: {
     'Content-Type': 'application/json'
    }
  }).then(response => {
    if(!response.ok) toast.error('¡Tuvimos un error!')
    return response.json()
  }).then(data => {
    console.log(data)
    setCategories(data)
  }).catch((e)=> {
    console.log(e)
    toast.error('Error al cargar categorías', {
      bodyClassName : 'text-foreground'
    });
  })
 };

  const createCategory = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/category',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name
      })
    }).then(response => {
      if (!response.ok) {
        toast.error('Error en la comunicacion con la base de datos...');
      }
      return response.json(); // Parsear la respuesta JSON
    })
    .then(data => {
      toast.success('Categoría creada correctamente');
      getCategories();
      setName('');

    })
    .catch(error => {
      toast.error('Error al crear categoría');
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  const deleteCategoryById = async (id) => {
    await fetch(`http://localhost:3001/api/category/${id}`,{
      method: 'DELETE',
      mode: 'cors'
    }).then(response => {
      if (!response.ok) {
        toast.error('Error al eliminar la categoria.');
      }
      return response.json(); // Parsear la respuesta JSON
    }).then(()=>{
      toast.success('Categoría eliminada correctamente');
      getCategories();
    }).catch((error)=>{
      console.log(error)
      toast.error('Error en la comunicacion con la base de datos...');
    })
  }
  const columns = [
    { uid: 'id', nombre: 'Id', sortable: false },
    { uid: 'nombre', nombre: 'Nombre', sortable: true },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
];

React.useEffect(()=>{
getCategories();
},[])
  return (
    <>
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className="w-[50%]">
        <form onSubmit={e => {createCategory(e)}} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
          <h2 className='text-2xl text-center'>Registrar nueva categoria</h2>
          <Input errorMessage="Por favor rellene este campo." variant='underlined'  value={name} onChange={e =>{setName(e.target.value)}} isRequired type="text" label="Nombre" size='sm' className=''/>
          <Button color='primary' type='submit'  className="border my-auto " >Agregar</Button>
        </form>
      </div>
      <div className="w-[50%]">
        <GenericTable  columns={columns} data={categories} onDelete={deleteCategoryById}/>
      </div>
      <div>
        <ToastContainer  position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
    </>
  )
}
