// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],

    browsers: [],

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/hammerjs/hammer.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',

      // Include main app.js first
      'admin/js/app.js',
      'admin/**/*.js'
    ],

    preprocessors: {
      'admin/js/app.js': ['babel'],
      'admin/**/*.js': ['babel']
    }

  });
};
