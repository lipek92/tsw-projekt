/*jshint globalstrict: true, devel: true, browser: true, jquery: true */
/*global require, __dirname*/ 
"use strict";

var express = require('express');
var path = require('path');
var less = require('less-middleware');
var app = express();
var connect = require('connect');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var socketIo = require('socket.io');
// var passportSocketIo = require('passport.socketio');
var sessionStore = new connect.session.MemoryStore();

var sessionSecret = 'sesyjnySekret';
var sessionKey = 'connect.sid';

var server = app.listen(3000);
var io = require('socket.io').listen(server);

var msgHistory = [];
var clubs = {
        fc: "",
        sc: "",
        fcScore: "0",
        scScore: "0"
    };


app.configure(function () {
    // app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon("public/images/favicon.png")); 
    app.use(express.urlencoded());
 //   app.use(express.methodOverride());

    app.use(less({
        src: path.join(__dirname, 'less'),
        dest: path.join(__dirname, 'public/css'),
        prefix: '/css',
        compress: true
    }));
    
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
        if ((username === 'admin') && (password === 'admin')) {
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


    socket.emit('rec clubs', clubs);
    socket.emit('history', msgHistory);

    socket.on('send msg', function (data) {
        msgHistory.unshift(data);
        io.sockets.emit('rec msg', data);
    });
    
    socket.on('send clubs', function (data) {
        clubs.fc = data.fc;
        clubs.sc = data.sc;
        io.sockets.emit('rec clubs', data);
    });

    socket.on('send score', function (data) {
        console.log(data);
        if (data === "firstTeam")
        {
            clubs.fcScore++;
        } else {
            clubs.scScore++;
        }
        io.sockets.emit('rec score', clubs);
    });

    socket.on('end relation', function () {
        clubs.fc = "";
        clubs.sc = "";
        clubs.fcScore = "0";
        clubs.scScore = "0";
        msgHistory.length = 0;

        socket.emit('rec clubs', clubs);
        socket.emit('history', msgHistory);
    });

});


app.get('/', function(req, res) {
    if (req.user) {
        res.render("index", {login: "Panel admina"});
    } else
    {
        res.render("index", {login: "Zaloguj"});
    }
});

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/admin');
        console.log(req.user);
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
    res.redirect('/');
});
