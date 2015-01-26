'use strict';

var app = angular.module('blogCms');

app.service('User', function() {
  this.username = '';
  this.role = '';
  this.id;

  this.logged = false;
});
