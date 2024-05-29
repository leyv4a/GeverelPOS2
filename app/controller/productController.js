const ProductModel = require('../model/product');
const logToFile = require('../utils/logger');

class ProductController {

    static async getAllProducts(req,res){
      
        try {
            const products = await ProductModel.getAll();
            res.status(200).json(products);
        } catch (error) {
            logToFile(error);
            res.status(500).json({ error: 'Error obteniendo productos de la base de datos' });
        }
    }

    static async createProduct(req,res){
        try {
            const { nombre, descripcion,stockMin,codigo,unidad, categoriaId} = req.body;

            if (!nombre || !descripcion || !stockMin || !codigo || !unidad || !categoriaId) {
                res.status(400).json({error : 'Todos los campos son requeridos'})
                return;
            }

            const result = await ProductModel.create(nombre, descripcion, stockMin, codigo, unidad, categoriaId)

            if (!result.success) {
                logToFile('Error creando el producto: ' + result.message);
                res.status(400).json({ error: result.message });
                return;
            }
                logToFile('Producto creado');
                res.status(201).json({ message: result.message });
        } catch (error) {
            logToFile(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}

module.exports = ProductController;