import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { IoSettings } from "react-icons/io5";
import { Button, Listbox, ListboxItem, cn } from "@nextui-org/react";
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

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const location = useLocation();

  const items = [
    {
      to: "productos",
      name: "Gestor de productos",
      desc: "Administra los productos de la tienda",
      icon: <GiFruitBowl className={iconClasses} />,
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
        {/* <LinkItem items={items}/> */}
        <LinkBar items={items} />
        <div className="h-full w-full flex">
          {/* <Sidebar /> */}
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

function Sidebar() {
  return (
    <div className="w-[15%] border-e border-[#dbdbdb] h-full">
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
          startContent={
            <MdSettingsInputHdmi className={cn(iconClasses, "text-danger")} />
          }
        >
          Delete file
        </ListboxItem>
      </Listbox>
    </div>
  );
}

function Productos() {
  const items = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    nombre: `Producto ${i + 1}`,
    stockMin: Math.floor(Math.random() * 100),
    stockActual: Math.floor(Math.random() * 200),
  }));

  const [products, setProducts] = React.useState([]);
  const [newPrices, setNewPrices] = React.useState({});
  const  getProducts =  async () => {
     const response = await fetch('http://localhost:3001/api/prices',{
       method: 'GET',
       mode: 'cors',
       headers: {
         'Content-Type': 'application/json'
       }
     }).then(response => response.json());
     setProducts(response);
    }

    const handlePriceChange = (id, value) => {
      // Actualiza el estado con el nuevo precio
      setNewPrices(prev => ({ ...prev, [id]: value }));
    };

    const handleSaveChanges = async () => {
      // Filtra los productos cuyos precios fueron modificados
      const updatedProducts = products.filter(product => {
        return newPrices[product.id] !== undefined && newPrices[product.id] !== "";
      }).map(product => ({
        ...product,
        nuevoPrecio: newPrices[product.id], // Agrega el nuevo precio
      }));
  
      const response = await fetch('http://localhost:3001/api/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ list: updatedProducts })    
      }).then(response => response.json());
      if(!response.success){
        toast.error(response.error);
        return;
      }
      toast.success('Lista de precios actualizada');
      setNewPrices({});
      getProducts();
    };
    React.useEffect(()=>{
      getProducts()
    },[])

  return (
    <div className="w-full h-full flex">
      <div className="flex flex-col gap-2 p-2 w-[40rem] m-2 rounded-lg border ">
        <h2 className="font-bold text-center text-lg sticky py-2 top-0 bg-white">
          Precios
        </h2>
        <div className="h-[80%] overflow-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 ">
          <table className="min-w-full ">
            <thead className="bg-[#f4f4f5] m-2 border-b border-[#dbdbdb] sticky top-0 ">
              <tr className="text-center ">
                <th className="py-3">Producto</th>
                <th>Precio(Compra)</th>
                <th>Precio(Venta)</th>
                <th>Nuevo Precio</th>
                {/* <th>Ok</th> */}
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr
                  key={item.id}
                  className="text-center border-b border-[#dbdbdb]"
                >
                  <td className="my-2 capitalize">{item.nombre}</td>
                  <td className="my-2">{item.precioCompra ? '$'+ item.precioCompra : 'Sin Datos'}</td>
                  <td className="my-2">{item.precioVenta? '$'+ item.precioVenta  : 'Sin Datos'}</td>
                  <td>
                    <input
                    value={newPrices[item.id] || ""}
                    onChange={(e)=> handlePriceChange(item.id, e.target.value)}
                      type="text"
                      className="my-2 border border-[#dbdbdb] max-w-[50px] rounded-md px-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-center bg-white  inset-x-0 bottom-0">
          <Button onClick={()=> handleSaveChanges()} color="success" radius="sm" className="text-white font-bold">Guardar cambios</Button>

        </div>
      </div>
   
    </div>
  );
}

function Usuarios() {
  return <div className="w-full h-full "></div>;
}

function Turnos() {
  return <div className="w-full h-full"></div>;
}
