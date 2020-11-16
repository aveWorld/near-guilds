const gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  browsersync = require('browser-sync'),
  minifyjs = require('gulp-js-minify'),
  cleanCSS = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin');

const path = {
  dist: {
    css: 'dist/scss',
    js: 'dist/js',
    img: 'dist/img'
  },
  src: {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/*.js',
    img: 'src/img/**/*'
  },
  clean: './dist/'

};

const scssBuild = () => {
  return gulp.src(path.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 100 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(path.dist.css))
};

const jsBuild = () => {
  return gulp.src(path.src.js)
    .pipe(concat('script.js'))
    .pipe(minifyjs())
    .pipe(gulp.dest(path.dist.js))
};

const cleanBuild = () => {
  return gulp.src(path.clean, {allowEmpty: true})
    .pipe(clean())
};

const imgBuild = () => {
  return gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
};


const watcher = () => {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch(path.src.scss, scssBuild).on('change', browsersync.reload);
  gulp.watch(path.src.js, jsBuild).on('change', browsersync.reload);
};
//-----------------------TASKS----------------------------

// gulp.task('scss', scssBuild);
// gulp.task('js', jsBuild);
// gulp.task('clean', cleanBuild);

gulp.task('build', gulp.series(
  cleanBuild,
  scssBuild,
  jsBuild,
  imgBuild
));

gulp.task('dev', gulp.series(
  watcher,
  jsBuild,
  scssBuild
));