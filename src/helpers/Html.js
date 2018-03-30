import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import { toJS } from 'mobx';
/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    isDev: PropTypes.bool
  };

  prepareStore(allStore) {
    const keyArr = Object.keys(allStore);
    const output = {};
    keyArr.map((key) => {
      output[key] = toJS(allStore[key]);
    });
    return output;
  }

  render() {
    const { assets, component, ...allStore } = this.props;
    const stores = this.prepareStore(allStore);
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    const envAssets = __DEV__
      ? { main: { js: '/assets/main.js', css: '/assets/main.css' } }
      : assets;
    return (
      <html lang="en-us">
        <head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <title>webpack-server</title>
          {Object.keys(envAssets)
            .map(
              key => (
                envAssets[key].css
                  ? <link href={assets.styles[style]} key={key}
                    rel="stylesheet" type="text/css" charSet="UTF-8" />
                  : ''
              )
            ).join('')}
        </head>
        <body>
          <div id="root" style={{ height: '100%' }} dangerouslySetInnerHTML={{ __html: content }} />
          <script dangerouslySetInnerHTML={{ __html: `window.__data=${JSON.stringify(stores)};` }} charSet="UTF-8" />
          <script src={assets.javascript['common']} charSet="UTF-8" />
          <script id="main" src={assets.javascript.main} charSet="UTF-8" />
        </body>
      </html>
    );
  }
}
