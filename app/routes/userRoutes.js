const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const CategoryController = require('../controller/categoryController');
const ProductController = require('../controller/productController');
const TransactionController = require('../controller/transactionsController');

router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);

router.get('/category', CategoryController.getAllCategories);
router.post('/category', CategoryController.createCategory);
router.delete('/category/:id', CategoryController.deleteCategoryById);
router.put('/category', CategoryController.updateCategoryById);

router.get('/product', ProductController.getAllProducts);
router.post('/product', ProductController.createProduct);
router.delete('/product/:id', ProductController.deleteProductById);
router.put('/product', ProductController.updateProductById);
router.get('/product/:id', ProductController.getProductById);

router.get('/transaction/entry', TransactionController.getAllEntryTransactions);
router.post('/transaction/entry', TransactionController.createTransactionEntry);


module.exports = router;
