import React,{useRef} from 'react'
import Sidebar, { SidebarItem } from './Sidebar';
import { IoStorefront } from "react-icons/io5";
import { AiFillDashboard } from "react-icons/ai";
import { FaTag } from "react-icons/fa";
import { TbCoinFilled } from "react-icons/tb";
export default function () {

    const tiendaRef = useRef(null);
    const panelRef = useRef(null);
    const inventarioRef = useRef(null);
    const monederoRef = useRef(null);

  return (
    <>
    <Sidebar>
    <SidebarItem text={"Tienda"} icon={<IoStorefront size={23}/>} buttonRef={tiendaRef} functionKey ={'F1'} to={'/'} />  
    <SidebarItem text={"Panel"} icon={<AiFillDashboard size={25}/>} buttonRef={panelRef} functionKey ={'F2'} to={'/panel'}/>  
    <SidebarItem text={"Inventario"} icon={<FaTag size={23}/>} buttonRef={inventarioRef} functionKey ={'F3'} to={'/inventario'}/>  
    <SidebarItem text={"Monedero"} icon={<TbCoinFilled size={25}/>} buttonRef={monederoRef} functionKey ={'F4'} to={'/monedero'}/>  

    </Sidebar>
    </>
  )
}
