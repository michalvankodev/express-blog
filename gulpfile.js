// all gulp tasks are located in the ./build/tasks directory
// gulp configuration is in files in ./build directory
var gulp = require('gulp');
require('require-dir')('build/tasks');

/**
 * Run server and watch on save for changes.
 *
 * Test after every save
 */
gulp.task('default', ['serve', 'watch', 'test']);
