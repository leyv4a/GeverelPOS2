const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger');

class TransactionModel {

    static async getAllEntradas() {
        const sql = "SELECT transacciones.id, producto.nombre, producto.codigo, transacciones.tipo, transacciones.motivo, transacciones.cantidad, transacciones.fecha FROM transacciones INNER JOIN producto ON transacciones.productoId = producto.id WHERE tipo = 'entrada' ORDER BY transacciones.id DESC"
        const rows = await db.all(sql);
        return rows;
    }

    static async getAllSalidas() {
        const sql = "SELECT transacciones.id, producto.nombre, producto.codigo, transacciones.tipo, transacciones.motivo, transacciones.cantidad, transacciones.fecha FROM transacciones INNER JOIN producto ON transacciones.productoId = producto.id WHERE tipo = 'salida' ORDER BY transacciones.id DESC"
        const rows = await db.all(sql);
        return rows;
    }
    // productoId INTEGER NOT NULL, tipo TEXT NOT NULL, motivo TEXT NOT NULL,  catidad REAL NOT NULL, fecha TEXT 
    static async createEntrada(productoId,tipo,motivo, cantidad, fecha ){
        const sql = "INSERT INTO transacciones (productoId,tipo,motivo,cantidad,fecha) VALUES (?,?,?,?,?)"
        try {
            await db.run(sql, [productoId,tipo,motivo, cantidad, fecha]);
            return {success: true, message : 'Transaccion creada correctamente'};
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    static async deleteById(id){
        const sql = "DELETE FROM transacciones WHERE id =?";
        try {
            await db.run(sql, [id]);
            return {success :true, message: 'Transaccion eliminada correctamente'}; // Retorna true si la inserción es exitosa
        } catch (error) {
            return {success :false, message: error.message}
        }
    }

    static async getTotalVentas(fechaInicio, fechaFin) {
        const sql = `SELECT SUM(cantidad) as totalVendido 
                     FROM transacciones 
                     WHERE motivo = 'venta' 
                     AND fecha BETWEEN strftime('%Y-%m-%d %H:%M:%S', ?) AND strftime('%Y-%m-%d %H:%M:%S', ?)`;
        try {
            const row = await db.get(sql, [fechaInicio, fechaFin]);
            return row ? row.totalVendido || 0 : 0; // Devuelve 0 si no hay ventas
        } catch (error) {
            logToFile(`Error fetching total ventas: ${error.message}`);
            return 0;
        }
    }

    static async getTopTres({inicio, fin}) {
        const sql = `SELECT P.nombre AS Producto, 
       SUM(T.cantidad) AS TotalVendido
        FROM transacciones T
        JOIN producto P ON T.productoId = P.id
        WHERE T.motivo = 'venta'
        AND T.fecha BETWEEN strftime('%Y-%m-%d %H:%M:%S', ?) AND strftime('%Y-%m-%d %H:%M:%S', ?)
        GROUP BY P.id
        ORDER BY TotalVendido DESC
        LIMIT 3;`
try {
    const row = await db.all(sql, [inicio, fin]);
    return row 
} catch (error) {
    logToFile(`Error fetching top three products: ${error.message}`);
    }
     }
    }
module.exports = TransactionModel;