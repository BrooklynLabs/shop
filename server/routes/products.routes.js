var express = require('express');
var router = express.Router();
var product = require('../controller/productController');
//console.log(device);
var multer = require('multer');
var upload = multer({ dest: '../../public/uploads/' });

router.post('/', upload.single('images'), product.newProduct);
router.get('/', product.listProduct);


module.exports = router;
