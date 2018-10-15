const fs = require('fs');
const path = require('path');

const loadedModules = {};
const loadedExportObjs = {};
const loadedExportFuns = {};
const fileWatchers = {};
let options = {};
const oldExtFuns = {};
const RENodeModule = /^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/;

function setOptions(opts) {
  const curOpts = {
    extenstions: ['.js'],
    ignoreNodeModules: true,
    matchFn: null
  }
  if (opts && opts.extenstions) {
    if (Array.isArray(opts.extenstions)) {
      curOpts.extenstions = opts.extenstions;
    } else if (typeof opts.extenstions === 'string') {
      curOpts.extenstions = [opts.extenstions];
    }
  }
  if (opts && opts.ignoreNodeModules) curOpts.ignoreNodeModules = true;
  if (opts && typeof opts.matchFn === 'function') curOpts.matchFn = opts.matchFn;

  options = curOpts;
}

function match(filename, ext, matchFn, ignoreNodeModules) {
  if (typeof filename !== 'string') return false;
  if (ext.indexOf(path.extname(filename)) === -1) return false;

  const fullname = path.resolve(filename);
  if (ignoreNodeModules && RENodeModule.test(fullname)) return false;
  if (matchFn && typeof matchFn === 'function') return !!matchFn(fullname);
  return true;
}

function watchFile(filename) {
  const watcher = fs.watch(filename, { persistent: false }, () => {
    const _parentModule = loadedModules[filename].parent;
    const children = _parentModule.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].id === filename) {
        children.splice(i, 1);
        break;
      }
    }
    const exports = _parentModule.require(filename);
    const type = typeof exports;
    if (type === 'object') {
      Object.assign(loadedExportObjs[filename], exports);
    } else if (type === 'function') {
      loadedExportFuns[filename] = exports;
    }
  });
  fileWatchers[filename] = watcher;
}

function unWatchFiles() {
  Object.keys(fileWatchers).map((filename) => {
    fileWatchers[filename].close();
  });
}

function registerExtension(ext) {
  const oldExtFun = oldExtFuns[ext] || oldExtFuns['.js'];
  const matchFn = options.matchFn;
  const ignoreNodeModules = options.ignoreNodeModules;
  require.extensions[ext] = function (m, filename) {
    oldExtFun(m, filename);
    if (match(filename, ext, matchFn, ignoreNodeModules)) {
      delete require.cache[filename];
      if (!loadedModules[filename]) {
        loadedModules[filename] = m;
        const type = typeof m.exports;
        if (type === 'object') {
          loadedExportObjs[filename] = m.exports;
        } else if (type === 'function') {
          loadedExportFuns[filename] = m.exports;
          // A function Wrapper should be used to hot replace exports Object
          m.exports = function () {
            const args = Array.prototype.slice.call(arguments);
            return loadedExportFuns[filename].apply(m, args);
          }
        }
      }
      if (!fileWatchers[filename]) {
        watchFile(filename);
      }
    }
  }
  return unWatchFiles;
}

function hotNodeModuleReplace(opts) {
  setOptions(opts);
  const exts = options.extenstions;
  exts.forEach((ext) => {
    oldExtFuns[ext] = require.extensions[ext];
    registerExtension(ext);
  })
}

module.exports = hotNodeModuleReplace
