var app = angular.module('blogCms');

app.directive('ebSidebar', function() {
  return {
    restrict: 'EA',
    templateUrl: 'sidebar/sidebar.html',
    transclude: true,
    controller: function ($scope) {
      var posts = {
        name: "Posts",
        state: "posts",
        links: [{ name: "New post", state: "posts.new", icon: "fa-file-o" }]
      }

      $scope.sections = [posts];

    }
  };
});
