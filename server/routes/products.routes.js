var express = require('express');
var router = express.Router();
var product = require('../controller/productController');
//console.log(device);
router.post('/', product.newProduct);
router.get('/', product.listProduct);

module.exports = router;
