import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";

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

const ShiftPdf = ({ data }) => {
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <Header inicio={data.inicio} cierre={data.cierre} />
          {/* Columna 1 */}
          <View style={styles.section}>
            {/* Prductos mas vendidos */}
            <View style={{ fontSize: 12, marginTop: 3, width: "40%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Productos mas vendidos
              </Text>
              <TableItem
                cantidad={
                  data.topTresProductos[0]
                    ? data.topTresProductos[0].TotalVendido +
                      (data.topTresProductos[0].Unidad === "kg" ? "Kg" : "U")
                    : 0
                }
              >
                {data.topTresProductos[0]
                  ? data.topTresProductos[0].Producto
                  : "Sin datos"}
              </TableItem>
              <TableItem
                cantidad={
                  data.topTresProductos[1]
                    ? data.topTresProductos[1].TotalVendido +
                      (data.topTresProductos[1].Unidad === "kg" ? "Kg" : "U")
                    : 0
                }
              >
                {data.topTresProductos[1]
                  ? data.topTresProductos[1].Producto
                  : "Sin datos"}
              </TableItem>
              <TableItem
                cantidad={
                  data.topTresProductos[2]
                    ? data.topTresProductos[2].TotalVendido +
                      (data.topTresProductos[2].Unidad === "kg" ? "Kg" : "U")
                    : 0
                }
              >
                {data.topTresProductos[2]
                  ? data.topTresProductos[2].Producto
                  : "Sin datos"}
              </TableItem>
            </View>
            {/* Datos */}
            <View style={{ fontSize: 12, marginTop: 3, width: "40%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Datos</Text>
              <TableItem cantidad={2}>Clientes totales</TableItem>
              <TableItem cantidad={4}>Ventas totales</TableItem>
              <TableItem cantidad={0}>Cancelaciones</TableItem>
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
                  (data.totalesPorTurno[0].GananciasBrutas
                    ? data.totalesPorTurno[0].GananciasBrutas
                    : 0)
                }
              >
                Ingresos
              </TableItem>
              <TableItem
                cantidad={
                  "$" +
                  (data.totalesPorTurno[0].GastosTotales
                    ? data.totalesPorTurno[0].GastosTotales
                    : 0)
                }
              >
                Gasto
              </TableItem>
              <TableItem
                cantidad={
                  "$" +
                  (data.totalesPorTurno[0].GananciasNetas
                    ? data.totalesPorTurno[0].GananciasNetas
                    : 0)
                }
              >
                Ganancia
              </TableItem>
            </View>
          </View>
          <View style={styles.section}>
            <View style={{ fontSize: 12, marginTop: 3, width: "100%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Lista de compras
              </Text>
             <TableHeader/>
             <TableData/>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

const columns = [
  {
    title: "Producto",
    key: "producto",
  },
  {
    title: "Stock Min",
    key: "stockMin",
  },
  {
    title: "Ultimo precio de compra",
    key: "ultimoPrecio",
  },
  {
    title: "Stock actual",
    key: "stockActual",
  },
  {
    title: "Compra",
    key: "compra",
  }
];
const tableData = [
  {
    producto: "Manzanas",
    stockMin: 50,
    ultimoPrecio: 1.20,
    stockActual: 30,
    compra: 20, // Faltan 20 para alcanzar 50
  },
  {
    producto: "Bananas",
    stockMin: 40,
    ultimoPrecio: 0.50,
    stockActual: 25,
    compra: 15, // Faltan 15 para alcanzar 40
  },
  {
    producto: "Naranjas",
    stockMin: 60,
    ultimoPrecio: 0.80,
    stockActual: 55,
    compra: 5, // Faltan 5 para alcanzar 60
  },
  {
    producto: "Peras",
    stockMin: 30,
    ultimoPrecio: 1.00,
    stockActual: 10,
    compra: 20, // Faltan 20 para alcanzar 30
  },
  {
    producto: "Uvas",
    stockMin: 25,
    ultimoPrecio: 2.00,
    stockActual: 20,
    compra: 5, // Faltan 5 para alcanzar 25
  },
];

const TableHeader = () => {
  return (
  <>
    <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%",
        paddingTop: 3,
        paddingBottom: 3,}}>
    {
    columns.map((column)=>
        (
          <Text style={{fontFamily: 'Helvetica-Bold', width: '20%', textAlign: 'center',borderTop: "1px solid #c8c8c8",
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

const TableData = () => {
  return (
    <View style={{width: '100%'}}>
      {tableData.map((dataRow, index) => (
        <View key={index} style={{width: '20%',flexDirection: "row", justifyContent: "space-between", width: "100%",borderTop: "1px solid #c8c8c8",
          paddingTop: 3,
          paddingBottom: 3,}}>
          {columns.map((column) => (
            <Text style={{width: '100%', textAlign: 'center'}} key={column.key} >
              {dataRow[column.key]}
            </Text>
          ))}
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

const Header = ({ inicio, cierre }) => {
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
        <Text style={{ fontSize: 12 }}>Gabriel Leyva</Text>
      </View>
    </View>
  );
};

const Viewer = () => {
  const location = useLocation();
  const data = location.state?.data;
  return (
    <>
    <PDFViewer style={{ width: "100%" }}>
      <ShiftPdf data={data} />
    </PDFViewer>
    </>
  );
};

export default Viewer;
