var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
<<<<<<< HEAD
var session = require('express-session'); 
var mongoose = require('mongoose');       
mongoose.Promise = global.Promise;  //初始化

var index = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var admin = require('./routes/admin');
var msg = require('./routes/msg');
var teacher = require('./routes/teacher');
var upload = require('./routes/upload');
=======

var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var userHome = require('./routes/userHome');
var adminHome = require('./routes/adminHome');
var msg = require('./routes/msg');
>>>>>>> first commit

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
<<<<<<< HEAD
=======

>>>>>>> first commit
app.use(session({secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串    
cookie: { maxAge: 20 * 60 * 1000 }, //cookie生存周期20*60秒    
resave: true,  //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次    
saveUninitialized: true //强制保存未初始化的会话到存储器    
<<<<<<< HEAD
}));  //这些是写在app.js里面的    
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({uploadDir:'./uploadtemp'}));//设置上传临时文件夹  

//-----------拦截器的实现-------------------------------------
var openPage = ['/','/users/zhuce','/users/login','/users/logout'];

app.use(function(req, res, next) {
  var url = req.originalUrl;
  if(openPage.indexOf(url)>-1){
  	next();
  }else{
  	if(req.session.loginbean){
  		next();
  	}else{
  		res.redirect('/');
  	}
  	
  }
});
//-------------------------------------------------------------

app.use('/', index);
app.use('/users', users);
app.use('/home', home);
app.use('/admin', admin);
app.use('/msg', msg);
app.use('/teacher', teacher);
app.use('/upload', upload);



var db = mongoose.connect('mongodb://localhost/eduline');
console.log('数据库连接成功');


// catch 404 and forward to error handler
=======
}));  //这些是写在app.js里面的 



app.use(express.static(path.join(__dirname, 'public')));


var openPage = ['/','/aa','/users/zhuce','/users/login','/users/logout'];
app.use(function(req, res, next) {
	var url = req.originalUrl;
	if(openPage.indexOf(url)>-1){
  		next();
  	}else{
	  	if(req.session.loginbean){
	  		next();
	  	}else{
	  		res.redirect('/');
	  	}
  	}
});

app.use('/', index);
app.use('/users', users);
app.use('/userHome', userHome);
app.use('/adminHome', adminHome);
app.use('/msg', msg);

// catch 404 and forward to error handler


>>>>>>> first commit
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

<<<<<<< HEAD
=======


>>>>>>> first commit
module.exports = app;
