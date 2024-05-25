import React, {Suspense, lazy, useState} from 'react'
import NavigationBar from '../components/NavigationBar';
import Loader from '../components/Loader';
const AgregarProducto = lazy(() => import('../inventario/AgregarProductos'));
const AgregarCategoria = lazy(() => import('../inventario/AgregarCategorias'));
const RegistrarEntrada = lazy(() => import('../inventario/RegistrarEntrada'));
const RegistrarSalida = lazy(() => import('../inventario/RegistrarSalida'));


export default function Inventario() {
  const [section, setSection] = useState('agregarProducto')

  const handleSectionChange = (e)=> {
    setSection(e);
  }

  const items = [
    {
      name: 'Agregar Producto',
      section: 'agregarProducto'
    },
    {
      name: 'Agregar Categoria',
      section: 'agregarCategoria'
    },
    {
      name: 'Registrar Entrada',
      section:'registrarEntrada'
    },
    {
      name: 'Registrar Salida',
      section:'registrarSalida'
    }

  ]

  const sectionMapping = {
    agregarProducto: <AgregarProducto/>,
    agregarCategoria: <AgregarCategoria/>,
    registrarEntrada: <RegistrarEntrada/>,
    registrarSalida: <RegistrarSalida/>
  }
  return (
    <div className='w-full h-full'>
      <NavigationBar items={items} onSectionChange={handleSectionChange} currentSection={section}/>
      <div className='my-auto'>
      <Suspense fallback={<Loader/>}>
      {
        sectionMapping[section]
      }
      </Suspense>
      </div>
    </div>
  )
}
