var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

var bodyParser = require("body-parser");
var mongoose = require('mongoose');

var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blogs');
var requestsRouter = require('./routes/requests');
var likesRouter = require('./routes/likes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello Maria !!')
});

app.use(authRouter);
app.use(usersRouter);
app.use(blogsRouter);
app.use(requestsRouter);
app.use(likesRouter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

try {
  mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
} catch (e) {
  console.log(e)
}

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ success: false, error: err });
});

module.exports = app;