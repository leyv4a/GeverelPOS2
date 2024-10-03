import React from "react";
import { MensualChart, PieCharts } from "../components/Charts";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import Loader from "../components/Loader"
import { ToastContainer } from "react-toastify";
export default function Panel() {
  const [mensualData, setMensualData] = React.useState([]);
  const [totales, setTotales] = React.useState([]);
  const [topCincoData, setTopCincoData] = React.useState([]);
  const [ventaSemanal, setVentaSemanal] = React.useState([]);
  const [ventasMensuales, setVentasMensuales] = React.useState([]);

  // "Mes": "2024-09",
  // "GastosTotales": 0,
  // "GananciasBrutas": 3793.54,
  // "GananciasNetas": 3793.54,
  // "Margen": 100

  React.useEffect(() => {
    // Función asíncrona para obtener los datos
    const fetchData = async () => {
      try {
        const responseMensualData = await fetch('http://localhost:3001/api/dashboard/ventadiaria');
        const resultMensualData = await responseMensualData.json(); // Convertir la respuesta a JSON
        setMensualData(resultMensualData); // Actualizar el estado con los datos obtenidos
        const responseTotales = await fetch('http://localhost:3001/api/dashboard/totales');
        const resultTotales = await responseTotales.json(); // Convertir la respuesta a JSON
        setTotales(resultTotales); // Actualizar el estado con los datos obtenidos
        const responseTopCinco = await fetch('http://localhost:3001/api/dashboard/topcinco');
        const resultTopCinco = await responseTopCinco.json(); // Convertir la respuesta a JSON
        setTopCincoData(resultTopCinco); // Actualizar el estado con los datos obtenidos
        const responseVentaSemanal = await fetch('http://localhost:3001/api/dashboard/ventasemanal');
        const resultVentaSemanal = await responseVentaSemanal.json(); // Convertir la respuesta a JSON
        setVentaSemanal(resultVentaSemanal); // Actualizar el estado con los datos obtenidos
        const responseVentasMensuales = await fetch('http://localhost:3001/api/dashboard/ventasmensuales');
        const months = await responseVentasMensuales.json(); // Convertir la respuesta a JSON
        const resultVentasMensuales = [
          {
            key: "1", // Puedes cambiar el valor de key si es necesario
            ene: months[0].total.toString(),
            feb: months[1].total.toString(),
            mar: months[2].total.toString(),
            abr: months[3].total.toString(),
            may: months[4].total.toString(),
            jun: months[5].total.toString(),
            jul: months[6].total.toString(),
            ago: months[7].total.toString(),
            sep: months[8].total.toString(),
            oct: months[9].total.toString(),
            nov: months[10].total.toString(),
            dic: months[11].total.toString(),
        }
        ]
        setVentasMensuales(resultVentasMensuales); // Actualizar el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching data: ", error);
        return <div>Error obteniendo los datos</div>
      }
    };
    fetchData(); // Llamar a la función asíncrona
  }, []);

  if (totales.length === 0) {
    return <Loader/>
  }
  return (
    <div className="px-5 w-full min-h-screen h-screen my-auto flex flex-col items-center justify-center bg-slate-100">
      <div className="w-full h-[10%] text-3xl flex items-center">
        Registro Mensual {totales[0].Mes}
      </div>
      <div className="w-full h-[20%] py-3 flex  md:gap-8 gap-2">
        <Chart text={totales[0].GananciasBrutas} type={"cash"} head={"Ganancias brutas"} />
        <Chart text={totales[0].GastosTotales} type={"cash"} head={"Gastos totales"} />
        <Chart text={totales[0].GananciasNetas} type={"cash"} head={"Ganancias netas"} />
        <Chart text={totales[0].Margen.toFixed(2)} type={"porcentaje"} head={"Margen"} />
      </div>
      <div className="w-full h-[60%] flex gap-2">
        <MensualChart data={mensualData} />
        <div className="w-[50%] h-full flex flex-col gap-2">
          <div className="flex gap-2 h-[70%] w-full">
            <div className="w-full h-full">
              <PieCharts data={topCincoData} data2={ventaSemanal}/>
            </div>
          </div>
          <div className="w-full h-[30%]">
            {/* <Chart text={'Tomate'} type={''} head={'Mas vendido'}/> */}
           
          </div>
        </div>
      </div>
      <div className="w-full h-[20%] ">
      <MonthlyChart data={ventasMensuales}/>
      </div>
    <ToastContainer
    position="bottom-right"
    autoClose="2000"
    bodyClassName={() => "text-foreground"}
    draggable
  />
    </div>
  );
}

const Chart = ({ text, head, type }) => {
  const renderContent = () => {
    switch (type) {
      case "porcentaje":
        return <p>{text}%</p>;
      case "cash":
        return <p>${parseFloat(text).toFixed(2)}</p>;
      default:
        return <p>{text}</p>;
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader className="w-full">
        <h3 className="w-full text-center capitalize font-bold ">{head}</h3>
      </CardHeader>
      <CardBody>
        <div className="flex justify-center items-center w-full h-full">
          {renderContent()}
        </div>
      </CardBody>
    </Card>
  );
};


const columns = [
  {
    key: "ene",
    label: "Ene",
  },
  {
    key: "feb",
    label: "Feb",
  },
  {
    key: "mar",
    label: "Mar",
  },
  {
    key: "abr",
    label: "Abr",
  },
  {
    key: "may",
    label: "May",
  },
  {
    key: "jun",
    label: "Jun",
  },
  {
    key: "jul",
    label: "Jul",
  },
  {
    key: "ago",
    label: "Ago",
  },
  {
    key: "sep",
    label: "Sep",
  },
  {
    key: "oct",
    label: "Oct",
  },
  {
    key: "nov",
    label: "Nov",
  },
  {
    key: "dic",
    label: "Dic",
  },
];

const MonthlyChart = ({data}) => {
  return (
    <div className="px-3 pb-3 bg-white rounded-lg shadow-md">
        <h2 className="w-full text-center text-2xl font-bold text-[#c13ffe] inline-block align-top">Ventas mensuales</h2>
      <Table removeWrapper aria-label="Tabla de ventas mensual">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}  emptyContent={"Sin datos"}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>${parseFloat(getKeyValue(item, columnKey)).toFixed(1)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
