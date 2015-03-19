'use strict';

var app = angular.module('blogCms');

app.controller('UsersController', function($scope, $http, AppService) {
  AppService.title = 'Users';

  $scope.getUsers = function() {
    $http.get('/api/users')
      .success(data => $scope.users = data);
  };

  $scope.getUsers();
});
