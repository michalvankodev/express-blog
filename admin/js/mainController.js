'use strict';

var app = angular.module('blogCms');

app.controller('MainController', function($scope, AppService, $mdSidenav) {
  $scope.AppService = AppService;
  
  $scope.toggleMenu = function() {
    $mdSidenav('main-sidenav').toggle();
  };
});
