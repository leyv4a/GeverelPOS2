const db = require('../database/database'); // Importa la conexión a la base de datos SQLite

class ProductModel {

    static async getAll(){
        const sql = 'SELECT id, categoriaId, nombre, descripcion, stock, stockMin, precioVenta, precioCompra, codigo FROM producto'
        const rows = await db.all(sql);
        return rows;
    }

    static async create(categoriaId, nombre, descripcion,stock,stockMin, precioVenta, precioCompra, codigo){
        const sql = 'INSERT INTO producto (categoriaId, nombre, descripcion, stock, stockMin, precioVenta, precioCompra, codigo) VALUES (?,?,?,?,?,?,?,?)'
        try {
            await db.run(sql, [categoriaId, nombre, descripcion, stock, stockMin, precioVenta, precioCompra, codigo]);
            return true; // Retorna true si la inserción es exitosa
        } catch (error) {
            return false;
        }
    }
}


module.exports = ProductModel;
