import { useContext, createContext, useState, useEffect } from "react"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { FiMoreVertical } from "react-icons/fi";
import { Link as LinkRouter } from 'react-router-dom';
import {Avatar} from "@nextui-org/react";
import { FaUser } from "react-icons/fa";

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <aside className="h-screen ">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            // src="https://img.logoipsum.com/243.svg" 
            src={'TheGevpoint.svg'}
            // src={path.join(__dirname, '/static/TheGevpoint.svg')}
            className={`overflow-hidden transition-all ${
              expanded ? "w-40" : "w-0"
            }`}
            
            alt="gevpoint"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* USUARIO */}
        <div className="border-t flex justify-between p-3">
          {/* <img
            src="https://ui-avatars.com/api/?name=Gabriel+Leyva&background=c13ffe&color=ffffff&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          /> */}
            <Avatar name="Gabriel" radius="md" className="bg-[#c13ffe] text-white" fallback={<FaUser size={20}/>}/>
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Gabriel Leyva</h4>
              <span className="text-xs text-gray-600">gleyvaesquivel@gmail.com</span>
            </div>
          </div>
            
            <UserSettings/>
        </div>
      </nav>
    </aside> 
  )
}

export function SidebarItem({ icon, text, active, alert, buttonRef, functionKey, to }) {
  const { expanded } = useContext(SidebarContext)

  const handleKeyDown = (event) => {
    if (event.key === functionKey ) {
      event.preventDefault(); // Previene la acción por defecto del F1
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
    document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <LinkRouter ref={buttonRef} to={to}
      className={`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${
        active
        ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
        : "hover:bg-foreground hover:text-background text-gray-600"
      }
      `}
      tabIndex="-1"
      >
      <small className="me-1 text-[10px]">{functionKey}</small>{icon}
      <span
        className={`overflow-hidden transition-all text-start ${
          expanded ? "w-52 ml-3 font-semibold" : "w-0"
        }`}
        >
        {text}
      </span>
      {alert && (
        <div
        className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
          expanded ? "" : "top-2"
        }`}
        />
      )}

      {!expanded && (
        <div
        className={`
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-foreground text-background text-sm
        invisible opacity-0 transition-all duration-200
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        style={{ zIndex: 10 }}
        >
          {text}
        </div>
        
      )}
    </LinkRouter>
  )
}

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

 function UserSettings() {

  const [shift, setShift] = useState(false);

  const startShift = () => {
    localStorage.setItem("shift", true);
    setShift(true);
  }

  const finishShift = () => {
    localStorage.setItem("shift", false);
    setShift(false);
  }

  useEffect(()=>{
    let preshift = localStorage.getItem("shift");
    if(preshift == 'true'){
      setShift(true);
    }
    localStorage.removeItem("session");
  },[])

  return (
    <Dropdown className="rounded-md mb-3 ms-3">
      <DropdownTrigger>
        <Button 
          variant="borderedasad" 
          size="sm"
          className="my-auto"
          isIconOnly
          disableRipple
        >
         <FiMoreVertical className="my-auto cursor-pointer"  />
        </Button>
      </DropdownTrigger>
      <DropdownMenu  aria-label="Static Actions">
        <DropdownItem key="new">Perfil</DropdownItem>
        {/* {
          session ? 
          <DropdownItem onClick={finishSession} key="copy">Cerrar turno</DropdownItem> :
          <DropdownItem onClick={startSession} key="copy">Iniciar turno</DropdownItem>
        } */}
        <DropdownItem onClick={shift ? finishShift : startShift} key="shift">{shift ? "Cerrar turno" : "Iniciar turno"}</DropdownItem>
        <DropdownItem key="session" className="text-danger" color="danger">
          Cerrar Sesion
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}