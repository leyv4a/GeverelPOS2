// import React from 'react'
import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
// Create styles

// Font.register({ family: 'Helvetica', src: source, fontStyle: 'normal', fontWeight: 'normal', fonts?: [] })

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
    width: 575,
    margin: 10,
    padding: 10,
  },
});

const ShiftPdf = ({data}) => {
  const data2 = data;
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <Header />
          <View style={styles.section}>
            <Text style={{fontFamily: 'Helvetica-Bold'}}>Productos mas vendidos</Text>
            <View style={{fontSize: 12, marginTop: 3, width: '40%' }}>
              <TableItem cantidad={data2.topTresProductos[0].TotalVendido}>{data2.topTresProductos[0].Producto}</TableItem>
              <TableItem cantidad={data2.topTresProductos[1].TotalVendido}>{data2.topTresProductos[1].Producto}</TableItem>
              <TableItem cantidad={data2.topTresProductos[2].TotalVendido}>{data2.topTresProductos[2].Producto}</TableItem>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={{fontFamily: 'Helvetica-Bold'}}>Resumen de ingresos</Text>
            <View style={{fontSize: 12, marginTop: 3, width: '40%' }}>
              <TableItem cantidad={data2.totalesPorTurno[0].GananciasBrutas || 0}>Ingresos</TableItem>
              <TableItem cantidad={data2.totalesPorTurno[0].GastosTotales  || 0}>Gasto</TableItem>
              <TableItem cantidad={data2.totalesPorTurno[0].GananciasNetas || 0}>Ganancia</TableItem> 
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

const TableItem = ({children, cantidad}) => {
  return (
   <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%',borderTop: '1px solid #c8c8c8', paddingTop: 3, paddingBottom:3}}>
     <Text style={{paddingLeft: 1}}>
      {children} 
    </Text>
    <Text style={{fontFamily: 'Helvetica-Bold', color: '#353535'}}>
      {cantidad}
    </Text>
   </View>
  )
}

const Header = () => {
  return (
    <View style={styles.header}>
    <Image style={styles.image} src="FruteriaTaky.png" />
    <View style={{flexDirection: 'col', fontSize: 12, alignItems: 'center'}}>
      <Text style={{fontSize: 18, lineHeight: 1, fontFamily: 'Helvetica-Bold'}}>Fruteria Taky </Text>
      <Text style={{fontSize: 18}}>Reporte de turno</Text>
      <Text style={{lineHeight: 1}}>22-03-2024 10:12:01 - 22-03-2024 16:30:00 </Text>
    </View>
    <View>
    <Text style={{fontSize:12}}>
      Gabriel Leyva
    </Text>
    </View>
  </View>
  )
}

const Viewer = () => {
  return (
    <PDFViewer style={{ width: "100%", height: "" }}>
      <ShiftPdf />
    </PDFViewer>
  );
};

export default ShiftPdf;
