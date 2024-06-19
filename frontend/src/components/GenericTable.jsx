import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoMdEye } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { RiPencilFill } from "react-icons/ri";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
  Tooltip,
  useDisclosure
} from "@nextui-org/react";
import ContentPopOver from './PopoverContent';

const GenericTable = ({
  columns,
  data,
  onDelete,
  isFullTable,
  handleFullTable,
  onDetails,
  onEdit,
  handleEditing,
}) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(columns.map((col) => col.uid))
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: columns[0]?.uid || "",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);


  React.useEffect(() => {
    if (columns.length > 4) {
      const initialVisibleColumns = new Set(
        columns.slice(0, 4).map((col) => col.uid)
      );
      initialVisibleColumns.add(columns[columns.length - 1].uid);
      setVisibleColumns(initialVisibleColumns);
    } else {
      setVisibleColumns(new Set(columns.map((col) => col.uid)));
    }
  }, [columns]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns, columns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];
    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredData;
  }, [data, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

 
  const {isOpen, onOpen, onOpenChange} = useDisclosure();  
  const [nombre, setNombre] = React.useState('a');
  const [id, setId] = React.useState('b')

  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        // case "nombre":
        //     return (
        //         <div className='flex flex-col'>
        //             {item.nombre}
        //             <small className='m-0 p-0 text-gray-500'>{item.categoria}</small>
        //         </div>
        //     );
        // case "role":
        //     return (
        // <div className="flex flex-col">
        //     <p className="text-bold text-small capitalize">{cellValue}</p>
        //     <p className="text-bold text-tiny capitalize text-default-400">{item.team}</p>
        // </div>
        // );
        case "stock" :
          return (
          <>
          <p className={`font-bold ${item.stock < item.stockMin ? 'text-danger' : item.stock == item.stockMin ? 'text-warning' : 'text-success'}`}>{item.stock}</p>
          </>
          );
        case "acciones":
            return (
            <div className="relative flex items-center gap-2">
              {onDetails ? (
                <Tooltip color="primary" content="Detalles">
                  <span className="text-lg text-default-400 hover:text-foreground cursor-pointer active:opacity-50">
                    <IoMdEye />
                  </span>
                </Tooltip>
              ) : (
                ""
              )}
             {onEdit ? (
               <Tooltip color="primary" content="Editar">
               <button
                 onClick={() => handleEditing(item)}
                 className="text-lg text-default-400 hover:text-foreground cursor-pointer active:opacity-50"
               >
                 <RiPencilFill />
               </button>
             </Tooltip>
             ) : ("")
             }
              <Tooltip color="danger" content="Eliminar">
                <div className="flex flex-wrap gap-4">
                  <button
                    // isIconOnly
                    // variant="primary"
                    onClick={()=> {setNombre(item.nombre || 'undefined'); setId(item.id || 'undefined');onOpen();}}
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                  >
                    <FaTrash />
                  </button>
                  {/* <ContentPopOver isOpen={isOpen} onOpenChange={onOpenChange} name={item.nombre} id={item.id} onDelete={onDelete}/> */}
                </div>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    // [onDelete, isOpen, onOpen]
    [onDetails, handleEditing , onOpen, isOpen, onDelete]
  );

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre"
            variant="bordered"
            startContent={<HiMagnifyingGlass />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="bordered" endContent={<FaChevronDown />}>
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de la tabla"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.nombre}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Elementos totales: {data.length}{" "}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por pagina:
            <select
              className="ms-1 bg-transparent outline-none text-default-400 text-small me-3"
              onChange={onRowsPerPageChange}
            >
              <option value="5"> 5</option>
              <option value="10"> 10</option>
              <option value="100"> 100</option>
              {/* <option value="15"> 15</option> */}
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    data.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {/* <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "Todos los objetos seleccionados"
                        : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
                </span> */}
        <Button isIconOnly variant="borderer" onPress={handleFullTable}>
          {isFullTable ? (
            <HiOutlineChevronDoubleRight />
          ) : (
            <HiOutlineChevronDoubleLeft />
          )}
        </Button>
        <Pagination
          page={page}
          total={pages == 0 ? 1 : pages}
          onChange={setPage}
          showControls
          loop
          showShadow
          isCompact
          variant="borderer"
        />
      </div>
    );
  }, [selectedKeys, items.length, page, isFullTable, pages, hasSearchFilter]);

  return (
    <>
    <Table
      aria-label="Tabla generica"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="inside"
      classNames={{
          wrapper: "min-h-[286px] max-h-[70vh]",
          }}
          selectedKeys={selectedKeys}
          // selectionMode="multiple" Habiliar la seleccion multiple
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="inside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
          >
      <TableHeader columns={headerColumns}>
        {(column) => (
            <TableColumn
            key={column.uid}
            align={column.uid === "acciones" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.nombre}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No hay elementos"} items={sortedItems}>
        {(item) => (
            <TableRow className="capitalize" key={item.id}>
            {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
          </TableRow>
        )}
      </TableBody>
    </Table>
     <ContentPopOver isOpen={isOpen} onOpenChange={onOpenChange} onDelete={onDelete} onClose={onOpenChange} name={nombre} id={id} />
    </>
  );
};

export default GenericTable;
