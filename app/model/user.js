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
  static async login(user, password){
     const sql = "SELECT id, usuario, tipo, nombre FROM usuario WHERE usuario = ? AND password = ?";
    try {
      const rows = await db.get(sql, [user, password]);
      if (rows) {
        console.log(rows);
        return { success: true , rows: rows };
      }  
      return { success: false, error: 'Usuario o contraseña incorrectos'};	
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };	
    }
  }
}

module.exports = UserModel;
