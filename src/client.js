import React from 'react';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import { AppContainer } from 'react-hot-loader';
import { Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { useStrict } from 'mobx';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { clientCreateStore } from './stores';
import App from './containers/app';

useStrict(true);
const store = typeof window !== 'undefined' ? clientCreateStore() : createMemoryHistory();
const browserHistory = createBrowserHistory();

const dest = document.getElementById('root');
const renderApp = () => {
  Loadable.preloadReady().then(() => {
    hydrate(
      <Provider {...store}>
        <Router history={browserHistory}>
          <App />
        </Router>
      </Provider>,
      dest
    );
  });
};
renderApp();

if (module.hot) {
  module.hot.accept('./containers/app', () => {
    renderApp();
  });
}