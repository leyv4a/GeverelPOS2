const db = require("../database/database"); // Importa la conexión a la base de datos SQLite
const logToFile = require("../utils/logger");
class Shift {


    static async StartShift(usuarioId, inicio){
        const sql = `INSERT INTO turnos (usuarioId, inicio) VALUES (?, ?)`;
        try {
          await db.run(sql, [usuarioId, inicio]);
          return { success: true, message: 'Turno iniciado correctamente' };
        } catch (error) {
          logToFile(`Error creating shift: ${error.message}`);
          return { success: false, message: error.message };
        }
    }

    static async EndShift(shiftId, cierre, fondo){
        const sql = `UPDATE turnos SET cierre = ?, fondo = ? WHERE id = ?`;
        try {
          await db.run(sql, [cierre,  fondo,shiftId]);
          return { success: true, message: 'Turno cerrado correctamente' };
        } catch (error) {
          logToFile(`Error closing shift: ${error.message}`);
          return { success: false, message: error.message };
        }
    }

    static async getAllShifts(){
      // Hacer un inner join para obtener el nombre del usuario
      const sql = `SELECT U.nombre, T.id, T.inicio, T.cierre, T.fondo FROM turnos T INNER JOIN usuario U ON T.usuarioId = U.id WHERE T.cierre IS NOT NULL ORDER BY T.id DESC`
      try {
        const rows = await db.all(sql);
        return {success:true , result: rows};
      } catch (error) {
        logToFile(`Error fetching all shifts: ${error.message}`);
        return { success: false, message: error.message };
      }
    }

    static async getOpenShiftByUser(usuarioId) {
        const sql = `SELECT * FROM turnos WHERE usuarioId = ? AND cierre IS NULL ORDER BY inicio DESC LIMIT 1`;
        try {
          const row = await db.get(sql, [usuarioId]);
          return row ? { success: true, shift: row } : { success: false, message: 'No hay turnos abiertos' };
        } catch (error) {
          logToFile(`Error fetching open shift: ${error.message}`);
          return { success: false, message: error.message };
        }
      }

   static async getShiftData(inicio, cierre){
    try {
      await db.run('BEGIN TRANSACTION');
      logToFile('Transaccion empezada');

      // TotalVentas, TopTres, Cancelaciones, TotalesPorTurno, ProductosPorComprar
      const sqlTotalVendido = `SELECT COUNT(cantidad) as totalVendido 
        FROM transacciones 
        WHERE motivo = 'venta' 
        AND fecha BETWEEN strftime('%Y-%m-%d %H:%M:%S', ?) AND strftime('%Y-%m-%d %H:%M:%S', ?)`
      const totalVendido = await db.get(sqlTotalVendido, [inicio, cierre]);

      const sqlTopTres = `SELECT P.nombre AS Producto, 
        P.unidad AS Unidad,
        SUM(T.cantidad) AS TotalVendido
        FROM transacciones T
        JOIN producto P ON T.productoId = P.id
        WHERE T.motivo = 'venta'
        AND T.fecha BETWEEN strftime('%Y-%m-%d %H:%M:%S', ?) AND strftime('%Y-%m-%d %H:%M:%S', ?)
        GROUP BY P.id
        ORDER BY TotalVendido DESC
        LIMIT 3;`                  
      const topTres = await db.all(sqlTopTres, [inicio,cierre]) 
      
      const SqlCancelaciones = `SELECT V.fecha, V.monto, V.motivoCancelacion as motivo,
        (SELECT COUNT(*) 
        FROM ventas 
        WHERE status = 'cancelled' 
        AND fecha BETWEEN strftime('%Y-%m-%d %H:%M:%S', ?) 
        AND strftime('%Y-%m-%d %H:%M:%S', ?)
        ) as totalCancelaciones
        FROM ventas V 
        WHERE V.status = 'cancelled'
        AND V.fecha BETWEEN strftime('%Y-%m-%d %H:%M:%S', ?) AND strftime('%Y-%m-%d %H:%M:%S', ?)`    
      const cancelaciones = await db.all(SqlCancelaciones, [inicio, cierre, inicio, cierre])

      const sqlTotalesPorTurno = `SELECT 
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
      const totalesPorTurno = await db.all(sqlTotalesPorTurno, [inicio, cierre])

      const sqlProductosPorComprar = `SELECT 
        producto.nombre, 
        producto.stockMin, 
        producto.unidad,
        producto.precioCompra, 
        producto.stock
      FROM 
          producto
      WHERE 
          producto.stock < producto.stockMin 
          AND producto.precioCompra IS NOT NULL
      ORDER BY 
          producto.id;`
      const productosPorComprar = await db.all(sqlProductosPorComprar)

      // get fondo
      const fondo = await db.get('SELECT fondo FROM turnos WHERE inicio = ? AND cierre = ?', [inicio, cierre])

      await db.run('COMMIT')    
      logToFile("Transaccion completada")

      return {success:true, totalVendido, topTres, totalesPorTurno, inicio, cierre,fondo ,cancelaciones, productosPorComprar}
      
    } catch (error) {
      logToFile(error.message);
      try {
        await db.run('ROLLBACK');
        logToFile('Transaccion cancelada');
        return { success: false, message: error.message };
      } catch (rollbackError) {
        logToFile(rollbackError.message);
        return { success: false, message: rollbackError.message };
      }
    }
   }
}

module.exports = Shift;