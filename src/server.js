import Express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import fs from 'fs';
import http from 'http';
import Html from './helpers/Html';
import { match, RouterContext } from 'react-router';
import { Provider, useStaticRendering } from 'mobx-react';
import { renderToString } from 'react-dom/server';
import chalk from 'chalk';

import assets from '../public/webpack-assets.json';
import getRoutes from './routes';
import { RouterStore } from 'mobx-react-router';
import * as allStores from 'stores';
useStaticRendering(true);
const app = new Express();

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
  match({ routes: getRoutes('server'), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (renderProps) {
      console.log('路由被match', req.url);
      /*服务端注入RouterStore*/
      const routingStore = new RouterStore();
      allStores.routing = routingStore;
      const component = (
        <Provider { ...allStores }>
          <RouterContext {...renderProps} />
        </Provider>
      );
      const renderHTML = <Html 
        assets={assets}
        component={component} {...allStores}
      />
      resp.status(200);
      resp.send(
        ReactDOMServer.renderToString(renderHTML)
      );
    }
  })
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
