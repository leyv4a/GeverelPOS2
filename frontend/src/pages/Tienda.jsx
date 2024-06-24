import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { FaCashRegister, FaPlus } from "react-icons/fa";
import TicketPreview from '../components/TicketPreview';
import {Input,Button} from "@nextui-org/react";
import {Select, SelectItem, SelectSection, useDisclosure} from "@nextui-org/react";
import PasarelaPOS from '../components/PasarelaPOS';
import ProductTable from '../components/ProductTable';

export default function Tienda() {
  const headingClasses = "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

  const [fecha,setFecha] = React.useState('')

  const [carritoItems, addCarritoItems] = React.useState([])

  const [total, setTotal] = React.useState('');

  const handleCarritoAdd = async (id, cantidad, nombre, precioVenta, subTotal) => {
    const itemExists = carritoItems.some(item => item.id === id);

    if (itemExists) {
      toast.error('El producto ya está en el carrito', {
        bodyClassName: 'text-foreground'
      });
      setCodigo('')
    }  else {
      // Asegúrate de que productoId tenga un valor válido
      if (!id) {
        toast.error('No se ha encontrado el producto', {
          bodyClassName: 'text-foreground'
        });
        setCodigo('');
        return;
      }

      const nuevosItems = [...carritoItems, { id: id, cantidad: cantidad, nombre: nombre,  precioVenta: precioVenta, subtotal: subTotal }];
      addCarritoItems(nuevosItems);
      setTotal(sumarSubtotales(nuevosItems));
      resetFields();
    }
  }

  const handleRemove = (id) => {
    const nuevosItems = carritoItems.filter(item => item.id !== id);
    addCarritoItems(nuevosItems);
    setTotal(sumarSubtotales(nuevosItems));
    toast.success('Producto eliminado del carrito', {
      bodyClassName: 'text-foreground'
    });
  }

  // const handleEditarCantidad = (id, nuevaCantidad) => {
  //   const nuevosItems = carritoItems.map(item => {
  //     if (item.id === id) {
  //       const nuevoSubtotal = item.precioVenta * nuevaCantidad;
  //       return {...item, cantidad: nuevaCantidad, subtotal: nuevoSubtotal};
  //     }
  //     return item;
  //   });
  //   addCarritoItems(nuevosItems);
  //   setTotal(sumarSubtotales(nuevosItems));
  //   // const nuevosItems = carritoItems.map(item => {
  //   //   if (item.id === id) {
  //   //     const nuevoSubtotal = item.precioVenta * nuevaCantidad;
  //   //     return {...item, cantidad: nuevaCantidad, subtotal: nuevoSubtotal};
  //   //   }
  //   //   return item;
  //   // });
  //   // addCarritoItems(nuevosItems);
  //   // setTotal(sumarSubtotales(nuevosItems));
  // }
  const handleEditarCantidad = (id, nuevaCantidad) => {
    nuevaCantidad = Number(nuevaCantidad); // Asegúrate de que sea un número
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      toast.error('La cantidad debe ser un número positivo', {
        bodyClassName: 'text-foreground'
      });
      return;
    }
    const nuevosItems = carritoItems.map(item => {
      if (item.id === id) {
        const nuevoSubtotal = item.precioVenta * nuevaCantidad;
        return { ...item, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
      }
      return item;
    });
    addCarritoItems(nuevosItems);
    setTotal(sumarSubtotales(nuevosItems));
  }
  React.useEffect(() => {
    console.log('Carrito actualizado:', carritoItems);
  }, [carritoItems]);
 
  const handleProcesar = async () => {
    console.log(carritoItems)
    try {
      const response = await fetch('http://localhost:3001/api/pos/sale', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productos: carritoItems, tipo: 'salida', motivo: 'venta', fecha: fecha })
      });

      if (!response.ok) throw new Error('Error al procesar la venta');

      const result = await response.json();
       console.log(result)
      toast.success('Venta procesada exitosamente', {
        bodyClassName: 'text-foreground'
      });
      handleCancelar(); // Limpiar el carrito después de procesar la venta
    } catch (error) {
      console.log(error.message);
      toast.error(error.message || 'Error al procesar la venta', {
        bodyClassName: 'text-foreground'
      });
    }
  }
  const handleCancelar = () => {
    resetFields();
    addCarritoItems([]);
    setTotal(0);
  }

  const sumarSubtotales = (carritoItems) => {
    return carritoItems.reduce((total, item) => total + item.subtotal, 0);
  };
  const resetFields = () => {
    setFecha('')
    setCodigo('')
    setSelectedKeys(new Set([]));
  }


  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await getProductByCode(); // Espera a que getProductByCode termine
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error en la comunicacion con la base de datos', {
        bodyClassName: 'text-foreground'
      });
    }
  }
  
  const getProductByCode = async () => {
    try {
      if(codigo === '' ) throw new Error('Todos los campos son necesarios');
      const response = await fetch(`http://localhost:3001/api/product/${codigo.toLowerCase()}`,{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      if (!response.ok) throw new Error('Error al buscar el producto');
      const result = await response.json();
      handleCarritoAdd( result.id, 1, result.nombre, result.precioVenta, 1*result.precioVenta);
    } catch (error) {
      console.log(error.message)
      resetFields();
      throw error; 
    }
  }

  const [codigo, setCodigo] = React.useState('')
  //Guarda y maneja el cambio del Select para ponerlo en el codigowh
  const [selectedKeys,setSelectedKeys] = React.useState(new Set([]))
  const handleSelectionChange = (keys) => {
    const selectedArray = Array.from(keys);
    setCodigo(selectedArray[0]);
    setSelectedKeys(keys);
  }

  //Guarda los productos para mostrarlos en el Select
  const [products, setProducts] = React.useState([]);
  const getProducts = async () => {
    try {
    const response = await fetch(`http://localhost:3001/api/product`,{
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(!response.ok) throw new Error('Error al cargar los productos');
    const result = await response.json();
    setProducts(result);
    } catch (error) {
      // toast.error(error);
      console.log(error);
    }
  }

  React.useEffect(() => {
    getProducts();
  }, []);

  // Agrupar los productos por categoría
  const categorizedProducts = products.reduce((acc, product) => {
    if (!acc[product.categoria]) {
      acc[product.categoria] = [];
    }
    acc[product.categoria].push(product);
    return acc;
  }, {});

  React.useEffect(()=> {
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
    setFecha(formattedDate)
  
  }, [codigo])
  return (
    <div className='w-full h-screen p-5 bg-slate-100'>
      <h2 className='text-4xl flex gap-2 mb-5'>
       <FaCashRegister/> PUNTO DE VENTA
      </h2>
      <div className='flex w-[50%] mb-2 gap-2'>
        <div className='flex '>
          <Input type="text" label="Codigo" color='default' onChange={e=>setCodigo(e.target.value)} value={codigo} radius='none' size='sm' variant='borderer' />
          <Button onClick={e=> handleSearch(e)} size='lg' color='primary' radius='none' isIconOnly className='text-3xl'><FaPlus/></Button>
        </div>
        <Select
        label="Selecciona un producto"
        className="max-w-xs"
        radius='none'
        color='white'
        size='sm'
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        scrollShadowProps={{
          isEnabled: false,
        }}
      >
         {Object.keys(categorizedProducts).map(category => (
        <SelectSection 
          key={category}
          title={category}
          classNames={{
            heading: headingClasses,
          }}
        >
          {categorizedProducts[category].map(product => (
            <SelectItem key={product.codigo}>{product.nombre}</SelectItem>
          ))}
        </SelectSection>
      ))}
       </Select>
      </div>
       <div className="flex gap-6 max-h-[100%] sm:flex-row  flex-col">
        <div className='w-[70%]'>
          <ProductTable data={carritoItems} handleRemove={handleRemove} handleEditarCantidad={handleEditarCantidad}/>
        </div>
        <div className='w-[30%]'>
          <TicketPreview total={total} handleCancelar={handleCancelar} handleProcesar={handleProcesar} />
          <div className='flex items-center h-[50%]'>
          <img width={'90%'} src='https://geverel.com/Geverel-Software.webp'/>
          </div>
        </div>
       </div>
       <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
            {/* <PasarelaPOS onOpenChange={onOpenChange} isOpen={isOpen} handlePesar={handlePesar} handleCarritoAdd={handleCarritoAdd}/> */}
      </div>
    </div>
  )
}
