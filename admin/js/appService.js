'use strict';

class AppService {
  constructor() {
    this.title = 'express-blog CMS';
  }
}


var app = angular.module('blogCms');
app.service('AppService', AppService);
