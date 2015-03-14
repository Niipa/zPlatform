// Copyright (c) 2015 Menard (Ren) Z. Soliven
// Distributed under the MIT software license
// See license.txt or http://www.opensource.org/licenses/mit-license.php

module.exports = function(app){
  var mongo = require('mongodb');
  var express = require('express');
  var sanitizer = require('sanitizer');

  var jade = require('jade');
  var htmlFactory = jade.compileFile('resources/welcome.jade');
  var db = require('monk')('localhost:27891/zelDB', 
    function(err){
      if(err){
        /* TODO: logToFile() */
        console.error(err); 
      }
    }
  );

  var _collection = db.get('users');

  // Serving Logic
  app.use(express.static(__dirname + '/resources'));
  var sendOpts = {
    maxAge : '15 days',
    lastModified : true,
    dotfiles :  "ignore"
  };
  var sendFileCallBack = function(err){
    if(err){
      console.error(err);
      res.status(err.status).end();
    }else{
      console.log('Sent successfully.');
    }
  };

  app.use(function(req, res, next){

    switch(req.url){
      case '/00559ea764f3549e2a9c714ecd8af73f':

        var user = sanitizer.sanitize(req.body.u);
        var password = sanitizer.sanitize(req.body.p);

        console.log(user + ':' + password);

        _collection.count({'usr':user, 'pw':password}, function(err, doc){
          if(err){
            res.status(500).send("Internal error.");
            
            /* TODO: logToFile() */
            console.error(err); 
          }else{

            if(JSON.stringify(doc) == 1){
              var sess = req.session;
              sess.usr = user;
              sess.password = password;

              // Session Fixation Defense
              req.session.regenerate(function(err){
                  /* TODO: logToFile() */
              });

              // Generate welcome.html
              // TODO: appList logic.
              var locals = {usr: user}
              // Generate html, send html.
              res.send(htmlFactory(locals));

            }else{
              res.sendFile(__dirname + "/resources/reject.html", sendOpts, 
                sendFileCallBack);
            }
          }
        });
      break;
      default:
        res.sendFile(__dirname + "/resources/reject.html", sendOpts, 
          sendFileCallBack);
      break;
    }
  });
}