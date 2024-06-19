const PosModel = require('../model/pos');
const logToFile = require("../utils/logger");

class PosController {
    // productoId,tipo,motivo, cantidad, fecha , precioVenta, precioCompra
    static async CreateTransactionEntry (req, res) {
        try {
            const {productoId,tipo,motivo, cantidad, fecha , precioVenta, precioCompra} = req.body;
            if (!productoId || !tipo || !motivo || !cantidad || !fecha || !precioVenta || !precioCompra) {
                res.status(400).json({ error: 'Todos los campos son requeridos' });
            }
            const response = await PosModel.newEntry(productoId,tipo.toLowerCase(),motivo.toLowerCase(), cantidad, fecha, precioVenta, precioCompra);
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
}

module.exports = PosController;