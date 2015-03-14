// Copyright (c) 2015 Menard Z. Soliven
// Distributed under the MIT software license
// See license.txt or http://www.opensource.org/licenses/mit-license.php

module.exports = function(app){
  var mongo = require('mongodb');
  var monk = require('monk');
  var express = require('express');
  var sanitizer = require('sanitizer');
  var jade = require('jade');
  var htmlFactory = jade.compileFile('./resources/welcome.jade');
  var dbCreds = require('./dbCreds');

  var db = monk(dbCreds.u + ':' + dbCreds.p + '@localhost:27891/zelDB', 
    function(err){
      if(err){
        /* TODO: logToFile() */
        console.error(err); 
      }
    }
  );

  var _collection = db.get('users');

  app.use(express.static(__dirname+'/resources',
      {
        'reject':['resources/reject.html']
      }
    )
  );

  app.use(function(req, res, next){
    console.log(req.url);
    switch(req.url){
      case '/00559ea764f3549e2a9c714ecd8af73f':

        var user = sanitizer.sanitize(req.body.u);
        var password = sanitizer.sanitize(req.body.p);

        console.log(user + ':' + password);

        _collection.count({'name':user, 'pw':password}, function(err, doc){
          if(err){
            res.status(500).send("Internal error.");
            
            /* TODO: logToFile() */
            console.error(err); 
          }else{

            if(JSON.stringify(doc) == 1){
              var sess = req.session;
              sess.usr = user;
              sess.password = password;

              req.session.regenerate(function(err){
                  /* TODO: logToFile() */
              });

              // Generate welcome.html
              // TODO: appList logic.
              var locals = {usr: user}
              // Generate html, send html.
              res.send(htmlFactory(locals));

            }else{
              res.location("./resources/reject.html");
              res.redirect("./resources/reject.html");
            }
          }
        });
      break;
      case '/':
        res.location("resources/index.html");
        res.redirect("resources/index.html");
      break;
      default:
        res.location("./resources/reject.html");
        res.redirect("./resources/reject.html");
      break;
    }
  });
}