import React from 'react'
import { FaCashRegister, FaPlus } from "react-icons/fa";
import TicketPreview from '../components/TicketPreview';
import {Input,Button} from "@nextui-org/react";
import {Select, SelectItem, SelectSection} from "@nextui-org/react";

export default function Tienda() {
  const headingClasses = "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

  const [selectedKeys,setSelectedKeys] = React.useState(new Set([]))
  const [codigo, setCodigo] = React.useState('')
  const handleSelectionChange = (keys) => {
    const selectedArray = Array.from(keys);
    setCodigo(selectedArray[0]);
    setSelectedKeys(keys);
  }


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
          <Button size='lg' color='primary' radius='none' isIconOnly className='text-3xl'><FaPlus/></Button>
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
        <div className='w-[70%]'>TABLA DE PRODUCTOS {codigo}</div>
        <div className='w-[30%]'>
          <TicketPreview />
          <div className='flex items-center h-[50%]'>
          <img width={'100%'} src='https://geverel.com/Geverel-Software.webp'/>
          </div>
        </div>
       </div>
    </div>
  )
}
