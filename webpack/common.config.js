const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.resolve(rootPath, 'src');

module.exports = {
  context: rootPath,
  entry: ['webpack-hot-middleware/client?noInfo=true&reload=true', path.resolve(srcPath, 'client.js')],
  output: {
    filename: 'client.js',
    path: path.resolve(rootPath, 'static/dist')
  },
  plugins: [
    new CleanWebpackPlugin(['../static/dist']),
    new HtmlWebpackPlugin({
      title: 'webpack-server',
      template: 'src/helpers/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      components: path.resolve(rootPath, 'src/components/'),
      helpers: path.resolve(rootPath, 'src/helpers/'),
      vendors: path.resolve(rootPath, 'src/vendors/'),
      containers: path.resolve(rootPath, 'src/containers/'),
      stores: path.resolve(rootPath, 'src/stores/')
    }
  },
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
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              sourceMap: true
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ],
  },
}