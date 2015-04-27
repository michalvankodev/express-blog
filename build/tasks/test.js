var gulp = require('gulp');
var paths = require('../paths');
var mocha = require('gulp-spawn-mocha');

// Test server js files
gulp.task('test', function() {
  return gulp.src(paths.specs, {read: false})
    .pipe(mocha({
      reporter: 'nyan',
      compilers: 'js:babel/register',
      env: {
        'NODE_ENV': 'test',
        'PORT': 9999
      }
    }));
});
