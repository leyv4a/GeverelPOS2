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


    // const date = new Date();
    // const formattedDate =
    //   date.getFullYear() +
    //   "-" +
    //   String(date.getMonth() + 1).padStart(2, "0") +
    //   "-" +
    //   String(date.getDate()).padStart(2, "0") +
    //   " " +
    //   String(date.getHours()).padStart(2, "0") +
    //   ":" +
    //   String(date.getMinutes()).padStart(2, "0") +
    //   ":" +
    //   String(date.getSeconds()).padStart(2, "0");
    
    static async EndShift(){
        const sql = `UPDATE turnos SET cierre = ?, totalVendido = ?, gastos = ? WHERE id = ?`;
        try {
          await db.run(sql, [cierre, totalVendido, gastos, id]);
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