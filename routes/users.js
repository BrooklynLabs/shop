var express = require('express');
var router = express.Router();
var user = require('../controller/userController');
//console.log(device);
router.post('/register', user.register);
router.get('/view', user.get_user);

module.exports = router;
