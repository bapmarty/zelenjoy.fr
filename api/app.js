var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var planning    = require('./routes/planning');
var stream      = require('./routes/stream');
var callback    = require('./routes/callback');
var profile     = require('./routes/profile');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/planning', planning);
app.use('/api/stream', stream);
app.use('/api/callback', callback);
app.use('/api/profile', profile);

module.exports = app;
