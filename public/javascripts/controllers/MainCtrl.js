app.controller("MainCtrl", function($scope, $http, User, Game) {

  $scope.moves = {};
  $scope.winnerSpaces = [];

  function gameOver (result) {
    $scope.winnerSpaces = result.winnerSpaces;

    if (result.winnerSign === $scope.currentUser.sign) {
      $scope.currentGame.result = 'win';
    }
    else if (result.winnerSign === 'tie' ) {
      $scope.currentGame.result = result.winnerSign;
    }
    else {
      $scope.currentGame.result = 'lost';
    }

    Game.changeState($scope.currentGame.id, 'over');
  }

  function createAndAddUser (sign) {
    return User.create()
      .then(function (createUserResponse) {
        // assign current user
        $scope.currentUser = createUserResponse.data;
        $scope.currentUser.sign = sign;

        // add new user to game (state is waiting on user)
        return Game.addUser($scope.currentGame.id, $scope.currentUser.id, sign);
      });
  }

  function startGame () {
    var gameRef = rootRef.child('games').child($scope.currentGame.id);

    // fetch opponent's sign
    gameRef.child('users').child($scope.opponentId).child('sign').once('value', function (snapshot) {
      $scope.$apply(function () {
        $scope.opponentSign = snapshot.val();
      });
    });

    // listen for game state change
    gameRef.child('state').on('value', function (snapshot) {
      console.log('Game state change: ', snapshot.val());
      $scope.$apply(function () {
        $scope.currentGame.state = snapshot.val();
      });
    });

    // listen for game turn change
    gameRef.child('turn').on('value', function (snapshot) {
      console.log('Game turn change: ', snapshot.val());
      $scope.$apply(function () {
        $scope.currentGame.turn = snapshot.val();
      });
    });

    // listen for opponent's moves
    gameRef.child('users').child($scope.opponentId).child('moves')
      .on('child_added', function (snapshot) {
        var move = snapshot.val();
        if (move) {
          console.log('opponent made a move: ', move);

          // render the move
          var space = move.x.toString() + ',' + move.y.toString();
          $scope.moves[space] = $scope.opponentSign;

          // if game is won, update game state
          var check = Game.check($scope.moves);
          if (check.winnerSign) {
            gameOver(check);
          }
        }
      });
  }

  // check for active games
  Game.findWaitingGames().then(function (findGamesResponse) {
    var waitingGameFound = findGamesResponse.data;

    if (!waitingGameFound) {
      // create new game
      Game.create()
        .then(function (createGameResponse) {
          // assign as current game
          $scope.currentGame = createGameResponse.data;
          console.log('Game: ', $scope.currentGame);

          // create a user
          createAndAddUser('X').then(function () {
            // make this player's turn
            Game.makeTurn($scope.currentGame.id, $scope.currentUser.id);
          });

          // wait for opponent
          var usersRef = rootRef.child('games').child($scope.currentGame.id).child('users');
          usersRef.on('child_added', function (snapshot) {
            var newConnection = snapshot.val();
            if (newConnection.userId !== $scope.currentUser.id) {
              usersRef.off('child_added');

              // lookup and assign opponent
              $scope.opponentId = newConnection.userId;
              console.log('opponent added: ', $scope.opponentId);

              // change game state
              Game.changeState($scope.currentGame.id, 'started').then(startGame);
            }
          });
        });
    }

    else if (waitingGameFound) {
      // assign as currentGame
      $scope.currentGame = waitingGameFound;
      console.log('Game: ', $scope.currentGame);

      // assign opponent's user id
      if (waitingGameFound.users) {
        $scope.opponentId = Object.keys(waitingGameFound.users)[0];;
        console.log('opponent added: ', $scope.opponentId);
      }
      else {
        console.log('Something went wrong, try refreshing page.');
      }

      createAndAddUser('O');

      // update game state
      Game.changeState($scope.currentGame.id, 'started').then(startGame);
    }
  });

  $scope.makeMove = function (x, y) {
    if ($scope.currentGame.turn === $scope.currentUser.id && $scope.currentGame.state === 'started') {
      // check if there isn't a move alreade in this space
      var space = x.toString() + ',' + y.toString();
      if (!$scope.moves[space]) {
        console.log('move allowed');

        var move = '{"x": ' + x + ', "y":' + y + '}';
        Game.makeMove($scope.currentGame.id, $scope.currentUser.id, JSON.parse(move), function () {
          // update current board
          $scope.moves[space] = $scope.currentUser.sign;

          // if game is won, update game state
          var check = Game.check($scope.moves);
          if (check.winnerSign) {
            gameOver(check);
          }
          // else just keep playing
          else {
            // change turns
            Game.makeTurn($scope.currentGame.id, $scope.opponentId);
          }
        });
      }
    }
  };

  $scope.capitalize  = function (string) {
    var result = '';
    if (string) {
      var ary = string.split(' ');
      for (var i = 0; i < ary.length; i++) {
        var word = ary[i].charAt(0).toUpperCase() + ary[i].slice(1);
        result += word + ' ';
      }
    }
    return result;
  };

  $scope.moment = function (time) {
    return moment(time, 'YYYYMMDD').fromNow();
  };

  $scope.isWinner = function (space) {
    return $scope.winnerSpaces.indexOf(space) !== -1; 
  };

  $scope.showGamesList = function () {
    Game.find().then(function (games) {
      // populate list
      $scope.games = games.data;
      // show the dialog
      $scope.showDialog = true;
    });
  };

  $scope.closeGamesList = function () {
    // $scope.$apply(function () {
      // show the dialog
      $scope.showDialog = false;
      // clear list
      $scope.games = null;
    // });
  };

});