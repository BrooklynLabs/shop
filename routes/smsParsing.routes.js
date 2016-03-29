var express = require('express');
var router = express.Router();
var sms = require('../controller/smsParsingController');
console.log(device);
router.post('/parse', sms.store);


module.exports = router;
