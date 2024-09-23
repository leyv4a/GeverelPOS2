const logToFile = require("../utils/logger");
const DashboardModel = require("../model/dashboard");

class DashboardController {
    static async getVentaDiaria(req, res) {
        try {
            const data = await DashboardModel.getVentaDiaria();
            res.status(200).json(data);
        } catch (error) {
            logToFile(error.message)
            res.status(500).json({ error: error.message });
        }
    }

    static async getTotales(req, res) {
        try {
            const data = await DashboardModel.getTotales();
            res.status(200).json(data);
        } catch (error) {
            logToFile(error.message)
            res.status(500).json({ error: error.message });
        }
    }

    static async getTopCinco(req, res){
        try {
            const data = await DashboardModel.getTopCinco();
            res.status(200).json(data);
        } catch (error) {
            logToFile(error.message)
            res.status(500).json({ error: error.message });
        }
    }

    static async getVentaSemanal(req, res){
        try {
            const data = await DashboardModel.getVentaSemanal();
            res.status(200).json(data);
        } catch (error) {
            logToFile(error.message)
            res.status(500).json({ error: error.message });
        }
    }

    static async getVentasMensuales(req, res){
        try {
            const data = await DashboardModel.ventasMensuales();
            res.status(200).json(data);
        } catch (error) {
            logToFile(error.message)
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DashboardController;