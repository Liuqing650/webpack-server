const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.resolve(rootPath, 'src');

module.exports = {
  context: rootPath,
  entry: path.resolve(srcPath, 'index.js'),
  output: {
    filename: 'client.js',
    path: path.resolve(rootPath, 'static/dist')
  },
  plugins: [
    new CleanWebpackPlugin(['../static/dist']),
    new HtmlWebpackPlugin({
      title: 'webpack-server',
      template: srcPath + '/helpers/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules\/)/,
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              sourceMap: true
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      }
    ],
  },
}