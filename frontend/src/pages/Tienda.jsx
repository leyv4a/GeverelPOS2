import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaCashRegister, FaPlus } from "react-icons/fa";
import TicketPreview from "../components/TicketPreview";
import { Input, Button } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import ProductTable from "../components/ProductTable";
import { CheckPrice as ChecarPrecioComponente } from "../components/CheckPrice";

export default function Tienda() {
  const [fecha, setFecha] = React.useState("");
  const user = isAuthenticated();

  const [carritoItems, addCarritoItems] = React.useState([]);

  const [total, setTotal] = React.useState("");

  const handleCarritoAdd = async (
    id,
    cantidad,
    nombre,
    precioVenta,
    // subTotal,
    unidad
  ) => {
    try {
      const itemIndex = carritoItems.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        const nuevosItems = [...carritoItems];
        // Si la unidad es "kg", se sobrescribe la cantidad
        if (unidad === "kg") {
          nuevosItems[itemIndex].cantidad = cantidad;
        } else {
          nuevosItems[itemIndex].cantidad += cantidad;
        }
        nuevosItems[itemIndex].subtotal =
          nuevosItems[itemIndex].cantidad * precioVenta;

        try {
          addCarritoItems([...nuevosItems]);
          setTotal(sumarSubtotales(nuevosItems));
          resetFields();
        } catch (error) {
          console.error("Error al actualizar el carrito:", error);
          toast.error("Error al actualizar el carrito", {
            bodyClassName: "text-foreground",
          });
        }
      } else {
        if (!id) {
          toast.error("No se ha encontrado el producto", {
            bodyClassName: "text-foreground",
          });
          return;
        }

        if (cantidad <= 0) {
          toast.error("La cantidad debe ser un número mayor que cero", {
            bodyClassName: "text-foreground",
          });
          return;
        }

        if (precioVenta == undefined || precioVenta == null) {
          toast.error("El producto no tiene entradas", {
            bodyClassName: "text-foreground",
          });
          return;
        }

        const nuevoItem = {
          id,
          cantidad,
          nombre,
          precioVenta,
          subtotal: cantidad * precioVenta,
          unidad,
        };

        try {
          const nuevosItems = [...carritoItems, nuevoItem];
          addCarritoItems([...nuevosItems]); // Cambiado a [...nuevosItems]
          setTotal(sumarSubtotales(nuevosItems));
        } catch (error) {
          console.error("Error al agregar al carrito:", error);
          toast.error("Error al agregar al carrito", {
            bodyClassName: "text-foreground",
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedKeys("");
      resetFields();
    }
  };

  const handleRemove = (id) => {
    addCarritoItems((prevItems) => {
      const nuevosItems = prevItems.filter((item) => item.id !== id);
      setTotal(sumarSubtotales(nuevosItems));
      toast.info("Producto eliminado del carrito", {
        bodyClassName: "text-foreground",
      });
      return nuevosItems;
    });
  };

  const handleEditarCantidad = (id, nuevaCantidad, unidad) => {
    if (unidad == "kg") {
      return;
    } else {
      // Asegúrate de que sea un número positivo con decimales
      const cantidadNumerica = parseFloat(nuevaCantidad);

      if (isNaN(cantidadNumerica) || cantidadNumerica < 0) {
        toast.error("La cantidad debe ser un número positivo", {
          bodyClassName: "text-foreground",
        });
        return;
      }

      addCarritoItems((prevItems) => {
        const nuevosItems = prevItems.map((item) => {
          if (item.id === id) {
            const nuevoSubtotal = item.precioVenta * cantidadNumerica;
            return {
              ...item,
              cantidad: cantidadNumerica, // Usar el valor numérico con decimales
              subtotal: nuevoSubtotal,
            };
          }
          return item;
        });
        setTotal(sumarSubtotales(nuevosItems));
        return nuevosItems;
      });
    }
  };

  const handleCancelSale = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/pos/cancel", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha: fecha,
          total: total,
          motivoCancelacion: "Venta cancelada por el usuario",
          usuarioId: user.id,
        }),
      });
      if (!response.ok) throw new Error("Error al cancelar la venta");
      const result = await response.json();
      toast.info(result.message, {
        bodyClassName: "text-foreground",
      });
      handleCancelar(); // Limpiar el carrito después de procesar la venta
    } catch (error) {
      console.log(error.message);
      toast.error(error.message || "Error al cancelar la venta", {
        bodyClassName: "text-foreground",
      });
    }
  };

  const handleProcesar = async () => {
    console.log(carritoItems);
    try {
      const response = await fetch("http://localhost:3001/api/pos/sale", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productos: carritoItems,
          tipo: "salida",
          motivo: "venta",
          fecha: fecha,
          usuarioId: user.id,
        }),
      });

      if (!response.ok) throw new Error("Error al procesar la venta");

      const result = await response.json();
      toast.success(result.message, {
        bodyClassName: "text-foreground",
      });
      handleCancelar(); // Limpiar el carrito después de procesar la venta
    } catch (error) {
      console.log(error.message);
      toast.error(error.message || "Error al procesar la venta", {
        bodyClassName: "text-foreground",
      });
    }
  };
  const handleCancelar = () => {
    resetFields();
    addCarritoItems([]);
    setTotal(0);
  };

  const sumarSubtotales = (carritoItems) => {
    return carritoItems
      .reduce((total, item) => total + item.subtotal, 0)
      .toFixed(2);
  };
  const resetFields = () => {
    setFecha("");
    setCodigo("");
    setSelectedKeys(new Set([]));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await getProductByCode(); // Espera a que getProductByCode termine
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Error en la comunicacion con la base de datos",
        {
          bodyClassName: "text-foreground",
        }
      );
    }
  };

  const getProductByCode = async () => {
    try {
      if (codigo === "") throw new Error("Todos los campos son necesarios");
      const response = await fetch(
        `http://localhost:3001/api/product/${codigo.toLowerCase()}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Error al buscar el producto");
      const result = await response.json();
      console.log(result);

      let cantidad;
      if (result.unidad == "kg") {
        cantidad = await fetch("http://localhost:3001/api/weight").then(
          (response) => response.json()
        );
        if (cantidad?.weight != "") {
          let cantidad2;
          try {
            cantidad2 = cantidad.weight.replace(" kg", "");
          } catch (error) {
            throw new Error("Error en la comunicacion con la bascula");
          }
          cantidad = parseFloat(cantidad2);
          console.log(cantidad);
        }
      } else {
        cantidad = 1;
      }

      handleCarritoAdd(
        result.id,
        cantidad,
        result.nombre,
        result.precioVenta,
        // cantidad * result.precioVenta,
        result.unidad
      );
    } catch (error) {
      // console.log(error.message);
      resetFields();
      throw error;
    }
  };
  //Guarda los productos para mostrarlos en el Select
  const [products, setProducts] = React.useState([]);
  const getProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/product`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al cargar los productos");
      const result = await response.json();
      setProducts(result);
    } catch (error) {
      // toast.error(error);
      console.log(error);
    }
  };

  const [codigo, setCodigo] = React.useState("");
  //Guarda y maneja el cambio del Select para ponerlo en el codigowh
  const [selectedKeys, setSelectedKeys] = React.useState("");
  const handleSelectionChange = (keys) => {
    setSelectedKeys(keys);
    setCodigo(keys);
  };

  React.useEffect(() => {
    getProducts();
  }, []);

  React.useEffect(() => {
    const date = new Date();
    const formattedDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0") +
      " " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0");
    setFecha(formattedDate);
  }, [codigo]);

  const [isShiftStarted, setIsShiftStarted] = React.useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("shift") == "true") {
      setIsShiftStarted(true);
    }
  }, []);

  if (!isShiftStarted) {
    return <NoShift />;
  }
  return (
    <div className="w-full h-screen p-5 ">
      <h2 className="text-4xl flex gap-2 mb-5">
        <FaCashRegister /> PUNTO DE VENTA
      </h2>
      <div className="flex w-[50%] mb-2 gap-2">
        <form
          autoComplete="off"
          className="flex"
          onSubmit={(e) => handleSearch(e)}
        >
          <Input
            type="text"
            label="Codigo"
            color="default"
            onChange={(e) => setCodigo(e.target.value)}
            value={codigo}
            radius="none"
            size="sm"
            variant="borderer"
          />
          <Button
            type="submit"
            size="lg"
            color="primary"
            radius="none"
            isIconOnly
            className="text-3xl"
          >
            <FaPlus />
          </Button>
          <ChecarPrecioComponente
            CarritoAdd={handleCarritoAdd}
            resetFields={resetFields}
            codigo={codigo}
          />
        </form>
        <Autocomplete
          defaultItems={products}
          selectedKey={selectedKeys}
          onSelectionChange={handleSelectionChange}
          allowsEmptyCollection={false}
          className="max-w-xs"
          radius="none"
          label="Selecciona un producto"
          size="sm"
        >
          {(product) => (
            <AutocompleteItem key={product.codigo} className="capitalize">
              {product.nombre + " " + product.codigo}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <div className="flex gap-6 max-h-[100%] sm:flex-row  flex-col">
        <div className="w-[70%]">
          <ProductTable
            data={carritoItems}
            handleRemove={handleRemove}
            handleEditarCantidad={handleEditarCantidad}
          />
        </div>
        <div className="w-[30%]">
          <TicketPreview
            total={total}
            handleCancelarSale={handleCancelSale}
            handleProcesar={handleProcesar}
          />
          <div className="flex items-center h-[50%]">
            {/* <img width={'90%'} src='https://geverel.com/Geverel-Software.webp'/> */}
          </div>
        </div>
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

import { FaStoreSlash } from "react-icons/fa";
import { isAuthenticated } from "../../utils/auth";

const NoShift = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen ">
      <div className="text-slate-300 flex w-full flex-col items-center">
        <FaStoreSlash size={200} />
        <h2 className="text-3xl font-bold ">No hay ningun turno abierto...</h2>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose="2000"
        bodyClassName={() => "text-foreground"}
        draggable
      />
    </div>
  );
};
