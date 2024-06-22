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

  //Modal state
  const {isOpen, onOpen, onOpenChange} = useDisclosure(); 

  const [carritoItems, addCarritoItems] = React.useState([])

  //items individuales
  const [cantidad, setCantidad] = React.useState('')
  const [producto, setProducto] = React.useState('')
  const [unidad, setUnidad] = React.useState('')
  const [precioVenta, setPrecioVenta] = React.useState('');
  const [productoId, setProductoId] = React.useState('')
  const [subTotal, setSubtotal] = React.useState('');
  const [total, setTotal] = React.useState('');

  const handleCarritoAdd = () => {
    const itemExists = carritoItems.some(item => item.id === productoId);

    if (itemExists) {
      toast.error('El producto ya está en el carrito', {
        bodyClassName: 'text-foreground'
      });
    } else {
      const nuevosItems = [...carritoItems, { id: productoId, cantidad: cantidad, nombre: producto, unidad: unidad, precioVenta: precioVenta, subtotal: subTotal }];
      addCarritoItems(nuevosItems);
      setTotal(sumarSubtotales(nuevosItems));
      resetFields();
    }
  }

  const handleProcesar = () => {

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
    setCantidad('');
    setProducto('');
    setUnidad('');
    setPrecioVenta('');
    setProductoId('');
    setCodigo('')
    setSelectedKeys(new Set([]));
  }

  const handlePesar = (value) => {
    setCantidad(value);
    setSubtotal(value*precioVenta);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    await getProductByCode();
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
      setProducto(result.nombre);
      setUnidad(result.unidad);
      setProductoId(result.id);
      setPrecioVenta(result.precioVenta);
      console.log(result)
      onOpen();
    } catch (error) {
      console.log(error.message)
      resetFields();
      toast.error(error.message || 'Error en la comunicacion con la base de datos', {
        bodyClassName : 'text-foreground'
      })
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

  return (
    <div className='w-full h-screen p-5 bg-slate-100'>
      <h2 className='text-4xl flex gap-2 mb-5'>
       <FaCashRegister/> PUNTO DE VENTA
      </h2>
      <div className='flex w-[50%] mb-2 gap-2'>
        <div className='flex '>
          <Input type="text" label="Codigo" color='default' value={codigo} radius='none' size='sm' variant='borderer' />
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
          <ProductTable data={carritoItems}/>
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
            <PasarelaPOS onOpenChange={onOpenChange} isOpen={isOpen} handlePesar={handlePesar} unidad={unidad} handleCarritoAdd={handleCarritoAdd}/>
      </div>
    </div>
  )
}
