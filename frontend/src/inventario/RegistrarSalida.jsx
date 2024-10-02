import React from 'react'
import GenericTable from '../components/GenericTable';
import { ToastContainer, toast } from 'react-toastify';
import { FaMagnifyingGlass, FaKeyboard  } from "react-icons/fa6";
import { RiWeightLine as FaWeightScale} from "react-icons/ri";
import { Button, Input,RadioGroup, Radio } from '@nextui-org/react';
export default function RegistrarSalida() {

  // VALORES DEL PRODUCTO
  const [codigo, setCodigo] = React.useState('');
  const [fecha, setFecha] = React.useState('');
  const [producto, setProducto] = React.useState('');
  const [cantidad, setCantidad] = React.useState('');
  const [unidad,setUnidad] = React.useState('');
  const [motivo,setMotivo] = React.useState('');
  const [productoId, setProductoId] = React.useState('');

  // EL PRODUCTO SE PESARA CON BASCULA? O SE INSERTARA MANUAL?
  const [isManual,setIsManual] = React.useState(true);
  // PROPS PARA LA TABLA
  const [isFullTable, setIsFullTable] = React.useState(false);
  // LOADING PARA EL BOTON DE BUSCAR
  const [isButtonLoading, setIsButtonLoading] = React.useState(false)
    // LOADING PARA EL BOTON DE AGREGAR
  const [isButtonLoading2, setIsButtonLoading2] = React.useState(false)

  const [data,setData] = React.useState([])

  const getWeight = async () => {
    try {
      let cantidadKg = await fetch("http://localhost:3001/api/weight").then(
        (response) => response.json());
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

  const handleCancelar = (e)=> {
    e.preventDefault();
    resetFields();
  }

  const resetFields = () => {
    setCodigo('');
    setFecha('');
    setProducto('');
    setCantidad('');
    setUnidad('');
    setProductoId('');
    setMotivo('');
    setIsManual(true);
  }

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }
  const handleRadioKeyDown = (event, value) => {
    if (event.key === 'Enter') {
      setMotivo(value);
    }
  };

  const addSalida = async (e) => {
    e.preventDefault();
    setIsButtonLoading2(true);
    try {
            // productoId,tipo,motivo, cantidad, fecha , precioVenta
      const response = await fetch('http://localhost:3001/api/pos/exit', {
        method: 'POST',
        mode : 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({productoId, tipo: 'salida', motivo, cantidad, fecha})
      });      
      if(!response.ok) throw new Error('Error al registrar la entrada');
      const result = await response.json();
      resetFields();
      getSalidas();
      toast.success(result.message);  // Mostrar el mensaje recibido del servidor
    } catch (error) {
      toast.error(error.message);
    }finally{
      setIsButtonLoading2(false);
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
      getSalidas();
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const getSalidas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/transaction/exit',{
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
      // resetFields();
      toast.error(error.message || 'Error en la comunicacion con la base de datos', {
        bodyClassName : 'text-foreground'
      })
    }finally{
      setIsButtonLoading(false)
    }
  }

  const searchButtonRef = React.useRef(null);
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

  React.useEffect(()=>{
    getSalidas();
  }, [])
  React.useEffect(()=> {
    const date = new Date();
    const formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, '0') +
    "-" +
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
      <div className={isFullTable? 'hidden': ' sm:w-[50%] w-[80%]'}>
      <form onSubmit={e=>addSalida(e)} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
        <h2 className='text-2xl text-center w-full'>Registrar salidas</h2>
        <div className="flex w-full gap-4">
         <div className='flex'>
          <Input isRequired size='sm' variant='underlined' type="text" label="Producto" value={codigo} onChange={e=> setCodigo(e.target.value)} maxLength={4}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              searchButtonRef.current.click();
            }
          }}/>
          <Button 
                ref={searchButtonRef}
                isIconOnly isLoading={isButtonLoading} size='lg' color="primary" radius='none' disableRipple onClick={e => getProductByCode(e)}><FaMagnifyingGlass/></Button>
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
          <Button isIconOnly size='lg' color="primary" radius='none' disableRipple onClick={() => getWeight()}><FaWeightScale/></Button>
          <Button isIconOnly size='lg' color="foreground" onClick={() => setIsManual(!isManual)} className="border border-primary" radius='none' disableRipple><FaKeyboard /></Button>
        </div>
        {/* <Input isRequired size='sm' variant='underlined' value={inversion} onChange={e => setInversion(e.target.value.replace(/[^0-9.]/g, ''))} type="text" label="Costo por kilo" className='max-w-[40%]'/> */}
       </div>
         : producto != '' && unidad == 'unidad' ? 
         <div className='flex w-full gap-4'>
            <Input isRequired size='sm' variant='underlined' value={cantidad} onChange={e => setCantidad(e.target.value.replace(/[^0-9.]/g, ''))} label="Cantidad" />
        </div>
         : ''
      }
       {
        cantidad != '' ? 
        <RadioGroup
        label="Motivo"
        value={motivo}
        onValueChange={setMotivo}
        orientation="horizontal"
        size='sm'
      >
        <Radio value="obsequio" onKeyDown={e=> handleRadioKeyDown(e, 'obsequio')} tabIndex="0">Obsequio</Radio>
        <Radio value="otro" onKeyDown={e=> handleRadioKeyDown(e, 'otro')} tabIndex="0">Otro</Radio>
        <Radio value="merma" onKeyDown={e=> handleRadioKeyDown(e, 'merma')} tabIndex="0">Merma</Radio>
      </RadioGroup>
      :''
      }
          <div className='flex gap-2'>
      {
        motivo != ''   ? 
        <Button isLoading={isButtonLoading2} size='md' color="primary" type='submit' disableRipple className='w-full'>Registrar</Button>
        :
        ''
      }
       <Button  size='md' color="danger" onClick={e => handleCancelar(e)}  disableRipple className={producto != '' ? 'w-full' : 'hidden'}>Cancelar</Button>
       </div>
      </form>
      </div>
      <div className={isFullTable ? 'w-[100%]' : 'sm:w-[50%] w-[80%]'}>
        <GenericTable isFullTable={isFullTable} handleFullTable={handleFullTable} columns={columns} data={data} onDelete={deleteById}/>
      </div>
      <div>
        <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
      </div>
    </div>
  )
}
