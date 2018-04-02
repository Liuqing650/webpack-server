import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import combineServerData from 'helpers/combineServer';
import * as allStores from 'stores';
import getRoutes from './routes';

const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
const dest = document.getElementById('root');

combineServerData(allStores, window.__data);
allStores.routing = routingStore;
const render = () => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider {...allStores}>
        <Router routes={getRoutes(allStores)} history={history} />
      </Provider>
    </AppContainer>,
    dest
  );
};

if (module.hot) {
  module.hot.accept('./routes', () => {
    try {
      // const nextRoutes = require('./routes');
      console.log('nextRoutes------->');
      render();
      // render(nextRoutes);
    } catch (error) {
      console.error(`==> Routes hot reloading error ${error}`);
    }
  });
}
