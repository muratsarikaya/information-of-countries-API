'use strict';

/** Todo:
 * Add Clean Task with sync.
 * @type {*|Gulp}
 */

const gulp = require('gulp');
const twig = require('gulp-twig');
const rename = require("gulp-rename");
const minifyCss= require('gulp-minify-css');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const connect = require('gulp-connect');
const open = require('gulp-open');
const download = require("gulp-download-files");
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./countries/all', 'utf8'));

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

gulp.task('data', function () {
    download('https://restcountries.eu/rest/v2/all')
        .pipe(gulp.dest("countries/"));
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

var ct = {
    country: 0,
    data: data
};

function buildTemplates(cb) {
    gulp.run('parseTemplate', function () {
        console.log(ct.country + ' finish');
        if (ct.country < ct.data.length - 1) {
            ct.country += 1;
            buildTemplates()
        }
    });
}


gulp.task('parseTemplate',function () {
    return gulp.src('./src/templates/detail.html')
        .pipe(twig({
            base:'./src/templates',
            data:{
                ...data[ct.country]
            }
        }))
        .pipe(rename(data[ct.country].alpha3Code + '.html'))
        .pipe(gulp.dest(dist));
});

gulp.task('parseAllTemplate',function () {
    buildTemplates()
});


gulp.task('build', ['scripts','sass','html', 'connect'], function () {
    gulp.run(['scripts:watch', 'sass:watch', 'html:watch','open', 'data'], function () {
        gulp.run('parseAllTemplate')
    })
});

gulp.task('default', ['clean'],function () {
    console.log('Clean Finished');
    gulp.run('build');
});

//var country = 0;
