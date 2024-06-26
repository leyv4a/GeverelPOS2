
import React, {Suspense, lazy} from 'react';
import CompleteSidebar from './components/CompleteSidebar';
import {HashRouter, Route, Routes} from 'react-router-dom';

const Tienda = lazy(() => import('./pages/Tienda'));
const Panel = lazy(()=> import('./pages/Panel'));
const Inventario = lazy(()=> import('./pages/Inventario'));
const Monedero = lazy(()=> import('./pages/Monedero'));

import Loader from './components/Loader';
function App() {
  
  return (
    <>
   <HashRouter>
     <main className='flex max-w-screen max-h-screen overflow-hidden'>
      <CompleteSidebar/>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Tienda/>}/>
          <Route path="/panel" element={<Panel/>}/>
          <Route  path="/inventario/*" element={<Inventario/>}/>
          <Route path="/monedero/*" element={<Monedero/>}/>
        </Routes>
      </Suspense>
     </main>
   </HashRouter>
    </>
  )
}

export default App
