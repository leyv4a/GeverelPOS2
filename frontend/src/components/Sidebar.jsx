import React, { useContext, createContext, useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import { FiMoreVertical } from "react-icons/fi";
import { Link, Link as LinkRouter, useNavigate } from "react-router-dom";
import { Avatar, Input } from "@nextui-org/react";
import { FaUser } from "react-icons/fa";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = () => {
    setExpanded(!expanded);
    localStorage.setItem('sidebar', !expanded);
  }

  useEffect(()=> {
    if (localStorage.getItem('sidebar') == 'true') {
      setExpanded(true);
    }
  },[])


  return (
    <aside className="h-screen ">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            // src="https://img.logoipsum.com/243.svg"
            src={"TheGevpoint.svg"}
            // src={path.join(__dirname, '/static/TheGevpoint.svg')}
            className={`overflow-hidden transition-all ${
              expanded ? "w-40" : "w-0"
            }`}
            alt="gevpoint"
          />
          <button
            onClick={() => handleExpanded()}
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
          <Avatar
            name="Gabriel"
            radius="md"
            className="bg-[#c13ffe] text-white"
            fallback={<FaUser size={20} />}
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Gabriel Leyva</h4>
              <span className="text-xs text-gray-600">
                gleyvaesquivel@gmail.com
              </span>
            </div>
          </div>

          <UserSettings />
        </div>
      </nav>
    </aside>
  );
}
export function SidebarItem({
  icon,
  text,
  active,
  alert,
  buttonRef,
  functionKey,
  to,
}) {
  const { expanded } = useContext(SidebarContext);

  const handleKeyDown = (event) => {
    if (event.key === functionKey) {
      event.preventDefault(); // Previene la acción por defecto del F1
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <LinkRouter
      ref={buttonRef}
      to={to}
      className={`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${
        active
          ? "bg-foreground text-background"
          : "hover:bg-foreground hover:text-background text-foreground"
      }
      `}
      tabIndex="-1"
    >
      <small className="me-1 text-[10px]">{functionKey}</small>
      {icon}
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
  );
}

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";

function UserSettings() {
  const [shift, setShift] = useState(false);
  // const [data, setData] = useState();
  const [shiftIsEnded, setShiftIsEnded] = React.useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();

  const logout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('type');
    navigate('/');
  }

  const handleSetShift = (value) => {
    setShift(value);
  }

  const startShift = async () => {
    let dat = getDate();
    try {
      localStorage.setItem("shift", true);
      setShift(true);
      setShiftIsEnded(false);
      const response = await fetch("http://localhost:3001/api/shift/start", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId: 1, inicio: dat }),
      }).then((response) => response.json());
      if (!response.success) {
        throw new Error(response.error || response.message);
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShiftEnd =async (dat, fondo) => {
    try {
       const response = await fetch("http://localhost:3001/api/shift/end", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuarioId: 1, cierre: dat, fondo }),
      }).then((response) => response.json());
      console.log(response)
      return response;
    } catch (error) {
      toast.error(error.message);
    }
  }

  const finishShift = async () => {
    try {
      onOpen();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getDate = () => {
    const datetest = new Date();
    const formattedDate =
      datetest.getFullYear() +
      "-" +
      String(datetest.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(datetest.getDate()).padStart(2, "0") +
      " " +
      String(datetest.getHours()).padStart(2, "0") +
      ":" +
      String(datetest.getMinutes()).padStart(2, "0") +
      ":" +
      String(datetest.getSeconds()).padStart(2, "0");
    return formattedDate;
  };
  useEffect(() => {
    let preshift = localStorage.getItem("shift");
    if (preshift == "true") {
      setShift(true);
    }
  }, []);
  return (
    <>
      <Dropdown className="rounded-md mb-3 ms-3">
        <DropdownTrigger>
          <Button
            variant="borderedasad"
            size="sm"
            className="my-auto"
            isIconOnly
            disableRipple
          >
            <FiMoreVertical className="my-auto cursor-pointer" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="profile">
            Perfil
          </DropdownItem>

          <DropdownItem onClick={shift ? finishShift : startShift} key="shift">
            {shift ? "Cerrar turno" : "Iniciar turno"}
          </DropdownItem>
          <DropdownItem onClick={logout} key="session" className="text-danger" color="danger">
            Cerrar Sesion
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <CloseShiftModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleShiftEnd={handleShiftEnd}
        getDate={getDate}
        setShift={handleSetShift}
        setShiftisEnded={setShiftIsEnded}
        shiftIsEnded={shiftIsEnded}
      />
    </>
  );
}

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { FaCheckDouble } from "react-icons/fa";

function CloseShiftModal({ isOpen, onOpenChange, handleShiftEnd, getDate, setShift, setShiftisEnded , shiftIsEnded}) {
  const navigate = useNavigate();
  const [fondo, setFondo] = React.useState('');
  const [data, setData] = React.useState([]);

  const handleSetFondo = async (e) => {
    e.preventDefault();
    try {
      
       let dat = getDate();
       const response = await handleShiftEnd(dat, fondo);
       if (!response.success) {
         throw new Error(response.error || response.message);
       }
       toast.success(response.message);
       localStorage.setItem("shift", false);
       setShift(false);
       setFondo(''); 
       console.log(response)
       setData(response)
       setShiftisEnded(true);
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleClick = () => {
    navigate("/shift", { state: { data: data } });
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row items-center gap-5">
                <FaCheckDouble className="text-slate-700" size={30} />
                {shiftIsEnded ? `Turno finalizado...` : `Finalizar turno`}
              </ModalHeader>
              <ModalBody className="flex flex-row ">
                <Input
                isDisabled={shiftIsEnded}
                  value={fondo}
                  onChange={(e)=>{setFondo(e.target.value)}}
                  type="text"
                  variant="borderer"
                  size="sm"
                  label="Fondo de caja"
                  className="w-[90%]"
                />
                <Button
                isDisabled={shiftIsEnded}
                onClick={(e)=>{handleSetFondo(e)}}
                  size="lg"
                  radius="sm"
                  variant="light"
                  className="w-[10%] "
                >
                  <MdOutlineAttachMoney />
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={!shiftIsEnded}
                  onClick={() => handleClick()}
                  className="rounded-md font-bold text-white bg-gray-800 hover:bg-gray-900"
                  variant="solid"
                  startContent={<IoMdDownload size={20} />}
                >
                  Descargar PDF
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
