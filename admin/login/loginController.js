var app = angular.module('blogCms');

app.controller('LoginController', function($scope, $http, $window, $mdToast, $state) {
  $scope.inProgress = false;

  $scope.authenticate = function authenticate() {

    $scope.inProgress = true;

    var msg = {
      username: $scope.username,
      password: $scope.password
    };

    $http.post('/auth', msg)
      .success(function(data) {
        console.log(data);
        $window.sessionStorage.setItem('accessToken', data.token);

        $state.go('home');
        $scope.inProgress = false;
      })
      .error(function(data) {
        $scope.errorMessage = data.message;

        $scope.inProgress = false;
      });
  };
});
