var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


//Import modules

var router = require('./routes/transactions');
var incomeStatementRouter = require('./routes/income');
var trialBalanceRouter = require('./routes/trialbalances');
var closingRouter = require('./routes/closing');
//var ownerEquityRouter = require('./routes/ownerequity');


//Set route for sample data
app.use('/transactions', router);
app.use('/income', incomeStatementRouter);
app.use('/trialbalances', trialBalanceRouter);
app.use('/closing',closingRouter);

//app.use('/ownerequity', ownerEquityRouter);


// app.use('/income', router);
app.use(express.static('public'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;