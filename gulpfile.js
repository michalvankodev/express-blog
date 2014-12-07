var gulp = require('gulp');

// Plugins
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var SOURCE = {
  CLIENT : './client/**/!(*.spec).js',
  SERVER : './server/**/!(*.spec).js',

  CLIENT_SPEC : './client/**/*.spec.js',
  SERVER_SPEC : './server/**/*spec.js'
};


gulp.task('lint', function() {
  return gulp.src([SOURCE.CLIENT, SOURCE.SERVER])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
