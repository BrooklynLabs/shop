// require('es6-promise').polyfill();
// require('isomorphic-fetch');
var fetch = require('node-fetch');
module.exports = function(app, config, MongoClient, upload) {
    app.get('/', (req, res) => {
        res.render('dashboard', req.user);
    })

    app.get('/profile', (req, res) => {
        MongoClient.connect(config.db.url, (err, db) => {
            db.collection('user').find({ user_id: req.user.user_id }).toArray((err, user) => {
                // var obj = user[0];
                db.close();
                console.log(user[0]);
                var obj = {
                    user_id: user[0].user_id,
                    email: user[0].email || '',
                    // username: user[0].username||'',
                    photo: user[0].photo || '',
                    name: user[0].name || '',
                    age: user[0].age || '',
                    gender: user[0].gender || '',
                    role: user[0].role || ''
                }

                res.render('profile', obj);
            })
        })

    })
    app.post('/profile', upload.array('images'), (req, res) => {
        req.body.updated_at = (new Date()).getTime();
        MongoClient.connect(config.db.url, (err, db) => {
            db.collection('user').update({ user_id: req.user.user_id }, req.body, err => {
                res.redirect('/');
            })
        })

    })
    app.get('/product', (req, res) => {
        //console.log(req.user.role);
        if (req.user.role == 'ADMIN') {
            var obj = req.user;
            fetch(config.host + '/api/v1/product')
                .then(response => {
                    return (response).json(); })
                .then(products => { 
                    obj.products = products.result;
                    res.render('admin/product', obj);
                });
            
        } else{
            var obj = req.user;
            fetch(config.host + '/api/v1/product')
                .then(response => {
                    return (response).json(); })
                .then(products => { 
                    obj.products = products.result;
                    res.render('seller/product', obj);
                });
        }

    });

    app.get('/product/add', (req, res) => {
        if (req.user.role == 'ADMIN')
            res.render('admin/addProduct', req.user);
        else
            res.render('seller/addProduct', req.user);
    });

    app.get('/product/edit', (req, res) => {
        if (req.user.role == 'ADMIN')
            res.render('admin/editProduct', req.user);
        else
            res.render('seller/editProduct', req.user);
    })

    app.get('/product/:id', (req, res) => {
        res.send(req.params.id);
    })
}