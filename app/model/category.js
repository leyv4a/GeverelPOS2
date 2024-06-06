const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger')

class CategoryModel{
    static async getAll() {
        const sql = "SELECT id, nombre, inicial FROM categoria"
        const rows = await db.all(sql);
        return rows;
    }

    static async create(name, inicial){
        const sql = "INSERT INTO categoria (nombre, inicial) VALUES (?, ?)"
        try {
            await db.run(sql, [name,inicial]);
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

    static async updateById(id, name, inicial){
        const sql = "UPDATE categoria set nombre = ?, inicial = ? WHERE id = ?";
        try {
            await db.run(sql, [name,inicial,id]);
            return { success: true, message: 'Categoria actualizada exitosamente' };
        } catch (error) {
            return { success: false, message: error.message };;
        }
    }
}

module.exports = CategoryModel;