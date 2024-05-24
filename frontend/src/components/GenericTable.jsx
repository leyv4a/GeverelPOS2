import React from 'react';
import { FaChevronDown } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoMdMore } from "react-icons/io";
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
} from "@nextui-org/react";

const GenericTable = ({ columns, data }) => {
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(columns.map(col => col.uid)));
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: columns[0]?.uid || "",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
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

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];
        switch (columnKey) {
            // case "nombre":
            //     return (
            //         <User
            //             avatarProps={{ radius: "sm", src: item.avatar }}
            //             description={item.email}
            //             name={cellValue}
            //         >
            //             {item.email}
            //         </User>
            //     );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{item.team}</p>
                    </div>
                );
            case "acciones":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <IoMdMore/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>Ver</DropdownItem>
                                <DropdownItem>Editar</DropdownItem>
                                <DropdownItem>Borrar</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

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
                        startContent={<HiMagnifyingGlass/>}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<FaChevronDown/>} variant="flat">
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
                    <span className="text-default-400 text-small">Elementos totales:  {data.length} </span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por pagina:   
                        <select
                            className="ms-1 bg-transparent outline-none text-default-400 text-small me-3"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5"> 5</option>
                            <option value="10"> 10</option>
                            <option value="15"> 15</option>
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
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "Todos los objetos seleccionados"
                        : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color='primary'
                    className='text-foregrund'
                    page={page}
                    total={pages}
                    onChange={setPage}
                
                />
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Tabla generica"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "min-h-[360px] max-h-[60vh]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
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
            <TableBody emptyContent={"No items found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default GenericTable;
