var express = require('express');
var router = express.Router();
var sms = require('../controller/smsParsingController');
//console.log(device);
router.post('/parse', sms.store);
router.get('/view', sms.view);
router.get('/lastmessage', sms.lastMsg);

module.exports = router;
