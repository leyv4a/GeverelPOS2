import { Button } from "@nextui-org/react";
import React from "react";
import { toast } from "react-toastify";

export default function Productos() {

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
        <div className="flex flex-col gap-2 p-2 w-[40rem] h-[90%] m-2 rounded-lg border ">
          <h2 className="font-bold text-center text-lg sticky py-2 top-0 bg-white">
            Precios
          </h2>
          <div className="h-[100%] overflow-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 ">
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
  