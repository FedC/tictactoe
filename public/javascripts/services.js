app.factory('User', function($http) {
  var self = this;

  self.find = function (sid) {
    if (sid)
      return $http.get('/api/users' + sid);
    // else return full list
    return $http.get('/api/users', null);
  };

  self.create = function (sid) {
    $http.post('/api/users', {sid: sid})
      .then(function(resp) {
        console.log(resp.data.message);
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  return self;
});