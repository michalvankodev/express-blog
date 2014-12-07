var gulp = require('gulp');

// Plugins
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

var SOURCE = {
  CLIENT : './client/**/!(*.spec|*.mock).js',
  SERVER : './server/**/!(*.spec).js',
  STATIC : './client/**/*(*.html|*.css)',

  APP : './server/app.js',

  CLIENT_SPEC : './client/**/*.spec.js',
  SERVER_SPEC : './server/**/*spec.js'
};


gulp.task('lint', function() {
  return gulp.src([SOURCE.CLIENT, SOURCE.SERVER])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch([SOURCE.CLIENT, SOURCE.STATIC], ['reload']);
});

gulp.task('reload', function() {
  livereload.changed();
});

/** Main development task */
gulp.task('serve', ['lint', 'watch'], function() {
  nodemon({ script: SOURCE.APP, env: { 'NODE_ENV': 'development' } , watch: ['server/*'], ext: 'js'})
    .on('start', function() {
      setTimeout(function() {
        livereload.changed();
      }, 2000);
    });
});
