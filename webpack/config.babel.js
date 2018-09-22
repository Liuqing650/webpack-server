import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MinifyPlugin from 'babel-minify-webpack-plugin';

const rootPath = path.resolve(process.cwd());

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';

const CSSModules = true;
const eslint = false;
const stylelint = false;

const vendor = [
  'react',
  'react-dom'
];

const getPlugins = () => {
  // Common
  const plugins = [
    new AssetsPlugin({ path: path.resolve(process.cwd(), 'public') }),
    new ExtractTextPlugin({
      filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
      allChunks: true,
      ignoreOrder: CSSModules,
      disable: isDev
    }),
    new StyleLintPlugin({ failOnError: stylelint }),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEV__: isDev
    })
  ];

  if (isDev) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/webpack-assets\.json$/)
    );
  } else {
    plugins.push(
      new MinifyPlugin({}, { test: /\.jsx?$/, comments: false }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      }),
      new CleanWebpackPlugin([path.resolve(process.cwd(), 'public/assets')], { root: rootPath }),
      new webpack.optimize.ModuleConcatenationPlugin(),
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
  plugins: getPlugins(),
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}