module.exports = function(app){
  var mongo = require('mongodb');
  var monk = require('monk');
  var express = require('express');
  var sanitizer = require('santizer');
  var fs = require('fs');

  var db = monk('view1:viewingTheWorld@localhost:27891', function(err){
    if(err){
      /* TODO: logToFile() */
      console.error(err); 
    }
  });

  var _collection = db.get('usrs');

  app.use(express.static(_dirname+'/resources',
      {
        'welcome':['welcome.html']
      }
    )
  );

  app.use(function(req, res, next){
    switch(req.url){
      case '/':
        var user = sanitizer.santize(req.body.u);
        var password = sanitizer.sanitize(req.body.p);

        coll.count({'username':user, 'password':password}, function(err, doc){
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
                if(err)
                  /* TODO: logToFile() */
              });

              res.location("resources/welcome.html");
              res.redirect("resources/welcome.html");
            }else{
              res.location("resources/reject.html");
              res.redirect("resources/reject.html");
            }
          }
        });
    }
  });
}