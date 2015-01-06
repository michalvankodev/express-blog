'use strict';

var app = angular.module('blogCms');

app.service('User', function() {
  this.name = '';
  this.role = '';
  this.token = '';

  this.logged = false;
});
