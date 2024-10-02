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

    static async EndShift(shiftId, cierre, totalVendido, gastos){
        const sql = `UPDATE turnos SET cierre = ?, totalVendido = ?, gastos = ? WHERE id = ?`;
        try {
          await db.run(sql, [cierre, totalVendido, gastos, shiftId]);
          return { success: true, message: 'Turno cerrado correctamente' };
        } catch (error) {
          logToFile(`Error closing shift: ${error.message}`);
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

}

module.exports = Shift;