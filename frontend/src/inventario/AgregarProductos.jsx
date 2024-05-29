import React from 'react'
import GenericTable from '../components/GenericTable';
import { ToastContainer, toast } from 'react-toastify';
export default function AgregarProductos() {

  //Guarda los productos que traera la api 
  const [products, setProducts] = React.useState([])

  //Guardan los valores de los input para agregar un nuevo producto

  const [isFullTable, setIsFullTable] = React.useState(false);

  const handleFullTable = () => {
    setIsFullTable(!isFullTable);
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

  const columns = [ 
  { uid: 'id', nombre: 'Id', sortable: true },
  { uid: 'nombre', nombre: 'Nombre', sortable: true },
  { uid: 'categoria', nombre: 'Categoria', sortable: true },
  { uid: 'descripcion', nombre: 'Descripcion', sortable: false },
  { uid: 'stock', nombre: 'Stock', sortable: true },
  { uid: 'stockMin', nombre: 'Stock Min.', sortable: true },
  { uid: 'precioVenta', nombre: 'Precio', sortable: true },
  { uid: 'precioCompra', nombre: 'Precio (Compra)', sortable: true },
  { uid: 'codigo', nombre: 'Codigo', sortable: false },
  ];
  React.useEffect(() => {
    getProducts();
  }, [])
  return (
    <>
      <div className='flex gap-6 p-5 max-h-[100%]'>
        <div className={isFullTable? 'hidden':' w-[50%]' }>

        </div>
        <div className={isFullTable? 'w-[100%]' : 'w-[50%]'}>
          <GenericTable columns={columns} data={products} onDelete={'delete by id request'} isFullTable={isFullTable} handleFullTable={handleFullTable}/>
        </div>
        <div>
          <ToastContainer position='bottom-right' autoClose='2000' bodyClassName={() => "text-foreground"} draggable/>
        </div>
      </div>
    </>
  )
}
