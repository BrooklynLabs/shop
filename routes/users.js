var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/:word/:neword', function(req, res){
	res.send({word: req.params.word, newword:req.params.neword});
})
module.exports = router;
