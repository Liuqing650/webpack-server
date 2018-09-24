import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash/fp';
import { toJS } from 'mobx';

function prepareStore(store) {
  const keyArr = Object.keys(store);
  const output = {};
  keyArr.forEach(key => {
    output[key] = toJS(store[key]);
  });
  return output;
}

const Html = ({ assets, htmlContent, ...store }) => {
  return (
    <html lang={'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>webpack-server</title>
        <link rel="shortcut icon" href="/favicon.ico" />

          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, i) =>
            <link href={assets.styles[style]} key={`css-${i}`} media="screen, projection"
                  rel="stylesheet" type="text/css"/>)}
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
        <script key={_.uniqueId()} src={assets.javascript.manifest} />
        <script key={_.uniqueId()} src={assets.javascript.vendor} />
        <script key={_.uniqueId()} src={assets.javascript.main} />
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
  allStore: PropTypes.object // eslint-disable-line react/forbid-prop-types
};
export default Html;
