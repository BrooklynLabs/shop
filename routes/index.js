var express = require('express');
var router = express.Router();

var user    = require('./users.js');
var sms    = require('./smsParsing.routes.js');
//var analytics = require('./analytics.route.js');

router.use('/api/v1/user', user);
router.use('/api/v1/sms', sms);
//router.use('/api/v1/analytics', analytics);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
