const path = require('path');
const merge = require('webpack-merge');

const host = process.env.HOST;
const port = Number(process.env.PORT) + 1;

const common = require('./common.config.js');
const rootPath = path.resolve(__dirname, '..');
const srcPath = path.resolve(rootPath, 'src');

module.exports = merge(common, {
  // mode: 'development', // 'development' or 'production' >=4.0.0
  entry: {
    main: [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr', 
      path.resolve(srcPath, 'client.js')
    ]
  },
  output: {
    path: path.resolve(rootPath, 'static/dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  devtool: 'inline-source-map'
  // devServer: {
  //   contentBase: path.resolve(rootPath, 'static/dist'),
  // }
});
