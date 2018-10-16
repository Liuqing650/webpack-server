const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');

const loadedModules = {};
const loadedExportObjs = {};
const loadedExportFuns = {};
const fileWatchers = {};
let fileWatcher = null;
const directoryWatchers = {};
let options = {};
const oldExtFuns = {};
const REStores = /^(?:.*[\\\/])?stores(?:[\\\/].*)?$/;
const RENodeModule = /^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/;

function setOptions(opts) {
  const curOpts = {
    extenstions: ['.js'],
    directories: [],
    ignoreNodeModules: true,
    matchFn: null
  }
  function setSpecialOpts(attr) {
    if (opts && opts[attr]) {
      if (Array.isArray(opts[attr])) {
        curOpts[attr] = opts[attr];
      } else if (typeof opts[attr] === 'string') {
        curOpts[attr] = [opts[attr]];
      }
    }
  }
  setSpecialOpts('extenstions');
  setSpecialOpts('directories');
  // if (opts && opts.extenstions) {
  //   if (Array.isArray(opts.extenstions)) {
  //     curOpts.extenstions = opts.extenstions;
  //   } else if (typeof opts.extenstions === 'string') {
  //     curOpts.extenstions = [opts.extenstions];
  //   }
  // }
  if (opts && opts.ignoreNodeModules) curOpts.ignoreNodeModules = true;
  if (opts && typeof opts.matchFn === 'function') curOpts.matchFn = opts.matchFn;

  options = curOpts;
}

function match(filename, ext, matchFn, ignoreNodeModules) {
  if (typeof filename !== 'string') return false;
  if (ext.indexOf(path.extname(filename)) === -1) return false;

  const fullname = path.resolve(filename);
  if (ignoreNodeModules && (RENodeModule.test(fullname) || !REStores.test(fullname))) return false;
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

function watchChokidarFile(dir) {
  const watcher = chokidar.watch(dir, { persistent: false });
  watcher.on('ready', () => {
    watcher.on('all', (event, filename) => {
      if (event === 'change') {
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
      }
    })
  });
  fileWatcher = watcher;
}

function unWatchFiles() {
  // Object.keys(fileWatchers).map((filename) => {
  //   fileWatchers[filename].close();
  // });
  fileWatcher.close();
}

function registerExtension(ext) {
  const oldExtFun = oldExtFuns[ext] || oldExtFuns['.js'];
  const matchFn = options.matchFn;
  const ignoreNodeModules = options.ignoreNodeModules;
  require.extensions[ext] = function (m, filename) {
    oldExtFun(m, filename);
    console.log('filename------->', filename);
    // if (match(filename, ext, matchFn, ignoreNodeModules)) {
    //   console.log('filename------->', filename);
    //   delete require.cache[filename];
    //   if (!loadedModules[filename]) {
    //     loadedModules[filename] = m;
    //     const type = typeof m.exports;
    //     if (type === 'object') {
    //       loadedExportObjs[filename] = m.exports;
    //     } else if (type === 'function') {
    //       loadedExportFuns[filename] = m.exports;
    //       // A function Wrapper should be used to hot replace exports Object
    //       m.exports = function () {
    //         const args = Array.prototype.slice.call(arguments);
    //         return loadedExportFuns[filename].apply(m, args);
    //       }
    //     }
    //   }
    //   if (!fileWatcher) {
    //     const dirs = options.directories;
    //     dirs.forEach((dir) => {
    //       watchChokidarFile(dir);
    //     })
    //   }
    // }
  }
  return unWatchFiles;
}

// function registerChokidar(dir) {
//   const watcher = chokidar.watch(dir);
//   watcher.on('all', (event, fullPath) => {
//     console.log(event);
//     console.log(`File ${fullPath} has been change`);
//     if (event === 'change') {
//       delete require.cache[fullPath];
//       console.log('extensions---->', extensions);
//     }
//   })
  
// }

function hotNodeModuleReplace(opts) {
  setOptions(opts);
  const exts = options.extenstions;
  exts.forEach((ext) => {
    oldExtFuns[ext] = require.extensions[ext];
    registerExtension(ext);
  })
}

module.exports = hotNodeModuleReplace
