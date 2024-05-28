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
            const {categoriaId, nombre, descripcion,stock,stockMin, precioVenta, precioCompra, codigo} = req.body;

            if (!categoriaId || !nombre || !descripcion || !stock||!stockMin|| !precioVenta || !precioCompra || !codigo) {
                res.status(400).json({error : 'Todos los campos son requeridos'})
                return;
            }

            const created = await ProductModel.create(categoriaId, nombre, descripcion,stock,stockMin, precioVenta, precioCompra, codigo)

            if (!created) {
                logToFile('Error creando el producto');
                return res.status(500).json({error :'Algo salio mal'});
            }
                logToFile('Producto creado');
                return res.status(201).json({message : 'Producto creado correctamente'});
        } catch (error) {
            
        }
    }
}