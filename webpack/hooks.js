/* @flow */

/* Require hooks for server-side */
const path = require('path');
const hook = require('css-modules-require-hook');
const parseLess = require('postcss-less').parse;
// const syntax = require('postcss-less');

module.exports = () => {
  // CSS modules
  hook({
    // Must use the same pattern with your webpack config
    generateScopedName: '[path]__[name]__[local]__[hash:base64:5]',
    extensions: ['.css', '.less'],
    prepend: [require('autoprefixer')],
    // processorOpts: { parser: lessParser },
    preprocessCss: (css, filename) => {
      return parseLess(css, filename);
    },
    // Must be the same with the "context" of webpack LoaderOptionsPlugin
    // see here: https://github.com/css-modules/css-modules-require-hook/issues/86
    rootDir: path.resolve(process.cwd(), 'src'),
    devMode: __DEV__
  });

  // Images
  require('asset-require-hook')({
    extensions: ['gif', 'jpg', 'jpeg', 'png', 'webp'],
    limit: 10240
  });

  // Fonts
  require('asset-require-hook')({
    extensions: ['woff', 'woff2', 'ttf', 'eot', 'svg'],
    limit: 10240
  });
};
