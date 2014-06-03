var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var connect = require('connect');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var socketIo = require('socket.io');
var passportSocketIo = require('passport.socketio');
var sessionStore = new connect.session.MemoryStore();

var sessionSecret = 'sesyjnySekret';
var sessionKey = 'connect.sid';

var server = app.listen(3000);
var io = require('socket.io').listen(server);

var history = [];


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon("public/images/favicon.png")); 
    app.use(express.urlencoded());
 //   app.use(express.methodOverride());

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static("bower_components"));


    app.use(express.cookieParser());
    app.use(express.urlencoded());
    app.use(express.session({
        store: sessionStore,
        key: sessionKey,
        secret: sessionSecret
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        if ((username === 'admin') && (password === '1')) {
            return done(null, {
                username: username,
                password: password
            });
        } else {
            return done(null, false);
        }
    }
));

io.sockets.on('connection', function (socket) {
    socket.emit('history', history);
    socket.on('send msg', function (data) {
        history.unshift(data);
        io.sockets.emit('rec msg', data);
    });
    

    socket.on('send clubs', function (data) {
        
        io.sockets.emit('rec clubs', data);
    });
});


app.get('/', function(req, res) {
    res.render("index", {title: "Strona główna"});
});

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/admin');
    }
);

app.get('/login', function (req, res) {
    var username;
    if (req.user) {
        username = req.user.username;
        res.render("admin", {title: "Administracja"});

    } else {
        res.render("login", {title: "Logowanie"});
    }
});

app.get('/admin', function(req, res) {
    if (req.user) {
        res.render("admin", {title: "Administracja"});
    } else {
        res.render("login", {title: "Logowanie"});
    }

});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});
