'use strict';
/**
* authentification.js
*
* Authentification based on every state change.
* Whenever state changes we took a look if user has set credentials (access token)
* and compare it to the restriction of the state.
*/
var app = angular.module('blogCms');

app.run(function ($rootScope, $state, User) {

  var isAllowed = function isAllowed(user, state) {
    if (typeof state.data === 'undefined' || typeof state.data.restrictTo === 'undefined') {
      return true;
    }

    if (state.data.restrictTo.indexOf(user.role) > -1) {
      return true;
    }
    else {
      return false;
    }
  };

  // Check if user is allowed on every state change
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (!isAllowed(User, toState)) {
      event.preventDefault(); // Prevent going to the next state
      $state.go('notLoggedIn');
    }

  });


});
