var gulp = require('gulp');

// Plugins
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');


var SOURCE = {
  CLIENT : './client/**/!(*.spec|*.mock).js',
  SERVER : './server/**/!(*.spec).js',

  APP : './server/app.js',

  CLIENT_SPEC : './client/**/*.spec.js',
  SERVER_SPEC : './server/**/*spec.js'
};


gulp.task('lint', function() {
  return gulp.src([SOURCE.CLIENT, SOURCE.SERVER])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


/** Main development task */
gulp.task('serve', ['lint'], function() {
  nodemon({ script: SOURCE.APP, env: { 'NODE_ENV': 'development' } , watch: ['server/*'], ext: 'js'});
});
