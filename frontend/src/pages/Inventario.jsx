import React, {useState, Suspense, lazy} from 'react'
import NavigationBar from '../components/NavigationBar';
// import Loader from '../components/Loader';
import AgregarCategorias from '../inventario/AgregarCategorias';
import AgregarProductos from '../inventario/AgregarProductos';
import RegistrarEntrada from '../inventario/RegistrarEntrada';
import RegistrarSalida from '../inventario/RegistrarSalida';
// const AgregarProductos = lazy(() => import('../inventario/AgregarProductos'));
// const AgregarCategorias = lazy(() => import('../inventario/AgregarCategorias'));
// const RegistrarEntrada = lazy(() => import('../inventario/RegistrarEntrada'));
// const RegistrarSalida = lazy(() => import('../inventario/RegistrarSalida'));


export default function Inventario() {
  const [section, setSection] = useState('')

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
    agregarProducto: <AgregarProductos/>,
    agregarCategoria: <AgregarCategorias/>,
    registrarEntrada: <RegistrarEntrada/>,
    registrarSalida: <RegistrarSalida/>
  }
  return (
    <div className='w-full h-full'>
      <NavigationBar items={items} onSectionChange={handleSectionChange} currentSection={section}/>
      <Suspense fallback={<p>..</p>}>
      {
        sectionMapping[section]
      }
      </Suspense>
    </div>
  )
}
