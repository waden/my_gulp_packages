
var gulp       = require('gulp'),
	plumber    = require('gulp-plumber'),
	gutil      = require('gulp-util'),
	uglify     = require('gulp-uglify'),
	concat     = require('gulp-concat'),
	rename     = require('gulp-rename'),
	minifyCSS  = require('gulp-minify-css'),
	sass 	   = require('gulp-sass'),
	path       = require('path'),
	imagemin   = require('gulp-imagemin'),
	livereload = require('gulp-livereload');

// Handle sass error
var onError = function (err) {
	gutil.beep();
	console.log(err);
};

// Path configs
var css_files  = ['css/0/*.css','css/1/*.css','css/*.css'], // .css files
	css_path   = 'css', // .css path
	js_files   = ['js/0/*.js','js/1/*.js','js/*.js'], // .js files
	sass_file  = 'sass/*.scss', // .sass files
	img_file   = 'img/*', // img files
	dist_path  = 'dist';

//Extension config
var extension = 'html';


/***** Functions for tasks *****/
function js(){
	return gulp.src(js_files)
			.pipe(plumber({
				errorHandler: onError
			}))
			.pipe(concat('dist'))
			.pipe(rename('concat.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(dist_path))
			.pipe(livereload());
}

function css(){
	return gulp.src(css_files)
			.pipe(concat('dist'))
			.pipe(rename('all.min.css'))
			.pipe(minifyCSS(/*{keepBreaks:true} */)) 
			.pipe(gulp.dest(dist_path))
			.pipe(livereload());
}

function sassTask(err){
	return gulp.src(sass_file)
			.pipe(plumber({
				errorHandler: onError
			}))
			.pipe(sass(/* { paths: [ path.join(__dirname, 'sass', 'includes') ] } */))
			.pipe(gulp.dest(css_path))
			.pipe(livereload());
}
function compress(){
	return gulp.src(img_file)
      .pipe(imagemin())
      .pipe(gulp.dest('img_min'));
}
     
function reloadBrowser() {
	return gulp.src('*.' + extension)
			.pipe(livereload());
}


// The 'js' task
gulp.task('js', function() {
	return js();
});

// The 'css' task
gulp.task('css', function(){
	return css();
});

// The 'sass' task
gulp.task('sass', function(){
	return sassTask();
});

gulp.task('compress', function() {
      gulp.src(img_file)
      .pipe(imagemin())
      .pipe(gulp.dest('img_min'))
    });

// Reload browser when have *.html changes
gulp.task('reload-browser', function() {
	return reloadBrowser();
});

// The 'default' task.
gulp.task('default', function() {
	livereload.listen()

	gulp.watch(sass_file, function() {
		// if (err) return console.log(err);
		return sassTask();
	});

	gulp.watch(css_files, function() {
		console.log('CSS task completed!');
		return css();
	});

	gulp.watch(js_files, function() {
		console.log('JS task completed!');
		return js();
	});

	gulp.watch('*.' + extension, function(){
		console.log('Browse reloaded!');
		return reloadBrowser();
	});
});
