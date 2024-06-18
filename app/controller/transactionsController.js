const TransactionModel = require("../model/transactions");
const logToFile = require("../utils/logger");

class TransactionController {
  // productoId INTEGER NOT NULL, tipo TEXT NOT NULL, motivo TEXT NOT NULL,  catidad REAL NOT NULL, fecha TEXT
  static async createTransactionEntry(req, res) {
    try {
      const { productoId, tipo, motivo, cantidad, fecha } = req.body;

      if (!productoId || !tipo || !motivo || !cantidad || !fecha) {
        res.status(400).json({ error: "Todos los campos son requeridos" });
        return;
      }

      const result = await TransactionModel.createEntrada(
        productoId,
        tipo.toLowerCase(),
        motivo.toLowerCase(),
        cantidad,
        fecha
      );

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

  static async getAllEntryTransactions(req, res) {
    try {
      const entradas = await TransactionModel.getAllEntradas();
      res.status(200).json(entradas);
    } catch (error) {
      logToFile(error.message);
      res.status(500).json({ error: error.message });
    }
  }
  static async getAllExitTransactions(req, res) {
    try {
      const salidas = await TransactionModel.getAllEntradas();
      res.status(200).json(salidas);
    } catch (error) {
      logToFile(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteTransactionById(req, res) {
    const { id } = req.params;
    const response = await TransactionModel.deleteById(id);
    if (!response.success) {
      res
        .status(400)
        .json({ error: response.message });
      logToFile(`Error deleting transaction ${req.params.id} - ${response.message}`);
      return;
    }
    logToFile(`transaction deleted ${req.params.id}`);
    return res
      .status(200)
      .json({ message: `Transaccion eliminada correctamente` });
  }
}

module.exports = TransactionController;
