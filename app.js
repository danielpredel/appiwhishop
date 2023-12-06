var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Rutas
var usersRouter = require('./routes/user.routes');
var productRouter = require('./routes/product.routes');
var favoritesRouter = require('./routes/favorites.routes');
var listsRouter = require('./routes/lists.routes');
var historyRouter = require('./routes/history.routes');
var storesRouter = require('./routes/stores.routes');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Declarar rutas
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/favorites', favoritesRouter);
app.use('/lists', listsRouter);
app.use('/history', historyRouter);
app.use('/stores', storesRouter);

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