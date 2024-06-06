import React from 'react'
import GenericTable from '../components/GenericTable';
import { ToastContainer, toast } from 'react-toastify';
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {Select, SelectItem, RadioGroup, Radio} from "@nextui-org/react";
export default function AgregarProductos() {

  //Guarda los productos que traera la api 
  const [products, setProducts] = React.useState([])
  //Guarda la lista de categorias obtenidas de la api
  const [categories, setCategories] = React.useState([])
  //Guarda la categoria seleccionada
  const [category, setCategory] = React.useState(0)
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  //Guardan los valores de los input para agregar un nuevo producto
  const [id, setId] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  //Este se debe agregar al registrar entrada nueva
  const [stockMin, setStockMin] = React.useState('');
  const [codigo, setCodigo] = React.useState('');
  const [unidad, setUnidad] = React.useState('');
  const [inicial, setInicial] = React.useState('');

  const [editing, setEditing] = React.useState(false);

  const handleEditing = (item) => {
    setEditing(!editing)
    setId(item.id),
    setNombre(item.nombre),
    setDescripcion(item.descripcion),
    setStockMin(item.stockMin),
    setCodigo(item.codigo),
    setCategory(item.categoriaId),
    setUnidad(item.unidad);
  }
  // const [] = React.useState('');
  const resetFields = () => {
    setNombre('');
    setDescripcion('');
    setStockMin('');
    setCodigo('');
    setCategory(0)
    setUnidad('')
  }

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find(item => item.id.toString() === value);
    if (selectedCategory) {
      setCategory(parseInt(value));
      setInicial(selectedCategory.inicial);
    }
  }

  const [isFullTable, setIsFullTable] = React.useState(false);

  const handleRadioKeyDown = (event, value) => {
    if (event.key === 'Enter') {
      setUnidad(value);
    }
  };

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
  }

  const updateProductById = async(e) =>{
    e.preventDefault();
    setIsButtonLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/product',{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, nombre, descripcion, stockMin, codigo,  unidad ,categoriaId: category})
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error en la comunicación con la base de datos');
      }
      toast.success(result.message);
      resetFields();
      getProducts();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }finally{
      setIsButtonLoading(false);
      setEditing(false);
    }
  } 

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
      toast.error(error);
      console.log(error);
    }
  }

  const getCategories = async() => {
    try {
      const response = await fetch('http://localhost:3001/api/category', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategories(data)
    } catch (error) {
      console.log(error)
       toast.error('Error en la comunicacion con la base de datos', {
         bodyClassName : 'text-foreground'
       });
    }
   }

  const createProduct = async (e) => {
    e.preventDefault();
    setIsButtonLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre,
          descripcion : descripcion,
          stockMin: stockMin,
          codigo: codigo,
          unidad: unidad,
          categoriaId: category
        })    
      });

      const result = await response.json();
      if (!response.ok) {
          throw new Error(result.error || 'Error en la comunicación con la base de datos');
      }

      toast.success(result.message);
      getProducts();
      resetFields();
    } catch (error) {
      toast.error(error.message);
    }finally{
      setIsButtonLoading(false);
    }
  }

  const deleteProductById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/product/${id}`, {
        method: 'DELETE',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto.');
      }
       
    const result = await response.json();
    toast.success(result.message);  // Mostrar el mensaje recibido del servidor
      getProducts();
      getCategories();
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  const columns = [ 
  { uid: 'id', nombre: 'Id', sortable: true },
  { uid: 'nombre', nombre: 'Nombre', sortable: true },
  { uid: 'categoria', nombre: 'Categoria', sortable: true },
  { uid: 'descripcion', nombre: 'Descripcion', sortable: false },
  { uid: 'codigo', nombre: 'Codigo', sortable: false },
  { uid: 'unidad', nombre: 'Unidad', sortable: true },
  { uid: 'stock', nombre: 'Stock', sortable: true },
  { uid: 'stockMin', nombre: 'Stock Min.', sortable: true },
  { uid: 'precioVenta', nombre: 'Precio', sortable: true },
  { uid: 'precioCompra', nombre: 'Precio (Compra)', sortable: true },
  { uid: 'acciones', nombre: 'Acciones', sortable: false },
  ];
  React.useEffect(() => {
    getProducts();
    getCategories();
  }, [])

  return (
    <>
      <div className='flex gap-6 p-5 max-h-[100%]'>
        <div className={isFullTable? 'hidden':' w-[50%]' }>
          <form onSubmit={e => { editing? updateProductById(e) : createProduct(e)}} className="flex w-full flex-col flex-wrap md:flex-nowrap gap-4">
          <h2 className='text-2xl text-center w-full'>Registrar nuevo producto</h2>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input pattern="[A-Za-z\s]+" errorMessage="Por favor rellene este campo." variant='underlined'  value={nombre} onChange={e =>{setNombre(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}} isRequired type="text" label="Nombre" size='sm'/>
              <Select
                isRequired
                size='sm'
                label="Categoria"
                variant="underlined"
                selectedKeys={[category.toString()]} // Asegúrate de que sea un array de string
                className="max-w-xs"
                onChange={e => handleCategoryChange(e.target.value)}
              >
                {categories.map((items) => (
                  <SelectItem className='capitalize' value={`${items.id.toString()}|${items.inicial}`} key={items.id}>
                    {items.nombre}
                  </SelectItem>
                ))}
              </Select>
          </div>
          <Input pattern="[A-Za-z\s]+" variant='underlined' value={descripcion} onChange={e =>{setDescripcion(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}} isRequired type="text" label="Descripcion" size='sm'/>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Input pattern="\d+" errorMessage="Por favor rellene este campo." variant='underlined'  value={inicial+codigo} onChange={e =>{setCodigo(e.target.value.replace(/[^\d]/g, ''))}} isRequired type="text" label="Codigo" size='sm'  maxLength={4}/>
            <Input pattern="\d+" variant='underlined' value={stockMin} onChange={e =>{setStockMin(e.target.value.replace(/[^\d]/g, ''))}} isRequired type="text" label="Stock Min." size='sm'/>
          </div>
            <RadioGroup
              label="Selecciona la unidad de medida"
              value={unidad}
              onValueChange={setUnidad}
              orientation="horizontal"
              size='sm'
            >
              <Radio value="kg"  onKeyDown={(e) => handleRadioKeyDown(e, 'kg')} tabIndex="0">Kilogramos</Radio>
              <Radio value="unidad"  onKeyDown={(e) => handleRadioKeyDown(e, 'unidad')} tabIndex="0">Unidad</Radio>
            </RadioGroup>
                {editing?  
          <div className='flex gap-2'>
            <Button radius="sm" isLoading={isButtonLoading} color='primary' type='submit'  className="border my-auto w-full" >Editar</Button>
            <Button radius="sm" onClick={() => {resetFields();handleEditing(); }} color='danger' className="border my-auto w-full" >Cancelar</Button>
          </div> :
          <Button radius="sm" isLoading={isButtonLoading} color='primary' type='submit'  className="border my-auto " >Agregar</Button>
          }
          </form>
        </div>
        <div className={isFullTable? 'w-[100%]' : 'w-[50%]'}>
          <GenericTable columns={columns} data={products} onDelete={deleteProductById} isFullTable={isFullTable} handleFullTable={handleFullTable} onDetails={true} handleEditing={handleEditing}/>
        </div>
        <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
        </div>
        {/* <div className="flex flex-col gap-3">
        </div> */}
      </div>
    </>
  )
}
