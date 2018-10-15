#!/usr/bin/env node
require('babel-polyfill');
require('babel-register')({
    "plugins": [
        "dynamic-import-node"
    ]
});
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEV__ = process.env.NODE_ENV === 'development';

const dirRoot = require('path').join(process.cwd());
// Run server
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools.js')).server(dirRoot, () => require('../src/server'));
