var gulp = require('gulp'),
  gUtil = require('gulp-util'),
  source = require('vinyl-source-stream'),
  rename = require('gulp-rename'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  watchify = require('watchify'),
  path = require('path'),
  fs = require('fs-extra');

function printErrorStack(err) {
  if (err)
    console.log(err.stack || err);
};

gulp.task('watch', function() {
  var bundler = browserify({
    entries: ['./reflux-app/entry.js'],
    transform: [babelify],
    debug: true,
    cache: {},
    packageCache: {}
  });

  gUtil.log('Watching: Compiling ./reflux-app/entry.js to ./public/javascripts/app/');

  var watcher = watchify(bundler);

  function build() {
    gUtil.log('Building');
    watcher.bundle()
      .on('error', printErrorStack)
      .pipe(source('./reflux-app/entry.js'))
      .pipe(rename({dirname: ''}))
      .pipe(gulp.dest('./public/javascripts/app/'));
  }

  watcher.on('update', build)
    .on('time', (time) => {
      gUtil.log('Building time: ', time, 'ms');
    });

  build();
});

gulp.task('install', function() {
  gulp.src(['./node_modules/bootstrap/dist/**'])
    .pipe(gulp.dest('./public/vendor/bootstrap/'))
  gulp.src(['./node_modules/jquery/dist/**'])
    .pipe(gulp.dest('./public/vendor/jquery/'))
  gulp.src(['./config/default.json'])
    .pipe(rename('config.json'))
    .pipe(gulp.dest('./config/'))
});
