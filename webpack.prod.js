const webpack = require('webpack');
const merge = require('webpack-merge');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // webpack 打包工具
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'); // 多线程打包工具

const common = require('./webpack.common.js');
module.exports = merge(common, {
  entry: './src/index.js',
  devtool: 'source-map',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    // new UglifyJSPlugin({
    //   sourceMap: true
    // }),
    new ParallelUglifyPlugin({
      uglifyJS: {
        output: {
          // beautify: false, // 最紧凑的输出, false 时可减少main.js打包体积
          comments: false, // 删除所有的注释
        },
        compress: {
          warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
          drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
          collapse_vars: true, // 内嵌定义了但是只用到一次的变量
          reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      },
    })
  ]
});
