'use strict';

var app = angular.module('blogCms');

app.controller('PostsController', function($scope, $http, AppService) {
  AppService.title = 'Posts';

  $http.get('/api/posts?q={"state": "any"}')
    .success(data => $scope.posts = data);
});
