var fetch = require('node-fetch');
module.exports = function(app, config, MongoClient, upload) {

    app.get('/', (req, res) => {
        // console.log(req.user);
        var obj = req.user;
        (obj.images) = obj.images || "http://www.hyderabadangels.in/wp-content/uploads/2015/02/pplaceholder2.jpg";
        MongoClient.connect(config.db.url, (err, db) => {
            db.collection('user').count({ role: 'SELLER' }, (err, seller_count) => {
                db.collection('product').count({ role: req.user.role }, (err, product_count) => {
                    db.close();
                    obj.seller_count = seller_count || 0;
                    obj.product_count = product_count || 0;
                    // console.log(seller_count)
                    res.render('dashboard', obj);
                })

            })


        })
    })

    app.get('/profile', (req, res) => {
        MongoClient.connect(config.db.url, (err, db) => {
            db.collection('user').find({ user_id: req.user.user_id }).toArray((err, user) => {
                // var obj = user[0];
                db.close();
                // console.log(user[0]);
                var obj = {
                    user_id: user[0].user_id,
                    email: user[0].email || '',
                    images: user[0].images || '',
                    name: user[0].name || '',
                    age: user[0].age || '',
                    gender: user[0].gender || '',
                    role: user[0].role || '',
                    phone: user[0].phone || '',
                    shop_name: user[0].shop_name || '',
                    shop_about: user[0].shop_about || '',
                    shop_address: user[0].shop_address || '',
                    gender: user[0].gender,
                    lat: user[0].lat,
                    lng: user[0].lng
                }
                for (key in user[0]) {
                    obj[key] = user[0][key];
                }
                delete obj.password;

                res.render('profile', obj);
            })
        })

    })
    app.post('/profile', upload.single('images'), (req, res) => {
        // console.log(req.file.path.replace('public',''));
        req.body.updated_at = (new Date()).getTime();
        req.body.location = [req.body.lng, req.body.lat];
        if (req.file)
            req.body.images = req.headers.origin + req.file.path.replace('public', '');
        else {
            req.body.images = "http://www.hyderabadangels.in/wp-content/uploads/2015/02/pplaceholder2.jpg"
        }
        MongoClient.connect(config.db.url, (err, db) => {
            db.collection('user').update({ user_id: req.user.user_id }, { $set: req.body }, err => {
                res.redirect('/');
            })
        })

    })
    app.get('/product', (req, res) => {
        //console.log(req.user.role);
        if (req.user.role == 'ADMIN') {
            var obj = req.user;
            fetch(config.host + '/api/v1/product?user_id=' + req.user.user_id+'&role=ADMIN')
                .then(response => {
                    return (response).json();
                })
                .then(products => {
                    obj.products = products.result;
                    res.render('admin/product', obj);
                });

        } else {
            var obj = req.user;
            fetch(config.host + '/api/v1/product?user_id=' + req.user.user_id+'&role=SELLER')
                .then(response => {
                    return (response).json();
                })
                .then(products => {
                    console.log(products);
                    obj.products = products.result;
                    res.render('seller/product', obj);
                });
        }

    });
    app.get('/product/admin', (req, res) => {
        var obj = req.user;
        fetch(config.host + '/api/v1/product?role=ADMIN&user_id=12')
            .then(response => {
                return (response).json();
            })
            .then(products => {
                obj.products = products.result;
                res.render('seller/adminProduct', obj);
            });
    })
    app.get('/product/add', (req, res) => {
        if (req.user.role == 'ADMIN')
            res.render('admin/addProduct', req.user);
        else
            res.render('seller/addProduct', req.user);
    });

    app.get('/product/edit/:prod_id', (req, res) => {
        // console.log(req.params.prod_id);
        if (req.user.role == 'ADMIN') {
            var obj = req.user;
            MongoClient.connect(config.db.url, (err, db) => {
                db.collection('product').find({ prod_id: req.params.prod_id }).toArray((err, product) => {
                    console.log(product);
                    for (key in product[0]) {
                        obj[key] = product[0][key];
                    }

                    res.render('admin/editProduct', obj);
                })
            })

        } else {
            var obj = req.user;
            MongoClient.connect(config.db.url, (err, db) => {
                db.collection('product').find({ prod_id: req.params.prod_id }).toArray((err, product) => {
                    // console.log(product);
                    obj.p ={};
                    for (key in product[0]) {
                        obj.p[key] = product[0][key];
                    }
                    // console.log(obj);
                    if(req.query.seller_edit){
                        res.render('seller/editProduct', obj);
                    }
                    else
                    res.render('seller/editAdminProduct', obj);
                })
            })
        }
    })

    app.get('/product/:id', (req, res) => {
        res.send(req.params.id);
    })
}
