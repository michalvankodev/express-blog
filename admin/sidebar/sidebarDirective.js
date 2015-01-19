var app = angular.module('blogCms');

app.directive('ebSidebar', function() {
  return {
    restrict: 'EA',
    templateUrl: 'sidebar/sidebar.html',
    controller: function ($scope) {
      var posts = {
        name: "Posts",
        state: "posts",
        links: [{ name: "Add new post", state: "posts.new" }]
      }

      $scope.sections = [posts];

    }
  };
});
