const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const CategoryController = require('../controller/categoryController');
const ProductController = require('../controller/productController');
const TransactionController = require('../controller/transactionsController');
const PosController = require('../controller/posController');
const WalletController = require('../controller/walletController');

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
router.get('/product/:code', ProductController.getProductByCode);

router.get('/wallet/:tipo', WalletController.getTypeRecords);
router.post('/wallet', WalletController.createRecord);

router.get('/transaction/entry', TransactionController.getAllEntryTransactions);
router.get('/transaction/exit', TransactionController.getAllExitTransactions);
// router.post('/transaction/entry', TransactionController.createTransactionEntry);
router.delete('/transaction/:id', TransactionController.deleteTransactionById);

router.post('/pos/entry', PosController.CreateTransactionEntry);
router.post('/pos/exit', PosController.CreateTransactionExit);
router.post('/pos/sale', PosController.CreatePosSale)


module.exports = router;
