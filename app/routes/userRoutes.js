const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const CategoryController = require('../controller/categoryController');
const ProductController = require('../controller/productController');

router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);

router.get('/category', CategoryController.getAllCategories);
router.post('/category', CategoryController.createCategory);
router.delete('/category/:id', CategoryController.deleteCategoryById);
router.put('/category', CategoryController.updateCategoryById)

router.get('/product', ProductController.getAllProducts);
router.post('/product', ProductController.createProduct);
router.delete('/product/:id', ProductController.deleteProductById);


module.exports = router;
