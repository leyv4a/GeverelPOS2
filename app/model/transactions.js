const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger');

class TransactionModel {

    static async getAllEntradas() {
        const sql = "SELECT transacciones.id, producto.nombre, producto.codigo, transacciones.tipo, transacciones.motivo, transacciones.cantidad, transacciones.fecha FROM transacciones INNER JOIN producto ON transacciones.productoId = producto.id WHERE tipo = 'entrada'"
        const rows = await db.all(sql);
        return rows;
    }

    static async getAllSalidas() {
        const sql = "SELECT transacciones.id, producto.nombre, producto.codigo, transacciones.tipo, transacciones.motivo, transacciones.cantidad, transacciones.fecha FROM transacciones INNER JOIN producto ON transacciones.productoId = producto.id WHERE tipo = 'salida'"
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
}

module.exports = TransactionModel;