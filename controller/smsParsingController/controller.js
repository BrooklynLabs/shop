//var db 			= require('../mongodb.js');
var fs			= require('fs');
var randomstring= require('randomstring');


// var a = new device.constructor();
// console.log(a),
module.exports = {
	store:function (req, res){
		res.send(req.body);
	}
}