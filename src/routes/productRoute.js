const express = require('express')
const router = express.Router();

const productController = require('../controllers/productController');

router.post('/generateGroupedProductsBase',productController.generateGroupedProductsBase)
router.get('/loadProductsBase',productController.loadProductsBase)
router.get('/teste',productController.teste)

module.exports = router;
