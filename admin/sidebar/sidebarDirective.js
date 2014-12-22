var app = angular.module('blogCms');

app.directive('ebSidebar', function() {
  return {
    restrict: 'EA',
    templateUrl: 'sidebar/sidebar.html'
  };
});
