#!/usr/bin/env node
require('babel-polyfill');
require('babel-register')({
    "plugins": [
        "dynamic-import-node"
    ]
});

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DEV__ = process.env.NODE_ENV === 'development';
// Run assets require css-hook
require('../webpack/hooks')();
// Run server
require('../src/server');