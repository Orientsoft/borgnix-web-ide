var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var multer = require('multer');
var _ = require('underscore');

var routes = require('./routes/index');
var users = require('./routes/users');
var upload = require('./routes/upload')

var app = express();

var Nedbstore = require('borgnix-project-manager/lib/store/nedb')
var fs = require('fs-extra')
var config = fs.readJsonSync('config/config.json')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(multer({dest: './uploads'}));

var session = require('express-session')
var sessionStore
switch (config.session.store.type) {
  case 'redis':
    var RedisStore = require('connect-redis')(session)
    sessionStore = new RedisStore(_.omit(config.session.store, 'type'))
  break
  default:
  break
}

app.use(session({
  secret: config.session.secret,
  name: 'app.sid',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))

config.store = new Nedbstore('nedb/projects')

var projects = require('borgnix-project-manager/lib/router')(config)
var auth = require('./routes/' + (config.singleUser ? 'single' : 'auth'))

app.use('*', auth)
app.use('/', routes);
app.use('/users', users);
app.use('/p', projects)
app.use('/upload', upload)

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
