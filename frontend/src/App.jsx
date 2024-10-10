
import {Suspense, lazy} from 'react';
import CompleteSidebar from './components/CompleteSidebar';
import {HashRouter, Route, Routes} from 'react-router-dom';
import { ToastContainer} from "react-toastify";


const Tienda = lazy(() => import('./pages/Tienda'));
const Panel = lazy(()=> import('./pages/Panel'));
const Inventario = lazy(()=> import('./pages/Inventario'));
const Monedero = lazy(()=> import('./pages/Monedero'));
const Settings = lazy(()=> import('./pages/Settings'));
const Login = lazy(()=> import('./components/Login'));
const ShiftPdf = lazy(()=> import('./components/ShiftPdf'));

import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <>
   <HashRouter>
     <main className='flex max-w-screen max-h-screen overflow-hidden'>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<Login/>}/>
          {/* 3 */}
          <Route path="/tienda" element={<ProtectedRoute type={3}><Tienda/></ProtectedRoute>}/>
          <Route path="/panel" element={<ProtectedRoute type={2}><Panel/></ProtectedRoute>}/>
          <Route  path="/inventario/*" element={<ProtectedRoute type={3}><Inventario/></ProtectedRoute>}/>
          <Route path="/monedero/*" element={<ProtectedRoute type={2}><Monedero/></ProtectedRoute>}/>
          <Route path="/settings/*" element={<ProtectedRoute type={1}><Settings/></ProtectedRoute>}/>
          <Route path="/shift" element={<><CompleteSidebar /><ShiftPdf/></>}/>
        </Routes>
      </Suspense>
      <ToastContainer
          position="bottom-right"
          autoClose="2000"
          bodyClassName={() => "text-foreground"}
          draggable
        />
     </main>
   </HashRouter>
    </>
  )
}

export default App
