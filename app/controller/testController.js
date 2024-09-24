const Pruebas = require("../model/test");

class TestController {

    static async doTest(req, res) {
        try {
        const { sql } = req.body;
        const result = await Pruebas.doTest(sql);
        if(!result){
            res.status(400).json({error : 'error en la consulta'})
        }
        res.status(200).json({success: 'consulta realizada correctamente'});
        } catch (error) {
        logToFile(error.message);
        res.status(500).json({ error: "Error en el servidor" });
        }
    }

    static async getTest(req, res) {
        try {
        const { sql } = req.body;
        const result = await Pruebas.getTest(sql);
        res.status(200).json(result);
        } catch (error) {
        logToFile(error.message);
        res.status(500).json({ error: "Error en el servidor" });
        }
    }
}

module.exports = TestController;