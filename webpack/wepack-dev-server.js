const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require('./dev.config.js');

const app = express();
const compiler = webpack(config);

const port = 3000;
const DIST_DIR = config.output.path;

const devMiddleware = webpackDevMiddleware(compiler, {
  path: DIST_DIR,
  quiet: true //向控制台显示信息
});

const hotMiddleware = webpackHotMiddleware(compiler, {
  heartbeat: 2000,
})
app.use(devMiddleware)

app.use(hotMiddleware);

app.get("*", (req, res, next) =>{
  const filename = path.join(DIST_DIR, 'index.html');

  compiler.outputFileSystem.readFile(filename, (err, result) =>{
    if(err){
      return(next(err))
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

app.listen(port, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('App listening on port %s!\n', port);
  }
});