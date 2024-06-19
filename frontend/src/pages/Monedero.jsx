import React, {useState} from 'react'
import NavigationBar from '../components/NavigationBar';
import Entradas from '../monedero/Entradas'
import Salidas from '../monedero/Salidas'

import { Route, Routes, Navigate } from 'react-router-dom';

export default function Monedero() {

  const [section, setSection] = useState('agregarEntrada');

  const handleSectionChange = (section) => {
    setSection(section);
  };
  const items = [
    {
      name: 'Entradas',
      section: 'agregarEntrada'
    },
    {
      name: 'Salidas',
      section: 'agregarSalida'
    }
  ]
  return (
      <div className='w-full h-full'>
      <NavigationBar items={items} currentSection={section} onSectionChange={handleSectionChange} />
        <Routes>
          <Route path="/" element={<Navigate to="agregarEntrada" replace />} />
          <Route path="agregarEntrada" element={<Entradas/>} />
          <Route path="agregarSalida" element={<Salidas/>} />
        </Routes>
    </div>
  )
}
