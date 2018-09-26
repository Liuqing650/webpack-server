import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
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

const target = document.getElementById('root');
const renderApp = Component => {
  Loadable.preloadReady().then(() => {
    console.log('dom-len---2->', target.innerHTML.trim().length);
    ReactDOM.hydrate(
      <Provider {...store}>
        <BrowserRouter>
          <AppContainer>
            <Component />
          </AppContainer>
        </BrowserRouter>
      </Provider>,
      target
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