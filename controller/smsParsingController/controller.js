//var db 			= require('../mongodb.js');
var fs			= require('fs');
var randomstring= require('randomstring');
var MongoClient = require('mongodb').MongoClient;
var connection_string = '127.0.0.1:27017/shopylytics';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
var url 		= connection_string;
MongoClient.connect(url, function(err, database){
	db = database;
	console.log(db, err);
})

module.exports = {
	store:function (req, res){
		var obj = req.body;
		//res.send("hello store");
		MongoClient.connect(url, function(err, database){
			db = database;
			console.log(db, err);
			if(!err)
			db.collection('sms').insert(obj, function(err, result){
				res.send({error: err, status: result});
			})
			else{
				res.send({error:err});
			}
		})
		//res.send(req.body);
	}
}