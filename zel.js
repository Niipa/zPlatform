// Copyright (c) 2015 Menard Z. Soliven
// Distributed under the MIT software license
// See license.txt or http://www.opensource.org/licenses/mit-license.php

var https = require('https');
var express = require('express');
var session = require('express-session');
var filesys = require('fs');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sessionStore = session(
  {
    secret: 'xs2@*kli13mcl406-XmeiAn2#casf', 
    cookie: {maxAge: 900}, 
    resave: true, 
    saveUninitialized: true,
    secure: true
  }
);

app.use(sessionStore);
var zel = require('./platform');
zel(app, express);

var options = {
  key: filesys.readFileSync('certs/key.pem'),
  cert: filesys.readFileSync('certs/cert.pem')
};

console.log('Listening, 27890');
https.createServer(options, app).listen(27890);