const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const CategoryController = require('../controller/categoryController');

router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);

router.get('/category', CategoryController.getAllCategories);
router.post('/category', CategoryController.createCategory);

module.exports = router;
