import React from "react";
import { ToastContainer } from "react-toastify";
import { RiUserSearchFill } from "react-icons/ri";
import { PiMoneyWavyFill } from "react-icons/pi";
import { GrShift } from "react-icons/gr";
import { IoPrint } from "react-icons/io5";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LinkBar from "../components/NaviBar";
import Productos from "../settings/Productos";
import Usuarios from "../settings/Usuarios";
export default function Settings() {

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const location = useLocation();

  const items = [
    {
      to: "productos",
      name: "Gestor de precios",
      desc: "Administra los precios de la tienda",
      icon: <PiMoneyWavyFill className={iconClasses} />,
      isActive: location.pathname.startsWith("/settings/productos"),
    },
    {
      to: "usuarios",
      name: "Gestor de usuarios",
      desc: "Gestiona los usuarios del sistema",
      icon: <RiUserSearchFill className={iconClasses} />,
      isActive: location.pathname.startsWith("/settings/usuarios"),
    },
    {
      to: "turnos",
      name: "Gestor de turnos",
      desc: "Administra los turnos del personal",
      icon: <GrShift className={iconClasses} />,
      isActive: location.pathname.startsWith("/settings/turnos"),
    },
  ];

  return (
    <>
      <div className=" w-full min-h-screen h-screen my-auto flex flex-col items-start justify-start ">
        <LinkBar items={items} />
        <div className="h-full w-full flex">
          <Routes>
            <Route path="/" element={<Navigate to="productos" replace />} />
            <Route path="productos" element={<Productos />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="turnos" element={<Turnos />} />
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


function Turnos() {
  return <div className="w-full h-full"></div>;
}
