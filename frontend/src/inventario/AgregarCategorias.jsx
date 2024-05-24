import React from 'react'
import {Input} from "@nextui-org/input";
import {Button, ButtonGroup} from "@nextui-org/button";
import GenericTable from '../components/GenericTable'
import { productColumns, products } from '../components/data.js';
export default function AgregarCategorias() {

  const [categories, setCategories] = React.useState([])
  const [name, setName] = React.useState('')
 
 const getCategories = async() => { await fetch('http://localhost:3001/api/category', {
   method: 'GET',
   headers: {
     'Content-Type': 'application/json'
    }
  }).then(response => {
    if(!response.ok) console.log('q tiste')
      return response.json()
  }).then(data => {
    setCategories(data)
  })
  }

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
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parsear la respuesta JSON
    })
    .then(data => {
      console.log(data); // Manejar los datos
      getCategories();
      setName('');

    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  const columns = [
    { uid: 'id', nombre: 'Id', sortable: false },
    { uid: 'nombre', nombre: 'Nombre', sortable: true },
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
          <Input variant='underlined'  value={name} onChange={e =>{setName(e.target.value)}} isRequired type="text" label="Nombre" size='sm' className=''/>
          <Button color='primary' type='submit' className="border my-auto " >Agregar</Button>
        </form>
      </div>
      <div className="w-[50%]">
        <GenericTable  columns={columns} data={categories}/>
      </div>
    </div>
    </>
  )
}
