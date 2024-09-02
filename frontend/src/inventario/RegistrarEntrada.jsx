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
  const [productoId, setProductoId] = React.useState('');
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

  const getWeight = async () => {
    try {
      let cantidadKg = await fetch("http://localhost:3001/api/weight").then(
        (response) => response.json());

        // if (cantidadKg.error?.trim() != '') {
        //   toast.error('No hay ninguna bascula disponible');
        // }else{
        //   setCantidad(parseFloat(cantidad.weight.trim().replace(" kg", "")))
        // }
        if (cantidadKg?.weight != '') {
          let cantidad2 = cantidadKg.weight.replace(" kg", "")
          setCantidad(parseFloat(cantidad2))
        }else{
          toast.error('No hay ninguna bascula disponible');
        }
       
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const handleCancelar = (e)=> {
    e.preventDefault();
    resetFields();
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
    setProductoId('');
  }

  const addEntradas = async (e) => {
    e.preventDefault();
    setIsButtonLoading2(true);
    try {
      const calculatedPrecioVenta = await calculatePrecioVenta(); // Espera a que se resuelva la promesa
            // productoId,tipo,motivo, cantidad, fecha , precioVenta, precioCompra
      const response = await fetch('http://localhost:3001/api/pos/entry', {
        method: 'POST',
        mode : 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({productoId, tipo: 'entrada', motivo, cantidad, fecha, precioVenta : calculatedPrecioVenta , precioCompra: inversion})
      });      
      if(!response.ok) throw new Error('Error al registrar la entrada');
      const result = await response.json();
      resetFields();
      getEntradas();
      toast.success(result.message);  // Mostrar el mensaje recibido del servidor
    } catch (error) {
      toast.error(error.message);
    }finally{
      setIsButtonLoading2(false);
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

  const deleteById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/transaction/${id}`, {
        method : 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      if (!response.ok) throw new Error('Error al eliminar la transaccion');
      const result = await response.json();
      toast.success(result.message);
      getEntradas();
    } catch (error) {
      toast.error(error.message)
      console.log(error)
      getEntradas();

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
    if (producto == '') {
      setFecha('')
    }
  }, [producto])
  return (
    <div className='flex gap-6 max-h-[100%] p-5 sm:flex-row  flex-col'>
      <div className={isFullTable? 'hidden': 'sm:w-[50%] w-[80%]'}>
        <form onSubmit={e=>addEntradas(e)} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
        <h2 className='text-2xl text-center w-full'>Registrar entradas</h2>
        <div  className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className='flex'>
          <Input isRequired size='sm' variant='underlined' type="text" label="Producto" value={codigo} onChange={e=> setCodigo(e.target.value)} maxLength={4}/>
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
          <Input isRequired size='sm' variant='underlined' value={cantidad} onChange={e=> setCantidad(e.target.value.replace(/[^0-9.]/g, ''))} isDisabled={isManual} label="Cantidad" />
          <Button isIconOnly size='lg' color="primary" radius='none' disableRipple onClick={e=>getWeight()}><FaWeightScale/></Button>
          <Button isIconOnly size='lg' color="foreground" onClick={e => setIsManual(!isManual)} className="border border-primary" radius='none' disableRipple><FaKeyboard /></Button>
        </div>
        <Input isRequired size='sm' variant='underlined' value={inversion} onChange={e => setInversion(e.target.value.replace(/[^0-9.]/g, ''))} type="text" label="Costo por kilo" className='max-w-[40%]'/>
       </div>
         : producto != '' && unidad == 'unidad' ? 
         <div className='flex w-full gap-4'>
            <Input isRequired size='sm' variant='underlined' value={cantidad} onChange={e => setCantidad(e.target.value.replace(/[^0-9.]/g, ''))} label="Cantidad" />
            <Input isRequired size='sm' variant='underlined' value={inversion} onChange={e => setInversion(e.target.value.replace(/[^0-9.]/g, ''))} type="text" label="Costo por unidad" />
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
        <Input isDisabled={precioVentaManual != '' ? true : false} isRequired size='sm' value={margenManual} onChange={e => setMargenManual(e.target.value.replace(/[^0-9.]/g, ''))} variant='underlined' type="text" maxLength={4} label="Margen" />
        <p className='mx-4'>ó</p>
        <Input isDisabled={margenManual != '' ? true : false} isRequired size='sm' value={precioVentaManual} onChange={e=> setPrecioVentaManual(e.target.value.replace(/[^0-9.]/g, ''))} variant='underlined' label="Precio" />
        </div>
        :
        ''
      }
      <div className='flex gap-2'>
      {
        margen != '' || margenManual != ''  ? 
        <Button isLoading={isButtonLoading2} size='md' color="primary" type='submit' disableRipple className='w-full'>Registrar</Button>
        :
        ''
      }
       <Button  size='md' color="danger" onClick={e => handleCancelar(e)}  disableRipple className={producto != '' ? 'w-full' : 'hidden'}>Cancelar</Button>
       </div>
        </form>
      </div>
      <div className={isFullTable? 'w-[100%]': 'sm:w-[50%] w-[80%]'}>
        <GenericTable columns={columns} data={data} isFullTable={isFullTable} handleFullTable={handleFullTable} onDelete={deleteById}/>
      </div>
      <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
