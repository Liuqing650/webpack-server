import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import { hydrate } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Loadable from 'react-loadable';
import { AppContainer } from 'react-hot-loader';
// import { useStrict } from 'mobx';
import { createBrowserHistory } from 'history';
import { clientCreateStore } from './stores';
import App from './containers/app';

// useStrict(true);
const store = clientCreateStore();
const browserHistory = createBrowserHistory();

const renderApp = Component => {
  Loadable.preloadReady().then(() => {
    hydrate(
      <Provider {...store}>
        <Router history={browserHistory}>
          <AppContainer>
            <Component />
          </AppContainer>
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  });
};
renderApp(App);

if (module.hot) {
  module.hot.accept('./containers/app', () => {
    const NextApp = require('./containers/app').default;
    renderApp(NextApp);
  });
}