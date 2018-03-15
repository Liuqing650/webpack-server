const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./common.config.js');

module.exports = merge(common, {
  mode: 'production', // 'development' or 'production'
  plugins: [
    new UglifyJSPlugin({
      sourceMap: false
    })
  ]
});
