const ProductModel = require("../model/product");
const logToFile = require("../utils/logger");

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getAll();
      res.status(200).json(products);
    } catch (error) {
      logToFile(error.message);
      res
        .status(500)
        .json({ error: "Error obteniendo productos de la base de datos" });
    }
  }
  
  static async getProductByCode(req, res){
    try {
      const code = req.params.code;
      if (!code) {
        res.status(400).json({ error: 'El codigo es requerido' });
      }
      const product = await ProductModel.getByCode(code);
      if (!product.success) {
        logToFile(product.message)
        return res.status(404).json({ error: product.message });
      }
      return res.status(200).json(product.rows);
    } catch (error) {
      logToFile(error.message)
      res.status(500).json({ error: "Error en el servidor" });
    }
  }

  static async createProduct(req, res) {
    try {
      const { nombre, descripcion, stockMin, codigo, unidad, categoriaId } =
        req.body;

      if (
        !nombre ||
        !descripcion ||
        !stockMin ||
        !codigo ||
        !unidad ||
        !categoriaId
      ) {
        res.status(400).json({ error: "Todos los campos son requeridos" });
        return;
      }

      const result = await ProductModel.create(
        nombre.toLowerCase(),
        descripcion.toLowerCase(),
        stockMin,
        codigo.toLowerCase(),
        unidad.toLowerCase(),
        categoriaId
      );

      if (!result.success) {
        logToFile("Error creando el producto: " + result.message);
        res.status(400).json({ error: result.message });
        return;
      }
      logToFile("Producto creado");
      res.status(201).json({ message: result.message });
    } catch (error) {
      logToFile(error.message);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }

  static async deleteProductById(req, res) {
    const id = await ProductModel.deleteById(req.params.id);
    if (!id) {
      res
        .status(400)
        .json({ error: "Algo salio mal al eliminar el producto" });
      logToFile(`Error deleting product ${req.params.id}`);
      return;
    }
    logToFile(`product deleted ${req.params.id}`);
    return res
      .status(200)
      .json({ message: `Producto eliminado correctamente` });
  }

  static async updateProductById(req,res){
    try {
      
      const {id, nombre, descripcion, stockMin, codigo, unidad, categoriaId } =
        req.body;

      if (
        !id ||
        !nombre ||
        !descripcion ||
        !stockMin ||
        !codigo ||
        !unidad ||
        !categoriaId
      ) {
        res.status(400).json({ error: "Todos los campos son requeridos" });
        return;
      }

      const result = await ProductModel.updateById(
        id,
        nombre.toLowerCase(),
        descripcion.toLowerCase(),
        stockMin,
        codigo.toLowerCase(),
        unidad.toLowerCase(),
        categoriaId
      );
      if (!result.success) {
        logToFile("Error actualizando el producto: " + result.message);
        res.status(400).json({ error: result.message });
        return;
      }
      logToFile("Producto actualizado");
      res.status(200).json({ message: result.message });
    } catch (error) {
      logToFile(error.message);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
}

module.exports = ProductController;
