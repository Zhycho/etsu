'use strict';

const gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    less = require('gulp-less'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat'),
    browserSync = require("browser-sync"),
    sass = require('gulp-sass'),
    reload = browserSync.reload;

const path = {
    build: {
        html: 'build/',
        js: 'build/assets/js/',
        css: 'build/assets/css/',
        img: 'build/assets/img/',
        fonts: 'build/assets/fonts/'
    },
    src: {
        html: 'src/*.pug',
        js: 'src/js/*.js',
        style: 'src/style/main.less',
        styleAll: 'src/**/*.less',
        styleBootstrap: ['src/bootstrap/scss/bootstrap.scss', 'src/bootstrap/scss/bootstrap-grid.scss'],
        img: ['src/img/**/*.jpg', 'src/img/**/*.png'],
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/*.pug',
        htmlAll: 'src/**/*.pug',
        js: 'src/js/*.js',
        style: 'src/style/**/*.less',
        styleAll: 'src/**/*.less',
        bootstrap: 'src/bootstrap/**/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
}

gulp.task('html:build', function() {
    return gulp.src(path.src.html)
        // .pipe(rigger())
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function() {
    return gulp.src(path.src.styleAll)
        .pipe(less())
        .pipe(concat('mainstyle.css'))
        .pipe(prefixer())
        // .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

// gulp.task('style:build', function() {
//     return gulp.src([path.src.styleAll, "!src/style/_common.less", "!src/style/_default.less", "!src/style/_variables.less", "!src/style/slick.less", "!src/templates/header/header.less", "!src/templates/footer/footer.less"])
//         .pipe(less())
//         // .pipe(concat('mainstyle.css'))
//         // .pipe(prefixer())
//         // .pipe(cssmin())
//         .pipe(gulp.dest(path.build.css))
//         .pipe(reload({stream: true}));
// });

// gulp.task('mainstyle:build', function() {
//     return gulp.src(["src/style/_common.less", "src/style/_default.less", "src/style/_variables.less", "src/style/slick.less", "src/templates/header/header.less", "src/templates/footer/footer.less"])
//         .pipe(less())
//         .pipe(concat('mainstyle.css'))
//         .pipe(gulp.dest(path.build.css))
//         .pipe(reload({stream: true}));
// });

gulp.task('image:build', function() {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// gulp.task('bootstrap-css:build', function() {
//     return gulp.src(path.src.styleBootstrap)
//         .pipe(sass())
//         .pipe(cssmin())
//         .pipe(concat('bootstrap.css'))
//         .pipe(gulp.dest(path.build.css))
//         .pipe(reload({stream: true}));
// });

// gulp.task('bootstrap-js:build', function() {
//     return gulp.src(['', ''])
//         .pipe(concat('bootstrap.js'))
//         .pipe(gulp.dest(path.build.js))
//         .pipe(reload({stream: true}));
// });

// gulp.task('bootstrap:build', gulp.parallel('bootstrap-css:build'));

gulp.task('build', gulp.parallel('html:build', 'js:build', 'style:build', 'fonts:build', 'image:build'));

gulp.task('watch', function() {
    gulp.watch([path.watch.htmlAll], gulp.parallel('html:build'));
    gulp.watch([path.watch.styleAll], gulp.parallel('style:build'));
    // gulp.watch([path.watch.styleAll], gulp.parallel('mainstyle:build'));
    // gulp.watch([path.watch.bootstrap], gulp.parallel('bootstrap:build'));
    gulp.watch([path.watch.js], gulp.parallel('js:build'));
    gulp.watch([path.watch.img], gulp.parallel('image:build'));
    gulp.watch([path.watch.fonts], gulp.parallel('fonts:build'));
});

gulp.task('webserver', function() {
    browserSync({
        server: {
            baseDir: './build'
        },
        online: true,
        notify: false
    });
});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));

// 'build'