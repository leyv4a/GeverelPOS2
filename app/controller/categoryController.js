const CategoryModel = require("../model/category");
const ProductModel = require("../model/product");
const logToFile = require("../utils/logger");

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryModel.getAll();
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
      const { name, inicial } = req.body;
      if (!name || !inicial) {
        res.status(400).json({ error: "Todos los campos son requeridos" });
        return;
      }
      const result = await CategoryModel.create(name.toLowerCase(), inicial.toLowerCase());
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
    const id = req.params.id
    try {
      const isUsed = await ProductModel.getByCategory(id);
      if(isUsed.success) return res.status(302).json({message :'No se puede borrar la categoria por que esta siendo usada.'})
  
      const isDeleted = await CategoryModel.deleteById(req.params.id);
      if (!isDeleted) {
        logToFile(`Error deleting category`);
        return  res
          .status(404)
          .json({ error: "Algo salio mal al eliminar la categoria" });
        ;
      }
      logToFile(`Category deleted`);
      return res
        .status(200)
        .json({ message: `Categoria eliminada correctamente` });
    } catch (error) {
        return res.status(500).json(error.message);
    }
  }
  static async updateCategoryById(req, res) {
    try {
      const { name,inicial, id } = req.body;
      if (!name || !id ||!inicial) {
        res.status(400).json({ error: "Todos los campos son requeridos" });
        return;
      }
      const result = await CategoryModel.updateById(id, name.toLowerCase(), inicial.toLowerCase());
      if (!result.success) {
        logToFile("Error actualizando el producto: " + result.message);
        res.status(400).json({ error: result.message });
        return;
      }
      logToFile("Producto actualizado");
      res.status(201).json({ message: result.message });
    } catch (error) {
      logToFile(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
}

module.exports = CategoryController;
