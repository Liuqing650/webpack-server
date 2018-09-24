#!/usr/bin/env node
require('babel-polyfill');
require('babel-register')({
    "plugins": [
        "dynamic-import-node"
    ]
});
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const dirRoot = require('path').join(process.cwd());

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DEV__ = process.env.NODE_ENV === 'development';

// Run server
global.webpackIsomorphicTools =
  new WebpackIsomorphicTools(
      require('../webpack/webpack-isomorphic-tools-configuration')
    ).server(dirRoot, () => require('../src/server'));
