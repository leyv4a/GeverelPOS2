const db = require('../database/database'); // Importa la conexión a la base de datos SQLite

class UserModel {
  static async getAll() {
    const sql = "SELECT id, name, email FROM users"
    const rows = await db.all(sql);
    return rows;
    };

  static async create(name, email) {
   const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
   try {
    await db.run(sql, [name, email]);
    return true; // Retorna true si la inserción es exitosa
    } catch (error) {
        return false;
    }
  }
}

module.exports = UserModel;
