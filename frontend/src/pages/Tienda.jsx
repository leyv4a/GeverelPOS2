import React, { Children } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaCashRegister, FaPlus } from "react-icons/fa";
import TicketPreview from "../components/TicketPreview";
import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem, SelectSection } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import ProductTable from "../components/ProductTable";
import { ImPriceTag } from "react-icons/im";
import debounce from "lodash.debounce";

export default function Tienda() {
  const headingClasses =
    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small capitalize";

  const [fecha, setFecha] = React.useState("");

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

        if(precioVenta == undefined || precioVenta == null){
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
    }finally{
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
      nuevaCantidad = Number(nuevaCantidad); // Asegúrate de que sea un número
      if (isNaN(nuevaCantidad)) {
        toast.error("La cantidad debe ser un número positivo", {
          bodyClassName: "text-foreground",
        });
        return;
      }
      addCarritoItems((prevItems) => {
        const nuevosItems = prevItems.map((item) => {
          if (item.id === id) {
            const nuevoSubtotal = item.precioVenta * nuevaCantidad;
            return {
              ...item,
              cantidad: nuevaCantidad,
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
          motivoCancelacion: "Venta cancelada por el usuario"
        }),
      })
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
  }

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

  const [priceData, setPriceData] = React.useState([]);
  const CheckPrice = async () => {
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
      if (result.unidad == "kg") {
        // cantidad = parseFloat(cantidad.weight.trim().replace(" kg", ""));
        let cantidad = await fetch("http://localhost:3001/api/weight").then(
          (response) => response.json()
        );
        if (cantidad?.weight != "") {
          cantidad = parseFloat(cantidad.weight.trim().replace(" kg", ""));
        } else {
          cantidad = 1;
        }
        setPriceData([{ ...result, cantidad }]);
        return { error: false };
      }
      setPriceData([{ ...result, cantidad: 1 }]);
      return { error: false };
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Error en la comunicacion con la base de datos",
        {
          bodyClassName: "text-foreground",
        }
      );
      return { error: true };
    } finally {
      resetFields();
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
          let cantidad2 = cantidad.weight.replace(" kg", "");
          cantidad = parseFloat(cantidad2);
          console.log(cantidad);
        } 
      }else {
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
      console.log(error.message);
      resetFields();
      throw error;
    }finally{
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


  const inputRef = React.useRef(null);

  React.useEffect(
    () => {
      inputRef.current.focus();
    },
    [carritoItems.length],
    []
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const openModal = async () => {
    const data = await CheckPrice(); // Espera a que CheckPrice termine
    if (data.error) {
      return;
    } else {
      if (priceData.length) {
        // Verifica si hay datos en priceData
        onOpen();
      }
    }
  };

  React.useEffect(() => {
    const date = new Date();
    const formattedDate =
      date.getFullYear() +
      "/" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(date.getDate()).padStart(2, "0") +
      " " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0");
    setFecha(formattedDate);
  }, [codigo]);
  return (
    <div className="w-full h-screen p-5 bg-slate-100">
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
            ref={inputRef}
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
          {/* <Button  onClick={(e)=>{CheckPrice(e)}} size='lg' color='primary' radius='none' isIconOnly className='text-3xl'><ImPriceTag/></Button> */}
          <ModalPrecio
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            openModal={openModal}
            PriceData={priceData}
            CarritoAdd={handleCarritoAdd}
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
            <AutocompleteItem key={product.codigo} className="capitalize">{product.nombre +" "+product.codigo}</AutocompleteItem>
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
            handleCancelar={handleCancelar}
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

const ModalPrecio = ({
  openModal,
  isOpen,
  onOpenChange,
  PriceData,
  CarritoAdd,
}) => {
  return (
    <>
      <Button
        onPress={openModal}
        size="lg"
        color="primary"
        radius="none"
        isIconOnly
        className="text-3xl"
      >
        <ImPriceTag />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              {/* id, cantidad, nombre, precioVenta, subTotal, unidad */}
              <ModalHeader className="flex flex-col gap-1 capitalize text-center">
                {PriceData[0].nombre}
              </ModalHeader>
              <ModalBody className="flex flex-row  w-full ">
                <div className="text-start ">
                    <ul className="font-bold">
                      <li>Cantidad</li>
                      <li>P.U</li>
                      <li>Total</li>
                    </ul>
                </div>
                <div className="">
                  <ul>
                    <li>{": "}{PriceData[0].cantidad || 1}</li>
                    <li>{": "}${PriceData[0].precioVenta || 0}</li>
                    <li className="font-bold">{": "}${(PriceData[0].cantidad || 1) * (PriceData[0].precioVenta)}</li>
                  </ul>
                </div>
                {/* Cantidad : {PriceData[0].cantidad || 1} <br />
                Precio unitario : {PriceData[0].precioVenta} <br />
                Total : {(PriceData[0].cantidad || 1) * (PriceData[0].precioVenta)} */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    CarritoAdd(
                      PriceData[0].id,
                      PriceData[0].cantidad,
                      PriceData[0].nombre,
                      PriceData[0].precioVenta,
                      PriceData[0].unidad
                    );
                    onClose(); // Cierra el modal después de agregar al carrito
                  }}
                >
                  Agregar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
