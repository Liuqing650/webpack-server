const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'static/dist')
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
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ],
  },
}