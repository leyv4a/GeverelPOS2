const UserModel = require('../model/user');
const logToFile = require('../utils/logger')

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      res.status(200).json(users);
    } catch (error) {
      logToFile(`Error getting users ${error}`)
      res.status(500).json({ error: error.message });
    }
  }

  

  static async createUser(req, res) {
    const { usuario,password,tipo,nombre} = req.body;
    if (!usuario || !password || !tipo || !nombre) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
    const id = await UserModel.create(usuario,password,tipo,nombre);
    if (!id) {
      logToFile(`Error creando el usuario`)
      return res.status(500).json({ error: 'Algo salio mal'});
    }
    logToFile(`User created`)
    return res.status(201).json({success: true, message: `Usuario creado con exito`});
  }

  static async updateUser(req, res) {
    const { id, usuario, password, tipo, nombre } = req.body;
    if (!id || !usuario || !password || !tipo || !nombre) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
    const userData = await UserModel.updateById(id, usuario, password, tipo, nombre);
    if (!userData) {
      logToFile(`Error actualizando el usuario`)
      return res.status(500).json({ error: 'Algo salio mal'});
    }
    logToFile(`User updated`)
    return res.status(200).json({success: true, message: `Usuario actualizado con exito`});
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
    const userData = await UserModel.deleteById(id);
    if (!userData) {
      logToFile(`Error eliminando el usuario`)
      return res.status(500).json({ error: 'Algo salio mal'});
    }
    logToFile(`User deleted`)
    return res.status(200).json({success: true, message: `Usuario eliminado con exito`});
  }

  static async loginUser(req, res) {
    const { user, password } = req.body;
    if (!user || !password) {
      return res.status(400).json({success: false, error: "Todos los campos son requeridos" });
    }
    const userData = await UserModel.login(user, password);
    if (!userData.success) {
      logToFile(`Error logging in user ${userData.error}`)
      return res.status(404).json({success:false, error: userData.error });
    }
    logToFile(`User logged in`)
    return res.status(200).json({ success: true,message: `Bienvenido ${userData.rows.usuario}`, user: userData.rows });
  }

}

module.exports = UserController;
