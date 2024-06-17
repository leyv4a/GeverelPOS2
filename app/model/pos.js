const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger')

class PosModel {
    static async newEntry(productoId,tipo,motivo, cantidad, fecha , precioVenta, precioCompra) {
        try {
            await db.run('BEGIN TRANSACTION');
            logToFile('Transaccion empezada');

            //Registrar la transacción
            const sqlProduct = "INSERT INTO transacciones (productoId,tipo,motivo,cantidad,fecha) VALUES (?,?,?,?,?)"
            await db.run(sqlProduct, [productoId,tipo,motivo, cantidad, fecha]);
            logToFile('Transaccion agregada');
            //Actualizar stock de productos
            const sqlStock = "UPDATE producto SET stock = stock +?, precioVenta = ?, precioCompra = ?  WHERE id =?"
            await db.run(sqlStock, [cantidad,precioVenta, precioCompra, productoId]);
            logToFile('Stock actualizado');
            await db.run('COMMIT');
            logToFile('Transaccion completada');
            return { success: true, message: 'Transacción registrada exitosamente' };
            } catch (error) {
                logToFile(error.message);
                try {
                    await db.run('ROLLBACK');
                    logToFile('Transaccion cancelada');
                    return { success: false, message: error.message };
                    } catch (error) {
                     logToFile(error.message);
                     return { success: false, message: error.message}
                }
            }
    }
}

module.exports = PosModel;