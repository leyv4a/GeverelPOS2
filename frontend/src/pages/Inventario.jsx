
import React from 'react';
// Lazy loading de los componentes
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { BiSolidCategory } from "react-icons/bi";
import { FaTag } from "react-icons/fa6";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import { RiInboxArchiveFill } from "react-icons/ri";
import LinkBar from '../components/NaviBar';
import AgregarProductos from '../inventario/AgregarProductos';
import AgregarCategorias from '../inventario/AgregarCategorias';
import RegistrarEntrada from '../inventario/RegistrarEntrada';
import RegistrarSalida from '../inventario/RegistrarSalida';

export default function Inventario() {

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const location = useLocation();

  const items = [
    {
      icon: <FaTag className={iconClasses}/>,
     
      desc: 'Administra tus productos',
      name: 'Productos',
      to: 'agregarProducto',
      isActive: location.pathname.startsWith('/inventario/agregarProducto')
    },
    {
      icon: <BiSolidCategory className={iconClasses}/>,
      name: 'Categorias',
      desc: "Administra tus categorias",
      to: 'agregarCategoria',
      isActive: location.pathname.startsWith('/inventario/agregarCategoria')
    },
    {
      icon: <RiInboxArchiveFill className={iconClasses}/>,
      name: 'Entradas',
      desc: "Registra tus entradas",
      to:'registrarEntrada',
      isActive: location.pathname.startsWith('/inventario/registrarEntrada')
    },
    {
      icon: <RiInboxUnarchiveFill className={iconClasses}/>,
      name: 'Salidas',
      desc : "Registra tus salidas", 
      to:'registrarSalida',
      isActive: location.pathname.startsWith('/inventario/registrarSalida')
    }

  ]
  
  return (
    <div className='w-full h-screen'>
      <LinkBar items={items}/>
        <Routes>
          <Route path="/" element={<Navigate to="agregarProducto" replace />} />
          <Route path="agregarProducto" element={<AgregarProductos />} />
          <Route path="agregarCategoria" element={<AgregarCategorias />} />
          <Route path="registrarEntrada" element={<RegistrarEntrada />} />
          <Route path="registrarSalida" element={<RegistrarSalida />} />
        </Routes>
    </div>
  )
}
