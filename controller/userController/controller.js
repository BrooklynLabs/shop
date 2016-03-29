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
var url 		= 'mongodb://'+connection_string;
// MongoClient.connect(url, function(err, database){
// 	db = database;
// 	console.log(db, err);
// })

module.exports = {
	register:function (req, res){
		res.send(req.body);
		var obj = req.body;
		if(!obj.name||!obj.phone||!obj.password){
			res.send({error:"inappropriate parameters passed"});
			return;
		}
		obj.user_id = randomstring.generate(20);
		obj.date_joined = (new Date()).getTime();
		obj.address 	= obj.address?obj.address:"";
		MongoClient.connect(url, function(err, db){
			db.collenction('user').insert(obj, function(err, result){
				if(!err){
					delete obj.password;
					res.send({error:err, data:obj});
				}
				else{
					res.send({error:err});
				}
				db.close();
			})
		})

	},
	get_user: function(req, res){
		MongoClient.connect(url, function(err, db){
			if(!err){
				db.collection('user').find({}).toArray(function(err, data){
					res.send({error:err, result:data});
				})
			}
			else
				res.send({error:err});
		})
	}
}