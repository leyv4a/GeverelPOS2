import React, {useState} from 'react'
import NavigationBar from '../components/NavigationBar';
import Entradas from '../monedero/Entradas'
import Salidas from '../monedero/Salidas'

import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

export default function Monedero() {


  const location = useLocation();
  const items = [
    {
      name: 'Ingresos',
      section: 'agregarEntrada',
      isActive : location.pathname.startsWith('/monedero/agregarEntrada')

    },
    {
      name: 'Egresos',
      section: 'agregarSalida',
      isActive : location.pathname.startsWith('/monedero/agregarSalida')
    }
  ]
  return (
      <div className='w-full h-screen'>
      <NavigationBar items={items}   />
        <Routes>
          <Route path="/" element={<Navigate to="agregarEntrada" replace />} />
          <Route path="agregarEntrada" element={<Entradas/>} />
          <Route path="agregarSalida" element={<Salidas/>} />
        </Routes>
    </div>
  )
}
