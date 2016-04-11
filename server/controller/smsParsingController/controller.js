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
	store:function (req, res){
		var obj = req.body;
		//res.send(req.body);
		MongoClient.connect(url, function(err, database){
			db = database;
			console.log(db, err);
			if(!err)
			db.collection('sms').insert(obj, function(err, result){
				res.send({error: err, status: result});
				db.close();
			})
			else{
				res.send({error:err});
				db.close();
			}
		})
		res.send(req.body);
	},
	view:function(req, res){
		MongoClient.connect(url, function(err, database){
			db= database;
			if(!err){
				db.collection('sms').find({}).toArray(function(err, result){
					res.send({error:err, result:result});
					db.close();
				})
			}
			else{
				res.send({error:err});
				db.close();
			}
		})
	},
	lastMsg:function(req, res){
		if(!req.query.user_id){
			res.send({error:"inappropriate parameters passed"});
			return;
		}
		MongoClient.connect(url, function(err, db){
			if(!err){
				db.collection('sms').find({user_id:req.query.user_id}).limit(1).sort({ $natural: 1 }).toArray(function(err, result){
					res.send({error:err, data:{last_date:result.length==0||!result[0].timespan?0:result[0].timespan}})
				})
			}
		})
	}
}