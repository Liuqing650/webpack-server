import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import getRoutes from './routes';
import { Provider } from 'mobx-react';
import * as allStores from 'stores';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
const dest = document.getElementById('root');

allStores.routing = routingStore;
ReactDOM.render(
  <Provider { ...allStores }>
    <Router routes={getRoutes(allStores)} history={history} />
  </Provider>,
  dest
);