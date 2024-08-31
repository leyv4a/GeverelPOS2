import React, { Children } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { FaCashRegister, FaPlus } from "react-icons/fa";
import TicketPreview from '../components/TicketPreview';
import {Input,Button} from "@nextui-org/react";
import {Select, SelectItem, SelectSection} from "@nextui-org/react";
import ProductTable from '../components/ProductTable';
import { ImPriceTag } from "react-icons/im";
import debounce from 'lodash.debounce';

export default function Tienda() {
  const headingClasses = "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small capitalize";

  const [fecha,setFecha] = React.useState('')

  const [carritoItems, addCarritoItems] = React.useState([])

  const [total, setTotal] = React.useState('');

  const handleCarritoAdd = async (id, cantidad, nombre, precioVenta, subTotal, unidad) => {
    const itemIndex = carritoItems.findIndex(item => item.id === id);
  
    const cantidadkg = await fetch('http://localhost:3001/api/weight').then(response => response.json());
  
    

    if (unidad === 'kg') {
      cantidad = parseFloat(cantidadkg.weight.trim().replace(" kg", ""));

      // cantidad = 1; // Asigna un valor aleatorio
    }

    if (itemIndex !== -1) {
      const nuevosItems = [...carritoItems];
      // Si la unidad es "kg", se sobrescribe la cantidad
      if (unidad === 'kg') {
        nuevosItems[itemIndex].cantidad = cantidad;
      } else {
        nuevosItems[itemIndex].cantidad += cantidad;
      }
      nuevosItems[itemIndex].subtotal = nuevosItems[itemIndex].cantidad * precioVenta;

      try {
        addCarritoItems([...nuevosItems]);
        setTotal(sumarSubtotales(nuevosItems));
        resetFields();
      } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        toast.error('Error al actualizar el carrito', {
          bodyClassName: 'text-foreground',
        });
      }
    } else {
      if (!id) {
        toast.error('No se ha encontrado el producto', {
          bodyClassName: 'text-foreground',
        });
        return;
      }

      if (cantidad <= 0) {
        toast.error('La cantidad debe ser un número mayor que cero', {
          bodyClassName: 'text-foreground',
        });
        return;
      }

  
      const nuevoItem = {
        id,
        cantidad,
        nombre,
        precioVenta,
        subtotal: cantidad * precioVenta,
        unidad
      };
  
      try {
        const nuevosItems = [...carritoItems, nuevoItem];
        addCarritoItems([...nuevosItems]); // Cambiado a [...nuevosItems]
        setTotal(sumarSubtotales(nuevosItems));
        resetFields();
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        toast.error('Error al agregar al carrito', {
          bodyClassName: 'text-foreground'
        });
      }
    }
  };

  const handleRemove = (id) => {
    addCarritoItems(prevItems => {
      const nuevosItems = prevItems.filter(item => item.id !== id);
      setTotal(sumarSubtotales(nuevosItems));
      toast.success('Producto eliminado del carrito', {
        bodyClassName: 'text-foreground'
      });
      return nuevosItems;
    });
  }

  const handleEditarCantidad = (id, nuevaCantidad) => {
    nuevaCantidad = Number(nuevaCantidad); // Asegúrate de que sea un número
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      toast.error('La cantidad debe ser un número positivo', {
        bodyClassName: 'text-foreground'
      });
      return;
    }
    addCarritoItems(prevItems => {
      const nuevosItems = prevItems.map(item => {
        if (item.id === id) {
          const nuevoSubtotal = item.precioVenta * nuevaCantidad;
          return { ...item, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
        }
        return item;
      });
      setTotal(sumarSubtotales(nuevosItems));
      return nuevosItems;
    });
  }

  const handleEditarCantidadDebounced = debounce((id, nuevaCantidad) => {
    nuevaCantidad = Number(nuevaCantidad);
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      toast.error('La cantidad debe ser un número positivo', {
        bodyClassName: 'text-foreground',
      });
      return;
    }

    addCarritoItems(prevItems => {
      const nuevosItems = prevItems.map(item => {
        if (item.id === id) {
          const nuevoSubtotal = item.precioVenta * nuevaCantidad;
          return { ...item, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
        }
        return item;
      });

      setTotal(sumarSubtotales(nuevosItems));
      return nuevosItems;
    });
  }, 500);
  

 
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

  const CheckPrice = async (e) => {
    e.preventDefault();
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
      console.log(result)
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error en la comunicacion con la base de datos', {
        bodyClassName: 'text-foreground'
      });
    }finally{
      resetFields();
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
      console.log(result)
      handleCarritoAdd( result.id, 3, result.nombre, result.precioVenta, 1*result.precioVenta, result.unidad);
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

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus();
  }, [carritoItems.length],[]);



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
          <form className='flex' onSubmit={e=>handleSearch(e)}>
          <Input ref={inputRef} type="text" label="Codigo" color='default' onChange={e=>setCodigo(e.target.value)} value={codigo} radius='none' size='sm' variant='borderer' />
          <Button type='submit' size='lg' color='primary' radius='none' isIconOnly className='text-3xl'><FaPlus/></Button>
          </form>
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
            heading: headingClasses
          }}
        >
          {categorizedProducts[category].map(product => (
            <SelectItem key={product.codigo} className='capitalize'>{product.nombre}</SelectItem>
          ))}
        </SelectSection>
      ))}
       </Select>
       <form className='flex' onSubmit={(e)=>{CheckPrice(e)}}> 
       <Input type="text" label="Codigo" color='default' onChange={e=>setCodigo(e.target.value)} value={codigo} radius='none' size='sm' variant='borderer' />
       <Button type='submit' size='lg' color='primary' radius='none' isIconOnly className='text-3xl'><ImPriceTag/></Button>
       </form>
      </div>
       <div className="flex gap-6 max-h-[100%] sm:flex-row  flex-col">
        <div className='w-[70%]'>
          <ProductTable data={carritoItems} handleRemove={handleRemove} handleEditarCantidad={handleEditarCantidad}/>
        </div>
        <div className='w-[30%]'>
          <TicketPreview total={total} handleCancelar={handleCancelar} handleProcesar={handleProcesar} />
          <div className='flex items-center h-[50%]'>
          {/* <img width={'90%'} src='https://geverel.com/Geverel-Software.webp'/> */}
          </div>
        </div>
       </div>
       <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
