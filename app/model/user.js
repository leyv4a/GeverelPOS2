const db = require('../database/database'); // Importa la conexión a la base de datos SQLite

class UserModel {
  static async getAll() {
    const sql = "SELECT id, usuario, password, tipo, nombre FROM usuario"
    const rows = await db.all(sql);
    return rows;
    };

  static async create(usuario,password,tipo,nombre) {
   const sql = "INSERT INTO usuario (usuario,password,tipo,nombre) VALUES (?,?,?,?)";
   try {
    await db.run(sql, [usuario,password,tipo,nombre]);
    return true; // Retorna true si la inserción es exitosa
    } catch (error) {
        return false;
    }
  }

  static async updateById(id, usuario, password, tipo, nombre) {
    const sql = "UPDATE usuario SET usuario = ?, password = ?, tipo = ?, nombre = ? WHERE id = ?";
    try {
      await db.run(sql, [usuario, password, tipo, nombre, id]);
      return true; // Retorna true si la inserción es exitosa
    } catch (error) {
      return false;
    }
  }

  static async deleteById(id) {
    const sql = "DELETE FROM usuario WHERE id = ?";
    try {
      await db.run(sql, [id]);
      return true; // Retorna true si la eliminacion es exitosa
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
