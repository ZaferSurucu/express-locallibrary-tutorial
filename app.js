var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coolRouter = require('./routes/cool')
const catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
const compression = require('compression');
const helmet = require('helmet');

var app = express();

var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 1*60*1000,
  max: 20,
})

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = "mongodb+srv://zafer:3578520@cluster0.aynz0gw.mongodb.net/?retryWrites=true&w=majority"

main().catch(err => console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression()); //Compress all routes
app.use(helmet());
app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/cool', coolRouter)
app.use("/catalog", catalogRouter);  // Add catalog routes to middleware chain.
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