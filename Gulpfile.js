// gulp
var gulp = require("gulp");
var gutil = require("gulp-util");
var log = gutil.log;
var colors = gutil.colors;

// layout
var htmls = [
    "./src/html/*.*",
    "./src/html/**/*.*"
];
gulp.task("layout", function() {
  gulp.src(htmls, { base: "./src/html"})
    .pipe(gulp.dest("./build/"));
})

// unecessery for now
// partial html views
// gulp.task("views", function() {
//   gulp.src("./src/assets/views/*.html")
//     .pipe(gulp.dest("./build/assets/views/"))
// })

// images
var imgs = [
    "./src/assets/images/*.*",
    "./src/assets/images/**/*.*"
]
gulp.task("images", function () {
  gulp.src(imgs, { base: "./src/assets/images"})
    .pipe(gulp.dest("./build/assets/images/"))
})

// svg
var svgs = [
    "./src/assets/svg/*.*",
    "./src/assets/svg/**/*.*"
]
gulp.task("svg", function () {
  gulp.src(svgs, { base: "./src/assets/svg"})
    .pipe(gulp.dest("./build/assets/svg/"))
})

// font
var fonts = [
    "./src/assets/css/fonts/*.woff2",
    "./src/assets/css/fonts/*.woff",
    "./src/assets/css/fonts/*.eot",
    "./src/assets/css/fonts/*.svg",
    "./src/assets/css/fonts/*.ttf"
]
gulp.task("font", function () {
  gulp.src(fonts, { base: "./src/assets/css/fonts"})
    .pipe(gulp.dest("./build/assets/css/fonts"))
})

// rootFile
var roots = [
  "./src/CNAME",
  "./src/apple-touch-icon-precomposed.png",
  "./src/browserconfig.xml",
  "./src/favicon.ico",
  "./src/robots.txt",
  "./src/tile-wide.png",
  "./src/tile.png"
]
gulp.task("rootFile", function () {
  gulp.src(roots)
    .pipe(gulp.dest("./build/"))
})

// bootstrap files
gulp.task("bootstrap", function() {
  gulp.src("./src/libs/bootstrap/dist/**", { base: "./src/libs/bootstrap/dist/"})
    .pipe(gulp.dest("./build/assets/bootstrap"));
})

// less
var less = require('gulp-less');
var csso = require('gulp-csso');

var lessSrc = [
  "./src/assets/css/*.less",
  "./src/assets/css/components/*.less",
  "./src/assets/css/components/**/*.less"
];

gulp.task('less', function () {
  gulp.src("./src/assets/css/main.less")
    .pipe(less())
    .pipe(csso())
    .pipe(gulp.dest('./build/assets/css'));
});


// copy all library dependencies
var libs = [
  "./src/libs/jquery/dist/jquery.min.js",
  "./src/libs/jquery/dist/jquery.min.map"
  ]
gulp.task("libs", function () {
  gulp.src(libs)
    .pipe(gulp.dest("./build/assets/libs/"));
});

// js
// var concat = require('gulp-concat');
// var jshint = require('gulp-jshint');
// var stylish = require('jshint-stylish');

// gulp.task("app", function () {
//   gulp.src(["./src/app/app.js", "./src/app/route.js","src/app/*/*.js"])
//     .pipe(jshint())
//     .pipe(jshint.reporter(stylish))
//     .pipe(concat("app.js"))
//     .pipe(gulp.dest("./build/assets/js"))
// })

/*
  Watching all files

  TODO:

 */
gulp.task("watch", function () {
  gulp.watch(["./src/html/*.html", "./src/html/**/*.html"], ["layout"]);
  gulp.watch("./src/assets/views/*.html", ["views"]);
  // watch less files, and compile main.less
  gulp.watch(lessSrc, ["less"]);
  // gulp.watch(["./src/app/*.js", "src/app/*/*.js"], ["app"]);
});

// build
var tasks = ["bootstrap", "layout", "images", "svg", "font", "rootFile", "less", "libs"]
gulp.task("build", tasks, function() {})

// server
var connect = require("connect");
var open = require("open");
var http = require("http");
// host required on vagrant guest vm so it can accessed on host vm
var HOST = "0.0.0.0";
var PORT = 8080;

var deps = ["watch", "libs"]
gulp.task('server',deps, function(callback) {

  // set connect middleware
  var app = connect()
    .use(connect.logger('dev'))
    .use(connect.static(__dirname + '/build'));

  var server = http.createServer(app).listen(PORT, HOST);

  server.on('error', function(error) {
    log(colors.underline(colors.red('ERROR'))+' Unable to start server!');
      callback(error);
  });

  server.on('listening', function() {
    var address = server.address();
    var host = HOST;
    var url = 'http://' + host + ':' + address.port + '/index.html';

    log('Started at '+colors.magenta(url));
    if(gutil.env.open) {
      log('Opening URL in browser');
      open(url);
    } else {
      log(colors.gray('(Run with --open to automatically open URL on startup)'));
    };
    });
});

// start
gulp.task("start", ["build", "server"], function() {})