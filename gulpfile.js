var gulp = require('gulp');
var concat = require('gulp-concat');
var beautify = require('gulp-beautify');
var del = require('del');
var uglify = require('gulp-uglify');

var _jsBundleFilename = '_main.js';

gulp.task('build', function () {
    return gulp.src([
        'js/_app.header.inc',
        'js/utils.js',
        'js/jsonEditor/factories.js',
        'js/jsonEditor/directives.js',
        'js/jsonEditor/controllers.js',
        'js/app.js',
        'js/_app.footer.inc'
    ])
    .pipe(concat(_jsBundleFilename))
    .pipe(gulp.dest('_tmp'));
});

gulp.task('dev-build', ['build'], function () {
    return gulp.src('_tmp/' + _jsBundleFilename)
        .pipe(beautify())
        .pipe(gulp.dest('js'));
});

gulp.task('prod-build', ['build'], function () {
    return gulp.src('_tmp/' + _jsBundleFilename)
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('copy-files-distr', function () {
    gulp.src([
        '_tmp/_main.js',
        'css/*.css',
        'index.html',
        'LICENSE',
        'README.md',
        'terms.txt'
        ])
        .pipe(gulp.dest('distr'));
        
    gulp.src('data/**/*.*', { base: '.' })
        .pipe(gulp.dest('distr'));        
});

gulp.task('distr', ['copy-files-distr'], function () {
    // return gulp.src('distr/index.html')
    //     .pipe(cdn(require('./bower.json')));
});

gulp.task('clean', function () { 
    return del(['_tmp/**', '_tmp']);
});

gulp.task('dev',  ['dev-build', 'distr', 'clean']);
gulp.task('prod', ['prod-build', 'distr', 'clean']);

gulp.task('watch', function () {
    gulp.watch('js/**/*.js', ['dev']);
});