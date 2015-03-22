'use strict';

var app = angular.module('blogCms');

app.controller('SingleUserController', function($scope, $state, $http, AppService, $mdDialog, User) {

  if ($state.params.username) {
    $scope.newUser = false;
    $scope.user = { username: $state.params.username };
    AppService.title = 'Users > ' + $scope.user.username;

    $http.get('/api/users/' + $scope.user.username)
      .success(data => $scope.user = data);

  } else {
    $scope.newUser = true;
    $scope.user = { username: '' };
    AppService.title = 'Users > New User';
  }

  $scope.add = function() {
    $scope.saving = true;

    $http.post('/api/users', $scope.user)
      .success( data => {
        $scope.saving = false;
        $scope.refreshUsers();
        $state.go('users');
      });
  };

  $scope.save = function() {
    $scope.saving = true;
    $http.put('/api/users/' + $scope.user.username, $scope.user)
      .success((data) => {
        $scope.saving = false;
        $scope.refreshUsers();
        $state.go('users');
      });
  };

  $scope.removeDialog = function(event) {

    // Show alert
    var dialog = $mdDialog.confirm()
      .parent(angular.element(document.body))
      .title(`Remove ${$scope.user.username}`)
      .content(`Are you sure you want to remove user ${$scope.user.username}?`)
      .ariaLabel(`Are you sure you want to remove user ${$scope.user.username}?`)
      .ok('Delete')
      .cancel('Cancel')
      .targetEvent(event);

    var alertDialog = $mdDialog.alert()
      .parent(angular.element(document.body))
      .title('You can not remove yourself')
      .content('Why you would do that? Contact other admin to remove yourself.')
      .ariaLabel('You can not remove yourself')
      .ok('Got it!')
      .targetEvent(event)

    if(User.username === $scope.user.username) {
      $mdDialog.show(alertDialog);
    } else {
      $mdDialog.show(dialog).then(deleteUser, cancel);
    }

    function deleteUser() {
      $http.delete('/api/users/' + $scope.user.username)
        .success((data) => {
          $scope.deleting = false;
          $scope.refreshUsers();
          $state.go('users');
        });
    }

    function cancel() {
      // pass
    }

  };

  $scope.refreshUsers = function() {
    $scope.$parent.getUsers();
  };
});
