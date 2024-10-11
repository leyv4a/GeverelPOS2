import React from "react";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
  Input,
  Button,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import { IoMdCamera } from "react-icons/io";

const columns = [
  { name: "Nombre", uid: "nombre" },
  //   { name: "Usuario", uid: "usuario" },
  { name: "Tipo", uid: "tipo" },
  { name: "Acciones", uid: "actions" },
];

const statusColorMap = {
  1: "success",
  2: "danger",
  3: "warning",
};

const statusTipeMap = {
  1: "Administrador",
  2: "Usuario",
  3: "Vendedor",
};

export default function Usuarios() {
  // TABLE DATA
  const [usuarios, setUsuarios] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [id, setId] = React.useState(0);

  const getUsuarios = async () => {
    const response = await fetch("http://localhost:3001/api/users", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    setUsuarios(response);
  };

  React.useEffect(() => {
    getUsuarios();
  }, []);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "nombre":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: user.avatar,
              showFallback: true,
              fallback: (
                <IoMdCamera
                  className="animate-pulse w-6 h-6 text-default-500"
                  size={20}
                />
              ),
            }}
            description={"@" + user.usuario}
            name={cellValue}
          >
            {user.usuario}
          </User>
        );
      case "usuario":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm ">@{cellValue}</p>
            {/* <p className="text-bold text-sm capitalize text-default-400">
                {user.team}
              </p> */}
          </div>
        );
      case "tipo":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.tipo]}
            size="sm"
            variant="flat"
          >
            {statusTipeMap[cellValue]}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detalles">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaEye />
              </span>
            </Tooltip>
            <Tooltip content="Editar usuario">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <button
                  onClick={() => handleEditing(user)}
                  className="text-sm text-default-400 hover:text-foreground cursor-pointer active:opacity-50"
                >
                  <FaPencilAlt />
                </button>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar usuario">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <PopOverDelete
                 handler={deleteById}
                 id={user.id}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleEditing = (item) => {
    setIsEditing(!isEditing);
    setNombre(item.nombre);
    setUsuario(item.usuario);
    setTipo(item.tipo);
    setContra(item.password);
    setId(item.id);
  };

  const updateById = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/users`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          usuario: usuario,
          password: contra,
          tipo: tipo,
          nombre: nombre,
        }),
      }).then((response) => response.json());
      if (!response.success) {
        throw new Error(response.error);
      }
      resetData();
      toast.success(response.message);
      getUsuarios();
    } catch (error) {
      toast.error(error.message);
    } finally {
      getUsuarios();
    }
  };

  const deleteById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
      if (!response.success) {
        throw new Error(response.error);
      }
      toast.success(response.message);
      getUsuarios();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ADD USUARIO DATA
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // usuario,password,tipo,nombre
  const [usuario, setUsuario] = React.useState("");
  const [contra, setContra] = React.useState("");
  const [tipo, setTipo] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [correo, setCorreo] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          password: contra,
          tipo: tipo,
          nombre: nombre,
        }),
      }).then((response) => response.json());
      if (!response.success) {
        throw new Error(response.error);
      }
      resetData();
      toast.success(response.message);
      getUsuarios();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetData = () => {
    setUsuario("");
    setContra("");
    setTipo(0);
    setNombre("");
    setCorreo("");
    setId(0);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full flex p-4 gap-5">
      <div className="h-[100%] ">
        <Table className="min-h-full">
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
          <TableBody emptyContent={"Sin usuarios"} items={usuarios}>
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
      <div className="flex-col gap-2 h-full pe-2 border-e">
        <div className="h-1/2 flex-col flex gap-2">
          <h2 className="text-2xl  text-center font-bold">
            {isEditing ? "Editar" : "Agregar"} usuarios
          </h2>
          <form
            onSubmit={(e) => {
              isEditing ? updateById(e) : handleSubmit(e);
            }}
            className="flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <Input
                 isRequired
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
                size="sm"
                variant="faded"
                label="Nombre"
              />
              <Input
                isRequired
                value={contra}
                onChange={(e) => {
                  setContra(e.target.value);
                }}
                size="sm"
                variant="faded"
                label="Contraseña"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
            </div>
            <div className="flex gap-2">
              <Input
                 isRequired
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                size="sm"
                variant="faded"
                type="text"
                label="Usuario"
              />
              <Select   
                variant="faded"
                placeholder="Selecciona un tipo"
                // value={tipo.toString()}
                selectedKeys={[tipo.toString()]}
                onChange={(e) => setTipo(e.target.value)}
                // value={tipo}
                // onChange={(e) => setTipo(e.target.value)}
                size="lg"
                radius="sm"
              >
                <SelectItem value={1} key={1}>
                  Administrador
                </SelectItem>
                <SelectItem value={2} key={2}>
                  Usuario
                </SelectItem>
                <SelectItem value={3} key={3}>
                  Vendedor
                </SelectItem>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input
                disabled
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                size="sm"
                variant="faded"
                type="mail"
                label="Correo electronico"
              />
              {isEditing ? (
                <Button
                  onClick={() => resetData()}
                  size="lg"
                  radius="sm"
                  color="danger"
                  className="text-white"
                  variant="solid"
                >
                  Cancelar
                </Button>
              ) : (
                <></>
              )}
              <Button
                isLoading={false}
                size="lg"
                type="submit"
                radius="sm"
                color="success"
                className="text-white"
                variant="solid"
              >
                {isEditing ? "Editar" : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
        <div>Por definirse</div>
      </div>
      <div className="text-center w-1/2">
        <h2 className="text-3xl font-bold mb-5">Logs</h2>
        <p className="text-gray-500 text-sm">No logs to display</p>
       </div> 
    </div>
  );
}

function PopOverDelete({handler, id}) {
  return (
    <Popover placement="right">
      <PopoverTrigger>
        <button  className="text-sm text-danger cursor-pointer active:opacity-50">
          <FaTrash />
        </button>
        {/* <Button>Open Popover</Button> */}
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 ">
          <div className="text-small font-bold mb-2">¿Estás seguro que deseas eliminar el usuario?</div>
          {/* <div className="text-tiny">Confirmar</div> */}
          <Button onClick={()=>{handler(id)}} size="sm" radius="sm" color="danger" className="text-white " variant="solid">
            Confirmar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
