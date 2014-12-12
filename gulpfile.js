var gulp = require('gulp');

// Plugins
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var concat = require('gulp-concat');
var path = require('path');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

var SOURCE = {
  CLIENT : {
    js: './client/**/!(*.spec|*.mock).js',
    less: './client/**/*.less'
  },
  SERVER : './server/**/!(*.spec).js',
  STATIC : './client/**/*(*.html|*.css)',

  APP : './server/app.js',

  CLIENT_SPEC : './client/**/*.spec.js',
  SERVER_SPEC : './server/**/*spec.js'
};


gulp.task('lint', function() {
  return gulp.src([SOURCE.CLIENT.js, SOURCE.SERVER])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch([SOURCE.CLIENT.js, SOURCE.STATIC], ['reload']);
});

gulp.task('reload', function() {
  livereload.changed();
});

gulp.task('less', function() {
  return gulp.src(SOURCE.CLIENT.less)
    .pipe(less())
    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(gulp.dest('./client/generated/css'));
})

//TODO INJECT CSS JS

/** Main development task */
gulp.task('serve', ['lint', 'watch'], function() {
  nodemon({ script: SOURCE.APP, env: { 'NODE_ENV': 'development' } , watch: ['server/*'], ext: 'js'})
    .on('start', function() {
      setTimeout(function() {
        livereload.changed();
      }, 2000);
    });
});
