import React from 'react';
import PropTypes from 'prop-types';
import { renderToString } from 'react-dom/server';
import { toJS } from 'mobx';

function prepareStore(allStore) {
  const keyArr = Object.keys(allStore);
  const output = {};
  keyArr.forEach(key => {
    output[key] = toJS(allStore[key]);
  });
  return output;
}

const Html = ({ assets, htmlContent, ...allStore }) => {
  const envAssets = __DEV__
    ? { main: { js: '/assets/main.js', css: '/assets/main.css' } }
    : assets;
  const stores = prepareStore(allStore);
  const content = htmlContent ? renderToString(htmlContent) : '';
  return (
    <html {...rest} lang={'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>webpack-server</title>
        <link rel="shortcut icon" href="/favicon.ico" />

        {Object.keys(envAssets)
          .map((key, index) =>
            envAssets[key].css
              ? < link
                key = {`css-${index}`}
                href={ envAssets[key].css }
                media="screen, projection"
                rel="stylesheet"
                type="text/css"
              /> : ''
          )}
      </head>
      <body>
        <div
          id="root"
          style={{ height: '100%' }}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              stores &&
              `window.__INITIAL_STATE__=${JSON.stringify(stores)};`
          }}
        />
        {Object.keys(envAssets)
          .map((key, index) => <script key={`js-${index}`} src={envAssets[key].js}></script>)}
      </body>
    </html>
  );
};

Html.defaultProps = { htmlContent: '' };
Html.propTypes = {
  htmlContent: PropTypes.object,
  allStore: PropTypes.object // eslint-disable-line react/forbid-prop-types
};
export default Html;
