# vue 开发环境

# 首先我们要知道 vue-cli 生成的项目，帮我们配置好了哪些功能？

    1、ES6代码转换成ES5代码
    2、scss/sass/less/stylus转css
    3、.vue文件转换成js文件
    4、使用 jpg、png，font等资源文件
    5、自动添加css各浏览器产商的前缀
    6、代码热更新
    7、资源预加载
    8、每次构建代码清除之前生成的代码
    9、定义环境变量
    10、区分开发环境打包跟生产环境打包

## 配置 ES6/7/8 转 ES5 代码

```js
npm install babel-loader @babel/core @babel/preset-env
```

## ES6/7/8 Api 转 es5

babel-loader 只会将 ES6/7/8 语法转换为 ES5 语法，但是对新 api 并不会转换。

我们可以通过 babel-polyfill 对一些不支持新语法的客户端提供新语法的实现

```js
npm install @babel/polyfill
```

按需引入

```js
npm install core-js@2 @babel/runtime-corejs2 -S
```

配置了按需引入 polyfill 后，用到 es6 以上的函数，babel 会自动导入相关的 polyfill，这样能大大减少 打包编译后的体积

## 配置 scss 转 css

```js
npm install sass-loader dart-sass css-loader style-loader -D
```

sass-loader, dart-sass 主要是将 scss/sass 语法转为 css

css-loader 主要是解析 css 文件

style-loader 主要是将 css 解析到 html 页面 的 style 上

## 配置 postcss 实现自动添加 css3 前缀

```js
npm install postcss-loader autoprefixer -D

```

## 使用 html-webpack-plugin 来创建 html 页面

使用 html-webpack-plugin 来创建 html 页面，并自动引入打包生成的 js 文件

```js
npm install html-webpack-plugin -D

```

## 配置 devServer 热更新功能

通过代码的热更新功能，我们可以实现不刷新页面的情况下，更新我们的页面

```js
npm install webpack-dev-server -D
```

## 配置 webpack 打包 图片、媒体、字体等文件

```js
npm install file-loader url-loader -D
```

file-loader 解析文件 url，并将文件复制到输出的目录中

url-loader 功能与 file-loader 类似，如果文件小于限制的大小。则会返回 base64 编码，否则使用 file-loader 将文件复制到输出的目录中

修改 webpack-config.js 配置 添加 rules 配置，分别对 图片，媒体，字体文件进行配置

```js
// build/webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  // 省略其它配置 ...
  module: {
    rules: [
      // ...
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "fonts/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // ...
  ],
};
```

## 让 webpack 识别 .vue 文件

```js
npm install vue-loader vue-template-compiler cache-loader thread-loader -D
npm install vue -S

```

      vue-loader 用于解析.vue 文件
      vue-template-compiler 用于编译模板
      cache-loader 用于缓存 loader 编译的结果
      thread-loader 使用 worker 池来运行 loader，每个 worker 都是一个 node.js 进程。

## 定义环境变量

通过 webpack 提供的 DefinePlugin 插件，可以很方便的定义环境变量

```js
plugins: [
  new webpack.DefinePlugin({
    "process.env": {
      VUE_APP_BASE_URL: JSON.stringify("http://localhost:3000"),
    },
  }),
];
```

## 打包分析

webpack-bundle-analyzer

```js
npm install --save-dev webpack-bundle-analyzer

```

修改 webpack-prod.js 配置，在 plugins 属性中新增一个插件
在开发环境中，我们是没必要进行模块打包分析的，所以我们将插件配置在了生产环境的配置项中

## 集成 VueRouter,Vuex

npm install vue-router vuex --save

```js
// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import About from "../views/About";
Vue.use(VueRouter);
export default new VueRouter({
  mode: "hash",
  routes: [
    {
      path: "/Home",
      component: Home,
    },
    {
      path: "/About",
      component: About,
    },
    {
      path: "*",
      redirect: "/Home",
    },
  ],
});
```

## 配置路由懒加载

在没配置路由懒加载的情况下，我们的路由组件在打包的时候，都会打包到同一个 js 文件去，当我们的视图组件越来越多的时候，就会导致这个 js 文件越来越大。然后就会导致请求这个文件的时间变长，最终影响用户体验

```js
npm install @babel/plugin-syntax-dynamic-import --save-dev
```

```js
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
export default new VueRouter({
  mode: "hash",
  routes: [
    {
      path: "/Home",
      component: () =>
        import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
      // component: Home
    },
    {
      path: "/About",
      component: () =>
        import(/* webpackChunkName: "About" */ "../views/About.vue"),
      // component: About
    },
    {
      path: "*",
      redirect: "/Home",
    },
  ],
});
```
