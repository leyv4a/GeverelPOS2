import {useState} from 'react'
import NavigationBar from '../components/NavigationBar';
 import AgregarProductos from '../inventario/AgregarProductos';
 import AgregarCategorias from '../inventario/AgregarCategorias';
 import RegistrarEntrada from '../inventario/RegistrarEntrada';
 import RegistrarSalida from '../inventario/RegistrarSalida';

import { Route, Routes, Navigate, useLocation } from 'react-router-dom';


export default function Inventario() {


  const location = useLocation();

  const items = [
    {
      name: 'Productos',
      section: 'agregarProducto',
      isActive: location.pathname.startsWith('/inventario/agregarProducto')
    },
    {
      name: 'Categorias',
      section: 'agregarCategoria',
      isActive: location.pathname.startsWith('/inventario/agregarCategoria')
    },
    {
      name: 'Entradas',
      section:'registrarEntrada',
      isActive: location.pathname.startsWith('/inventario/registrarEntrada')
    },
    {
      name: 'Salidas',
      section:'registrarSalida',
      isActive: location.pathname.startsWith('/inventario/registrarSalida')
    }

  ]

  
  return (
    <div className='w-full h-screen'>
      <NavigationBar items={items} />
        <Routes>
          <Route path="/" element={<Navigate to="agregarProducto" replace />} />
          <Route path="agregarProducto" element={<AgregarProductos/>} />
          <Route path="agregarCategoria" element={<AgregarCategorias />} />
          <Route path="registrarEntrada" element={<RegistrarEntrada />} />
          <Route path="registrarSalida" element={<RegistrarSalida />} />
        </Routes>
    </div>
  )
}
