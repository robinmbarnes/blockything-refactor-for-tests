var gulp = require('gulp');
var connect = require('gulp-connect');
var traceur = require('gulp-traceur');
var less = require('gulp-less');

gulp.task('default', ['connect', 'traceur', 'traceur-tests', 'less', 'watch']);

gulp.task('connect', function () {
    connect.server({
        livereload: true,
        port: 9100
    });
});

gulp.task('less', function () {
    gulp.src('app/less/*less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('traceur', function () {
    gulp.src('app/javascript/*js')
        .pipe(traceur({modules: 'inline'}))
        .on('error', function (e) {
            console.log('traceur error: ', e);
        })
        .pipe(gulp.dest('dist/javascript'));
});

gulp.task('traceur-tests', function () {
    gulp.src('test/src/*js')
        .pipe(traceur({modules: 'inline'}))
        .on('error', function (e) {
            console.log('traceur error: ', e);
        })
        .pipe(gulp.dest('test/dist'));
});

gulp.task('reload', function () {
    gulp.src('dist/**/*')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['app/less/*less'], ['less']);
    gulp.watch(['app/javascript/*js'], ['traceur']);
    gulp.watch(['test/src/*js'], ['traceur-tests']);
    gulp.watch(['dist/**/*'], ['reload']);
});
