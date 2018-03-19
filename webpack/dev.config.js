const path = require('path');
const merge = require('webpack-merge');

const common = require('./common.config.js');

const rootPath = path.resolve(__dirname, '..');

module.exports = merge(common, {
  mode: 'development', // 'development' or 'production'
  devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: path.resolve(rootPath, 'static/dist'),
  // }
});
