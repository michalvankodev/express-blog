var gulp = require('gulp');
var paths = require('../paths');
var shell = require('shelljs');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function(done) {
  del(paths.output, done);
});

gulp.task('jsdoc', function(done) {
  shell.exec('jsdoc -r dist/ -d dist/docs -R README.md', done);
});

gulp.task('compile', ['lint', 'test'], function() {
  var options = {
    optional: ['strict']
  };

  return gulp.src(paths.source)
    .pipe(babel(options))
    .pipe(gulp.dest(paths.output));
});

gulp.task('dist', function() {
  runSequence('clean', 'compile', 'jsdoc');
});
