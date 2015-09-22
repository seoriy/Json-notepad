var gulp = require('gulp');
var concat = require('gulp-concat');
var beautify = require('gulp-beautify');
var del = require('del');
var uglify = require('gulp-uglify');
var seq = require('gulp-sequence');
var mainBowerFiles = require('gulp-main-bower-files');
var gfi = require("gulp-file-insert");
var rename = require("gulp-rename");

var _jsBundleFilename = 'main.js';
var tmpPath = "_tmp";
var distrFolder = 'distr';

gulp.task('default', ['dev']);

////   COMMON

gulp.task('build-js', function () {
    gulp.src([
        'js/_app.header.inc',
        'js/utils.js',
        'js/jsonEditor/factories.js',
        'js/jsonEditor/directives.js',
        'js/jsonEditor/controllers.js',
        'js/app.js',
        'js/_app.footer.inc'
    ])
        .pipe(concat(_jsBundleFilename))
        .pipe(gulp
            .dest(tmpPath));
});

gulp.task('distr', function (cb) {
    gulp.src([
        'css/*.css',
        'LICENSE',
        'README.md',
        'terms.txt'
    ])
        .pipe(gulp
            .dest(distrFolder));

    gulp.src([
        'data/**/*.*',
        'parts/**/*.*',
    ], { base: '.' })
        .pipe(gulp
            .dest(distrFolder));
});

// gulp.task('clean', function () { });

/////   DEV

gulp.task('dev-build', ['build-js'], function () {
    gulp.src(tmpPath + '/' + _jsBundleFilename)
        .pipe(beautify())
        .pipe(gulp
            .dest(distrFolder));

    gulp.src('_index.html')
        .pipe(rename({ basename: 'index' }))
        .pipe(gfi({ '<!--HEADERS.INC-->': './_index.headers.dev.inc' }))
        .pipe(gulp
            .dest(distrFolder));
});

gulp.task("dev-libs", function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            oiverrides: {
                fontAwesome: {
                    main: [
                        './css/font-awesome.min.css',
                        './fonts/*.*'
                    ]
                }
            }
        }))
        .pipe(gulp
            .dest(distrFolder + '/libs'));
});

gulp.task('dev', function (cb) { seq('dev-build', 'dev-libs', 'distr', cb); });
gulp.task('dev-light', function (cb) { seq('clean', 'dev-build', 'distr', cb); });

gulp.task('dev-watch', function (cb) {
    var watcher = gulp.watch('js/**/*.*', ['dev-light']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    watcher.on('ready', function (event) {
    console.log('start wathing files...');});
    return watcher;
});
gulp.task('watch', function (cb) { seq('dev-libs', 'dev-watch', cb); });

////    PROD

gulp.task('prod-build', ['build-js'], function () {
    gulp.src(tmpPath + '/' + _jsBundleFilename)
        // .pipe(uglify())
        .pipe(gulp
            .dest(distrFolder));

    gulp.src('_index.html')
        .pipe(rename({ basename: 'index' }))
        .pipe(gfi({
            '<!--HEADERS.INC-->': './_index.headers.prod.inc',
            '<!--GA.INC-->': './_index.ga.prod.inc'
        }))
        .pipe(gulp
            .dest(distrFolder));
});

gulp.task('del-distr', function (cb) {
    return del('./distr', cb)
});

gulp.task('prod', function (cb) { seq('del-distr', 'prod-build', 'distr', cb); });