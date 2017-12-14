/**
 * Created by realm on 2017/5/12.
 */

const del = require('del');
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const htmlMin = require('gulp-htmlmin');
const event = require('event-stream');
const sequence = require('run-sequence');
const CDN = require('./cdn.json');
const pkg = require('./package.json');
const repoExp = /node_modules\/([\w\-.]+)\/(dist|build\/)?/g;

let DEST = 'docs/';
let config;

gulp.task('sourcemap', () => {
  gulp.src('dist/*.js')
    .pipe(replace(/\/\/# sourceMap[\S]+/gi, ''))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clear', () => {
  return del(DEST);
});

gulp.task('stylus', () => {
  return gulp.src('./styl/screen.styl')
    .pipe(stylus({
      compress: true,
      'include css': true,
      'resolve url': true,
      define: {
        url: require('stylus').resolver()
      }
    }))
    .pipe(cleanCSS({
      level: 2,
      rebaseTo: 'css/'
    }))
    .pipe(gulp.dest(DEST + 'css/'));
});

gulp.task('webpack', () => {
  config = config || require('./webpack.config.build');
  return gulp.src('./app/main.js')
    .pipe(webpackStream(config, webpack))
    .pipe(replace(repoExp, (match, repo) => {
      return CDN[repo];
    }))
    .pipe(uglify({
      compress: {
        unused: true,
        dead_code: true,
        drop_console: true,
        toplevel: true
      }
    }))
    .pipe(gulp.dest(DEST + 'js/'));
});

gulp.task('html', () => {
  return gulp.src('./index.dev.html')
    .pipe(replace(repoExp, (match, repo) => {
      return CDN[repo];
    }))
    .pipe(replace('dist/main.bundle.js', 'js/main.min.js'))
    .pipe(replace('${version}', pkg.version + '.' + Date.now()))
    .pipe(htmlMin({
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(DEST));
});

gulp.task('copy', () => {
  return event.merge(
    gulp.src('font/**').pipe(gulp.dest(DEST + 'font/')),
    gulp.src('img/**').pipe(gulp.dest(DEST + 'img/'))
  );
});

gulp.task('test', () => {
  config = require('./webpack.config.test');
  DEST = 'test/';
});

gulp.task('default', callback => {
  sequence(
    'clear',
    ['stylus', 'webpack', 'html', 'copy'],
    callback
  );
});

gulp.task('default:test', callback => {
  sequence(
    'test',
    'default',
    callback
  );
});