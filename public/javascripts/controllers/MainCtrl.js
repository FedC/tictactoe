app.controller("MainCtrl", function($scope, $http, User) {
  $scope.state = 'waiting'; // game state

  var _socket = io.connect('http://localhost:8080');

  _socket.on('current user', function(msg){
    console.log('current user: ', msg.sid);
    $scope.session = msg.sid;
  });

  _socket.on('new user', function (msg) {
    console.log('new user: ', msg.sid);
    // game is started after at 
    // least one more user connects
    $scope.state = 'started';
  });

  _socket.on('user disconnected', function (msg) {
    console.log('user disconnected: ', msg.sid);

    User.find().then(function(res) {

      if (res.data && res.data.legnth < 1) {
        $scope.state = 'started';
      }
      else {
        $scope.state = 'waiting';
      }

    });
  });
  
  // Fetch users
  User.find().then(function(res) {
    var users = res.data;
    console.log('users: ', users);

    User.create($scope.session);

    if (users.length === 0) { // (1st player)

      $scope.state = 'waiting';

    }

    else if (users.length === 1) { // (2nd player)

      $scope.state = 'started';

    }

    else if (users.length === 2) { // (spectator)

    }

  });

});