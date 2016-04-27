
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat');

gulp.task('styles', function() {
    gulp.src('./src/css/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('./dest/css'));
});

gulp.task('script', function(){
	gulp.src('./src/js/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./dest/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./dest/js'));
});

gulp.task('watch', function(){
	gulp.watch('./src/css/*.scss', ['styles']);

	gulp.watch('./src/js/*.js', ['script']);
});

gulp.task('default',['styles', 'script']);