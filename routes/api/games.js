var express = require('express');
var router = express.Router();
var mongoose   = require('mongoose');
mongoose.connect('mongodb://node:node@apollo.modulusmongo.net:27017/ma6Wujot');

var Game = require('../models/game');

// gets games list
router.get('/games', function (req, res) {
  Game.find(function(err, games) {
    if (err)
      res.send(err);

    res.json(games);
  });
});

// get single game
router.get('/games/:id', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    var id = req.params.id;
    Game.findById(id, function (err, game) {
      if (err)
        res.send(err);
      res.json(game);
    });
  }
});

// create game
router.post('/games', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    var game = new Game();

    game.created_at = new Date();
    game.status = 'waiting';

    game.save(function(err) {
      if (err) 
        res.send(err);

      res.json({message: 'Game created!'});
    });
  }
});

// update game
router.put('/games/:id', function (req, res) {
  if (! req.body) {
    res.send('Your request contained no body!');
  }
  else {
    Game.findById(req.params.id, function (err, game) {
      if (err)
        res.send(err);

      // update game info
      if (req.body.status) game.status = req.body.status;
      if (req.body.users) game.users = req.body.users;

      game.save(function(err) {
        if (err)
          res.send(err);

        res.json({message: 'Game updated!'});
      });
    });
  }
  
});

module.exports = router;