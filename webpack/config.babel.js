import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const rootPath = path.resolve(process.cwd());

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';


const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(
  require('./hooks')
).development(isDev);

const getPlugins = () => {
  // Common
  const plugins = [
    new AssetsPlugin({ path: path.resolve(process.cwd(), 'public') }),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEV__: isDev
    }),
    webpackIsomorphicToolsPlugin
  ];

  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      new webpack.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin([path.resolve(process.cwd(), 'public/assets')], { root: rootPath }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new UglifyJsPlugin({
        uglifyOptions: {
          beautify: true, // 最紧凑的输出
          comments: true, // 删除所有的注释
          compress: {
            warnings: false,
            drop_console: !PREVIEW, // 删除所有的 `console` 语句
            collapse_vars: true,
            reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          }
        }
      }),
    );
  }
  return plugins;
};

const getEntry = () => {
  // Development
  let entry = ['webpack-hot-middleware/client?reload=true', './src/client.js'];

  // Prodcution
  if (!isDev) entry = ['./src/client.js'];

  return entry;
};

// 获取loaders
const webpackLoaders = () => {
  const loaders = [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: isDev
      }
    },
    {
      test: /\.css$/,
      include: /node_modules/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:['css-loader', 'postcss-loader']
        },
      )
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:['css-loader', 'postcss-loader']
        },
      )
    }, {
      test: /\.less$/,
      include: /node_modules/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:[
            'css-loader', 'postcss-loader', 
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true
                }
              }
          ]
        }
      )
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:[
            {
              loader: 'css-loader',
              options: {
                modules: true,
                import: true,
                importLoaders: 1,
                localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
                sourceMap: true
              }
            },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            {
              loader: 'less-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
                javascriptEnabled: true,
                sourceMapContents: !isDev
              }
            }
          ]
        }
      )
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    }
  ];
  
  if (eslint) {
    loaders.unshift({
      test: /\.(js|jsx)?$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'eslint-loader'
    });
  }
  return loaders;
};
module.exports = {
  target: 'web',
  devtool: isDev ? 'cheap-module-source-map' : 'hidden-source-map',
  context: path.resolve(process.cwd()),
  cache: isDev,
  entry: getEntry(),
  output: {
    path: path.resolve(process.cwd(), 'public/assets'),
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    publicPath: '/assets/',
    pathinfo: isDev
  },
  resolve: {
    modules: ['src', 'node_modules'],
    descriptionFiles: ['package.json'],
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    loaders: webpackLoaders()
  },
  optimization: {
    splitChunks: {
      // Auto split vendor modules in production only
      chunks: isDev ? 'async' : 'all'
    }
  },
  plugins: getPlugins()
}