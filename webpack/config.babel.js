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
    // Development
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      // Production
      new webpack.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin([path.resolve(process.cwd(), 'public/dist')], { root: rootPath }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|jsx)?$|\.css$|\.less$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      // Visualize all of the webpack bundles
      // Check "https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin"
      // for more configurations
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.NODE_ENV === 'analyze' ? 'server' : 'disabled'
      })
    );
  }

  return plugins;
};

// Setup the entry for development/prodcution
const getEntry = () => {
  // Development
  let entry = ['webpack-hot-middleware/client?reload=true', './src/client.js'];

  // Prodcution
  if (!isDev) entry = ['./src/client.js'];

  return entry;
};
module.exports = {
  mode: isDev ? 'development' : 'production', // 'development' or 'production' >=4.0.0
  context: path.resolve(process.cwd()),
  entry: getEntry(),
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(process.cwd(), 'public/dist'),
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    publicPath: '/dist/',
    pathinfo: isDev
  },
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