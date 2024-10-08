import React from 'react'
import Entradas from '../monedero/Entradas'
import Salidas from '../monedero/Salidas'
import { FaPlusCircle , FaMinusCircle } from "react-icons/fa";
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LinkBar from '../components/NaviBar';

export default function Monedero() {

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const location = useLocation();
  const items = [
    {
      icon: <FaPlusCircle className={iconClasses}/>,
      desc: 'Registra ingresos',
      name: 'Ingresos',
      to: 'agregarEntrada',
      isActive : location.pathname.startsWith('/monedero/agregarEntrada')

    },
    {
      icon: <FaMinusCircle className={iconClasses}/>,
      desc: 'Registra egresos',
      name: 'Egresos',
      to: 'agregarSalida',
      isActive : location.pathname.startsWith('/monedero/agregarSalida')
    }
  ]
  return (
      <div className='w-full h-screen'>
      <LinkBar items={items}/>
        <Routes>
          <Route path="/" element={<Navigate to="agregarEntrada" replace />} />
          <Route path="agregarEntrada" element={<Entradas/>} />
          <Route path="agregarSalida" element={<Salidas/>} />
        </Routes>
    </div>
  )
}
