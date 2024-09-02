const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger')

class WalletModel{
    static async getAll(tipo){
        const sql = "SELECT * FROM cartera WHERE tipo =?  ORDER BY id DESC"
        const rows = await db.all(sql, [tipo]);
        return rows;
    }

    static async create(tipo, descripcion,monto, fecha){
      try {
        const sql = "INSERT INTO cartera (tipo,descripcion,monto, fecha) VALUES (?,?,?,?)"
        await db.run(sql, [tipo, descripcion, monto,fecha]);
        logToFile(`Monedero actualizado : ${tipo} : $ ${monto}` )
        return { success: true, message: 'Transacción registrada exitosamente' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
}

module.exports = WalletModel;