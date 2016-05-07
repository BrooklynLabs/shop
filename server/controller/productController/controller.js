//var db 			= require('../mongodb.js');
var fs = require('fs');
var randomstring = require('randomstring');
var MongoClient = require('mongodb').MongoClient;
var config = require('../../../config.server.js');

module.exports = {
    newProduct: function(req, res) {
    	if(Object.keys(req.body).length==0){
    		res.send({error:'Blank form submitted!'});
    		return;
    	}
    	else
    	MongoClient.connect(config.db.url, function(err, database){
			db = database;
			console.log(req.body);
			console.log(req.file);
			req.body.prod_id = randomstring.generate();
			req.body.prod_mrp = Number(req.body.prod_mrp||'0');
			if(!err)
			db.collection('product').insert(req.body, function(err, result){
				db.close();
				if(!err){
					res.redirect('back');
				}
				// res.send({error: err, status: result});
				
			})
			else{
				res.send({error:err});
				db.close();
			}
		})
		

    },
    listProduct: function(req, res) {
    	MongoClient.connect(config.db.url, function(err, database){
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
