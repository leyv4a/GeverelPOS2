import React from "react";
import GenericTable from "../components/GenericTable";
import { ToastContainer, toast } from "react-toastify";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function Salidas() {
  const [fecha, setFecha] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [monto, setMonto] = React.useState("");

  const [data, setData] = React.useState([]);

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [isFullTable, setIsFullTable] = React.useState(false);

  const addEgreso = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/wallet`,{
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({tipo: 'egreso', fecha, descripcion, monto }),
      })
      if (!response.ok) throw new Error ('Error al registrar el egreso');
      getEgresos();
      resetFields();
      toast.success("Egreso registrado");
    } catch (error) {
      toast.error(error.message)
    }finally{
      setIsButtonLoading(false)
    }
  }

  const getEgresos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/wallet/egreso`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al cargar los egresos");
      const data = await response.json();
      setData(data);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const resetFields = () => {
    setFecha("");
    setDescripcion("");
    setMonto("");
  };

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  };

  const columns = [
    // { uid: 'id', nombre: 'Id', sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: "descripcion", nombre: "Descripcion", sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: "monto", nombre: "Cantidad", sortable: false },
    { uid: "fecha", nombre: "Fecha", sortable: true },
    // { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];

  React.useEffect(() => {
    getEgresos();
  }, []);
  React.useEffect(() => {
    const date = new Date();
    const formattedDate =
    date.getFullYear() +
    "/" +
    String(date.getMonth() + 1).padStart(2, '0') +
    "/" +
    String(date.getDate()).padStart(2, '0') +
    " " +
    String(date.getHours()).padStart(2, '0') +
    ":" +
    String(date.getMinutes()).padStart(2, '0') +
    ":" +
    String(date.getSeconds()).padStart(2, '0');

    setFecha(formattedDate);
    if (descripcion == "") {
      setFecha("");
    }
  }, [descripcion]);
  return (
    <div className="flex gap-6 max-h-[100%] p-5 sm:flex-row  flex-col">
      <div className={isFullTable ? "hidden" : "sm:w-[50%] w-[80%]"}>
        <form
          onSubmit={(e) => addEgreso(e)}
          className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4"
        >
          <h2 className="text-2xl text-center w-full">Registrar egresos</h2>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              isRequired
              type="text"
              label="Descripcion"
              size="sm"
              variant="underlined"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <Input
              size="sm"
              variant="underlined"
              isReadOnly
              disabled
              value={fecha}
              label="Fecha"
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input
              label={"Monto"}
              isRequired
              variant="underlined"
              size="sm"
              value={monto}
              onChange={(e) => setMonto(e.target.value.replace(/[^0-9.]/g, ""))}
              className="max-w-[50%]"
            />
          </div>
          <Button isLoading={isButtonLoading} size="md" color="primary" type="submit" disableRipple>
            Agregar
          </Button>
        </form>
      </div>
      <div className={isFullTable ? "w-[100%]" : "sm:w-[50%] w-[80%]"}>
        <GenericTable
          data={data}
          columns={columns}
          isFullTable={isFullTable}
          handleFullTable={handleFullTable}
        />
      </div>
      <div>
        <ToastContainer
          position="bottom-right"
          autoClose="2000"
          bodyClassName={() => "text-foreground"}
          draggable
        />
      </div>
    </div>
  );
}
