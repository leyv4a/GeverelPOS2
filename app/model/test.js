const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger');
class Pruebas{

    static async doTest(sql){
        try {
            await db.run(sql);
            return true;
        } catch (error) {
            return false
        }

    }

    static async getTest(sql){
        const rows = await db.all(sql);
        logToFile('test query :' + sql)
        return rows;
    }
}

module.exports = Pruebas;