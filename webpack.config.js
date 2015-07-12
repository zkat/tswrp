var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: ['./src/js/index.jsx'],
  output: {
    path: __dirname + '/www',
    contentBase: 'www/',
    publicPath: '/',
    filename: 'index.js',
    sourceMapFilename: 'index.js.map'
  },
  resolve: {
    alias: {},
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules']
  },
  module: {
    loaders: [{
      test: /(src\/js\/.*\.jsx?$)/,
      exclude: /firebase-web\.js/,
      loader: 'babel'
    }, {
      include: /src\/js\/pages\/.*/,
      loader: 'react-router-proxy!babel'
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css?sourceMap')
    }, {
      test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&minetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&minetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&minetype=image/svg+xml'
    }]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'FIREBASE_URL': JSON.stringify('https://tswrp.firebaseio.com')
      }
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery'
    })
  ]
}
