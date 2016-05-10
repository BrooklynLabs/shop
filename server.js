var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });
var MongoClient = require('mongodb').MongoClient;
var api = require('./server/routes');
var config = require('./config.server.js');
var session = require('express-session');
var randomstring = require("randomstring");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.session_secret
}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// passport settings
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        MongoClient.connect(config.db.url, (err, db) => {
            db.collection('user').find({ email: username }).toArray((err, user) => {
                db.close();
                if (err) {
                    return done(err);
                }
                if (!user[0]) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user[0].password != password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user[0]);
            })
        })
    }
));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    res.render('login', { message: "" });
})
app.post('/login', (req, res) => {
    console.log(req.body);

    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.redirect('/login?message=' + info.message);
            return;
        }
        delete user.password;
        req.logIn(user, (err) => {
            if (err) {
                return res.redirect('/login?message=invalid');
            } else
                return res.redirect('/');
        });
    })(req, res);


});
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})
app.get('/signup', (req, res) => {
    res.render('signup', { message: "" });
})
app.post('/signup', (req, res) => {
    console.log(req.body);
    if (!req.body.email || !req.body.password || !req.body.role) { //|| req.body.role != 'user'
        res.render('signup', { message: "Incomplete form" });
    } else {
        MongoClient.connect(config.db.url, (err, db) => {
            var user = req.body;
            user.user_id = randomstring.generate(10);
            db.collection('user').insert(user, (err, info) => {
                console.log(info);
                if (!err) {
                    req.logIn(user, err => {
                        if (req.body.role == "USER") {
                            res.send({ error: 0, status: "Registered", data:info.ops[0] });
                        } else
                            res.redirect('/profile');
                    })

                } else {
                    res.render('signup', { message: err });
                }
            })
        })
    }
})

app.use('/uploads/*', (req, res, next){
    res.setHeader('Content-Type', 'image/jpg');
    next();
})

app.use('/api', api);

app.use(function(req, res, next) {

    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
});


require('./server/main.controller')(app, config, MongoClient, upload);


app.use('/', express.static(__dirname + "/public"));

app.use('/*', function(req, res, next) {
    res.redirect('/');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
