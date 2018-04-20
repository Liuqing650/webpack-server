const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';
const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';

// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 2 });

module.exports = {
  // entry: './src/index.js',
  // watchOptions: {
  //   ignored: /node_modules/, // 不监听node_modules下的文件,可减少压力,但是安装新模块后需要重启项目
  // },
  context: path.join(process.cwd()),
  plugins: [
    new CleanWebpackPlugin(['public/dist']),
    new HtmlWebpackPlugin({
      title: 'Caching',
      template: __dirname + '/public/index.html'
    }), 
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory']
    }),
    new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
      __DEV__: isDev
    })
  ],
  output: {
    path: path.join(process.cwd(), './public/dist'),
    publicPath: ASSET_PATH,
    filename: '[name].js'
  },
  // externals: {
  //   lodash: {
  //     commonjs: 'lodash',
  //     commonjs2: 'lodash',
  //     amd: 'lodash',
  //     root: '_'
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=babel'],
        exclude: /node_modules/
        // loader: 'babel-loader',
        // options: {
        //   cacheDirectory: isDev // 支持缓存转换出的结果
        // }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(['style-loader', 'css-loader', 'postcss-loader'])
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract([{
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
            sourceMap: true
          }
        },
        { loader: 'postcss-loader', options: { sourceMap: true } },
         'less-loader'])
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../../src/'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json']
  },
};
