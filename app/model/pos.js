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
            const sqlStock = "UPDATE producto SET stock = stock + ?, precioVenta = ?, precioCompra = ?  WHERE id =?"
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
                    return { success: false, message: error.message};
                    } catch (error) {
                     logToFile(error.message);
                     return { success: false, message: error.message}
                }
            }
    }

    static async newExit(productoId,tipo,motivo, cantidad, fecha) {
        try {
            await db.run('BEGIN TRANSACTION');
            logToFile('Transaccion empezada');

            //Registrar la transacción
            const sqlProduct = "INSERT INTO transacciones (productoId,tipo,motivo,cantidad,fecha) VALUES (?,?,?,?,?)"
            await db.run(sqlProduct, [productoId,tipo,motivo, cantidad, fecha]);
            logToFile('Transaccion agregada');
            //Actualizar stock de productos
            const sqlStock = "UPDATE producto SET stock = stock - ? WHERE id =?"
            await db.run(sqlStock, [cantidad, productoId]);
            logToFile('Stock actualizado');
            await db.run('COMMIT');
            logToFile('Transaccion completada');
            return { success: true, message: 'Transacción registrada exitosamente' };
            } catch (error) {
                logToFile(error.message);
                try {
                    await db.run('ROLLBACK');
                    logToFile('Transaccion cancelada');
                    return { success: false, message: error.message};
                    } catch (error) {
                     logToFile(error.message);
                     return { success: false, message: error.message}
                }
            }
    }
    static async PosSale(cart, tipo, motivo, fecha) {
        try {
          await db.run('BEGIN TRANSACTION');
          logToFile('Transacción empezada');
      
          for (const item of cart) {
            const { id, cantidad } = item;
      
            // Registrar la transacción
            const sqlProduct = "INSERT INTO transacciones (productoId, tipo, motivo, cantidad, fecha) VALUES (?, ?, ?, ?, ?)";
            await db.run(sqlProduct, [id, tipo, motivo, cantidad, fecha]);
            logToFile(`Transacción agregada para producto ${id}`);
      
            // Actualizar stock de productos
            const sqlStock = "UPDATE producto SET stock = stock - ? WHERE id = ?";
            await db.run(sqlStock, [cantidad, id]);
            logToFile(`Stock actualizado para producto ${id}`);
          }
      
          await db.run('COMMIT');
          logToFile('Transacción completada');
          return { success: true, message: 'Transacción registrada exitosamente' };
        } catch (error) {
          logToFile(error.message);
          try {
            await db.run('ROLLBACK');
            logToFile('Transacción cancelada');
            return { success: false, message: error.message };
          } catch (rollbackError) {
            logToFile(rollbackError.message);
            return { success: false, message: rollbackError.message };
          }
        }
      }
}

module.exports = PosModel;