const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));


const common = require('./common.config.js');
const rootPath = path.resolve(__dirname, '..');
const assetsPath = path.resolve(rootPath, './static/dist');

module.exports = merge(common, {
  // mode: 'production', // 'development' or 'production' 4.0.0
  entry: {
    'main': [path.resolve(rootPath, 'src/client.js')]
  },
  output: {
    path: path.resolve(rootPath, 'static/dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/dist/'
  },
  plugins: [
    new CleanWebpackPlugin([assetsPath], { root: rootPath }),
    new UglifyJSPlugin({
      uglifyOptions: {
        warnings: false
      },
      sourceMap: false
    })
  ]
});
