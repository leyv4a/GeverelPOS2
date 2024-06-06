import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import GenericTable from '../components/GenericTable';
import { Button, Input,RadioGroup, Radio } from '@nextui-org/react';
import { FaMagnifyingGlass, FaKeyboard  } from "react-icons/fa6";
import { RiWeightLine as FaWeightScale} from "react-icons/ri";
export default function RegistrarEntrada() {

  //Guardara el nombre del producto resultante de la api
  const [producto, setProducto] = React.useState('');
  //Guardara el codigo del input para buscar en la api
  const [codigo, setCodigo] = React.useState('');
  const [fecha, setFecha] = React.useState('');
  const [unidad,setUnidad] = React.useState('');
  const [motivo, setMotivo] = React.useState('');
  const [cantidad, setCantidad] = React.useState('');
  //Guarda el precio de inversion para los calculos futuros
  const [inversion, setInversion] = React.useState('');
  //Guarda el margen en caso ser ingresado por el radiobutton
  const [margen, setMargen] = React.useState('');
  //Guarda el margen ingresado manualmente para hacer los calculos
  const [margenManual, setMargenManual] = React.useState('');
  //Guarda el precio de venta en caso de ingresarse manualmente
  const [precioVentaManual, setPrecioVentaManual] = React.useState('');

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [isButtonLoading2, setIsButtonLoading2] = React.useState(false);
  const [isManual, setIsManual] = React.useState(true);

  const [data, setData] = React.useState([]);
  const [isFullTable, setIsFullTable] = React.useState(false);

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const calculatePrecioVenta = async () => {
    try {
      let calculatedPrecioVenta = 0;

      if (precioVentaManual > 0) {
        calculatedPrecioVenta = precioVentaManual;
      } else if (margenManual) {
        calculatedPrecioVenta = inversion * (1 + parseFloat(margenManual) / 100);
      } else if (margen && margen !== 'manual') {
        calculatedPrecioVenta = inversion * (1 + parseFloat(margen) / 100);
      }
      return calculatedPrecioVenta
    } catch (error) {
      toast.error(error.message);
    }
  }

  const resetFields = async () => {
    setProducto('');
    setCodigo('');
    setFecha('');
    setUnidad('');
    setMotivo('');
    setCantidad('');
    setInversion('');
    setMargen('');
    setMargenManual('');
    setPrecioVentaManual('');
    setIsManual(true);
    setIsButtonLoading(false);
    setIsButtonLoading2(false);
  }

  const addEntradas = async (e) => {
    e.preventDefault();
    //  setPrecioVenta(calculatePrecioVenta());
    try {
      const calculatedPrecioVenta = await calculatePrecioVenta(); // Espera a que se resuelva la promesa
      console.log(
          `El nombre del producto es: ${producto}
          El codigo del producto es: ${codigo}
          La fecha es: ${fecha}
          La unidad es: ${unidad}
          El motivo es: ${motivo}
          La cantidad es: ${cantidad}
          El inversion es: ${inversion}
          El precio de venta es: ${calculatedPrecioVenta}`
        )
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getEntradas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/transaction/entry',{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      if (!response.ok) throw new Error('Error al cargar las entradas');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error)
      toast.error('Error en la comunicacion con la base de datos', {
        bodyClassName : 'text-foreground'
      })
      
    }
  }
  //Se esta buscando por id cambiar el metodo en la api para buscar por codigo
  const getProductByCode = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true)
    try {
      if(codigo === '' ) throw new Error('Todos los campos son necesarios');
      const response = await fetch(`http://localhost:3001/api/product/${codigo}`,{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      if (!response.ok) throw new Error('Error al buscar el producto');
      const result = await response.json();
      console.log(result)
      setProducto(result.nombre);
      setUnidad(result.unidad)
    } catch (error) {
      console.log(error.message)
      resetFields();
      toast.error(error.message || 'Error en la comunicacion con la base de datos', {
        bodyClassName : 'text-foreground'
      })
    }finally{
      setIsButtonLoading(false)
    }
  }

  const handleRadioKeyDown = (event, value) => {
    if (event.key === 'Enter') {
      setMotivo(value);
    }
  };
  const handleRadioKeyDown2 = (event, value) => {
    if (event.key === 'Enter') {
      setMargen(value);
    }
  };

  const columns = [
    // { uid: 'id', nombre: 'Id', sortable: true },
    { uid: 'nombre', nombre: 'Nombre', sortable: true },
    { uid: 'codigo', nombre: 'Codigo', sortable: true },
    // { uid: 'tipo', nombre: 'Tipo', sortable: true },
    { uid: 'fecha', nombre: 'Fecha', sortable: true },
    { uid: 'motivo', nombre: 'Motivo', sortable: true },
    { uid: 'cantidad', nombre: 'Cantidad', sortable: false },
    { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];

  React.useEffect(() => {
    getEntradas();
  }, [])
  React.useEffect(()=> {
    const date = new Date();
    setFecha(date.getFullYear())
    if (producto == '') {
      setFecha('')
    }
  }, [producto])
  return (
    <div className='flex gap-6 max-h-[100%] p-5'>
      <div className={isFullTable? 'hidden': 'w-[50%]'}>
        <form onSubmit={e=>addEntradas(e)} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
        <div className="flex w-full gap-4">
        <div className='flex'>
          <Input isRequired size='sm' variant='underlined' type="text" label="Producto" value={codigo} onChange={e=> setCodigo(e.target.value)}/>
          <Button isIconOnly isLoading={isButtonLoading} size='lg' color="primary" radius='none' disableRipple onClick={e => getProductByCode(e)}><FaMagnifyingGlass/></Button>
        </div>
         <Input size='sm' variant='underlined' isReadOnly disabled value={fecha} label="Fecha" className='max-w-[40%]'/>
      </div>  
      {
        producto != '' ? 
        <div className='flex w-full gap-4'>
          <p>El producto es: <em>{producto}</em></p>
        </div> :''
      }
      {
        producto != '' && unidad == 'kg' ?
        <div className='flex w-full gap-4'>
        <div className='flex'>
          <Input isRequired size='sm' variant='underlined' value={cantidad} onChange={e=> setCantidad(e.target.value)} isDisabled={isManual} label="Cantidad" />
          <Button isIconOnly size='lg' color="primary" radius='none' disableRipple><FaWeightScale/></Button>
          <Button isIconOnly size='lg' color="foreground" onClick={e => setIsManual(!isManual)} className="border border-primary" radius='none' disableRipple><FaKeyboard /></Button>
        </div>
        <Input isRequired size='sm' variant='underlined' value={inversion} onChange={e => setInversion(e.target.value)} type="text" label="Costo por kilo" className='max-w-[40%]'/>
       </div>
         : producto != '' && unidad == 'unidad' ? 
         <div className='flex w-full gap-4'>
            <Input isRequired size='sm' variant='underlined' value={cantidad} onChange={e => setCantidad(e.target.value)} type="number" label="Cantidad" />
            <Input isRequired size='sm' variant='underlined' value={inversion} onChange={e => setInversion(e.target.value)} type="text" label="Costo por unidad" />
        </div>
         : ''
      }
      {
        cantidad != '' && inversion != '' ? 
        <RadioGroup
        label="Motivo"
        value={motivo}
        onValueChange={setMotivo}
        orientation="horizontal"
        size='sm'
      >
        <Radio value="compra" onKeyDown={e=> handleRadioKeyDown(e, 'compra')} tabIndex="0">Compra</Radio>
        <Radio value="obsequio" onKeyDown={e=> handleRadioKeyDown(e, 'obsequio')} tabIndex="0">Obsequio</Radio>
        <Radio value="otro" onKeyDown={e=> handleRadioKeyDown(e, 'otro')} tabIndex="0">Otro</Radio>
      </RadioGroup>
      :''
      }
      {
        motivo != '' ?
        <RadioGroup
        label="Margen de ganancia"
        value={margen}
        onValueChange={setMargen}
        orientation="horizontal"
        size='sm'
      >
        <Radio value="15" onKeyDown={e=> handleRadioKeyDown2(e, '15')} tabIndex="0">15%</Radio>
        <Radio value="30" onKeyDown={e=> handleRadioKeyDown2(e, '30')} tabIndex="0">30%</Radio>
        <Radio value="50" onKeyDown={e=> handleRadioKeyDown2(e, '50')} tabIndex="0">50%</Radio>
        <Radio value="manual" onKeyDown={e=> handleRadioKeyDown2(e, 'manual')} tabIndex="0">Manual</Radio>
      </RadioGroup>
        :
        ''
      }
      {
        margen === 'manual' ? 
        <div className='flex gap-3 items-center'>
        <Input isDisabled={precioVentaManual != '' ? true : false} isRequired size='sm' value={margenManual} onChange={e => setMargenManual(e.target.value)} variant='underlined' type="text" label="Margen" />
        <p className='mx-4'>ó</p>
        <Input isDisabled={margenManual != '' ? true : false} isRequired size='sm' value={precioVentaManual} onChange={e=> setPrecioVentaManual(e.target.value)} variant='underlined' type="number" label="Precio" />
        </div>
        :
        ''
      }
      {
        margen != '' || margenManual != ''  ? 
        <Button isLoading={isButtonLoading2} size='md' color="primary" type='submit' disableRipple >Agregar</Button>
        :
        ''
      }
        </form>
      </div>
      <div className={isFullTable? 'w-[100%]': 'w-[50%]'}>
        <GenericTable columns={columns} data={data} isFullTable={isFullTable} handleFullTable={handleFullTable}/>
      </div>
      <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
