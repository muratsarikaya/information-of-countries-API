'use strict';

/** Todo:
 * Add Clean Task with sync.
 * @type {*|Gulp}
 */

var gulp = require('gulp');
var twig = require('gulp-twig');
var rename = require("gulp-rename");
var minifyCss= require('gulp-minify-css');
var sass = require('gulp-sass')(require('sass'));
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var open = require('gulp-open');

var templates = './src/templates/',
    dist = './dist/',
    nodeModules = './node_modules/',
    scripts = './src/scripts/',
    sourceJs = [
        nodeModules + 'jquery/dist/jquery.min.js',
        nodeModules + 'bootstrap/dist/js/bootstrap.js',
        scripts + 'main.js',
    ],
    css = './src/styles/',
    sass_f = './src/styles/sass/styles.sass';

gulp.task('clean', function (cb) {
    return gulp.src('./dist/*')
        .pipe(clean(function () {
            if (cb)
                cb();
        }));
});


gulp.task('html', function () {
    return gulp.src('./src/templates/*.html')
        .pipe(twig({
            base: './src/templates/',
            data: {}
        }))
        .pipe(gulp.dest(dist))
        .pipe(connect.reload());
});


gulp.task('sass', function () {
    return gulp.src(sass_f)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(minifyCss())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./dist/assets/styles'))
        .pipe(connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src(sourceJs)
        .pipe(concat('scripts.js'))
        //.pipe(uglify())
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest("./dist/assets/scripts"))
        .pipe(connect.reload());

});

gulp.task('sass:watch', function () {
    gulp.watch( 'src/styles/sass/*.sass', ['sass']);
});

gulp.task('html:watch', function () {
    gulp.watch('src/templates/*.html', ['html']);
});

gulp.task('scripts:watch', function () {
    gulp.watch('src/scripts/*.js', ['scripts']);
});

gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        port: 8001,
        livereload: true
    });
});

gulp.task('open', function () {
    var osname = process.platform;
    var apppath = '/Applications/Google\ Chrome.app';

    if (osname === "win32") {
        apppath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
    } else if (osname === "linux") {
        apppath = '/opt/google/chrome/chrome'
    }


    gulp.src('./dist/index.html')
        .pipe(open({
            uri: 'http://localhost:8001/',
            app: apppath
        }));
});


gulp.task('build', ['scripts','sass','html', 'connect'], function () {
    gulp.run(['scripts:watch', 'sass:watch', 'html:watch','open'])
});

gulp.task('default', ['clean'],function () {
    console.log('Clean Finished');
    gulp.run('build');
});
