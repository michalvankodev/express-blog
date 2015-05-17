var gulp = require('gulp');
var paths = require('../paths');
var nodemon = require('gulp-nodemon');

gulp.task('serve', ['lint'], function() {
  nodemon({
    script: paths.app,
    env: { 'NODE_ENV': 'development' },
    watch: [paths.source],
    ext: 'js',
    nodeArgs: [''],
    execMap: {
      'js': 'babel-node --optional strict'
    }
  });
});
