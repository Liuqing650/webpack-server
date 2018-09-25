import path from 'path';
// 获取页面访问时间
import morgan from 'morgan';
import express from 'express';
// import compression from 'compression';
import hpp from 'hpp';
import React from 'react';
import Loadable from 'react-loadable';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import chalk from 'chalk';
import url from 'url';
import { StaticRouter } from 'react-router';
import { toJS } from 'mobx';
import { Provider, useStaticRendering } from 'mobx-react';
import config from './config';
import Html from './helpers/Html';
import App from './containers/app';
import { serverCreateStore } from './stores';

const renderHtml = (htmlContent, store) => {
  const assets = webpackIsomorphicTools.assets();
  const html = renderToStaticMarkup(
    <Html
      assets={assets}
      htmlContent={htmlContent}
      {...store}
    />
  ); 
  return `${'<!doctype html>\n'}${html}`;
}

// 默认服务端渲染函数
const defaultSend = (req, resp, store) => {
  const context = {};
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
// ----------------------------------------------
useStaticRendering(true);
const app = express();
app.use(hpp());
// app.use(morgan('dev'));
// app.use(compression());

app.use(express.static(path.resolve(process.cwd(), './public')));
if (__DEV__) {
  /* Run express as webpack dev server */
  const webpack = require('webpack');
  const webpackConfig = require('../webpack/config.babel');
  const compiler = webpack(webpackConfig);

  // compiler.apply(new webpack.ProgressPlugin());
  console.log('publicPath------>', webpackConfig.output.publicPath);
  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      overlay: true,
      noInfo: true,
      stats: 'minimal',
      serverSideRender: true
    })
  );
  app.use(require('webpack-hot-middleware')(compiler));
}

app.get('*', (req, resp) => {
  if(__DEV__) {
    webpackIsomorphicTools.refresh();
  }
  const stores = serverCreateStore();
  stores.clientStore.env = __DEV__ ? 'dev' : 'prod';
  defaultSend(req, resp, stores);
})

if (config.port) {
  // 服务端异步加载组件，参考https://github.com/thejameskyle/react-loadable#loadablepreloadall
  Loadable.preloadAll().then(() => {
    const url = `http://${config.host}:${config.port}`;
    app.listen(config.port, config.host, err => {
      if (err) console.error(chalk.red(`==>     [error]: ${err}`));
      console.info(chalk.green(`==>     [success]: Open ${url} in a browser to view the app.`));
    });

  });
} else {
  console.error(
    chalk.red('==>     [error]: No PORT environment variable has been specified')
  );
}
