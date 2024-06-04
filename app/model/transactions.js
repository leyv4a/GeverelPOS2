const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger');

class TransactionModel {

    static async getAllEntradas() {
        const sql = "SELECT transacciones.id, producto.nombre, producto.codigo, transacciones.tipo, transacciones.motivo, transacciones.cantidad, transacciones.fecha FROM transacciones INNER JOIN producto ON transacciones.productoId = producto.id WHERE tipo = 'Entrada'"
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
            logToFile('Model ' +error.message);
            return { success: false, message: error.message };
        }
    }
}

module.exports = TransactionModel;