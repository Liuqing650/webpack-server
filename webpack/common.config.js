const path = require('path');
const webpack = require('webpack');

// const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const rootPath = path.resolve(__dirname, '..');

module.exports = {
  context: rootPath,
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
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules\/)/,
      use: [{
        loader: 'babel-loader',
        }]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract(['style-loader', 'css-loader'])
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract([{
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
          sourceMap: true
        }
      }, 'less-loader'])
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    }, {
      test: webpackIsomorphicToolsPlugin.regular_expression('images'),
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10240
        }
      }]
    }],
  },
  // optimization: {
    // runtimeChunk: false,
    // splitChunks: {
      // chunks: 'all'
      // minSize: 30000,
      // minChunks: 3,
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      // name: true,
      // cacheGroups: {
      //   commons: {
      //     name: 'commons',
      //     chunks: 'all',
      //     minChunks: 3,
      //     enforce: true
      //   },
      //   vendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10
      //   }
      // }
    // }
  // },
  plugins: [
    webpackIsomorphicToolsPlugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    // new HtmlWebpackPlugin({
    //   title: 'webpack-server',
    //   template: 'src/helpers/index.html'
    // }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true
    })
  ],
}