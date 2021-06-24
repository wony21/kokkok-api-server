require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var session = require('express-session');
var kokkokPassport = require('./authentication/kokkok-passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login.router');
var memberRouter = require('./routes/member.router');

var app = express();

var mongoose = require('./db/db');
console.log('try connect database...');
mongoose.connection();

// view engine setup
console.log('view engine setup');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// passport middleware
console.log('passport middleware');
var passportMiddleWare = function (req, res, next) {
  console.log(req);
  if ( req.isAuthenticated() ) {
    // var requestUri = req.path;
    // var isAdminPage = requestUri.startsWith('/admin/');
    // var isAdmin = req.session.passport.user.admin;
    // if ( isAdmin == undefined ) {
    //   isAdmin = false;
    // }
    // console.log('request admin page :', isAdminPage, ' is admin user :', isAdmin);
    // if ( isAdminPage && !isAdmin ) {
    //   req.logout();
    //   res.redirect('/login');
    //   return false;
    // }
    // console.log(req.session.passport.user);
    return next();
  }
  // console.log('Not isAuthenticated()');
  console.log('not authenticated.');
  res.redirect('/');
}

//app.use(logger('dev'));
app.use(logger('local'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors 적용
app.use(cors());


console.log('init passport..');
// 세션 활성화
app.use(session({ secret: process.env.PASSPORT_SECRET, resave: true, saveUninitialized: false })); 
app.use(passport.initialize()); // passport 연결
app.use(passport.session());    // session 연결
kokkokPassport();               // passport custom 적용

console.log('setting routers...');
app.use('/', indexRouter);
app.use('/login', loginRouter);
// app.use(passportMiddleWare);  // 미들웨어 아래 부분 부터 인증검사 후 비인가사용자 로그인 페이지로 이동
app.use('/members', memberRouter);
app.use('/users', usersRouter);

console.log('catch 404 and forward to error handler...');
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
