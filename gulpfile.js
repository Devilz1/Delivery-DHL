var gulp = require('gulp'),
    less = require('gulp-less'),
    watch = require('watch'),
    browserSync = require('browser-sync'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglifyjs'),
    autoPrefixer = require('gulp-autoprefixer'),
    cssimport = require("gulp-cssimport");

gulp.task('less', function (){
    return gulp.src('src/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(autoPrefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
    return gulp.src([
        'src/libs/jquery/dist/jquery.min.js',
        'src/libs/bootstrap/dist/js/bootstrap.min.js',
        'src/libs/mdbootstrap/js/mdb.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
});

gulp.task('css-libs', ['less'], function(){
    gulp.src('src/css/libs.css')
    .pipe(cssimport())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('watch', ['scripts', 'browser-sync', 'css-libs'], function(){
    gulp.watch('src/less/**/*.less', ['less'])
    gulp.watch('src/*.html', browserSync.reload)
    gulp.watch('src/js/**/*.js', browserSync.reload)
});

gulp.task('build', ['less', 'scripts'], function(){
    var buildCss = gulp.src([
        'src/css/main.css',
        'src/css/libs.min.css',
    ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('src/font/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildImg = gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img'));

    var buildJs = gulp.src('src/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});