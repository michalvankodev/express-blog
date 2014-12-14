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
var inject = require('gulp-inject');
var order = require('gulp-order');


var SOURCE = {
  CLIENT : {
    js: './client/**/!(*.spec|*.mock).js',
    less: './client/**/*.less',
    css: './client/**/*.css',
    indexHtml: './client/index.html'
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

  gulp.watch([SOURCE.CLIENT.js, SOURCE.STATIC], ['reload'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', reloading...');
    });

  // Watch less stylesheets and compile them
  gulp.watch(SOURCE.CLIENT.less, ['less']);

  livereload.listen();
});

gulp.task('reload', function() {
  livereload.changed('Client');
});

gulp.task('less', function() {
  return gulp.src(SOURCE.CLIENT.less)
    .pipe(less())
    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(gulp.dest('./client/generated/css'));
});

//TODO INJECT CSS JS
gulp.task('inject', function() {
  var sources = gulp.src([SOURCE.CLIENT.css, SOURCE.CLIENT.js], {read: false})
   .pipe(order([
     'client/**/reset.css',
     'client/**/main.css',
     'client/**/*.css'
     ], {base: '.'}));
     // TODO: Add JS order

  return gulp.src(SOURCE.CLIENT.indexHtml)
    .pipe(inject(sources, {relative : true}))
    .pipe(gulp.dest('./client'));
});

/** Main development task */
gulp.task('serve', ['lint', 'less', 'inject', 'watch'], function() {
  nodemon({ script: SOURCE.APP, env: { 'NODE_ENV': 'development' } , watch: ['server/*'], ext: 'js'})
    .on('start', function() {
      setTimeout(function() {
        livereload.changed('Server');
      }, 2000);
    });
});
