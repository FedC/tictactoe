var express = require('express');
var router = express.Router();
var request = require('request');
var generate = require('project-name-generator');
var fbURL = 'https://tindertictactoe.firebaseio.com/';
var _ = require('lodash');

// get waiting game
router.get('/games/waiting', function (req, res) {
  request({
    uri: fbURL + 'games.json',
    method: 'GET',
  }, function (err, response, body) {
    if (err)
      res.send(err);

    var obj;
    _.forIn(JSON.parse(body), function(game, id) {
      if (game.state === 'waiting') {
        obj = game;
        obj.id = id;
      }
    });
    res.json(obj);
  });
});

// gets games list
router.get('/games', function (req, res) {
  request({
    uri: fbURL + 'games.json',
    method: 'GET',
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.send(body);
  });
});

// get single game
router.get('/games/:id', function (req, res) {
  request({
    uri: fbURL + 'games.json?id=' + req.params.id,
    method: 'GET',
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.send(body);
  });
});

// create game
router.post('/games', function (req, res) {
  req.body.state = 'waiting';
  req.body.started_at = new Date();
  req.body.name = generate().spaced; // generate random name for game
  var data = JSON.stringify(req.body);
  
  request({
    uri: fbURL + 'games.json',
    method: 'POST',
    'content-type': 'application/json',
    body: data
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.json({id: JSON.parse(body).name, state: req.body.state, name: req.body.name, started_at: req.body.started_at});
  });
});

// add user to game
router.put('/games/:id/users', function (req, res) {
  var data = req.body;
  request({
    uri: fbURL + '/games/' + req.params.id + '/users/' + data.userId + '.json',
    method: 'PUT',
    'content-type': 'application/json',
    body: JSON.stringify(data)
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.json(JSON.parse(body));
  });
});

// update game state
router.put('/games/:id/state', function (req, res) {
  request({
    uri: fbURL + '/games/' + req.params.id + '.json',
    method: 'PATCH',
    'content-type': 'application/json',
    body: JSON.stringify(req.body)
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.json(JSON.parse(body));
  });
});

module.exports = router;