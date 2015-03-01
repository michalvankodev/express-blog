'use strict';

var app = angular.module('blogCms');

app.controller('SingleUserController', function($scope, $state, $http, AppService) {
  $scope.user = { username: $state.params.username };

  AppService.title = 'Users > ' + $state.params.username;

  $http.get('/api/users/' + $scope.user.username)
    .success(data => $scope.user = data);

  $scope.save = function() {
    $scope.saving = true;
    $http.put('/api/users/' + $scope.user.username, $scope.user)
      .success((data) => {
        $scope.saving = false;
      });
  }
});
