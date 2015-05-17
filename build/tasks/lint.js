var gulp = require('gulp');
var paths = require('../paths');
var eslint = require('gulp-eslint');

// runs jshint on all .js files
gulp.task('lint', function() {
  return gulp.src([paths.source, paths.specs])
    .pipe(eslint())
    .pipe(eslint.format());
});
