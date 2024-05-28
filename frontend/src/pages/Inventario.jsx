import React, {useState} from 'react'
import NavigationBar from '../components/NavigationBar';
 import AgregarProductos from '../inventario/AgregarProductos';
 import AgregarCategorias from '../inventario/AgregarCategorias';
 import RegistrarEntrada from '../inventario/RegistrarEntrada';
 import RegistrarSalida from '../inventario/RegistrarSalida';

import { Route, Routes, Navigate } from 'react-router-dom';


export default function Inventario() {

  const [section, setSection] = useState('');

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
