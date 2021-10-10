var path = require('path');
var logger = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var createError = require('http-errors');
var cookieParser = require('cookie-parser');

const User = require('./models/User');
const bcrypt = require("bcryptjs");

require('dotenv').config();

var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var blogsRouter = require('./routes/blogs');
var likesRouter = require('./routes/likes');
var reportsRouter = require('./routes/reports');
var requestsRouter = require('./routes/requests');

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
app.use(likesRouter);
app.use(reportsRouter);
app.use(requestsRouter);

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

User.find({}, async (err, users) => {
  if (!users || !users.length) {
    let body = {
      username: '@admin',
      password: 'admin123',
      role_id: 'admin',
      phone: '00000000',
      firstName: 'Admin',
      lastName: 'Admin',
      gender: 'Male',
      address: 'Lebanon',
      birthDate: '1991-01-01T00:00:00.000Z'
    };
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(body['password'], salt);
    body['password'] = hashedPassword;

    let user = new User(body);
    user.save((err, response) => { });
  }
});

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