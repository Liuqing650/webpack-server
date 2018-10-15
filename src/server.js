import path from 'path';
// 获取页面访问时间
import morgan from 'morgan';
import express from 'express';
import http from 'http';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
// import history from 'connect-history-api-fallback';
// import compression from 'compression';
import hpp from 'hpp';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import React from 'react';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import openBrowser from 'react-dev-utils/openBrowser';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import chalk from 'chalk';
import url from 'url';
import { StaticRouter } from 'react-router';
import { toJS } from 'mobx';
import { Provider, useStaticRendering } from 'mobx-react';
import config from './config';
import Html from './helpers/Html';
// import { serverCreateStore } from 'stores';
import App from './containers/app';

const renderHtml = (htmlContent, store) => {
  const assets = webpackIsomorphicTools.assets();
  const html = renderToStaticMarkup(
    <Html
      assets={assets}
      htmlContent={htmlContent}
      {...store}
    />
  );
  // console.log('html------>', html);
  return `${'<!doctype html>\n'}${html}`;
}

// 默认服务端渲染函数
const defaultSend = (req, resp, store) => {
  const context = {}
  const htmlContent = (
    <Provider {...store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );
  resp.status(200);
  global.navigator = { userAgent: req.headers['user-agent'] };
  resp.send(renderHtml(renderToString(htmlContent), store));
};
useStaticRendering(true);
const app = new express();
const router = express.Router();
app.use(hpp());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));
// app.use(compression());
// app.use(history());

app.use(express.static(path.join(process.cwd(), './public')));

if (__DEV__) {
  /* Run express as webpack dev server */
  const webpack = require('webpack');
  const webpackConfig = require('../webpack/config.babel');
  const compiler = webpack(webpackConfig);
  // compiler.apply(new webpack.ProgressPlugin());
  const serverOption = {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'http://' + config.host + ':' + config.port,
    quiet: true,
    hot: true,
    overlay: true,
    noInfo: true,
    stats: 'minimal',
    serverSideRender: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
  app.use(webpackDevMiddleware(compiler, serverOption));
  app.use(webpackHotMiddleware(compiler));
  // ssrHotServer();
  require("babel-register")({
    extensions: ['.js', '.jsx'],
    plugins: ["ignore-html-and-css-imports"],
    cache: false
  });
  require('./utils/hot-node-module-replacement.js')({
    extenstions: ['.js', '.jsx']
  });
}
app.get('*', (req, resp) => {
  if(__DEV__) {
    webpackIsomorphicTools.refresh();
  }
  const { serverCreateStore } = require('./stores');
  const stores = serverCreateStore();
  stores.clientStore.env = __DEV__ ? 'dev' : 'prod';
  defaultSend(req, resp, stores);
});
if (config.port) {
  // 服务端异步加载组件，参考https://github.com/thejameskyle/react-loadable#loadablepreloadall
  Loadable.preloadAll().then(() => {
    const url = `http://${config.host}:${config.port}`;
    app.listen(config.port, config.host, err => {
      if (err) console.error(chalk.red(`==>     [error]: ${err}`));
      console.info(chalk.green(`==>     [success]: Open ${url} in a browser to view the app.`));
      // Open browser
      // openBrowser(url)
    });
  });
} else {
  console.error(
    chalk.red('==>     [error]: No PORT environment variable has been specified')
  );
}
