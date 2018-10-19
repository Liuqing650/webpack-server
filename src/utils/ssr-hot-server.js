module.exports = (path) => {
  require("babel-register")({
    extensions: [".jsx", ".js"],
    plugins: ["ignore-html-and-css-imports"],
    cache: false
  });
  require('reload-server-require')([path], null, () => {
    // 添加回调函数用于每一次清除该文件缓存后，重新require新内容，达到数据热更新效果
    const { serverCreateStore } = require('../stores');
    const stores = serverCreateStore();
    console.log('hot stores...');
  });
};
