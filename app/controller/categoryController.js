const categoryModel = require("../model/category");
const logToFile = require("../utils/logger");

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await categoryModel.getAll();
      res.status(200).json(categories);
    } catch (error) {
      logToFile(`Error getting categories ${error}`);
      res
        .status(500)
        .json({ error: "Error obteniendo categorias de la base de datos" });
    }
  }
  static async createCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ error: "El nombre es requerido" });
        return;
      }
      const result = await categoryModel.create(name);
      if (!result.success) {
        logToFile(`Error creating category ${result.message}`);
        return res.status(500).json({ error: result.message });
      }
      logToFile(`Category created`);
      return res.status(201).json({ message: result.message });
    } catch (error) {
      logToFile(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }

  static async deleteCategoryById(req, res) {
    const name = await categoryModel.deleteById(req.params.id);
    if (!name) {
      res
        .status(404)
        .json({ error: "Algo salio mal al eliminar la categoria" });
      logToFile(`Error deleting category`);
      return;
    }
    logToFile(`Category deleted`);
    return res
      .status(200)
      .json({ message: `Categoria eliminada correctamente` });
  }
}

module.exports = CategoryController;
