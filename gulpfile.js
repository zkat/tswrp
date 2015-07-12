var gulp = require('gulp')
var gutil = require('gulp-util')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var webpackConfig = require('./webpack.config.js')

var PORT = gutil.env.port || 8080

gulp.task('static', function () {
  return gulp.src([
    'src/index.html'
  ]).pipe(gulp.dest('www/'))
})

gulp.task('build-dev', ['webpack:build-dev'], function () {
  gulp.watch(['lib/**/*'], ['webpack:build-dev'])
})

// Production build
gulp.task('build', ['webpack:build', 'static'])

gulp.task('webpack:build', function (callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig)
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin())

  myConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}))

  // run webpack
  webpack(myConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build', err)
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }))
    callback()
  })
})

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig)
myDevConfig.devtool = 'sourcemap'
myDevConfig.debug = true

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig)

gulp.task('webpack:build-dev', function (callback) {
  // run webpack
  devCompiler.run(function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-dev', err)
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }))
    callback()
  })
})

gulp.task('webpack-dev-server', function (callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig)
  myConfig.devtool = 'eval'
  myConfig.debug = true

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    stats: {
      colors: true
    }
  }).listen(PORT, '0.0.0.0', function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html')
  })
})

// The development server (the recommended option for development)
gulp.task('default', ['webpack-dev-server'])
