import Express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import Helmet from 'react-helmet';
import path from 'path';
import React from 'react';
import { renderToString, renderToStaticMarkup} from 'react-dom/server';
import favicon from 'serve-favicon';
import fs from 'fs';
import http from 'http';
import chalk from 'chalk';
import url from 'url';
import { renderToString } from 'react-dom/server';
import { RouterStore } from 'mobx-react-router';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { getLoadableState } from 'loadable-components/server';
import { Provider, useStaticRendering } from 'mobx-react';
import { parseUrl } from 'query-string';
import config from './config';
import Html from './helpers/Html';
import { serverStore } from './stores';

import routes from './routes';
import App from './containers/app';
import assets from '../public/webpack-assets.json';
useStaticRendering(true);
const app = new Express();
const renderHtml = (head, htmlContent, loadableStateTag, store) => {
  const html = renderToStaticMarkup(
    <Html
      head={head}
      assets={assets}
      htmlContent={htmlContent}
      loadableStateTag
      {...store}
    />
  ); 
  return `${'<!DOCTYPE html>\n' +
    '<!--[if lt IE 10]>\n' +
    '<![endif]-->\n' +
    '<!--[if lte IE 11]>\n' +
    '<![endif]-->\n'}${html}`;
}

// 默认服务端渲染函数
const defaultSend = (req, resp, reqPathName, store) => {
  const routingStore = new RouterStore();
  const reqUrlObj = {
    pathname: reqPathName,
    query: parseUrl(req.url).query
  };
  const loadBranchData = () => {
    const branch = matchRoutes(routes, req.path);

    const promises = branch.map(({ route, match }) => {
      if (route.loadData) {
        return Promise.all(
          route
            .loadData({ params: match.params, getState: store })
            .map(item => store.dispatch(item))
        );
      }

      return Promise.resolve(null);
    });

    return Promise.all(promises);
  };

  (async () => {
    try {
      // Load data from server-side first
      await loadBranchData();

      const staticContext = {};
      const AppComponent = (
        <Provider store={store}>
          {/* Setup React-Router server-side rendering */}
          <StaticRouter location={req.path} context={staticContext}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      );

      // Check if the render result contains a redirect, if so we need to set
      // the specific status and redirect header and end the response
      if (staticContext.url) {
        res.status(301).setHeader('Location', staticContext.url);
        res.end();

        return;
      }

      // Extract loadable state from application tree (loadable-components setup)
      getLoadableState(AppComponent).then(loadableState => {
        const head = Helmet.renderStatic();
        const htmlContent = renderToString(AppComponent);
        const initialStore = store;
        const loadableStateTag = loadableState.getScriptTag();
        console.log('loadableStateTag------>', loadableStateTag);

        // Check page status
        const status = staticContext.status === '404' ? 404 : 200;

        // Pass the route and initial state into html template
        resp
          .status(status)
          .send(
            renderHtml(
              head,
              renderToString(htmlContent),
              loadableStateTag,
              initialStore
            )
          );
      });
    } catch (err) {
      resp.status(404).send('Not Found :(');

      console.error(chalk.red(`==> 😭  Rendering routes error: ${err}`));
    }
  })();
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
  const reqPathName = url.parse(req.url).pathname;
  const store = serverStore();
  defaultSend(req, resp, reqPathName, store);
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
