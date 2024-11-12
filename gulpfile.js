// Импорт пакетов
const gulp = require('gulp')
const less = require('gulp-less')
const stylus = require('gulp-stylus')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const ts = require('gulp-typescript')
//const coffee = require('gulp-coffee')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
//const gulppug = require('gulp-pug')
const newer = require('gulp-newer')
const fonter = require('gulp-fonter')
const ttf2woff2 = require('gulp-ttf2woff2')
const browsersync = require('browser-sync').create()
const del = require('del')

// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
  html: {
    src: ['src/*.html', 'src/*.pug'],
    dest: 'dist/'
  },
  styles: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.styl', 'src/styles/**/*.less', 'src/styles/**/*.css', 'src/styles/normalize.css', 'src/styles/fonts.css'],
    dest: 'dist/css/'
  },
  normalize: {
    src: ['src/styles/normalize.css'],
    dest: 'dist/css/'
  },
  fonteface: {
    src: ['src/styles/fonts.css'],
    dest: 'dist/css/'
  },
  scripts: {
    src: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js'],
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  },
  fonts: {
    srs: ['src/fonts/**.*ttf'],
    dest: 'dist/fonts/'
  }
}

// Очистить каталог dist, удалить все кроме изображений
function clean() {
  return del(['dist/*', '!dist/img'])
}

// Обработка html и pug
function html() {
  return gulp.src(paths.html.src)
  //.pipe(gulppug())
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей
function styles() {
  return gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  //.pipe(less())
  //.pipe(stylus())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'style',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browsersync.stream())
}
function normalize() {
  return gulp.src(paths.normalize.src)
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'normalize',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.normalize.dest))
  .pipe(browsersync.stream())
}
function fonteface() {
  return gulp.src(paths.fonteface.src)
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'fonts',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.fonteface.dest))
  .pipe(browsersync.stream())
}

// Обработка Java Script, Type Script и Coffee Script
function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  //.pipe(coffee({bare: true}))
  /*
  .pipe(ts({
    noImplicitAny: true,
    outFile: 'main.min.js'
  }))
  */
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browsersync.stream())
}

// Сжатие изображений
function img() {
  return gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.images.dest))
}

// конвертирование шрифтов
function fonts() {
  return gulp.src(paths.fonts.srs)
  .pipe(fonter({
    formats: ['woff', 'ttf']
  }))   
  .pipe(gulp.dest('src/font')) 
}

function fonts2() {
  return gulp.src('src/font/**.*ttf')  
  .pipe(ttf2woff2()) 
  .pipe(gulp.dest(paths.fonts.dest))
}

function fonts3() {
  return gulp.src('src/font/**.*ttf')
  .pipe(fonter({
    formats: ['woff',]
  }))   
  .pipe(gulp.dest(paths.fonts.dest))
}

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
  browsersync.init({
    server: {
        baseDir: "./dist"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.fonteface.src, fonteface)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean

exports.html = html
exports.styles = styles
exports.normalize = normalize
exports.fonteface = fonteface
exports.scripts = scripts
exports.fonts = fonts
exports.fonts2 = fonts2
exports.fonts3 = fonts3
exports.img = img
exports.watch = watch

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(styles, normalize, fonteface, scripts, img, fonts, fonts2, fonts3), watch)