const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require('./dev.config');

const app = express();
const compiler = webpack(config);

const host = process.env.HOST;
const port = Number(process.env.PORT) + 1;

const devMiddleware = webpackDevMiddleware(compiler, {
  contentBase: 'http://' + host + ':' + port,
  quiet: true, //是否向控制台显示信息
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true},
});

const hotMiddleware = webpackHotMiddleware(compiler, {
  // heartbeat: 2000,
  // poll: true
})
app.use(devMiddleware)

app.use(hotMiddleware);

app.listen(port, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('[success]: App 正在被 %s 端口监听!\n', port);
  }
});