const PosModel = require('../model/pos');
const logToFile = require("../utils/logger");

class PosController {
    // productoId,tipo,motivo, cantidad, fecha , precioCompra
    static async CreateTransactionEntry (req, res) {
        try {
            const {productoId,tipo,motivo, cantidad, fecha, precioCompra} = req.body;
            if (!productoId || !tipo || !motivo || !cantidad || !fecha ||  !precioCompra) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
                
            }
            const response = await PosModel.newEntry(productoId,tipo.toLowerCase(),motivo.toLowerCase(), cantidad, fecha, precioCompra);
            if (!response.success) {
                logToFile(response.message);
                return res.status(500).json({ error: response.message });
            }
            logToFile('Transaccion creada');
            return res.status(201).json({ message: response.message });
        } catch (error) {
            console.log(error)
            logToFile(error.message);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
    static async CreateTransactionExit (req, res) {
        try {
            const {productoId,tipo,motivo, cantidad, fecha } = req.body;
            if (!productoId || !tipo || !motivo || !cantidad || !fecha ) {
                res.status(400).json({ error: 'Todos los campos son requeridos' });
            }
            const response = await PosModel.newExit(productoId,tipo.toLowerCase(),motivo.toLowerCase(), cantidad, fecha);
            if (!response.success) {
                logToFile(response.message);
                return res.status(500).json({ error: response.message });
            }
            logToFile('Transaccion creada');
            res.status(201).json({ message: response.message });
        } catch (error) {
            logToFile(error.message);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static async CreatePosSale(req, res) {
        try {
            const { productos, tipo, motivo, fecha } = req.body;
            if (!productos || !Array.isArray(productos) || productos.length === 0 || !tipo || !motivo || !fecha) {
                return res.status(400).json({ error: 'Todos los campos son requeridos y el carrito no debe estar vacío' });
            }
            const response = await PosModel.PosSale(productos, tipo.toLowerCase(), motivo.toLowerCase(), fecha);
            if (!response.success) {
                logToFile(response.message);
                return res.status(500).json({ error: response.message });
            }
            logToFile('Transacción creada');
            res.status(201).json({ message: response.message });
        } catch (error) {
            logToFile(error.message);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
    static async CancelPosSale(req, res){
        try {
            const {fecha, total, motivoCancelacion} = req.body;
            if (!fecha || !total || !motivoCancelacion) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }
            const response = await PosModel.PosCancelSale(fecha, total, motivoCancelacion);
            if (!response.success) {
                logToFile(response.message);
                return res.status(500).json({ error: response.message });
            }
            logToFile('Venta cancelada');
            res.status(201).json({ message: response.message });
        } catch (error) {
            logToFile(error.message);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
}

module.exports = PosController;