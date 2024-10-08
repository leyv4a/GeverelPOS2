const db = require("../database/database"); // Importa la conexión a la base de datos SQLite

class DashboardModel {
  static async getVentaDiaria() {
    const sql =
      "SELECT strftime('%d', REPLACE(fecha, '/', '-')) AS dia, COUNT(*) AS ventas FROM ventas WHERE strftime('%Y-%m', REPLACE(fecha, '/', '-')) = strftime('%Y-%m', 'now') GROUP BY dia;";
    const rows = await db.all(sql);
    return rows;
  }

  static async getTotales() {
    const sql = `SELECT Mes, GastosTotales, GananciasBrutas, 
       (GananciasBrutas - GastosTotales) AS GananciasNetas, 
       (GananciasNetas / GananciasBrutas * 100) AS Margen 
FROM (
  SELECT strftime('%Y-%m', REPLACE(fecha, '/', '-')) AS Mes, 
         SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS GananciasBrutas, 
         SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS GastosTotales, 
         SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE -monto END) AS GananciasNetas 
  FROM cartera 
  WHERE strftime('%Y-%m', REPLACE(fecha, '/', '-')) = strftime('%Y-%m', 'now') 
  GROUP BY Mes
);`;
    const rows = await db.all(sql);
    return rows;
  }

  static async getTotalesPorTurno({inicio, fin}){
    const sql = `SELECT 
    IFNULL(GastosTotales, 0) AS GastosTotales, 
    IFNULL(GananciasBrutas, 0) AS GananciasBrutas, 
    IFNULL(GananciasBrutas - GastosTotales, 0) AS GananciasNetas, 
    CASE 
        WHEN GananciasBrutas = 0 THEN 0 
        ELSE (GananciasNetas / GananciasBrutas * 100) 
    END AS Margen  
FROM (
  SELECT SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) AS GananciasBrutas, 
         SUM(CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END) AS GastosTotales, 
         SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE -monto END) AS GananciasNetas 
  FROM cartera 
  WHERE fecha BETWEEN strftime('%Y-%m-%d %H:%M:%S', ?) AND strftime('%Y-%m-%d %H:%M:%S', ?)
);`

try {
  const rows = await db.all(sql,[inicio, fin]);
  return rows;
} catch (error) {
  logToFile(`Error fetching total ventas: ${error.message}`);
  return error.message
}
  }

  static async getTopCinco() {
    const sql = `SELECT strftime('%Y/%m', REPLACE(fecha, '/', '-')) AS Mes, P.nombre AS Producto, SUM(T.cantidad) AS TotalVendidoMes, P.unidad AS Unidad
FROM transacciones T
JOIN producto P ON T.productoId = P.id
WHERE T.motivo = 'venta'
GROUP BY Mes, P.id
ORDER BY TotalVendidoMes DESC
LIMIT 5;`;
    const rows = await db.all(sql);
    return rows;
  }
  static async getVentaSemanal() {
    const sql = `SELECT strftime('%w', REPLACE(fecha, '/', '-')) as dia_semana, COUNT(*) as total_ventas FROM ventas WHERE strftime('%Y-%m', REPLACE(fecha, '/', '-')) = strftime('%Y-%m', 'now') GROUP BY dia_semana ORDER BY dia_semana;`;
    const rows = await db.all(sql);
    return rows;
  }

  static async ventasMensuales() {
    // const sql = `SELECT strftime('%Y-%m', REPLACE(fecha, '/', '-')) AS Mes, SUM(T.cantidad) AS TotalVendidoMes FROM transacciones T JOIN producto P ON T.productoId = P.id WHERE T.motivo = 'venta' GROUP BY Mes ORDER BY TotalVendidoMes DESC;`
//     const sql = `SELECT 
//     strftime('%m', REPLACE(fecha, '/', '-')) AS mes,
//     SUM(monto) AS total
// FROM 
//     ventas
// GROUP BY 
//     mes
// ORDER BY 
//     mes ASC;`;
const sql = `WITH meses AS (
    SELECT 01 AS mes, 'ene' AS nombre UNION ALL
    SELECT 02, 'feb' UNION ALL
    SELECT 03, 'mar' UNION ALL
    SELECT 04, 'abr' UNION ALL
    SELECT 05, 'may' UNION ALL
    SELECT 06, 'jun' UNION ALL
    SELECT 07, 'jul' UNION ALL
    SELECT 08, 'ago' UNION ALL
    SELECT 09, 'sep' UNION ALL
    SELECT 10, 'oct' UNION ALL
    SELECT 11, 'nov' UNION ALL
    SELECT 12, 'dic'
)

SELECT 
    m.nombre AS mes,
    COALESCE(SUM(v.monto), 0) AS total
FROM 
    meses m
LEFT JOIN 
    ventas v ON m.mes = CAST(strftime('%m', REPLACE(v.fecha, '/', '-')) AS INTEGER)
GROUP BY 
    m.nombre
ORDER BY 
    m.mes;`
    const rows = await db.all(sql);
    return rows;
  }
}

module.exports = DashboardModel;
