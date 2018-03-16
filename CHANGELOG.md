
> The latest CHANGELOG is written in https://github.com/Liuqing650/webpack-server/releases .

## `0.0.4`
- 添加 `babel` ES7支持插件: `babel-plugin-transform-decorators-legacy`
- 添加 `babel` 复用模块插件: `babel-plugin-transform-runtime`
- 添加 `mobx`, `mobx-react`, `react-router`
- 新增 `mobx`, `react-router` 环境, `mobx` 基础框架构建告一段落.

## `0.0.3`

- 新增 `file-loader` 解析字体
- `webpack/common.config.js` 下新增字体解析配置
- `webpack/common.config.js` 下新增模块解析
  ```
    alias: {
      components: path.resolve(rootPath, 'src/components/'),
      helpers: path.resolve(rootPath, 'src/helpers/')
    }
  ```
## `0.0.2`

- 增加 **CHANGELOG** 日志
- 添加 `url-loader` 支持图片处理，压缩
- 修改 `css-loader` 路径，支持末尾追加 `hash`
  `localIdentName: '[path]___[name]__[local]___[hash:base64:5]',`

## `0.0.1`

- First version
- 添加webpacke-dev-server配置
- 添加webpack.dev.config配置和babel
- 分离webpack,并支持热加载
