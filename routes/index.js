var express = require('express');
var index = require('../controllers/index.controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log(index.user);
});

module.exports = router;
