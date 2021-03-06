import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

const rootPath = path.resolve(process.cwd());
const assetsPath = path.resolve(process.cwd(), 'public/assets');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';
// 环境
const PORT_ENV = process.env.PORT || 3030;
const PORT = (Number(PORT_ENV) + 1) || 3031;
const HOST_ENV = process.env.HOST || 'localhost';

const CSSModules = true;
const eslint = false;
const stylelint = false;

const vendor = [
  'react',
  'react-dom'
];

console.log(isDev ? '开发模式' : '发布模式');

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools.js')).development(isDev);
const getPlugins = () => {
  // Common
  const plugins = [
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
      allChunks: true,
      ignoreOrder: CSSModules,
      disable: isDev
    }),
    new StyleLintPlugin({ failOnError: stylelint }),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': nodeEnv,
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: isDev
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    webpackIsomorphicToolsPlugin
  ];

  if (isDev) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new webpack.IgnorePlugin(/webpack-assets\.json$/),
    );
  } else {
    plugins.push(
      new CleanWebpackPlugin([assetsPath], { root: rootPath }),
      new webpack.HashedModuleIdsPlugin(),
      new MinifyPlugin({}, { test: /\.js?$/, comments: false }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
      new webpack.optimize.ModuleConcatenationPlugin()
    );
  }
  return plugins;
};

const getEntry = () => {
  // Development
  let entry = ['react-hot-loader/patch', 'webpack-hot-middleware/client?reload=true', './src/client.js'];

  // Prodcution
  if (!isDev) {
    entry = {
      main: './src/client.js',
      vendor
    };
  }

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
    }, {
      test: /\.css$/,
      include: /node_modules/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:[
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                context: path.resolve(process.cwd(), 'src'),
                sourceMap: true,
                minimize: !isDev
              }
            }, 'postcss-loader']
        },
      )
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:[
            {
              loader: 'css-loader',
              options: {
                modules: CSSModules,
                importLoaders: 1,
                context: path.resolve(process.cwd(), 'src'),
                sourceMap: true,
                minimize: !isDev
              }
            }, 'postcss-loader']
        },
      )
    }, {
      test: /\.less$/,
      include: /node_modules/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use:[
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  modules: CSSModules,
                  localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
                  context: path.resolve(process.cwd(), 'src'),
                  sourceMap: true
                }
              }, 'postcss-loader', 
              {
                loader: 'less-loader',
                options: {
                  outputStyle: 'expanded',
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
                import: true,
                modules: CSSModules,
                importLoaders: 2,
                localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
                context: path.resolve(process.cwd(), 'src'),
                sourceMap: true,
                minimize: !isDev
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
    }, {
      test: webpackIsomorphicToolsPlugin.regularExpression('images'),
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }
      ]
    }, {
      test: webpackIsomorphicToolsPlugin.regularExpression('fonts'),
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

const createWebpackConfig = (target = 'web') => {
  const isServer = target === 'node';
  let webpackConfig = {
    name: 'client',
    target: 'web',
    // devtool: isDev ? 'cheap-module-source-map' : false,
    devtool: false,
    context: path.join(process.cwd()),
    // cache: isDev,
    entry: getEntry(),
    output: {
      path: path.join(process.cwd(), './public/assets'),
      filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
      chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
      publicPath: '/assets/',
      pathinfo: isDev
    },
    resolve: {
      modules: [path.resolve(process.cwd(), 'src'), path.resolve(process.cwd(), 'public'), 'node_modules'],
      descriptionFiles: ['package.json'],
      extensions: ['.js', '.jsx', '.json']
    },
    module: {
      loaders: webpackLoaders()
    },
    plugins: getPlugins(),
    node: {
      fs: 'empty',
      vm: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  };
  return webpackConfig;
};
module.exports = createWebpackConfig();