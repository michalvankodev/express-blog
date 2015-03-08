'use strict';

var app = angular.module('blogCms');

app.controller('SingleUserController', function($scope, $state, $http, AppService) {

  if ($state.params.username) {
    $scope.newUser = false;
    $scope.user = { username: $state.params.username };
    AppService.title = 'Users > ' + $scope.user.username;

    $http.get('/api/users/' + $scope.user.username)
      .success(data => $scope.user = data);

  } else {
    $scope.newUser = true;
    $scope.user = { username: '' };
    AppService.title = 'Users > New User';
  }

  $scope.add = function() {
    $scope.saving = true;

    $http.post('/api/users', $scope.user)
      .success( data => {
        $scope.saving = false;

        $state.go('users');
      });
  };

  $scope.save = function() {
    $scope.saving = true;
    $http.put('/api/users/' + $scope.user.username, $scope.user)
      .success((data) => {
        $scope.saving = false;
      });
  };

  $scope.remove = function() {
  // TODO
  };
});
