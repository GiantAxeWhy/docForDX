# webpack 汇总

webpack 是一个现代 JavaScript 应用程序的静态模块打包器，当 webpack 处理应用程序时，会递归构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 bundle。

# webpack 的核心概念

      entry: 入口
      output: 输出
      loader: 模块转换器，用于把模块原内容按照需求转换成新内容
      插件(plugins): 扩展插件，在 webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情

# 图片/字体文件处理

我们可以使用 url-loader 或者 file-loader 来处理本地的资源文件。url-loader 和 file-loader 的功能类似，但是 url-loader 可以指定在文件大小小于指定的限制时，返回 DataURL，因此，个人会优先选择使用 url-loader。
首先安装依赖:
npm install url-loader -D
安装 url-loader 的时候，控制台会提示你，还需要安装下 file-loader，听人家的话安装下就行(新版 npm 不会自动安装 peerDependencies)：

npm install file-loader -D
在 webpack.config.js 中进行配置：

```js
//webpack.config.js
module.exports = {
  //...
  modules: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, //10K
              esModule: false,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
```

此处设置 limit 的值大小为 10240，即资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录。esModule 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
将资源转换为 base64 可以减少网络请求次数，但是 base64 数据较大，如果太多的资源是 base64，会导致加载变慢，因此设置 limit 值时，需要二者兼顾。
默认情况下，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名，例如我上面的图片(thor.jpeg)对应的文件名如下：

当本地资源较多时，我们有时会希望它们能打包在一个文件夹下，这也很简单，我们只需要在 url-loader 的 options 中指定 outpath，如: outputPath: 'assets'

# 处理 html 中的本地图片

安装 html-withimg-loader 来解决相对路径压根找图片。
npm install html-withimg-loader -D

修改 webpack.config.js：

```js
//webpack.config.js
module.exports = {
  //...
  modules: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, //10K
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
```

# 入口配置

入口的字段为: entry

```JS
//webpack.config.js
module.exports = {
    entry: './src/index.js' //webpack的默认配置
}
```

复制代码 entry 的值可以是一个字符串，一个数组或是一个对象。
字符串的情况无需多说，就是以对应的文件为入口。
为数组时，表示有“多个主入口”，想要多个依赖文件一起注入时，会这样配置。例如:

```JS
entry: [
    './src/polyfills.js',
    './src/index.js'
]
```

复制代码 polyfills.js 文件中可能只是简单的引入了一些 polyfill，例如 babel-polyfill，whatwg-fetch 等，需要在最前面被引入（我在 webpack2 时这样配置过）。
那什么时候是对象呢？不要捉急，后面将多页配置的时候，会说到。

# 出口配置

配置 output 选项可以控制 webpack 如何输出编译文件。

```JS
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.js',
        publicPath: '/' //通常是CDN地址
    }
}
```

例如，你最终编译出来的代码部署在 CDN 上，资源的地址为: 'https://AAA/BBB/YourProject/XXX'，那么可以将生产的 publicPath 配置为: //AAA/BBB/。
编译时，可以不配置，或者配置为 /。可以在我们之前提及的 config.js 中指定 publicPath（config.js 中区分了 dev 和 public）， 当然还可以区分不同的环境指定配置文件来设置，或者是根据 isDev 字段来设置。
除此之外呢，考虑到 CDN 缓存的问题，我们一般会给文件名加上 hash.

```JS
//webpack.config.js
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.[hash].js',
        publicPath: '/' //通常是CDN地址
    }
}
```

如果你觉得 hash 串太长的话，还可以指定长度，例如 bundle.[hash:6].js。使用 npm run build 打包看看吧。

# 0.有哪些常见的 Loader？你用过哪些 Loader？

        raw-loader：加载文件原始内容（utf-8）
        file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
        url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
        source-map-loader：加载额外的 Source Map 文件，以方便断点调试
        svg-inline-loader：将压缩后的 SVG 内容注入代码中
        image-loader：加载并且压缩图片文件
        json-loader 加载 JSON 文件（默认包含）
        handlebars-loader: 将 Handlebars 模版编译成函数并返回
        babel-loader：把 ES6 转换成 ES5
        ts-loader: 将 TypeScript 转换成 JavaScript
        awesome-typescript-loader：将 TypeScript 转换成 JavaScript，性能优于 ts-loader
        sass-loader：将SCSS/SASS代码转换成CSS
        css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
        style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
        postcss-loader：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀
        eslint-loader：通过 ESLint 检查 JavaScript 代码
        tslint-loader：通过 TSLint检查 TypeScript 代码
        mocha-loader：加载 Mocha 测试用例的代码
        coverjs-loader：计算测试的覆盖率
        vue-loader：加载 Vue.js 单文件组件
        i18n-loader: 国际化
        cache-loader: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里

# 1.有哪些常见的 Plugin？你用过哪些 Plugin？

      define-plugin：定义环境变量 (Webpack4 之后指定 mode 会自动配置)
      ignore-plugin：忽略部分文件
      html-webpack-plugin：简化 HTML 文件创建 (依赖于 html-loader)
      web-webpack-plugin：可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
      uglifyjs-webpack-plugin：不支持 ES6 压缩 (Webpack4 以前)
      terser-webpack-plugin: 支持压缩 ES6 (Webpack4)
      webpack-parallel-uglify-plugin: 多进程执行代码压缩，提升构建速度
      mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)
      serviceworker-webpack-plugin：为网页应用增加离线缓存功能
      clean-webpack-plugin: 目录清理
      ModuleConcatenationPlugin: 开启 Scope Hoisting
      speed-measure-webpack-plugin: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)
      webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)

# 2.那你再说一说 Loader 和 Plugin 的区别？

Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。

因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。

Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。

Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

如果把 webpack 打包构建的流程比作一条生产线，那么插件就像是插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。
webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 webpack 通过 Tapable 来组织这条复杂的生产线。 webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

# 3.Webpack 构建流程简单说一下

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

      初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
      开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
      确定入口：根据配置中的 entry 找出所有的入口文件
      编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
      完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
      输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
      输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。
简单说

    初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
    编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
    输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

# 4.使用 webpack 开发时，你用过哪些可以提高效率的插件？

      webpack-dashboard：可以更友好的展示相关打包信息。
      webpack-merge：提取公共配置，减少重复配置代码
      speed-measure-webpack-plugin：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。
      size-plugin：监控资源体积变化，尽早发现问题
      HotModuleReplacementPlugin：模块热替换

# 5.source map 是什么？生产环境怎么用？

source map 是将编译、打包、压缩后的代码映射回源代码的过程。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 soucre map。

map 文件只要不打开开发者工具，浏览器是不会加载的。

线上环境一般有三种处理方案：

    hidden-source-map：借助第三方错误监控平台 Sentry 使用
    nosources-source-map：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
    sourcemap：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

注意：避免在生产中使用 inline- 和 eval-，因为它们会增加 bundle 体积大小，并降低整体性能。

# 6.模块打包原理知道吗？

Webpack 实际上为每个模块创造了一个可以导出和导入的环境，本质上并没有修改 代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致。

1、需要读到入口文件里面的内容。

2、分析入口文件，递归的去读取模块所依赖的文件内容，生成 AST 语法树。

3、根据 AST 语法树，生成浏览器能够运行的代码

1、获取主模块内容分析模块

      安装@babel/parser 包（转 AST）

2、对模块内容进行处理

      安装@babel/traverse 包（遍历 AST 收集依赖）安装@babel/core 和@babel/preset-env 包 （es6 转 ES5）

3、递归所有模块生成最终代码

# 7.文件监听原理呢？

在发现源码发生变化时，自动重新构建出新的输出文件。
Webpack 开启监听模式，有两种方式：

    启动 webpack 命令时，带上 --watch 参数
    在配置 webpack.config.js 中设置 watch:true

缺点：每次需要手动刷新浏览器
原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout 后再执行。

```js
module.export = {
  // 默认false,也就是不开启
  watch: true, // 只有开启监听模式时，watchOptions才有意义
  watchOptions: {
    // 默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored: /node_modules/, // 监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout: 300, // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
    poll: 1000,
  },
};
```

# 8.说一下 Webpack 的热更新原理吧

(敲黑板，这道题必考)
Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR 的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该 chunk 的增量更新。

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 HotModulePlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像 react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR。

# 9.如何对 bundle 体积进行监控和分析？

VSCode 中有一个插件 Import Cost 可以帮助我们对引入模块的大小进行实时监测，还可以使用 webpack-bundle-analyzer 生成 bundle 的模块组成图，显示所占体积。
bundlesize 工具包可以进行自动化资源体积监控。

# 10.文件指纹是什么？怎么用？

文件指纹是打包后输出的文件名的后缀。

Hash：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
Chunkhash：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
Contenthash：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

JS 的文件指纹设置
设置 output 的 filename，用 chunkhash。

```js
module.exports = {
  entry: { app: "./scr/app.js", search: "./src/search.js" },
  output: { filename: "[name][chunkhash:8].js", path: __dirname + "/dist" },
};
```

CSS 的文件指纹设置
设置 MiniCssExtractPlugin 的 filename，使用 contenthash。

```js
module.exports = {
  entry: { app: "./scr/app.js", search: "./src/search.js" },
  output: { filename: "[name][chunkhash:8].js", path: __dirname + "/dist" },
  plugins: [
    new MiniCssExtractPlugin({ filename: `[name][contenthash:8].css` }),
  ],
};
```

图片的文件指纹设置
设置 file-loader 的 name，使用 hash。
占位符名称及含义

      ext
      资源后缀名name
      文件名称path
      文件的相对路径folder
      文件所在的文件夹contenthash
      文件的内容hash，默认是md5生成hash
      文件内容的hash，默认是md5生成emoji
      一个随机的指代文件内容的emoj

```js
const path = require("path");
module.exports = {
  entry: "./src/index.js",
  output: { filename: "bundle.js", path: path.resolve(__dirname, "dist") },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: { name: "img/[name][hash:8].[ext]" },
          },
        ],
      },
    ],
  },
};
```

# 11.在实际工程中，配置文件上百行乃是常事，如何保证各个 loader 按照预想方式工作？

可以使用 enforce 强制执行 loader 的作用顺序，pre 代表在所有正常 loader 之前执行，post 是所有 loader 之后执行。(inline 官方不推荐使用)

# 12.如何优化 Webpack 的构建速度？

      使用高版本的 Webpack 和 Node.js
      多进程/多实例构建：HappyPack(不维护了)、thread-loader
      压缩代码

      多进程并行压缩

      webpack-paralle-uglify-pluginuglifyjs-webpack-plugin 开启 parallel 参数 (不支持 ES6)terser-webpack-plugin 开启 parallel 参数
      通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。
      图片压缩

      使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)配置 image-webpack-loader
      缩小打包作用域：

      exclude/include (确定 loader 规则范围)resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)resolve.extensions 尽可能减少后缀尝试的可能性 noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)IgnorePlugin (完全排除模块)合理使用 alias
      提取页面公共资源：

      基础包分离：

      使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4 内置) ，替代了 CommonsChunkPlugin 插件

      DLL：

      使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。HashedModuleIdsPlugin 可以解决模块数字 id 问题
      充分利用缓存提升二次构建速度：

      babel-loader 开启缓存 terser-webpack-plugin 开启缓存使用 cache-loader 或者 hard-source-webpack-plugin
      Tree shaking

      打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的 bundle 中去掉(只能对 ES6 Modlue 生效) 开发中尽可能使用 ES6 Module 的模块，提高 tree shaking 效率禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking 使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码

      purgecss-webpack-plugin 和 mini-css-extract-plugin 配合使用(建议)

      Scope hoisting

      构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突必须是 ES6 的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法
      动态 Polyfill

      建议采用 polyfill-service 只给用户返回需要的 polyfill，社区维护。 (部分国内奇葩浏览器 UA 可能无法识别，但可以降级返回所需全部 polyfill)

# 13.你刚才也提到了代码分割，那代码分割的本质是什么？有什么意义呢？

代码分割的本质其实就是在源代码直接上线和打包成唯一脚本 main.bundle.js 这两种极端方案之间的一种更适合实际场景的中间状态。

「用可接受的服务器性能压力增加来换取更好的用户体验。」
源代码直接上线：虽然过程可控，但是 http 请求多，性能开销大。
打包成唯一脚本：一把梭完自己爽，服务器压力小，但是页面空白期长，用户体验不好。
(Easy peezy right)

# 14.是否写过 Loader？简单描述一下编写 loader 的思路？

Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情。
Loader 的 API 可以去官网查阅

Loader 运行在 Node.js 中，我们可以调用任意 Node.js 自带的 API 或者安装第三方模块进行调用 Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下 Loader 处理二进制文件时，需要通过 exports.raw = true 告诉 Webpack 该 Loader 是否需要二进制数据尽可能的异步化 Loader，如果计算量很小，同步也可以 Loader 是无状态的，我们不应该在 Loader 中保留状态使用 loader-utils 和 schema-utils 为我们提供的实用工具加载本地 Loader 方法

Npm linkResolveLoader

# 15.是否写过 Plugin？简单描述一下编写 Plugin 的思路？

webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在特定的阶段钩入想要添加的自定义功能。Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好。
Plugin 的 API 可以去官网查阅

compiler 暴露了和 Webpack 整个生命周期相关的钩子 compilation 暴露了与模块和依赖有关的粒度更小的事件钩子插件需要在其原型上绑定 apply 方法，才能访问 compiler 实例传给每个插件的 compiler 和 compilation 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件找出合适的事件点去完成想要的功能

emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)watch-run 当依赖的文件发生变化时会触发
异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

# 16.聊一聊 Babel 原理吧

大多数 JavaScript Parser 遵循 estree 规范，Babel 最初基于 acorn 项目(轻量级现代 JavaScript 解析器)
Babel 大概分为三大部分：

      解析：将代码转换成 AST

      词法分析：将代码(字符串)分割为 token 流，即语法单元成的数组语法分析：分析 token 流(上面生成的数组)并生成 AST
      转换：访问 AST 的节点进行变换操作生产新的 AST

      Taro 就是利用 babel 完成的小程序语法转换
      生成：以新的 AST 为基础生成代码

# webpack 优化

## 1 合理的配置 mode 参数与 devtool 参数

mode 可设置 development production 两个参数
如果没有设置，webpack4 会将 mode 的默认值设置为 production
production 模式下会进行 tree shaking(去除无用代码)和 uglifyjs(代码压缩混淆)

## 2 缩小文件的搜索范围(配置 include exclude alias noParse extensions)

    alias: 当我们代码中出现 import 'vue'时， webpack会采用向上递归搜索的方式去node_modules 目录下找。为了减少搜索范围我们可以直接告诉webpack去哪个路径下查找。也就是别名(alias)的配置。
    include exclude 同样配置include exclude也可以减少webpack loader的搜索转换时间。
    noParse  当我们代码中使用到import jq from 'jquery'时，webpack会去解析jq这个库是否有依赖其他的包。但是我们对类似jquery这类依赖库，一般会认为不会引用其他的包(特殊除外,自行判断)。增加noParse属性,告诉webpack不必解析，以此增加打包速度。
    extensions webpack会根据extensions定义的后缀查找文件(频率较高的文件类型优先写在前面)

## 3 使用 HappyPack 开启多进程 Loader 转换

在 webpack 构建过程中，实际上耗费时间大多数用在 loader 解析转换以及代码的压缩中。日常开发中我们需要使用 Loader 对 js，css，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大。由于 js 单线程的特性使得这些转换操作不能并发处理文件，而是需要一个个文件进行处理。HappyPack 的基本原理是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间

## 4 使用 webpack-parallel-uglify-plugin 增强代码压缩

上面对于 loader 转换已经做优化，那么下面还有另一个难点就是优化代码的压缩时间。

## 5 抽离第三方模块

对于开发项目中不经常会变更的静态依赖文件。类似于我们的 elementUi、vue 全家桶等等。因为很少会变更，所以我们不希望这些依赖要被集成到每一次的构建逻辑中去。 这样做的好处是每次更改我本地代码的文件的时候，webpack 只需要打包我项目本身的文件代码，而不会再去编译第三方库。以后只要我们不升级第三方包的时候，那么 webpack 就不会对这些库去打包，这样可以快速的提高打包的速度。

这里我们使用 webpack 内置的 DllPlugin DllReferencePlugin 进行抽离
在与 webpack 配置文件同级目录下新建 webpack.dll.config.js 代码如下

```js
// webpack.dll.config.js
const path = require("path");
const webpack = require("webpack");
module.exports = {
  // 你想要打包的模块的数组
  entry: {
    vendor: ["vue", "element-ui"],
  },
  output: {
    path: path.resolve(__dirname, "static/js"), // 打包后文件输出的位置
    filename: "[name].dll.js",
    library: "[name]_library",
    // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, "[name]-manifest.json"),
      name: "[name]_library",
      context: __dirname,
    }),
  ],
};
```

在 package.json 中配置如下命令

```js
"dll": "webpack --config build/webpack.dll.config.js"

```

接下来在我们的 webpack.config.js 中增加以下代码

```js
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./vendor-manifest.json"),
    }),
    new CopyWebpackPlugin([
      // 拷贝生成的文件到dist目录 这样每次不必手动去cv
      { from: "static", to: "static" },
    ]),
  ],
};
```

执行

npm run dll
会发现生成了我们需要的集合第三地方 代码的 vendor.dll.js 我们需要在 html 文件中手动引入这个 js 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>老yuan</title>
    <script src="static/js/vendor.dll.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

这样如果我们没有更新第三方依赖包，就不必 npm run dll。直接执行 npm run dev npm run build 的时候会发现我们的打包速度明显有所提升。因为我们已经通过 dllPlugin 将第三方依赖包抽离出来了。

## 6 配置缓存

我们每次执行构建都会把所有的文件都重复编译一遍，这样的重复工作是否可以被缓存下来呢，答案是可以的，目前大部分 loader 都提供了 cache 配置项。比如在 babel-loader 中，可以通过设置 cacheDirectory 来开启缓存，babel-loader?cacheDirectory=true 就会将每次的编译结果写进硬盘文件（默认是在项目根目录下的 node_modules/.cache/babel-loader 目录内，当然你也可以自定义）

但如果 loader 不支持缓存呢？我们也有方法,我们可以通过 cache-loader ，它所做的事情很简单，就是 babel-loader 开启 cache 后做的事情，将 loader 的编译结果写入硬盘缓存。再次构建会先比较一下，如果文件较之前的没有发生变化则会直接使用缓存。使用方法如官方 demo 所示，在一些性能开销较大的 loader 之前添加此 loader 即可

npm i -D cache-loader

## 7 优化打包文件体积

## 引入 webpack-bundle-analyzer 分析打包后的文件

webpack-bundle-analyzer 将打包后的内容束展示为方便交互的直观树状图，让我们知道我们所构建包中真正引入的内容

## externals

按照官方文档的解释，如果我们想引用一个库，但是又不想让 webpack 打包，并且又不影响我们在程序中以 CMD、AMD 或者 window/global 全局等方式进行使用，那就可以通过配置 Externals。这个功能主要是用在创建一个库的时候用的，但是也可以在我们项目开发中充分使用
Externals 的方式，我们将这些不需要打包的静态资源从构建逻辑中剔除出去，而使用 CDN
的方式，去引用它们。

```js
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>;

module.exports = {
  //...
  externals: {
    jquery: "jQuery",
  },
};

import $ from "jquery";
$(".my-element").animate(/* ... */);
```

## Tree-shaking

这里单独提一下 tree-shaking,是因为这里有个坑。tree-shaking 的主要作用是用来清除代码中无用的部分。目前在 webpack4 我们设置 mode 为 production 的时候已经自动开启了 tree-shaking。但是要想使其生效，生成的代码必须是 ES6 模块。不能使用其它类型的模块如 CommonJS 之流。如果使用 Babel 的话，这里有一个小问题，因为 Babel 的预案（preset）默认会将任何模块类型都转译成 CommonJS 类型，这样会导致 tree-shaking 失效。修正这个问题也很简单，在.babelrc 文件或在 webpack.config.js 文件中设置 modules： false 就好了

# 手写 loader

loader 从本质上来说其实就是一个 node 模块。相当于一台榨汁机(loader)将相关类型的文件代码(code)给它。根据我们设置的规则，经过它的一系列加工后还给我们加工好的果汁(code)。

loader 编写原则

    单一原则: 每个 Loader 只做一件事；
    链式调用: Webpack 会按顺序链式调用每个 Loader；
    统一原则: 遵循 Webpack 制定的设计规则和结构，输入与输出均为字符串，各个 Loader 完全独立，即插即用；

在日常开发环境中，为了方便调试我们往往会加入许多 console 打印。但是我们不希望在生产环境中存在打印的值。那么这里我们自己实现一个 loader 去除代码中的 console

    知识点普及之AST。AST通俗的来说，假设我们有一个文件a.js,我们对a.js里面的1000行进行一些操作处理,比如为所有的await 增加try catch,以及其他操作，但是a.js里面的代码本质上来说就是一堆字符串。那我们怎么办呢，那就是转换为带标记信息的对象(抽象语法树)我们方便进行增删改查。这个带标记的对象(抽象语法树)就是AST。这里推荐一篇不错的AST文章 https://segmentfault.com/a/1190000016231512

npm i -D @babel/parser @babel/traverse @babel/generator @babel/types
@babel/parser 将源代码解析成 AST
@babel/traverse 对 AST 节点进行递归遍历，生成一个便于操作、转换的 path 对象
@babel/generator 将 AST 解码生成 js 代码
@babel/types 通过该模块对具体的 AST 节点进行进行增、删、改、查
新建 drop-console.js

```js
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
module.exports = function (source) {
  const ast = parser.parse(source, { sourceType: "module" });
  traverse(ast, {
    CallExpression(path) {
      if (
        t.isMemberExpression(path.node.callee) &&
        t.isIdentifier(path.node.callee.object, { name: "console" })
      ) {
        path.remove();
      }
    },
  });
  const output = generator(ast, {}, source);
  return output.code;
};
```

如何使用

```js
const path = require("path");
module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "index.js"),
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: path.resolve(__dirname, "drop-console.js"),
      },
    ],
  },
};
```

实际上在 webpack4 中已经集成了去除 console 功能，在 minimizer 中可配置 去除 console
使用 loader-utils，schema-utils
loader-utils, schema-utils 是 webpack 的 loader 工具库，有很多便捷的方法可以调用。

# 2 手写 webpack plugin

在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。通俗来说：一盘美味的 盐豆炒鸡蛋 需要经历烧油 炒制 调味到最后的装盘等过程，而 plugin 相当于可以监控每个环节并进行操作，比如可以写一个少放胡椒粉 plugin,监控 webpack 暴露出的生命周期事件(调味)，在调味的时候执行少放胡椒粉操作。那么它与 loader 的区别是什么呢？上面我们也提到了 loader 的单一原则,loader 只能一件事，比如说 less-loader,只能解析 less 文件，plugin 则是针对整个流程执行广泛的任务。

一个基本的 plugin 插件结构如下

```js
class firstPlugin {
  constructor (options) {
    console.log('firstPlugin options', options)
  }
  apply (compiler) {
    compiler.plugin('done', compilation => {
      console.log('firstPlugin')
    ))
  }
}

module.exports = firstPlugin

```

compiler 、compilation 是什么？

compiler 对象包含了 Webpack 环境所有的的配置信息。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

compiler 和 compilation 的区别在于

    compiler代表了整个webpack从启动到关闭的生命周期，而compilation 只是代表了一次新的编译过程


    compiler和compilation暴露出许多钩子，我们可以根据实际需求的场景进行自定义处理

下面我们手动开发一个简单的需求,在生成打包文件之前自动生成一个关于打包出文件的大小信息

新建一个 webpack-firstPlugin.js

```js
class firstPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      let str = "";
      for (let filename in compilation.assets) {
        str += `文件:${filename}  大小${compilation.assets[filename][
          "size"
        ]()}\n`;
      }
      // 通过compilation.assets可以获取打包后静态资源信息，同样也可以写入资源
      compilation.assets["fileSize.md"] = {
        source: function () {
          return str;
        },
        size: function () {
          return str.length;
        },
      };
      callback();
    });
  }
}
module.exports = firstPlugin;
```

如何使用

```js
const path = require("path");
const firstPlugin = require("webpack-firstPlugin.js");
module.exports = {
  // 省略其他代码
  plugins: [new firstPlugin()],
};
```

执行 npm run build 即可看到在 dist 文件夹中生成了一个包含打包文件信息的 fileSize.md

上面两个 loader 与 plugin 案例只是一个引导，实际开发需求中的 loader 与 plugin 要考虑的方面很多，建议大家自己多动手尝试一下。

# webpack5 优化

      使用持久化缓存提高构建性能；
      使用更好的算法和默认值改进长期缓存（long-term caching）；
      清理内部结构而不引入任何破坏性的变化；
      引入一些breaking changes，以便尽可能长的使用v5版本。

# chunk、bundle 与 moudle

module、chunk、bundle 这三个都可以理解为文件，区别在于：我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的是 bundle。也可以这样理解，module，chunk 和 bundle 其实就是同一份逻辑代码在不同转换场景下的三个名字。

# compiler、complication

compiler
可以理解为 webpack 编译的调度中心，是一个编译器实例，在 compiler 对象中记录了完整的 webpack 环境信息，在 webpack 的每个进程中，compiler 只会生成一次。（举例，npm run dev 一次只有一个 compiler)
complication
是 compiler 的生命周期内一个核心对象，它包含了一次构建过程中所有的数据(modules、chunks、assets)。也就是说一次构建过程对应一个 complication 实例。（举例，比如热更新的时候，webpack 会监听本地文件改变然后重新生成一个 complication）

# compiler 几个重要的钩子：

    make🛠：在钩子的回调中有开始读取 webpack 配置文件的逻辑
    emit🏹：在钩子的回调中执行生成文件（也就是 bundle）的逻辑
    done🔚：文件已写入文件系统后触发这个钩子
