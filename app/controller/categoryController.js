const categoryModel = require('../model/category');
const logToFile = require('../utils/logger');

class CategoryController {

    static async getAllCategories(req, res) {
        try {
            const categories = await categoryModel.getAll();
            res.status(200).json(categories);
        } catch (error) {
            logToFile(`Error getting categories ${error}`)
            res.status(500).json({ error: err.message });
        }
    }
    static async createCategory(req,res){
        const {name} = req.body
        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }
        const id = await categoryModel.create(name);
        if (!id) {
            logToFile(`Error creating category`)
            return res.status(500).json({ error: `Something went wrong ${id}`});
        }
        logToFile(`Category created`)
        return res.status(201).json({ message: `Category created sucessfully`});
    }    

}

module.exports = CategoryController;