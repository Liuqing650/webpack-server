const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.server.js');
const path = require('path');

const app = express();
const compiler = webpack(webpackConfig);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.

const options = {
  contentBase: './public/dist',
  hot: true,
  noInfo: true,
  stats: {
    colors: true
  },
  host: 'localhost'
};
app.use(webpackDevMiddleware(compiler, options));
app.use(webpackHotMiddleware(compiler));

// app.get("*", (req, res, next) => {
//   const filename = path.join(process.cwd(), 'public/index.html');

//   complier.outputFileSystem.readFile(filename, (err, result) => {
//     if (err) {
//       return (next(err))
//     }
//     res.set('content-type', 'text/html')
//     res.send(result)
//     res.end()
//   })
// })
app.use(express.static('./public/dist'));
// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('=========>    Example app listening on port 3000!\n');
});