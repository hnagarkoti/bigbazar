var express = require('express');
var flash = require('express-flash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressValidator = require('express-validator');
var session      = require('express-session');
var MySQLStore = require('express-mysql-session')(session);


var multer  = require('multer');
var fs = require('fs');




var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var profile = require('./routes/profile');
var siteAddons = require('./lib/site_addons');

var config = require( './config' );
config.db.user = config.db.username;

var sessionStore = new MySQLStore( config.db );
var app = express();
siteAddons.setupCutomRedirect( app );
// app.response._redirect = function(url){
//   // console.log('url:-- ', url);
//   var res = this;
//   console.log('--------------------------------','/blogstar'+ url);
//   return res.redirect('/blogstar'+ url);
// }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: config.cookieName,
  secret: config.cookieSecret,
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/users/profile',profile)


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

app.use(function(req, res, next){
  res.on('finish', function(){
    console.log("Finished " + res.headersSent); // for example
    console.log("Finished " + res.statusCode);  // for example
    // Do whatever you want
  });
  next();
});

if(process.env.NODE_ENV != "production") {
  app.locals.mountPath = '../..';
  app.locals.localPath = '';
  console.log('if part==============');
} else {
  app.locals.localPath = 'http://fbbblogstar.in/blogstar/';
  // app.locals.localPath = '';
  app.locals.mountPath = 'http://fbbblogstar.in/blogstar/';
  // app.locals.mountPath = '';
}

// module.exports.localPath = localPath;
module.exports = app;
