const WalletModel = require('../model/wallet')
const logToFile = require("../utils/logger");

class WalletController {

    static async getTypeRecords(req,res){
        try {
            const tipo = req.params.tipo;
            if (!tipo) return res.status(400).json({ error: 'Debes proporcionar el tipo' }) 
            
            const response = await WalletModel.getAll(tipo)
            return res.status(200).json(response);    
        } catch (error) {
            logToFile(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
    static async createRecord(req, res) {
        try {
            const { tipo, descripcion, monto, fecha } = req.body;
            // Checar todos los campos
            if (!tipo || !descripcion || !monto  || !fecha) {
                return res.status(400).json({ error: 'Debes ingresar todos los campos' });
            }
            //Llamar al metodo crear
            const result = await WalletModel.create(tipo.toLowerCase(), descripcion.toLowerCase(), monto, fecha);
    
            // Checar si el resultado  es correcto
            if (!result.success) {
                logToFile(result.message);
                return res.status(400).json({ error: result.message });
            }
    
            //Responder al cliente 
            return res.status(201).json({ message: 'Record created successfully', data: result.data });
        } catch (error) {
            logToFile(error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = WalletController;