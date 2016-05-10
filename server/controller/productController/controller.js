//var db 			= require('../mongodb.js');
var fs = require('fs');
var randomstring = require('randomstring');
var MongoClient = require('mongodb').MongoClient;
var config = require('../../../config.server.js');

module.exports = {
    newProduct: function(req, res) {
        if (Object.keys(req.body).length == 0) {
            res.send({ error: 'Blank form submitted!' });
            return;
        } else
            MongoClient.connect(config.db.url, function(err, database) {
                db = database;
                // console.log(req.body);
                // console.log(req.file);
                // req.body.shop_id = req.user.user_id;
                req.body.prod_id = randomstring.generate();
                req.body.prod_mrp = Number(req.body.prod_mrp || '0');
                if(req.body.seller_mrp){
                	req.body.seller_mrp = Number(req.body.seller_mrp||'0');
                }
                if(req.file)
                req.body.images = req.headers.origin + req.file.path.replace('public','');
                if (!err)
                    db.collection('product').insert(req.body, function(err, result) {
                        db.close();
                        if (!err) {
                            res.redirect('back');
                        }
                        // res.send({error: err, status: result});

                    })
                else {
                    res.send({ error: err });
                    db.close();
                }
            })


    },
    editProduct: (req, res) => {
        // res.send(req.body);

        if (Object.keys(req.body).length == 0) {
            res.send({ error: 'Blank form submitted!' });
            return;
        } else
            MongoClient.connect(config.db.url, function(err, database) {
                db = database;
                // console.log(req.body);
                // console.log(req.file);
                req.body.prod_mrp = Number(req.body.prod_mrp || '0');
                if(req.body.seller_mrp){
                	req.body.seller_mrp = Number(req.body.seller_mrp||'0');
                }
                if(req.file)
                req.body.images = req.headers.origin + req.file.path.replace('public','');
                if (!err)
                    db.collection('product').update({ prod_id: req.body.prod_id }, {$set:req.body}, function(err, result) {
                        db.close();
                        if (!err) {
                            res.redirect('back');
                        }
                        // res.send({error: err, status: result});

                    })
                else {
                    res.send({ error: err });
                    db.close();
                }
            })
    },
    listProduct: function(req, res) {
    	var shop_id= req.query.user_id;
    	var role = req.query.role;
    	if(!shop_id||!role){
    		res.send({error:1, errMsg:"Inappropiate parameters passed"})
    		return;
    	}
        MongoClient.connect(config.db.url, function(err, database) {
            db = database;
            if (!err) {
            	var obj ={};
            	// if(type=='ADMIN')
            	if(role=='ADMIN'){
            		obj.role ='ADMIN'
            	}
            	else if(role =='USER'){
            		obj.role ='SELLER'
            	}
            	else if(role=='SELLER'){
            		obj.role = 'SELLER',
            		shop_id = shop_id
            	}
            	console.log(obj);
                db.collection('product').find(obj).toArray(function(err, result) {
                    res.send({ error: err, result: result });
                    db.close();
                })
            } else {
                res.send({ error: err });
                db.close();
            }
        })
    }
}
