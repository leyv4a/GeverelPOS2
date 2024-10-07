const UserModel = require('../model/user');
const logToFile = require('../utils/logger')

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      res.status(200).json(users);
    } catch (error) {
      logToFile(`Error getting users ${error}`)
      res.status(500).json({ error: err.message });
    }
  }

  

  static async createUser(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const id = await UserModel.create(name, email);
    if (!id) {
      logToFile(`Error creating user`)
      return res.status(500).json({ error: 'Something went wrong'});
    }
    logToFile(`User created`)
    return res.status(201).json({ message: `User created sucessfully`});
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
