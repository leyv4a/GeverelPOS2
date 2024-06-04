const TransactionModel = require('../model/transactions')
const logToFile = require("../utils/logger");

class TransactionController {

    // productoId INTEGER NOT NULL, tipo TEXT NOT NULL, motivo TEXT NOT NULL,  catidad REAL NOT NULL, fecha TEXT 
    static async createTransactionEntry(req, res) {
        try {
            const { productoId, tipo, motivo, cantidad, fecha} = req.body;

            if (!productoId ||!tipo ||!motivo ||!cantidad ||!fecha) {
                res.status(400).json({error : 'Todos los campos son requeridos' })
                return;
            }

            const result = await TransactionModel.createEntrada(productoId, tipo, motivo, cantidad, fecha)

            if (!result.success) {
                logToFile(`Error creating transaction ${result.message}`);
                return res.status(500).json({ error: result.message });
            }
            logToFile(`Transaction created`);
            return res.status(201).json({ message: result.message });
        } catch (error) {
            logToFile(error.message);
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static async getAllEntryTransactions(req,res){
        try {
            const entradas = await TransactionModel.getAllEntradas();
            res.status(200).json(entradas);
        } catch (error) {
            logToFile(error.message)
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TransactionController;