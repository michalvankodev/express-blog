'use strict';

var app = angular.module('blogCms');

app.controller('SinglePostController', function($scope, $state, $http, User, AppService) {

  if ($state.params.seoTitle) {
    $scope.newPost = false;
    $scope.post = { seoTitle: $state.params.seoTitle };

    $http.get('/api/posts/' +$scope.post.seoTitle)
      .success(data => {
        $scope.post = data;
        AppService.title = 'Posts > ' + $scope.post.title;
      });
  }
  else {
    $scope.newPost = true;
    $scope.post = { seoTitle: '' };
    AppService.title = 'Posts > New Post';
  }

  $scope.saving = false;

  $scope.saveNewPost = function saveNewPost() {
    $scope.saving = true;
    $http.post('/api/posts/', $scope.post)
      .success(function(data){
        $scope.saving = false;
        $scope.post.id = data._id;
      })
      .error(function(data){
        console.log(data);
      });
  };

  $scope.saveEditingPost = function saveEditingPost() {
    $scope.saving = true;
    $http.put('/api/posts/' + $scope.post.seoTitle, $scope.post)
      .success(function(data){
        $scope.saving = false;
        $scope.post.id = data._id;
      })
      .error(function(data){
        console.log(data);
      });
  };

  $scope.savePost = function savePost() {
    if (newPost) {
      $scope.saveNewPost();
    }
    else {
      $scope.saveEditingPost();
    }
  };

});
