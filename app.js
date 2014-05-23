var express = require('express');
// var routes = require('./routes');
// var admin = require('./routes/admin');
// var login = require('./routes/login');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});



app.get('/', function(req, res) {
    res.render("index", {title: "Strona główna"});
});

app.get('/login', function(req, res) {
    res.render("login", {title: "Logowanie"});
});

app.get('/admin', function(req, res) {
    res.render("admin", {title: "Administracja"});
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express nasłuchuje na porcie: " + app.get('port'));
});
