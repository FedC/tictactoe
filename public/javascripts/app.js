var rootRef = new Firebase('https://tindertictactoe.firebaseio.com/');

var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('game', {
      url: '/',
      templateUrl: 'partials/game.jade'
    });
});