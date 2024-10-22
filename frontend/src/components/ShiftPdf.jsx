import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

const styles = StyleSheet.create({
  page: {
    flexDirection: "col",
  },
  header: {
    margin: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    height: 110,
    width: 575,
  },
  image: {
    width: 100,
    height: 80,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 575,
    margin: 10,
    padding: 10,
  },
});
const columns = [
  {
    title: "Producto",
    key: "nombre",
  },
  {
    title: "Stock Min",
    key: "stockMin",
  },
  {
    title: "Ultimo precio de compra",
    key: "precioCompra",
  },
  {
    title: "Stock actual",
    key: "stock",
  },
  {
    title: "Compra",
    key: "compra",
  }
];

const columns2 = [
  {
    title: "Empleado",
    key: "nombre",
  },
  {
    title: "Motivo",
    key: "motivo",
  },
  {
    title: "Hora",
    key: "fecha",
  },
  {
    title: "Monto",
    key: "monto",
  }
];

const ShiftPdf = ({ data }) => {

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <Header inicio={data.result.inicio} cierre={data.result.cierre} user={data.userName} />
          {/* Columna 1 */}
          <View style={styles.section}>
            {/* Prductos mas vendidos */}
            <View style={{ fontSize: 12, marginTop: 3, width: "40%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Productos mas vendidos
              </Text>
              <TableItem
                cantidad={
                  data.result.topTres[0]
                    ? data.result.topTres[0].TotalVendido +
                      (data.result.topTres[0].Unidad === "kg" ? "Kg" : "U")
                    : 0
                }
              >
                {data.result.topTres[0]
                  ? data.result.topTres[0].Producto
                  : "Sin datos"}
              </TableItem>
              <TableItem
                cantidad={
                  data.result.topTres[1]
                    ? data.result.topTres[1].TotalVendido +
                      (data.result.topTres[1].Unidad === "kg" ? "Kg" : "U")
                    : 0
                }
              >
                {data.result.topTres[1]
                  ? data.result.topTres[1].Producto
                  : "Sin datos"}
              </TableItem>
              <TableItem
                cantidad={
                  data.result.topTres[2]
                    ? data.result.topTres[2].TotalVendido +
                      (data.result.topTres[2].Unidad === "kg" ? "Kg" : "U")
                    : 0
                }
              >
                {data.result.topTres[2]
                  ? data.result.topTres[2].Producto
                  : "Sin datos"}
              </TableItem>
            </View>
            {/* Datos */}
            <View style={{ fontSize: 12, marginTop: 3, width: "55%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Datos</Text>
              <TableItem cantidad={'$'+data.result.fondo.fondo}>Fondo de caja</TableItem>
              <TableItem cantidad={data.result.totalVendido.totalVendido}>Ventas totales</TableItem>
              {/* <TableItem cantidad={4}>Clientes totales</TableItem> */}
              <View style={{width: '100%'}}>
              <View style={{borderTop: "1px solid #c8c8c8", paddingTop: 3,display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Cancelaciones
              </Text>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {data.result.cancelaciones[0]?.totalCancelaciones ? (data.result.cancelaciones[0].totalCancelaciones) : 0}
              </Text>
              </View>
              <TableHeader  col={columns2} wid={'25%'} />
              <View style={{fontSize: 8}}>
              <TableData data={data.result.cancelaciones} col={columns2}/>
              </View>
              </View>
            </View>
          </View>
          {/* Columna 2 */}
          <View style={styles.section}>
            {/* Resumen de ingresos */}
            <View style={{ fontSize: 12, marginTop: 3, width: "40%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Resumen de ingresos
              </Text>
              <TableItem
                cantidad={
                  "$" +
                  (data.result.totalesPorTurno[0].GananciasBrutas
                    ? data.result.totalesPorTurno[0].GananciasBrutas
                    : 0).toFixed(2)
                }
              >
                Ingresos
              </TableItem>
              <TableItem
                cantidad={
                  "$" +
                  (data.result.totalesPorTurno[0].GastosTotales
                    ? data.result.totalesPorTurno[0].GastosTotales
                    : 0).toFixed(2)
                }
              >
                Gasto
              </TableItem>
              <TableItem
                cantidad={
                  "$" +
                  (data.result.totalesPorTurno[0].GananciasNetas
                    ? data.result.totalesPorTurno[0].GananciasNetas
                    : 0).toFixed(2)
                }
              >
                Ganancia
              </TableItem>
              <TableItem
                cantidad={
                   
                  (data.result.totalesPorTurno[0].Margen
                    ? data.result.totalesPorTurno[0].Margen
                    : 0).toFixed(2)+"%"
                }
              >
                Margin
              </TableItem>
            </View>
          </View>
          <View style={styles.section}>
            <View style={{ fontSize: 12, marginTop: 3, width: "100%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Lista de compras
              </Text>
             <TableHeader col={columns} wid={'20%'}/>
             <TableData data={data.result.productosPorComprar} col={columns}/>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

const TableHeader = ({col, wid}) => {
  return (
  <>
    <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%",
        paddingTop: 3,
        paddingBottom: 3,}}>
    {
    col.map((column)=>
        (
          <Text style={{fontFamily: 'Helvetica-Bold', width: `${wid}`, textAlign: 'center',borderTop: "1px solid #c8c8c8",
            paddingTop: 3,
            paddingBottom: 3}} key={column.key}>
            {column.title}
          </Text>
        )  
        )
    }
    </View>
   </>
  )
};

const TableData = ({data, col}) => {
  return (
    <View style={{width: '100%'}}>
      {data.map((dataRow, index) => (
        <View key={index} style={{flexDirection: "row", justifyContent: "space-between", width: "100%",borderTop: "1px solid #c8c8c8",
          paddingTop: 3,
          paddingBottom: 3,}}>
          {col.map((column) => {
            switch (column.key) {
              case 'precioCompra':
                return (
                  <Text style={{width: '100%', textAlign: 'center'}} key={column.key}>
                    {'$'+ dataRow[column.key]}
                  </Text>
                );
                case 'monto':
                return (
                  <Text style={{width: '100%', textAlign: 'center'}} key={column.key}>
                    {'$'+ dataRow[column.key]}
                  </Text>
                );
                case 'nombre':
                return (
                  <Text style={{width: '100%', textAlign: 'center', textTransform: 'capitalize'}} key={column.key}>
                    {dataRow[column.key] ? dataRow[column.key] : 'Gabriel Leyva'}
                  </Text>
                );
                case 'compra':
                return (
                  <Text style={{width: '100%', textAlign: 'center'}} key={column.key}>
                    {(dataRow.stockMin - dataRow.stock).toFixed(2)+(dataRow.unidad == 'kg' ? ' Kg' : ' U')}
                  </Text>
                );
                
                case 'stockMin':
                return (
                  <Text style={{width: '100%', textAlign: 'center'}} key={column.key}>
                    {(dataRow.stockMin).toFixed(2)+(dataRow.unidad == 'kg' ? ' Kg' : ' U')}
                  </Text>
                );
                case 'stock':
                return (
                  <Text style={{width: '100%', textAlign: 'center', color: `${dataRow.stockMin > dataRow.stock ? 'red' : 'green'}`}} key={column.key}>
                    {parseFloat(dataRow[column.key]).toFixed(2)+(dataRow.unidad == 'kg' ? ' Kg' : ' U')}
                  </Text>
                );
              default:
                return (
                  <Text style={{width: '100%', textAlign: 'center'}} key={column.key}>
                    {dataRow[column.key]}
                  </Text>
                );
            }
        })}
        </View>
      ))}
    </View>
  );
};

const TableItem = ({ children, cantidad }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderTop: "1px solid #c8c8c8",
        paddingTop: 3,
        paddingBottom: 3,
      }}
    >
      <Text style={{ paddingLeft: 1, textTransform: "capitalize" }}>
        {children}
      </Text>
      <Text style={{ fontFamily: "Helvetica-Bold", color: "#353535" }}>
        {cantidad}
      </Text>
    </View>
  );
};

const Header = ({ inicio, cierre, user }) => {
  return (
    <View style={styles.header}>
      <Image style={styles.image} src="FruteriaTaky.png" />
      <View
        style={{ flexDirection: "col", fontSize: 12, alignItems: "center" }}
      >
        <Text
          style={{ fontSize: 18, lineHeight: 1, fontFamily: "Helvetica-Bold" }}
        >
          Fruteria Taky
        </Text>
        <Text style={{ fontSize: 18 }}>Reporte de turno</Text>
        <Text style={{ lineHeight: 1 }}>
          {inicio || "Sin datos"} - {cierre || "Sin datos"}
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold" }}>
          Empleado
        </Text>
        <Text style={{ fontSize: 12 }}>{user}</Text>
      </View>
    </View>
  );
};

// const Viewer = () => {
//   const location = useLocation();
//   const data = location.state?.data;
//   return (
//     <>
//     <PDFViewer style={{ width: "100%" }}>
//       <ShiftPdf data={data} />
//     </PDFViewer>
//     </>
//   );
// };
// export default Viewer;

const Viewer = () => {
  const location = useLocation();
  const [data, setData] = useState(null); // Estado para almacenar los datos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    if (location.state?.data) {
      setData(location.state.data); // Asignamos los datos
      setLoading(false); // Una vez los datos están disponibles, desactivamos el loading
    }
    
  }, [location.state]);

  if (loading) {
    return <Loader/>// Mensaje mientras se cargan los datos
  }

  return (
    <PDFViewer style={{ width: "100%", minHeight: "100%" }}>
      <ShiftPdf data={data} />
    </PDFViewer>
  );
};

export default Viewer;