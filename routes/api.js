var express = require('express');
var router = express.Router();
var mongoose   = require('mongoose');
mongoose.connect('mongodb://node:node@apollo.modulusmongo.net:27017/ma6Wujot');

var User = require('../models/user');

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('API accessed');
  next();
});

// gets users list
router.get('/users', function (req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
});

// get single user
router.get('/users/:uid', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    var uid = req.params.uid;
    User.findById(uid, function (err, user) {
      if (err)
        res.send(err);
      res.json(user);
    });
  }
});

// create user
router.post('/users', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    var user = new User();
    user.sid = req.body.sid;

    user.save(function(err) {
      if (err) 
        res.send(err);

      res.json({message: 'User created!'});
    });
  }
});

// update user
router.put('/users/:uid', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    User.findById(req.params.uid, function (err, user) {
      if (err)
        res.send(err);

      // update user info
      // user.moves = req.body.moves; 
      // user.rank = req.body.rank;

      user.save(function(err) {
        if (err)
          res.send(err);

        res.json({message: 'User updated!'});
      });
    });
  }
  
});

// delete user
router.delete('/users/:sid', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    User.findOneAndRemove({sid: req.params.sid}, '_id', function (err) {
      if (err)
        res.send(err || 'No user found for sid ' + req.params.sid);
    
      res.json({message: 'Successfully deleted.'});
    });
  }
});

// clear db (reset game)
router.delete('/users', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    User.find(function(err, users) {
      if (err)
        res.send(err);

      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        User.remove({
          _id: user._id
        }, function(err, user) {
          if (err)
            res.send(err);
        });
      }
      res.json({message: 'Successfully deleted users.'});
    });
  }
});

module.exports = router;