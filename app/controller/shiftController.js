const Shift = require('../model/shift');
const TransactionModel = require('../model/transactions');
const WalletModel = require('../model/wallet');
const logToFile = require('../utils/logger');


class ShiftController {

    static async StartShift(req, res){
        try {
            const { usuarioId, inicio } = req.body;
            
            // Crear el turno
            const result = await Shift.StartShift(usuarioId, inicio);
            if (!result.success) {
              logToFile(`Error starting shift: ${result.message}`);
              return res.status(500).json({ success: false, error: result.message });
            }
            
            logToFile(`Shift started for user ${usuarioId}`);
            return res.status(201).json({success: true, message: result.message });
          } catch (error) {
            logToFile(error.message);
            return res.status(500).json({success: false, error: 'Error en el servidor' });
          }
    }

    static async EndShift(req, res){
        try {
            const { usuarioId, cierre } = req.body;
      
            // Obtener el turno abierto
            const openShift = await Shift.getOpenShiftByUser(usuarioId);
      
            if (!openShift.success) {
              logToFile(`No open shift found for user ${usuarioId}`);
              return res.status(400).json({success: false, error: openShift.message });
            }
      
            const shiftId = openShift.shift.id;
            const inicio = openShift.shift.inicio;
      
            // Calcular el total vendido durante el turno
            const totalVendido = await TransactionModel.getTotalVentas(inicio, cierre);
            logToFile('totalvendido' + totalVendido)
            // Calcular los gastos durante el turno
            const gastos = await WalletModel.getGastos(inicio, cierre);
            logToFile('gastos' + gastos)
      
            // Cerrar el turno y guardar el feedback
            const closeResult = await Shift.EndShift(shiftId, cierre, totalVendido, gastos);
      
            if (!closeResult.success) {
              logToFile(`Error closing shift: ${closeResult.message}`);
              return res.status(500).json({success: false,  error: closeResult.message });
            }
      
            logToFile(`Shift closed for user ${usuarioId+ closeResult.message +totalVendido+gastos}`);
            return res.status(200).json({ success: true ,message: closeResult.message, totalVendido, gastos });
          } catch (error) {
            logToFile(error.message);
            return res.status(500).json({ success: false, error: 'Error en el servidor' });
          }
        }
    }


module.exports = ShiftController;