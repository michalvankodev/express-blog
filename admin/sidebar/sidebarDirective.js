var app = angular.module('blogCms');

app.directive('ebSidebar', function() {
  return {
    restrict: 'EA',
    templateUrl: 'sidebar/sidebar.html',
    controller: function ($scope) {
      $scope.sections = [
        { name: "Posts", url: '/posts' }
      ];

    }
  };
});
