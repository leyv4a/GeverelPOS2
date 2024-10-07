import {useRef} from 'react'
import Sidebar, { SidebarItem } from './Sidebar';
import { IoStorefront,IoStatsChart } from "react-icons/io5";
import { FaWarehouse, FaWallet } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { useLocation } from 'react-router-dom';
export default function CompleteSidebar () {

    const tiendaRef = useRef(null);
    const panelRef = useRef(null);
    const inventarioRef = useRef(null);
    const monederoRef = useRef(null);
    const settingsRef = useRef(null);


  const location = useLocation();

  return (
    <>
    <Sidebar >
    <div className='grid grid-cols-1 h-full content-between' >
      <div>
        <SidebarItem active={location.pathname == '/tienda'} text={"Tienda"} icon={<IoStorefront size={23}/>} buttonRef={tiendaRef} functionKey={'F1'} to={'/tienda'} />  
        <SidebarItem active={location.pathname == '/panel'} text={"Panel"} icon={<IoStatsChart size={23}/>} buttonRef={panelRef} functionKey={'F2'} to={'/panel'}/>  
        <SidebarItem active={location.pathname.startsWith('/inventario')} text={"Inventario"} icon={<FaWarehouse size={23}/>} buttonRef={inventarioRef} functionKey={'F3'} to={'/inventario'}/>  
        <SidebarItem active={location.pathname.startsWith('/monedero')} text={"Monedero"} icon={<FaWallet size={23}/>} buttonRef={monederoRef} functionKey={'F4'} to={'/monedero'} />  
      </div>
      <SidebarItem active={location.pathname == '/settings'} text={"Configuracion"} icon={<IoIosSettings size={23}/>} buttonRef={settingsRef} functionKey={'F5'} to={"/settings"} />
    </div>
    </Sidebar>
    </>
  )
}
