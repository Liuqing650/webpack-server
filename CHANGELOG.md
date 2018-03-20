
> The latest CHANGELOG is written in https://github.com/Liuqing650/webpack-server/releases .

## `0.0.5`
- 浅实现服务端渲染
- 分离 `@0.0.4` 版本到 `mobx` 分支, 后续接着 `mobx` 搭建非服务端项目
- 添加错误捕获模块 `react-transform-catch-errors`, 错误信息可以直接展示到浏览器端
- 添加路径映射插件 `webpack-isomorphic-tools`
- 添加 `extract-text-webpack-plugin`, 版本为 `@4.0.0-beta.0`, 用以支持 `webpack-isomorphic-tools`
- 卸载了 `webpack-dev-server`, `npm run dev` 暂时无效, 用于实现服务端渲染
- 添加热加载插件 `webpack-dev-middleware`, `webpack-hot-middleware`
- 添加 `html-webpack-plugin`, 版本为 `@webpack-contrib/html-webpack-plugin` 用以支持 `webpack 4`
- 修改 `package.json` 启动配置, 需要运行环境支持 `pm2`
- 修改 `node` 版本范围, `>=6.11.5`

**环境支持**
- 可能需要 `react-tools` 为 `@0.13.3` 或更高版本
  最新版本查看: `npm view react-tools version`
  升级|安装: `npm install react-tools -g`

- 可能需要安装 `supervisor` 用于启动 `node` 服务
  安装: `npm install -g supervisor`

- 可能需要安装 `pm2` 用于管理 `node` 服务进程
  安装: `npm install -g pm2`
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
