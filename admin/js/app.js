'use strict';
/**
* app.js
*
* Settings for the angular app.
* In this file you can setup routes and other configuration for the angular app
*/
var app = angular.module('blogCms', ['ui.router', 'ngMaterial']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('notLoggedIn', {
      url: '/login',
      views: {
        'mainView': {
          templateUrl: 'login/login.html',
          controller: 'LoginController'
        }
      }
    })
    .state('home', {
      url: '/',
      views: {
        'mainView': {
          templateUrl: 'home/home.html',
          controller: 'HomeController'
        }
      },
      data: { restrictTo: ['admin'] }
    })
    .state('posts', {
      url: '/posts',
      views: {
        'mainView': {
          templateUrl: 'post/index.html',
          controller: 'PostsController'
        }
      },
      data: { restrictTo: ['admin'] }
    })
    .state('posts.post', {
      url: '/:post',
      views: {
        'mainView': {
          templateUrl: 'post/post.html',
          controller: 'SinglePostController'
        }
      },
      data: { restrictTo: ['admin'] }
    })
    .state('posts.new', {
      url: '/new',
      views: {
        'mainView': {
          templateUrl: 'post/post.html',
          controller: 'SinglePostController'
        }
      },
      data: { restrictTo: ['admin'] }
    })
    ;
});
