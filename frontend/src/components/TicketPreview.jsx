import React from "react";
import { Button } from "@nextui-org/button";
import { IoIosPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { Badge } from "@nextui-org/react";
export default function TicketPreview({
  total,
  handleProcesar,
  handleCancelarSale,
  handlePauseCar,
  handleCarritoAdd
}) {
  const [cambio, setCambio] = React.useState("");

  let data = localStorage.getItem("carts");
  if (data) {
    data = JSON.parse(data);
  }
  const handleEliminarItem = (id) => {
    // Obtener la lista actual de items desde el localStorage
    let storedData = JSON.parse(localStorage.getItem("carts")) || [];
  
    // Filtrar para eliminar el ítem correspondiente al id
    const updatedData = storedData.filter(item => item.id !== id);
  
    // Actualizar el localStorage con la nueva lista sin el ítem eliminado
    localStorage.setItem("carts", JSON.stringify(updatedData));
  
  };

  return (
    <div className="rounded-lg border-2 border-slate-500/20 bg-white p-5 flex flex-col gap-2">
      <div className="flex gap-10 justify-start">
        <div className="flex flex-col gap-4">
          <span>
            <strong>Subtotal:</strong>
          </span>
          <span>
            <strong>Descuento:</strong>
          </span>
          <span>
            <strong>Impuesto:</strong>
          </span>
          <span>
            <strong>Pago con:</strong>
          </span>
          <span>
            <strong>Total:</strong>
          </span>
          <span>
            <strong>Cambio:</strong>
          </span>
        </div>
        <div className="flex-col flex gap-4">
          {/* <div className='w-full flex justify-between bg-red-500'> */}
          <span>${(!isNaN(total) ? total : 0) || 0}</span>

          {/* </div> */}
          <span>$0</span>
          <span>$0</span>
          <span>
            <input
              className="border w-full max-w-[70%] px-1"
              value={cambio}
              onChange={(e) =>
                setCambio(e.target.value.replace(/[^0-9.]/g, ""))
              }
              type="text"
            />
            {/* <Input classNames="p-0 m-0" isRequired size='sm' variant='underlined' value={cambio} onChange={e => setCambio(e.target.value.replace(/[^0-9.]/g, ''))} type="text" className='max-w-[70%]'/> */}
          </span>
          <span>
            <strong>${(!isNaN(total) ? total : 0) || 0}</strong>
          </span>
          <span>
            <strong>${!cambio ? "0" : (cambio - total).toFixed(2)}</strong>
          </span>
        </div>
        <div className="flex flex-col ">
          <Button
            onClick={() => handlePauseCar()}
            variant="flat"
            color="s"
            isIconOnly
            className="text-blue-700 mx-auto"
          >
            <IoIosPause size={20} />
          </Button>
          {data.map((date, key) => (
            <Button
              variant="flat"
              key={key}
              color="s"
              isIconOnly
              className="text-warning mx-auto"
              onClick={() => {
                handleCarritoAdd(date.id, date.cantidad, date.nombre, date.precioVenta, date.unidad);
                handleEliminarItem(date.id);
              }}
            >
              <Badge
                size="sm"
                color="warning"
                className="text-white"
                content={key == 0? 1: 2}
              >
                <PiShoppingCartSimpleFill size={20} />
              </Badge>
            </Button>
          ))}
          {/* <Button
            variant="flat"
            color="s"
            isIconOnly
            className="text-warning mx-auto"
          >
            <Badge size="sm" color="warning" className="text-white" content="1">
              <PiShoppingCartSimpleFill size={20} />
            </Badge>
          </Button> */}
        </div>
      </div>

      <Button
        className="font-bold "
        onPress={() => {
          handleProcesar();
          setCambio("");
        }}
        variant="flat"
        radius="sm"
        color="success"
      >
        Procesar
      </Button>
      <Button
        isDisabled={!total}
        onPress={() => {
          handleCancelarSale();
          setCambio(``);
        }}
        className="font-bold"
        radius="sm"
        variant="flat"
        color="danger"
      >
        Cancelar
      </Button>
    </div>
  );
}
