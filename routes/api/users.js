var express = require('express');
var router = express.Router();
var request = require('request');
var fbURL = 'https://tindertictactoe.firebaseio.com/users.json';
var _ = require('lodash');

// gets users list
router.get('/users', function (req, res) {
  request({
    uri: fbURL,
    method: 'GET',
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.json(JSON.parse(body));
  });
});

// get user
router.get('/users/:id', function (req, res) {
  request({
    uri: fbURL + '?id=' + req.params.id,
    method: 'GET',
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.send(body);
  });
});

// create user
router.post('/users', function (req, res) {
  request({
    uri: fbURL,
    method: 'POST',
    'content-type': 'application/json',
    body: JSON.stringify(req.body)
  }, function (err, response, body) {
    if (err)
      res.send(err);

    res.json({id: JSON.parse(body).name});
  });
});

module.exports = router;