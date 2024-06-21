import React, {useState} from 'react'
import NavigationBar from '../components/NavigationBar';
 import AgregarProductos from '../inventario/AgregarProductos';
 import AgregarCategorias from '../inventario/AgregarCategorias';
 import RegistrarEntrada from '../inventario/RegistrarEntrada';
 import RegistrarSalida from '../inventario/RegistrarSalida';

import { Route, Routes, Navigate } from 'react-router-dom';


export default function Inventario() {

  const [section, setSection] = useState('agregarProducto');

  const handleSectionChange = (section) => {
    setSection(section);
  };

  const items = [
    {
      name: 'Productos',
      section: 'agregarProducto'
    },
    {
      name: 'Categorias',
      section: 'agregarCategoria'
    },
    {
      name: 'Entradas',
      section:'registrarEntrada'
    },
    {
      name: 'Salidas',
      section:'registrarSalida'
    }

  ]

  
  return (
    <div className='w-full h-screen bg-slate-100'>
      <NavigationBar items={items} currentSection={section} onSectionChange={handleSectionChange} />
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
