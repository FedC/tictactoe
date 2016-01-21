var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./public/stylesheets'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('start', function () {
  nodemon({
    script: 'tictactoe.js'
  , ext: 'js'
  , env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('default', ['sass', 'start', 'sass:watch']);
