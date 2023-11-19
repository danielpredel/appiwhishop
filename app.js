var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var rutaDBOne = process.env.RUTA_DB_ONE;
var rutaDBTwo = process.env.RUTA_DB_TWO;

// console.log(rutaDBOne);
// console.log(rutaDBTwo);
fs.readFile(`${rutaDBOne}/users.json`, 'utf-8', (error, data) => {
  if (error) {
    console.error('Error al leer el archivo:', error);
    return;
  }

  // Parsea el contenido del JSON
  const jsonData = JSON.parse(data);

  // Ahora, jsonData contiene el objeto JavaScript correspondiente al JSON
  console.log(jsonData);
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
