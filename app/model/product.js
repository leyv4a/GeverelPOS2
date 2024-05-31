const db = require('../database/database'); // Importa la conexión a la base de datos SQLite
const logToFile = require('../utils/logger');

class ProductModel {

    static async getAll(){
        const sql =
        `SELECT 
        producto.id, producto.nombre,producto.descripcion,categoria.nombre AS categoria ,producto.codigo , producto.unidad ,producto.stock, producto.stockMin, producto.precioVenta, producto.precioCompra, producto.categoriaId
        FROM producto
        INNER JOIN categoria ON producto.categoriaId = categoria.id
        ORDER BY producto.categoriaId
        `
        const rows = await db.all(sql);
        return rows;
    }


    static async create(nombre, descripcion,stockMin,codigo,unidad, categoriaId){
        const sql = 'INSERT INTO producto ( nombre, descripcion, stockMin, codigo, unidad, categoriaId) VALUES (?,?,?,?,?,?)'
        try {
            await db.run(sql, [ nombre, descripcion, stockMin, codigo,unidad, categoriaId]);
            return { success: true, message: 'Producto creado exitosamente' };
        } catch (error) {
            logToFile(error.message) 
            return { success: false, message: error.message };
        }
    }

    static async deleteById(id) {
        const sql = "DELETE FROM producto WHERE id = ?";
        try {
            await db.run(sql, [id]);
            return true; // Retorna true si la inserción es exitosa
        } catch (error) {
            return false;
        }
    }
    
    static async updateById(id, nombre, descripcion, stockMin,codigo,unidad, categoriaId){
        const sql= 'UPDATE producto set nombre = ?, descripcion = ?, stockMin = ?, codigo = ?, unidad = ?, categoriaId = ? WHERE id = ?';
        try {
            await db.run(sql, [id, nombre, descripcion, stockMin, codigo, unidad, categoriaId]);
            return { success: true, message: 'Producto actualizado exitosamente' };
        } catch (error) {
            logToFile(error);
            return { success: false, message: error.message};
        }
    }
}


module.exports = ProductModel;
