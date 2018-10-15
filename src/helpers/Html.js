import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import { toJS } from 'mobx';
import config from '../config';

function prepareStore(store) {
  const keyArr = Object.keys(store);
  const output = {};
  keyArr.forEach(key => {
    output[key] = toJS(store[key]);
  });
  return output;
}

const Html = ({ assets, htmlContent, ...store }) => {
  const head = Helmet.renderStatic();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        <title>webpack-server</title>
        <link rel="shortcut icon" href="/favicon.ico" />
          {assets.styles && _.keys(assets.styles).map(style => (
            <link
              key={_.uniqueId()}
              href={assets.styles[style]}
              media="screen, projection"
              rel="stylesheet"
              type="text/css"
            />
          ))}
      </head>
      <body>
        <div
          id="root"
          style={{ height: '100%' }}
          dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
        />
        {store && (
          <script
            dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(prepareStore(store))};` }}
            charSet="UTF-8"
          />
        )}
        {assets.javascript && <script src={assets.javascript.main} charSet="UTF-8" />}
        {/* {Object.keys(assets.javascript).map((script, i) =>
            <script src={assets.javascript[script]} key={`js-${i}`}/>
          )} */}
      </body>
    </html>
  );
};

Html.defaultProps = { htmlContent: '' };
Html.propTypes = {
  htmlContent: PropTypes.string,
  assets: PropTypes.object,
  bundles: PropTypes.arrayOf(PropTypes.any),
  allStore: PropTypes.object // eslint-disable-line react/forbid-prop-types
};
export default Html;
