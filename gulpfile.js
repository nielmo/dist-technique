var gulp = require('gulp'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    htmlbeautify = require('gulp-html-beautify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber');
    cleanCSS = require('gulp-clean-css');
    sourcemaps = require('gulp-sourcemaps');
    notify = require('gulp-notify');
    gutil = require('gulp-util');
    beeper = require('beeper');
    flatten = require('gulp-flatten');
    imagemin = require('gulp-imagemin');
    cache = require('gulp-cache');
    uglify = require('gulp-uglify');
    htmlclean = require('gulp-htmlclean');
    sassglob = require('gulp-sass-glob')

    onError = function (err) { // Custom error msg with beep sound and text color
        notify.onError({
          title:    "Gulp error in " + err.plugin,
          message:  err.toString()
        })(err);
        beeper(3);
        this.emit('end');
        gutil.log(gutil.colors.red(err));
    };

    paths = {
      scr: 'src/**/*',
      srcPug: 'src/*.pug',
      srcSCSS: 'src/**/*.scss',
      srcImg: 'src/img/*',
      srcJS: 'src/js/*.js',
      srcJSPlugins: 'src/js/plugins/*.js',

      tmpHtml: 'tmp/',
      tmpCSS: 'tmp/css/',
      tmpImg: 'tmp/img/',
      tmpJS: 'tmp/js/',
      tmpJSPlugins: 'tmp/js/plugins',

      distHtml: 'dist/',
      distCSS: 'dist/css/',
      distImg: 'dist/img/',
      distJS: 'dist/js/',
      distJSPlugins: 'dist/js/plugins',
    },

    beautifyOptions = {
      "indent_size": 4,
      "indent_char": " ",
      "eol": "\n",
      "indent_level": 0,
      "indent_with_tabs": false,
      "preserve_newlines": true,
      "max_preserve_newlines": 10,
      "jslint_happy": false,
      "space_after_anon_function": false,
      "brace_style": "collapse",
      "keep_array_indentation": false,
      "keep_function_indentation": false,
      "space_before_conditional": true,
      "break_chained_methods": false,
      "eval_code": false,
      "unescape_strings": false,
      "wrap_line_length": 0,
      "wrap_attributes": "auto",
      "wrap_attributes_indent_size": 4,
      "end_with_newline": true
    }

gulp.task('tmpPug', function () {
  return gulp.src(paths.srcPug)
    .pipe(pug())
    .pipe(plumber({ errorHandler: onError }))
    .pipe(htmlbeautify(beautifyOptions))
    .pipe(rename({
      extname: '.html'
    }))

    .pipe(gulp.dest(paths.tmpHtml));
});

gulp.task('tmpCss', function () {
  gulp.src(paths.srcSCSS)
    .pipe(sassglob())
    .pipe(sass({indentedSyntax: true}))
    .pipe(plumber({ errorHandler: onError }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min'}))
    .pipe(flatten())
    .pipe(gulp.dest(paths.tmpCSS));
});

gulp.task('tmpImg', function () {
  gulp.src(paths.srcImg)
  .pipe(cache(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true})))
  .pipe(gulp.dest(paths.tmpImg));
});

gulp.task('tmpJS', function() {
  return gulp.src(paths.srcJS)
  .pipe(uglify())
  .pipe(rename({ suffix: '.min'}))
  .pipe(gulp.dest(paths.tmpJS));
});

gulp.task('tmpPluginJS', function () {
  return gulp.src(paths.srcJSPlugins)
    .pipe(gulp.dest(paths.tmpJSPlugins));
});

gulp.task('watch', function () {
  gulp.watch(
    [paths.srcPug, paths.srcSCSS, paths.srcImg, paths.srcJS, paths.srcJSPlugins], 
    ['tmpPug', 'tmpCss', 'tmpImg', 'tmpJS', 'tmpPluginJS']);
});

gulp.task('default', function () {
  gulp.start('watch');
});

// BUILD SITE`
gulp.task('distPug', function () {
  return gulp.src(paths.srcPug)
    .pipe(pug())
    .pipe(plumber({ errorHandler: onError }))
    .pipe(htmlclean())
    .pipe(htmlbeautify(beautifyOptions))
    .pipe(rename({
      extname: '.html'
    }))

    .pipe(gulp.dest(paths.distHtml));
});

gulp.task('distCss', function () {
  gulp.src(paths.srcSCSS)
    .pipe(sassglob())
    .pipe(sass({ indentedSyntax: true }))
    .pipe(plumber({ errorHandler: onError }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('distImg', function () {
  gulp.src(paths.srcImg)
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(paths.distImg));
});

gulp.task('distJS', function () {
  return gulp.src(paths.srcJS)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.distJS));
});

gulp.task('distJSPlugins', function () {
  return gulp.src(paths.srcJSPlugins)
    .pipe(gulp.dest(paths.distJSPlugins));
});

gulp.task('build', ['distPug', 'distCss', 'distImg', 'distJS', 'distJSPlugins']);