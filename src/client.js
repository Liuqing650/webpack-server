import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'mobx-react';
import createHistory from 'history/createBrowserHistory';
import { RouterStore } from 'mobx-react-router';
import { renderRoutes } from 'react-router-config';
import combineServerData from 'helpers/combineServer';
import { loadComponents } from 'loadable-components';
import { clientStore } from './stores';
import routes from './routes';

const routingStore = new RouterStore();
console.log('routingStore----->', routingStore);
const history = createHistory();
const dest = document.getElementById('root');
const store = clientStore();
store.routing = routingStore;
const render = (Routes) => {
  console.log('Routes----->', Routes);
  ReactDOM.hydrate(
    <AppContainer>
      <Provider {...store}>
        <Router history={history}>
          {renderRoutes(Routes)}
        </Router>
      </Provider>
    </AppContainer>,
    dest
  );
};
loadComponents().then(() => {
  render(routes);
});
if (module.hot) {
  module.hot.accept('./routes', () => {
    try {
      const nextRoutes = require('./routes').default;
      render(nextRoutes);
    } catch (error) {
      console.error(`==> Routes hot reloading error ${error}`);
    }
  });
}
