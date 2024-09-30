import React from 'react'
import { ImPriceTag } from "react-icons/im";
import { toast } from "react-toastify";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button
  } from "@nextui-org/react";


export function CheckPrice({CarritoAdd, resetFields, codigo}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [PriceData, setPriceData] = React.useState([]);
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

  React.useEffect(() => {
    if (PriceData.length > 0) {
        onOpen(); // Abre el modal solo si hay datos
    }
}, [PriceData, onOpen]);

const handleCheckPrice = async () => {
    await CheckPrice(); // Ejecuta la función para buscar el precio
};
    
  return (
          <>
             <Button
              onPress={handleCheckPrice}
               size="lg"
               color="primary"
               radius="none"
               isIconOnly
               className="text-3xl"
             >
               <ImPriceTag /></Button>
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
                          onClose(); 
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
      }
