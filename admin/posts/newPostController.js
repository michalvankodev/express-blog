'use strict';

var app = angular.module('blogCms');

app.controller('NewPostController', function($scope, $http, User) {
  $scope.saving = false;
  $scope.post = {};

  $scope.savePost = function savePost() {
    $scope.saving = true;
    $http.post('/api/posts/', $scope.post)
      .success(function(data){
        $scope.saving = false;
        $scope.post.id = data._id;
      })
      .error(function(data){
        console.log(data);
      });
  }
});
