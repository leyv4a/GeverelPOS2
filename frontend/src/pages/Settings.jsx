import React from "react";
import { ToastContainer } from "react-toastify";
import { IoSettings } from "react-icons/io5";
import {Listbox, ListboxItem, cn} from "@nextui-org/react";
import { GiFruitBowl } from "react-icons/gi";
import { RiUserSearchFill } from "react-icons/ri";
import { MdSettingsInputHdmi } from "react-icons/md";
import { GrShift } from "react-icons/gr";
import { IoPrint } from "react-icons/io5";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LinkBar from "../components/NaviBar";
export default function Settings() {

  // const [item, setItem] = React.useState(0);

  // //  const renderComponent = {
  // //   1: <Productos />,
  // //   2: <Usuarios />,
  // //   3: <Turnos />
  // // };

const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

const location = useLocation();

const items = [
  {
    to: 'productos',
    name: 'Gestor de productos',
    desc: 'Administra los productos de la tienda',
    icon : <GiFruitBowl className={iconClasses} />,
    isActive: location.pathname.startsWith('/settings/productos')
  },
  {
    to: 'usuarios',
    name: 'Gestor de usuarios',
    desc: 'Gestiona los usuarios del sistema',
    icon: <RiUserSearchFill className={iconClasses} />,
    isActive: location.pathname.startsWith('/settings/usuarios')
  },
  {
    to: 'turnos',
    name: 'Gestor de turnos',
    desc: 'Administra los turnos del personal',
    icon: <GrShift className={iconClasses} />,
    isActive: location.pathname.startsWith('/settings/turnos')
  }
]

  return (
    <>
      <div className=" w-full min-h-screen h-screen my-auto flex flex-col items-start justify-start ">
        {/* <LinkItem items={items}/> */}
        <LinkBar items={items}/>
        <div className="h-full w-full flex">
          {/* <Sidebar /> */}
          <Routes>
          <Route path="/" element={<Navigate to="productos" replace />} />
            <Route path="productos" element={<Productos/>}/>
            <Route path="usuarios" element={<Usuarios/>}/>
            <Route path="turnos" element={<Turnos/>}/>
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose="2000"
        bodyClassName={() => "text-foreground"}
        draggable
      />
    </>
  );
}

function Sidebar() {



  return <div className="w-[15%] border-e border-[#dbdbdb] h-full">
      <Listbox className="" variant="flat">
        <ListboxItem
          href="#/settings/productos"
          description="Administra los productos de la tienda"
          startContent={<GiFruitBowl className={iconClasses} />}
        >
          Gestor de productos
        </ListboxItem>
        <ListboxItem
         href="#/settings/usuarios"
          description="Gestiona los usuarios del sistema"
          startContent={<RiUserSearchFill className={iconClasses} />}
        >
          Gestor de usuarios
        </ListboxItem>
        <ListboxItem
         href="#/settings/turnos"
          description="Administra los turnos del personal"
          startContent={<GrShift className={iconClasses} />}
        >
          Gestor de turnos
        </ListboxItem>
        <ListboxItem
          key="hardware"
          showDivider
          description="Configura el hardware externo"
          startContent={<IoPrint className={iconClasses} />}
        >
          Gestor de hardware
        </ListboxItem>
        <ListboxItem
          key="delete"
          className="text-danger"
          color="danger"
          description="Permanently delete the file"
          startContent={<MdSettingsInputHdmi className={cn(iconClasses, "text-danger")} />}
        >
          Delete file
        </ListboxItem>
      </Listbox>
  </div>;
}



function Productos(){
  return (
    <div className="w-full h-full bg-red-100 flex">
      <div className="flex gap-2">
        asd
      </div>
    </div>
  )
}

function Usuarios(){
  return (
    <div className="w-full h-full bg-blue-100">
    Usuarios
    </div>
  )
}

function Turnos(){
  return (
    <div className="w-full h-full bg-green-100">
    Turnos
    </div>
  )
}
