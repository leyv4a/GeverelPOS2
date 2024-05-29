const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger')

class CategoryModel{
    static async getAll() {
        const sql = "SELECT id, nombre FROM categoria"
        const rows = await db.all(sql);
        return rows;
    }

    static async create(name){
        const sql = "INSERT INTO categoria (nombre) VALUES (?)"
        try {
            await db.run(sql, [name]);
            return { success: true, message: 'Categoria creada exitosamente' };
        } catch (error) {
            logToFile(error.message) 
            return { success: false, message: error.message };
        }
    }
    static async deleteById(id){
        const sql = "DELETE FROM categoria WHERE id =?";
        try {
            await db.run(sql, [id]);
            return true; // Retorna true si la inserción es exitosa
        } catch (error) {
            return false;
        }
    }
}

module.exports = CategoryModel;