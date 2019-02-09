var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    rename       = require('gulp-rename'),
    cssnano      = require('gulp-cssnano'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() { 
    browserSync({
        server: 'app',
        notify: false
    });
});

gulp.task('css-min', function() {
    return gulp.src('app/css/styles.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeVieBox: false}],
		une: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'));
});

// ------------------------------------------------------------------------------
// После версии GULP 4.0.0 выдает ошибку завершения цепочки команд build + clean. 
// Возможное решение - запуск отдельной команды последовательно:

gulp.task('clean', function(){
		return del.sync('dist');
})

gulp.task('pre-build', function(){
	var buildCss = gulp.src(['app/css/styles.css', 'app/css/styles.min.css'])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildFonts = gulp.src('app/index.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.parallel('clean', 'sass', 'img', 'pre-build'));

// ------------------------------------------------------------------------------

gulp.task('watch', function(){
    gulp.watch('app/sass/**/*.sass', gulp.series('sass', 'css-min'));
    gulp.watch('app/*.html').on('change', browserSync.reload); 
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));