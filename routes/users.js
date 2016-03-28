var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/:word', function(req, res){
	res.send(req.params.word);
})
module.exports = router;
