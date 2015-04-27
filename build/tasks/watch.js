var gulp = require('gulp');
var paths = require('../paths');

/**
 * Watch source and specs files and rerun tests on change
 */
gulp.task('watch', function() {
  gulp.watch([paths.source, paths.specs], ['test']);
});
