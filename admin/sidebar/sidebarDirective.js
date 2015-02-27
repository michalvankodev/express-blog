var app = angular.module('blogCms');

app.directive('ebSidebar', function() {
  return {
    restrict: 'EA',
    templateUrl: 'sidebar/sidebar.html',
    controller: function ($scope) {
      var users = {
        name: 'Users',
        state: 'users',
        links: [{ name: 'Add User', state: 'users.new', icon: 'fa-user-plus'}]
      }

      var posts = {
        name: 'Posts',
        state: 'posts',
        links: [{ name: 'New post', state: 'posts.new', icon: 'fa-file-o' }]
      }

      $scope.sections = [users, posts];

    }
  };
});
