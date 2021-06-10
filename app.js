var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const serveIndex = require('serve-index');

const axios = require('axios');
// Axios特性
// 1、可以在瀏覽器中發送 XMLHttpRequests
// 2、可以在 node.js 發送 http 請求
// 3、支持 Promise API
// 4、攔截請求和響應
// 5、轉換請求數據和響應數據
// 6、能夠取消請求
// 7、自動轉換 JSON 數據
// 8、客戶端支持保護安全免受 XSRF 攻擊
// 原文網址：https://kknews.cc/code/rl8leyo.html

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/', serveIndex('public', {'icons': true}));
app.use('/users', usersRouter);

app.get ('/try-sse',(req, res)=>{
  let id = 30;
  res.writeHead(200,{

    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',

  });

  setInterval(function(){
    //不可以用res.send跟res.end 不然會中斷連線
    let now = new Date;

    res.write(`id: ${id}\n`);
    res.write(`data: ${now.toLocaleString()}\n\n`);
    id ++;
  }, 2000)


})


app.get('/google',(req,res)=>{
  axios.get('http://google.com/')//拿到的是promise
  .then(response=>{
    res.send(response.data)
  });
})

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
