app.factory('User', function($http) {
  var self = this;

  self.find = function (id) {
    if (id)
      return $http.get('/api/users/' + id);
    // else return full list
    return $http.get('/api/users', null);
  };

  self.create = function () {
    return $http.post('/api/users', {online: true})
  };

  return self;
});

app.factory('Game', function($http) {
  var self = this;
  var gamesRef = rootRef.child('games');

  self.find = function (id) {
    if (id)
      return $http.get('/api/games/' + id);
    // else return full list
    return $http.get('/api/games', null);
  };

  self.findWaitingGames = function () {
    return $http.get('/api/games/waiting', null);
  };

  self.create = function () {
    return $http.post('/api/games', null);
  };

  self.addUser = function (gameId, userId, sign) {
    gamesRef.child(gameId).child('users').child(userId).set({userId: userId, sign: sign});
  };

  self.changeState = function (gameId, state) {
    return $http.put('/api/games/' + gameId + '/state', {state: state})
  };

  self.makeTurn = function (gameId, userId) {
    gamesRef.child(gameId).child('turn').set(userId);
  };

  self.makeMove = function (gameId, userId, move, callback) {
    gamesRef.child(gameId).child('users').child(userId).child('moves').push(move, callback);
  };

  self.check = function (moves) {
    var check = {};

    var row1 = ['0,0', '1,0', '2,0'];
    var row2 = ['0,1', '1,1', '2,1'];
    var row3 = ['0,2', '1,2', '2,2'];

    var col1 = ['0,0', '0,1', '0,2'];
    var col2 = ['1,0', '1,1', '1,2'];
    var col3 = ['2,0', '2,1', '2,2'];

    var diaglr = ['0,0', '1,1', '2,2']; // left to right
    var diagrl = ['2,0', '1,1', '0,2']; // right to left

    // check if all spaces filled up
    if (moves[row1[0]] && moves[row1[1]] &&
        moves[row1[1]] && moves[row1[2]] &&
        moves[row2[0]] && moves[row2[1]] &&
        moves[row2[1]] && moves[row2[2]] &&
        moves[row3[0]] && moves[row3[1]] &&
        moves[row3[1]] && moves[row3[2]] &&
        moves[col1[0]] && moves[col1[1]] &&
        moves[col1[1]] && moves[col1[2]] &&
        moves[col2[0]] && moves[col2[1]] &&
        moves[col2[1]] && moves[col2[2]] &&
        moves[col3[0]] && moves[col3[1]] &&
        moves[col3[1]] && moves[col3[2]] ) {
      check.winnerSign = 'tie';
      check.winnerSpaces = row1.concat(row2).concat(row3)
                            .concat(col1).concat(col2).concat(col3);
    }

    // check rows
    if (moves[row1[0]] === moves[row1[1]] &&
        moves[row1[1]] === moves[row1[2]] ) {
      check.winnerSign = moves[row1[0]];
      check.winnerSpaces = row1;
    }

    if (moves[row2[0]] === moves[row2[1]] &&
        moves[row2[1]] === moves[row2[2]] ) {
      check.winnerSign = row2[0];
      check.winnerSpaces = row2;
    }

    if (moves[row3[0]] === moves[row3[1]] &&
        moves[row3[1]] === moves[row3[2]] ) {
      check.winnerSign = moves[row3[0]];
      check.winnerSpaces = row3;
    }
    
    // check cols
    if (moves[col1[0]] === moves[col1[1]] &&
        moves[col1[1]] === moves[col1[2]] ) {
      check.winnerSign = moves[col1[0]];
      check.winnerSpaces = col1;
    }

    if (moves[col2[0]] === moves[col2[1]] &&
        moves[col2[1]] === moves[col2[2]] ) {
      check.winnerSign = moves[col2[0]];
      check.winnerSpaces = col2;
    }

    if (moves[col3[0]] === moves[col3[1]] &&
        moves[col3[1]] === moves[col3[2]] ) {
      check.winnerSign = moves[col3[0]];
      check.winnerSpaces = col3;
    }

    // check diagonals
    if (moves[diaglr[0]] === moves[diaglr[1]] &&
        moves[diaglr[1]] === moves[diaglr[2]] ) {
      check.winnerSign = moves[diaglr[0]];
      check.winnerSpaces = diaglr;
    }

    if (moves[diagrl[0]] === moves[diagrl[1]] &&
        moves[diagrl[1]] === moves[diagrl[2]] ) {
      check.winnerSign = moves[diagrl[0]];
      check.winnerSpaces = diagrl;
    }
    
    return check;
  };

  return self;
});