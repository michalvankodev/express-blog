// Node modules
var gulp = require('gulp');
var del = require('del');

// Plugins
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var less = require('gulp-less');
var concat = require('gulp-concat');
var path = require('path');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var order = require('gulp-order');
var gutil = require('gulp-util');


var SOURCE = {
  CLIENT : {
    js: './client/**/!(*.spec|*.mock).js',
    less: './client/**/*.less',
    css: './client/**/*.css',
    indexHtml: './client/index.html'
  },
  ADMIN : {
    js: './admin/**/!(*.spec|*.mock).js',
    less: './admin/**/*.less',
    css: './admin/**/*.css',
    indexHtml: './admin/index.html'
  },
  SERVER : './server/**/!(*.spec).js',
  STATIC : './**/*(*.html|*.css)',

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

  gulp.watch([SOURCE.CLIENT.js, SOURCE.ADMIN.js, SOURCE.STATIC], ['reload'])
    .on('change', function(event) {
      gutil.log('File ' + event.path + ' was ' + event.type + ', reloading...');
    });

  // Watch less stylesheets and compile them
  gulp.watch(SOURCE.CLIENT.less, ['less-client']);
  gulp.watch(SOURCE.ADMIN.less, ['less-admin']);

  livereload.listen();
});

gulp.task('reload', function() {
  livereload.changed('Client');
});

// Delete previously generated CSS files
gulp.task('clean-css', function(cb) {
  del('./**/generated/css', cb);
});

gulp.task('less-client', function() {
  return gulp.src(SOURCE.CLIENT.less)
    .pipe(less())
    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(gulp.dest('./client/generated/css'));
});

gulp.task('less-admin', function() {
  return gulp.src(SOURCE.ADMIN.less)
  .pipe(less())
  .pipe(rename(function(path) {
    path.dirname = '';
  }))
  .pipe(gulp.dest('./admin/generated/css'));
});


gulp.task('inject-client', ['less-client'], function() {
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

gulp.task('inject-admin', ['less-admin'], function() {
  var sources = gulp.src([SOURCE.ADMIN.css, SOURCE.ADMIN.js], {read: false})
    .pipe(order([
      'admin/**/main.css',
      'admin/**/*.css',
      'admin/**/app.js',
      'admin/**/*.js'
    ], {base: '.'}));

  return gulp.src(SOURCE.ADMIN.indexHtml)
    .pipe(inject(sources, {relative : true}))
    .pipe(gulp.dest('./admin'));
});

gulp.task('inject', ['inject-client', 'inject-admin']);

/** Main development task */
gulp.task('serve', ['lint', 'inject'], function() {
  nodemon({ script: SOURCE.APP, env: { 'NODE_ENV': 'development' } , watch: ['server/*'], ext: 'js'});
});
