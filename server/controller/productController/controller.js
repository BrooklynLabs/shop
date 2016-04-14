//var db 			= require('../mongodb.js');
var fs = require('fs');
var randomstring = require('randomstring');
var MongoClient = require('mongodb').MongoClient;
var connection_string = '127.0.0.1:27017/shopylytics';
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
var url = 'mongodb://' + connection_string;
// MongoClient.connect(url, function(err, database){
// 	db = database;
// 	console.log(db, err);
// })

module.exports = {
    newProduct: function(req, res) {
    	if(Object.keys(req.body).length==0){
    		res.send({error:'Blank form submitted!'});
    		return;
    	}
    	else
    	MongoClient.connect(url, function(err, database){
			db = database;
			console.log(db, err);
			if(!err)
			db.collection('product').insert(req.body, function(err, result){
				res.send({error: err, status: result});
				db.close();
			})
			else{
				res.send({error:err});
				db.close();
			}
		})
		

    },
    listProduct: function(req, res) {
    	MongoClient.connect(url, function(err, database){
			db= database;
			if(!err){
				db.collection('product').find({}).toArray(function(err, result){
					res.send({error:err, result:result});
					db.close();
				})
			}
			else{
				res.send({error:err});
				db.close();
			}
		})
    }
}
