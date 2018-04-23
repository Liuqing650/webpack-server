import React from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';

function prepareStore(allStore) {
  const keyArr = Object.keys(allStore);
  const output = {};
  keyArr.forEach(key => {
    output[key] = toJS(allStore[key]);
  });
  return output;
}

const Html = ({ head, assets, htmlContent, loadableStateTag, ...store }) => {
  const attrs = head.htmlAttributes.toComponent();
  const { lang, ...rest } = attrs || {};
  const envAssets = __DEV__
    ? { main: { js: '/assets/main.js', css: '/assets/main.css' } }
    : assets;
  return (
    <html {...rest} lang={lang || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>webpack-server</title>
        <link rel="shortcut icon" href="/favicon.ico" />

        {head.title.toComponent()}
        {head.base.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}

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
          dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              store &&
              `window.__INITIAL_STATE__=${JSON.stringify(prepareStore(store))};`
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: loadableStateTag
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
  htmlContent: PropTypes.string
  // store: PropTypes.object // eslint-disable-line react/forbid-prop-types
};
export default Html;
