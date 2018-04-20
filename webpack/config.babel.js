import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

const rootPath = path.resolve(process.cwd());

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';
const getPlugins = () => {
  // Common
  const plugins = [
    new AssetsPlugin({ path: path.resolve(process.cwd(), 'public') }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[chunkhash:8].css',
      chunkFilename: isDev
        ? '[name].chunk.css'
        : '[name].[chunkhash:8].chunk.css'
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEV__: isDev
    })
  ];

  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      new webpack.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin([path.resolve(process.cwd(), 'public/assets')], { root: rootPath }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|jsx)?$|\.css$|\.less$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.NODE_ENV === 'analyze' ? 'server' : 'disabled'
      })
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
module.exports = {
  mode: isDev ? 'development' : 'production', // 'development' or 'production' >=4.0.0
  devtool: isDev ? 'cheap-module-source-map' : 'hidden-source-map',
  context: path.resolve(process.cwd()),
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
  cache: isDev,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules\/)/,
        use: [{
          loader: 'babel-loader',
        }]
      }, 
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              context: path.resolve(process.cwd(), 'src'),
              modules: true,
              sourceMap: true,
              minimize: !isDev
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: true } }
        ]
      }, 
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              context: path.resolve(process.cwd(), 'src'),
              modules: true,
              sourceMap: true
            }
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'less-loader',
            options: {
              outputStyle: 'expanded',
              modules: true,
              sourceMap: true,
              sourceMapContents: !isDev
            }
          }
        ]
      }, 
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }, 
      {
        test: /\.(gif|png|jpe?g|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240
            }
          },
          {
            loader: 'image-webpack',
            options: { bypassOnDebug: true }
          }
        ]
      }
    ],
  },
  optimization: {
    splitChunks: {
      // Auto split vendor modules in production only
      chunks: isDev ? 'async' : 'all'
    }
  },
  plugins: getPlugins()
}