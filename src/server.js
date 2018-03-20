import Express from 'express';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import fs from 'fs';
import http from 'http';
import Html from './helpers/Html';
import { match, RouterContext } from 'react-router';
import { Provider, useStaticRendering } from 'mobx-react';
import getRoutes from './routes';
import { RouterStore } from 'mobx-react-router';
import * as allStores from 'stores';
useStaticRendering(true);
const app = new Express();
const server = new http.Server(app);

app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.use(Express.static(path.join(__dirname, '..', 'static')));
app.use((req, resp) => {
  if (__DEVELOPMENT__) {
    webpackIsomorphicToolsPlugin.refresh();
  }
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
        assets={webpackIsomorphicToolsPlugin.assets()}
        component={component} {...allStores}
      />
      resp.status(200);
      resp.send(
        ReactDOM.renderToString(renderHTML)
      );
    }
  })
})

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('==>     [success]: Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     [error]: No PORT environment variable has been specified');
}
