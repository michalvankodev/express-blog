'use strict';

var app = angular.module('blogCms');

app.service('User', function() {
  this.name = '';
  this.role = '';
  this.accesstoken = '';

  this.logged = false;
});
