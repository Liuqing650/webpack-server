import React from 'react';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import { AppContainer } from 'react-hot-loader';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import combineServerData from 'helpers/combineServer';
// import { loadComponents } from 'loadable-components';
import { clientStores } from './stores';
import getRoutes from './routes';

const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
const dest = document.getElementById('root');
const allStore = clientStores();
allStore.routing = routingStore;
// const render = () => {
//   ReactDOM.render(
//     <Provider {...allStore}>
//       <Router routes={getRoutes(allStore)} history={history} />
//     </Provider>,
//     dest
//   );
// };
// render();
const renderApp = () => {
  Loadable.preloadReady().then(() => {
    hydrate(
      <Provider {...allStore}>
        <Router routes={getRoutes(allStore)} history={history} />
      </Provider>,
      dest
    );
  });
};
renderApp();
if (module.hot) {
  module.hot.accept();
}
window.React = React;