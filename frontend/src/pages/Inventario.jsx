import React, {useState} from 'react'
import NavigationBar from '../components/NavigationBar';

const AgregarProductos = React.lazy(()=> import('../inventario/AgregarProductos'));
const RegistrarEntrada = React.lazy(() => import('../inventario/RegistrarEntrada'));
const AgregarCategorias = React.lazy(() => import('../inventario/AgregarCategorias'));
const RegistrarSalida = React.lazy(() => import('../inventario/RegistrarSalida'));

import Loader from '../components/Loader';
import { Route, Routes, Navigate } from 'react-router-dom';


export default function Inventario() {

  const [section, setSection] = useState('agregarProducto');

  const handleSectionChange = (section) => {
    setSection(section);
  };

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

  
  return (
    <div className='w-full h-full'>
      <NavigationBar items={items} currentSection={section} onSectionChange={handleSectionChange} />
      <React.Suspense fallback={<Loader/>}>
      <Routes>
         <Route path="/" element={<Navigate to="agregarProducto" replace />} />
          <Route path="agregarProducto" element={<AgregarProductos />} />
          <Route path="agregarCategoria" element={<AgregarCategorias />} />
          <Route path="registrarEntrada" element={<RegistrarEntrada />} />
          <Route path="registrarSalida" element={<RegistrarSalida />} />
        </Routes>
      </React.Suspense>
    </div>
  )
}
