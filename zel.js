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
    cookie: { maxAge: 900}, 
    resave: true, 
    saveUninitialized: true,
    secure: true
  }
);

app.use(sessionStore);
var zel = require('./platform');
zel(app, express);

var options = {
  key: fs.readFileSync('certs/key.pem');
  cert: fs.readFileSync('certs/cert.pem');
};

https.createServer(options, app).listen(27890);