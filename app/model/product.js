const db = require("../database/database"); // Importa la conexión a la base de datos SQLite
const logToFile = require("../utils/logger");
const { SerialPort } = require("serialport");

class ProductModel {
  static async getAll() {
    const sql = `SELECT 
        producto.id, producto.nombre,producto.descripcion,categoria.nombre AS categoria ,producto.codigo , producto.unidad ,producto.stock, producto.stockMin, producto.precioVenta, producto.precioCompra, producto.categoriaId, categoria.inicial
        FROM producto
        INNER JOIN categoria ON producto.categoriaId = categoria.id
        ORDER BY producto.categoriaId
        `;
    const rows = await db.all(sql);
    return rows;
  }

  static async getPrices(){
    const sql = `SELECT P.id, P.nombre, P.precioVenta, P.precioCompra FROM producto P`
    const rows = await db.all(sql);
    return rows;
  }

  static async changePrice(list){
    try {
      await db.run('BEGIN TRANSACTION')
      logToFile('Transaccion empezada')
      for (const item of list) {
        const {id, nuevoPrecio} = item;
        const sql = `UPDATE producto SET precioVenta = ? WHERE id = ?`
        await db.run(sql, [nuevoPrecio, id])
        logToFile(`Precio actualizado para producto ${id}`)
      }
      await db.run('COMMIT')
      logToFile('Transaccion completada')
      return { success: true, message: 'Lista de precios actualizada con exito'}
    } catch (error) {
      logToFile(error.message);
      try {
          await db.run('ROLLBACK');
          logToFile('Transaccion cancelada');
          return { success: false, error: error.message};
          } catch (error) {
           logToFile(error.message);
           return { success: false, error: error.message}
      }
    }
  }

  static async getByCode(code) {
    const sql = `SELECT producto.id, producto.nombre, producto.descripcion,categoria.nombre AS categoria ,producto.codigo , producto.unidad ,producto.stock, producto.stockMin, producto.precioVenta, producto.precioCompra, producto.categoriaId, categoria.inicial
        FROM producto
        INNER JOIN categoria ON producto.categoriaId = categoria.id
        WHERE producto.codigo = ?
        ORDER BY producto.categoriaId 
        `;
    try {
      const product = await db.get(sql, [code]);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return { success: true, rows: product };
    } catch (error) {
      logToFile(error.message);
      return { success: false, message: error.message };
    }
  }

  static async getByCategory(cat) {
    const sql = `SELECT producto.codigo FROM producto WHERE producto.categoriaId = ?`;
    try {
      const rows = await db.get(sql, [cat]);
      if (!rows || rows.length === 0) throw new Error("Producto no encontrado");
      logToFile("product found");
      return { success: true, rows: rows };
    } catch (error) {
      logToFile(error.message);
      return { success: false, error: error.message };
    }
  }
  static async create(
    nombre,
    descripcion,
    stockMin,
    codigo,
    unidad,
    categoriaId
  ) {
    const sql =
      "INSERT INTO producto ( nombre, descripcion, stockMin, codigo, unidad, categoriaId) VALUES (?,?,?,?,?,?)";
    try {
      await db.run(sql, [
        nombre,
        descripcion,
        stockMin,
        codigo,
        unidad,
        categoriaId,
      ]);
      return { success: true, message: "Producto creado exitosamente" };
    } catch (error) {
      logToFile(error.message);
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
  // id, nombre, descripcion, stockMin, codigo,  unidad ,categoriaId: category
  static async updateById(
    id,
    nombre,
    descripcion,
    stockMin,
    codigo,
    unidad,
    categoriaId
  ) {
    const sql =
      "UPDATE producto set nombre = ?, descripcion = ?, stockMin = ?, codigo = ?, unidad = ?, categoriaId = ? WHERE id = ?";
    try {
      await db.run(sql, [
        nombre,
        descripcion,
        stockMin,
        codigo,
        unidad,
        categoriaId,
        id,
      ]);
      return { success: true, message: "Producto actualizado exitosamente" };
    } catch (error) {
      logToFile(error);
      return { success: false, message: error.message };
    }
  }

  static async getWeight() {
    const port = new SerialPort({
      path: "COM4",
      baudRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      flowControl: false,
      autoOpen: false,
    });

    return new Promise((resolve, reject) => {
      port.open((err) => {
        if (err) {
          logToFile(`Error al abrir el puerto: ${err.message}`);
          return reject({ success: false, message: err.message });
        }

        port.write("P", (err) => {
          if (err) {
            logToFile(`Error al enviar el comando: ${err.message}`);
            return reject({ success: false, message: err.message });
          }
          logToFile('Comando "P" enviado a la báscula');
        });

        port.on("data", (data) => {
          logToFile(`Peso recibido: ${data.toString()}`);
          resolve({ success: true, weight: data.toString() });
          port.close();
        });

        port.on("error", (err) => {
          logToFile(`Error: ${err.message}`);
          reject({ success: false, message: err.message });
        });
      });
    });
  }

  static async getProductToShop() {
    const sql = `SELECT 
    producto.nombre, 
    producto.stockMin, 
    producto.unidad,
    producto.precioCompra, 
    producto.stock
FROM 
    producto
WHERE 
    producto.stock < producto.stockMin 
    AND producto.precioCompra IS NOT NULL
ORDER BY 
    producto.id;`;
    try {
      const rows = await db.all(sql);
      return rows;
    } catch (error) {
      logToFile(error.message);
      return { error: error.message };
    }
  }
}
module.exports = ProductModel;
