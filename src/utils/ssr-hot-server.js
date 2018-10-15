module.exports = () => {
  require("babel-register")({
    extensions: [".jsx", ".js"],
    plugins: ["ignore-html-and-css-imports"],
    cache: false
  });
  require('./hot-node-module-replacement.js')({
    extenstions: ['.js', '.jsx']
  });
};
