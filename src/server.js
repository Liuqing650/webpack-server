import Express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import Helmet from 'react-helmet';
import path from 'path';
import React from 'react';
import { renderToString, renderToStaticMarkup} from 'react-dom/server';
import favicon from 'serve-favicon';
import http from 'http';
import chalk from 'chalk';
import url from 'url';
import { RouterStore } from 'mobx-react-router';
import { RouterContext, match } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { getLoadableState } from 'loadable-components/server';
import { Provider, useStaticRendering } from 'mobx-react';
import { parseUrl } from 'query-string';
import config from './config';
import Html from './helpers/Html';
import getRoutes from './routes';
import { serverStores } from './stores';

import assets from '../public/webpack-assets.json';

useStaticRendering(true);
const app = new Express();
const renderHtml = (head, htmlContent, allStore) => {
  const html = renderToStaticMarkup(
    <Html
      head={head}
      assets={assets}
      htmlContent={htmlContent}
      {...allStore}
    />
  ); 
  return `${'<!DOCTYPE html>\n' +
    '<!--[if lt IE 10]>\n' +
    '<![endif]-->\n' +
    '<!--[if lte IE 11]>\n' +
    '<![endif]-->\n'}${html}`;
}

// 默认服务端渲染函数
const defaultSend = (req, resp) => {
  const reqPathName = url.parse(req.url).pathname;
  const allStore = serverStores();
  match({ routes: getRoutes('server'), location: reqPathName }, (err, redirectLocation, renderProps) => {
    if (err) {
      resp.status(500).end(`Internal Server Error ${err}`);
    } else if (redirectLocation) {
      resp.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const routingStore = new RouterStore();
      allStore.routing = routingStore;
      const head = Helmet.renderStatic();
      const htmlContent = (
        <Provider {...allStore}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      console.log('htmlContent------->', htmlContent);
      resp
        .status(200)
        .send(
          renderHtml(
            head,
            htmlContent,
            allStore
          )
        );
    } else {
      resp.status(404).send('Not Found :(');

      console.error(chalk.red(`==> 😭  Rendering routes error: ${err}`));
    }
  });
};

app.use(helmet());
app.use(compression());

app.use(favicon(path.resolve(process.cwd(), 'public/favicon.ico')));

if (!__DEV__) {
  app.use(express.static(path.resolve(process.cwd(), 'public/dist')));
} else {
  /* Run express as webpack dev server */
  const webpack = require('webpack');
  const webpackConfig = require('../webpack/config.babel');
  // const Dashboard = require('webpack-dashboard');
  // const DashboardPlugin = require('webpack-dashboard/plugin');
  // const dashboard = new Dashboard();
  const compiler = webpack(webpackConfig);

  compiler.apply(new webpack.ProgressPlugin());
  // compiler.apply(new DashboardPlugin());
  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
      hot: true,
      quiet: true, // lets WebpackDashboard do its thing
      noInfo: true,
      stats: 'minimal',
      serverSideRender: true
    })
  );

  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: false // Turn it off for friendly-errors-webpack-plugin
    })
  );
}

app.get('*', (req, resp) => {
  /*服务端注入RouterStore*/
  // const store = serverStore();
  defaultSend(req, resp);
})
if (config.port) {
  const url = `http://${config.host}:${config.port}`;
  app.listen(config.port, config.host, err => {

    if (err) console.error(chalk.red(`==>     [error]: ${err}`));

    console.info(chalk.green(`==>     [success]: Open ${url} in a browser to view the app.`));
  });
} else {
  console.error(
    chalk.red('==>     [error]: No PORT environment variable has been specified')
  );
}
