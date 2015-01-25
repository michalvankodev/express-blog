'use strict';

var app = angular.module('blogCms');

app.controller('PostsController', function($scope,$http) {
  $http.get('/api/posts')
    .success(function(data){
      $scope.posts = data;
    });
});
