var express = require('express');
var router = express.Router();

var user    = require('./users.js');
var sms    = require('./smsParsing.routes.js');
var product    = require('./products.routes.js');
//var analytics = require('./analytics.route.js');

router.use('/v1/user', user);
router.use('/v1/sms', sms);
router.use('/v1/product', product);
router.get('/health', (req, res)=>{res.send("Working");});
//router.use('/api/v1/analytics', analytics);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shopylytics' });
});

module.exports = router;
