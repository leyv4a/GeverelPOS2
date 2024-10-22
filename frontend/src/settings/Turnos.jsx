import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  getKeyValue,
  Pagination,
} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import ShiftPdf from "../components/ShiftPdf";
import { useLocation, useNavigate } from "react-router-dom";

const columns = [
  { name: "Id", uid: "id" },
  { name: "Usuario", uid: "nombre" },
  { name: "Inicio", uid: "inicio" },
  { name: "Cierre", uid: "cierre" },
  { name: "Fondo", uid: "fondo" },
  { name: "Acciones", uid: "actions" },
];
export default function Turnos() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = JSON.parse(localStorage.getItem("user")).nombre;
  const [isDataLoaded, setIsDataLoaded] = React.useState(false);
  const handleClick = async (inicio, cierre) => {
    setIsDataLoaded(false);
    try {
      const data1 = await fetch("http://localhost:3001/api/shift/data", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inicio, cierre }),
      }).then((data) => data.json());
      const updatedResponse = {
        ...data1, // Copia los datos actuales del response
        userName: userName, // Agrega el nombre del usuario (verifica que el usuario esté definido)
      };
      setData(updatedResponse);
      setIsDataLoaded(true);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  //   const handleClick = async (inicio, cierre) => {
  //     await fetchData(inicio, cierre);
  //     // if (isDataLoaded) {
  //     //   navigate(location.pathname, { state: { data: data } });
  //     // }
  //   };

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 9;

  

  const [shifts, setShifts] = React.useState([]);
  const [data, setData] = React.useState([]);
  const getShifts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/shift", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
      if (!response.success) {
        throw new Error(response.error);
      }
      setShifts(response.result.result);
    } catch (error) {
      toast.error(error.message);
    }
  };
  React.useEffect(() => {
    if (data && isDataLoaded) {
      navigate(location.pathname, { state: { data: data } });
    }
  }, [data, isDataLoaded]);
  React.useEffect(() => {
    getShifts();
  }, []);
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "fondo":
        return <p>${cellValue || 0}</p>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Ver">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <button
                  onClick={() => handleClick(user.inicio, user.cierre)}
                  className="text-sm text-default-400 hover:text-foreground cursor-pointer active:opacity-50"
                >
                  <FaEye />
                </button>
              </span>
            </Tooltip>
            {/* <Tooltip content="Edit user">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EditIcon />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete user">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon />
                  </span>
                </Tooltip>*/}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const pages = Math.ceil(shifts.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return shifts.slice(start, end);
  }, [page, shifts]);
  return (
    <div className="w-full h-full flex p-4 gap-5">
      <div className="min-h-full">
        <Table
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondasry"
                page={page}
                total={pages == 0 ? 1 : pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          className="min-h-full"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No hay turnos"} items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-[60%] ">
        {isDataLoaded ? (
          <ShiftPdf />
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center">
              Visor de archivos
            </h2>
            <p className="text-center text-gray-500 text-sm">
              Ningun archivo seleccionado
            </p>
          </>
        )}
      </div>
    </div>
  );
}
