const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const CategoryController = require('../controller/categoryController');
const ProductController = require('../controller/productController');
const TransactionController = require('../controller/transactionsController');
const PosController = require('../controller/posController');
const WalletController = require('../controller/walletController');
const DashboardController = require('../controller/dashboardController');
const TestController = require('../controller/testController');
const ShiftController = require('../controller/shiftController');

router.post('/login', UserController.loginUser)

router.post('/dotest', TestController.doTest);
router.get('/gettest', TestController.getTest);

router.post('/shift/start', ShiftController.StartShift);
router.post('/shift/end', ShiftController.EndShift);   
router.post('/shift/data', ShiftController.getShiftData);
router.get('/shift', ShiftController.getAllShift);

router.get('/dashboard/ventadiaria', DashboardController.getVentaDiaria);
router.get('/dashboard/totales', DashboardController.getTotales);
router.get('/dashboard/topcinco', DashboardController.getTopCinco);	
router.get('/dashboard/ventasemanal', DashboardController.getVentaSemanal);
router.get('/dashboard/ventasmensuales', DashboardController.getVentasMensuales);

router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.put('/users', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

router.get('/category', CategoryController.getAllCategories);
router.post('/category', CategoryController.createCategory);
router.delete('/category/:id', CategoryController.deleteCategoryById);
router.put('/category', CategoryController.updateCategoryById);

router.get('/product', ProductController.getAllProducts);
router.post('/product', ProductController.createProduct);
router.delete('/product/:id', ProductController.deleteProductById);
router.put('/product', ProductController.updateProductById);
router.get('/prices', ProductController.getAllPrices)
router.post('/prices', ProductController.changeProductsPrices)
router.get('/product/:code', ProductController.getProductByCode);
router.get('/weight', ProductController.getWeight);

router.get('/wallet/:tipo', WalletController.getTypeRecords);
router.post('/wallet', WalletController.createRecord);

router.get('/transaction/entry', TransactionController.getAllEntryTransactions);
router.get('/transaction/exit', TransactionController.getAllExitTransactions);
// router.post('/transaction/entry', TransactionController.createTransactionEntry);
router.delete('/transaction/:id', TransactionController.deleteTransactionById);

router.post('/pos/entry', PosController.CreateTransactionEntry);
router.post('/pos/exit', PosController.CreateTransactionExit);
router.post('/pos/sale', PosController.CreatePosSale)
router.post('/pos/cancel', PosController.CancelPosSale);


module.exports = router;
