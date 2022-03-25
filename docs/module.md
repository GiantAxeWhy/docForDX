# 模块化

# 概述

历史上，JavaScript 一直没有模块（module）体系，无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。其他语言都有这项功能，比如 Ruby 的 require、Python 的 import，甚至就连 CSS 都有@import，但是 JavaScript 任何这方面的支持都没有，这对开发大型的、复杂的项目形成了巨大障碍。

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```js
// CommonJS 模块
let { stat, exists, readfile } = require('fs');

// 等同于
let \_fs = require('fs');
let stat = \_fs.stat;
let exists = \_fs.exists;
let readfile = \_fs.readfile;
```

上面代码的实质是整体加载 fs 模块（即加载 fs 的所有方法），生成一个对象（\_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入。

// ES6 模块
import { stat, exists, readFile } from 'fs';

上面代码的实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

除了静态加载带来的各种好处，ES6 模块还有以下好处。

不再需要 UMD 模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。
将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者 navigator 对象的属性。
不再需要对象作为命名空间（比如 Math 对象），未来这些功能可以通过模块提供。

# ES6 模块与 CommonJS 模块的差异

讨论 Node.js 加载 ES6 模块之前，必须了解 ES6 模块与 CommonJS 模块完全不同。

它们有三个重大差异。

      CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
      CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
      CommonJS 模块的 require()是同步加载模块，ES6 模块的 import 命令是异步加载，有一个独立的模块依赖的解析阶段。
      第二个差异是因为 CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

下面重点解释第一个差异。

CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个模块文件 lib.js 的例子。

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量 counter 和改写这个变量的内部方法 incCounter。然后，在 main.js 里面加载这个模块。

```js
// main.js
var mod = require("./lib");

console.log(mod.counter); // 3
mod.incCounter();
console.log(mod.counter); // 3
```

上面代码说明，lib.js 模块加载以后，它的内部变化就影响不到输出的 mod.counter 了。这是因为 mod.counter 是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter;
  },
  incCounter: incCounter,
};
```

上面代码中，输出的 counter 属性实际上是一个取值器函数。现在再执行 main.js，就可以正确读取内部变量 counter 的变动了。

$ node main.js
3
4

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的 import 有点像 Unix 系统的“符号连接”，原始值变了，import 加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from "./lib";
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

# ES6 模块的循环加载 § ⇧

ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用 import 从一个模块加载变量（即 import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

请看下面这个例子。

```js
// a.mjs
import { bar } from "./b";
console.log("a.mjs");
console.log(bar);
export let foo = "foo";

// b.mjs
import { foo } from "./a";
console.log("b.mjs");
console.log(foo);
export let bar = "bar";
```

上面代码中，a.mjs 加载 b.mjs，b.mjs 又加载 a.mjs，构成循环加载。执行 a.mjs，结果如下。

```js
$ node --experimental-modules a.mjs
```

b.mjs

```js
ReferenceError: foo is not defined
```

上面代码中，执行 a.mjs 以后会报错，foo 变量未定义，这是为什么？

让我们一行行来看，ES6 循环加载是怎么处理的。首先，执行 a.mjs 以后，引擎发现它加载了 b.mjs，因此会优先执行 b.mjs，然后再执行 a.mjs。接着，执行 b.mjs 的时候，已知它从 a.mjs 输入了 foo 接口，这时不会去执行 a.mjs，而是认为这个接口已经存在了，继续往下执行。执行到第三行 console.log(foo)的时候，才发现这个接口根本没定义，因此报错。

解决这个问题的方法，就是让 b.mjs 运行的时候，foo 已经有定义了。这可以通过将 foo 写成函数来解决。

```js
// a.mjs
import { bar } from "./b";
console.log("a.mjs");
console.log(bar());
function foo() {
  return "foo";
}
export { foo };

// b.mjs
import { foo } from "./a";
console.log("b.mjs");
console.log(foo());
function bar() {
  return "bar";
}
export { bar };
```

这时再执行 a.mjs 就可以得到预期结果。

```js
$ node --experimental-modules a.mjs
b.mjs
foo
a.mjs
bar
```

这是因为函数具有提升作用，在执行 import {bar} from './b'时，函数 foo 就已经有定义了，所以 b.mjs 加载的时候不会报错。这也意味着，如果把函数 foo 改写成函数表达式，也会报错。

```js
// a.mjs
import { bar } from "./b";
console.log("a.mjs");
console.log(bar());
const foo = () => "foo";
export { foo };
```

上面代码的第四行，改成了函数表达式，就不具有提升作用，执行就会报错。

我们再来看 ES6 模块加载器 SystemJS 给出的一个例子。

```js
// even.js
import { odd } from "./odd";
export var counter = 0;
export function even(n) {
  counter++;
  return n === 0 || odd(n - 1);
}

// odd.js
import { even } from "./even";
export function odd(n) {
  return n !== 0 && even(n - 1);
}
```

上面代码中，even.js 里面的函数 even 有一个参数 n，只要不等于 0，就会减去 1，传入加载的 odd()。odd.js 也会做类似操作。

运行上面这段代码，结果如下。

```js
$ babel-node
> import * as m from './even.js';
> m.even(10);
true
> m.counter
6
> m.even(20)
true
> m.counter
17
```

上面代码中，参数 n 从 10 变为 0 的过程中，even()一共会执行 6 次，所以变量 counter 等于 6。第二次调用 even()时，参数 n 从 20 变为 0，even()一共会执行 11 次，加上前面的 6 次，所以变量 counter 等于 17。

这个例子要是改写成 CommonJS，就根本无法执行，会报错。

```js
// even.js
var odd = require("./odd");
var counter = 0;
exports.counter = counter;
exports.even = function (n) {
  counter++;
  return n == 0 || odd(n - 1);
};

// odd.js
var even = require("./even").even;
module.exports = function (n) {
  return n != 0 && even(n - 1);
};
```

上面代码中，even.js 加载 odd.js，而 odd.js 又去加载 even.js，形成“循环加载”。这时，执行引擎就会输出 even.js 已经执行的部分（不存在任何结果），所以在 odd.js 之中，变量 even 等于 undefined，等到后面调用 even(n - 1)就会报错。

```js
$ node
> var m = require('./even');
> m.even(10)
TypeError: even is not a function
```

## 1.什么是模块?

1、将一个复杂的程序依据一定的规则(规范)封装成几个块(文件), 并进行组合在一起
2、块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信

## 2、模块化的进程

### 全局 function 模式 : 将不同的功能封装成不同的全局函数

编码: 将不同的功能封装成不同的全局函数
问题: 污染全局命名空间, 容易引起命名冲突或数据不安全，而且模块成员之间看不出直接关系

### namespace 模式 : 简单对象封装

作用: 减少了全局变量，解决命名冲突
问题: 数据不安全(外部可以直接修改模块内部的数据)

```js
let myModule = {
  data: "www.baidu.com",
  foo() {
    console.log(`foo() ${this.data}`);
  },
  bar() {
    console.log(`bar() ${this.data}`);
  },
};
myModule.data = "other data"; //能直接修改模块内部的数据
myModule.foo(); // foo() other data
```

### IIFE 模式：匿名函数自调用(闭包)

作用: 数据是私有的, 外部只能通过暴露的方法操作
编码: 将数据和行为封装到一个函数内部, 通过给 window 添加属性来向外暴露接口
问题: 如果当前这个模块依赖另一个模块怎么办?

```js
// index.html文件
<script type="text/javascript" src="module.js"></script>
<script type="text/javascript">
    myModule.foo()
    myModule.bar()
    console.log(myModule.data) //undefined 不能访问模块内部数据
    myModule.data = 'xxxx' //不是修改的模块内部的data
    myModule.foo() //没有改变
</script>

```

```js
// module.js文件
(function (window) {
  let data = "www.baidu.com";
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`);
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`);
    otherFun(); //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log("otherFun()");
  }
  //暴露行为
  window.myModule = { foo, bar }; //ES6写法
})(window);
```

### IIFE 模式增强 : 引入依赖

现代模块实现的基石

```js
// module.js文件
(function (window, $) {
  let data = "www.baidu.com";
  //操作数据的函数
  function foo() {
    //用于暴露有函数
    console.log(`foo() ${data}`);
    $("body").css("background", "red");
  }
  function bar() {
    //用于暴露有函数
    console.log(`bar() ${data}`);
    otherFun(); //内部调用
  }
  function otherFun() {
    //内部私有的函数
    console.log("otherFun()");
  }
  //暴露行为
  window.myModule = { foo, bar };
})(window, jQuery);
```

```js
 // index.html文件
  <!-- 引入的js必须有一定顺序 -->
  <script type="text/javascript" src="jquery-1.10.1.js"></script>
  <script type="text/javascript" src="module.js"></script>
  <script type="text/javascript">
    myModule.foo()
  </script>

```

上例子通过 jquery 方法将页面的背景颜色改成红色，所以必须先引入 jQuery 库，就把这个库当作参数传入。这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显。

## 3. 模块化的好处

避免命名冲突(减少命名空间污染)
更好的分离, 按需加载
更高复用性
高可维护性

## 4、引入多个 script 后出现出现问题

请求过多

首先我们要依赖多个模块，那样就会发送多个请求，导致请求过多

依赖模糊

我们不知道他们的具体依赖关系是什么，也就是说很容易因为不了解他们之间的依赖关系导致加载先后顺序出错。

难以维护

以上两种原因就导致了很难维护，很可能出现牵一发而动全身的情况导致项目出现严重的问题。
模块化固然有多个好处，然而一个页面需要引入多个 js 文件，就会出现以上这些问题。而这些问题可以通过模块化规范来解决，下面介绍开发中最流行的 commonjs, AMD, ES6, CMD 规范。

## CommonJS

### (1)概述

Node 应用由模块组成，采用 CommonJS 模块规范。每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。

### (2)特点

1、所有代码都运行在模块作用域，不会污染全局作用域。
2、模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
3、模块加载的顺序，按照其在代码中出现的顺序。

### (3)基本语法

暴露模块：module.exports = value 或 exports.xxx = value
引入模块：require(xxx),如果是第三方模块，xxx 为模块名；如果是自定义模块，xxx 为模块文件路径
此处我们有个疑问：CommonJS 暴露的模块到底是什么? CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

```js
// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

上面代码通过 module.exports 输出变量 x 和函数 addX。

```js
var example = require("./example.js"); //如果参数字符串以“./”开头，则表示加载的是一个位于相对路径
console.log(example.x); // 5
console.log(example.addX(1)); // 6
```

require 命令用于加载模块文件。require 命令的基本功能是，读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错。

### (4)模块的加载机制

CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。这点与 ES6 模块化有重大差异（下文会介绍），请看下面这个例子：

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量 counter 和改写这个变量的内部方法 incCounter。

```js
// main.js
var counter = require("./lib").counter;
var incCounter = require("./lib").incCounter;

console.log(counter); // 3
incCounter();
console.log(counter); // 3
```

上面代码说明，counter 输出以后，lib.js 模块内部的变化就影响不到 counter 了。这是因为 counter 是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。

### (5)服务器端实现

① 下载安装 node.js
② 创建项目结构
注意：用 npm init 自动生成 package.json 时，package name(包名)不能有中文和大写
③ 下载第三方模块
npm install uniq --save // 用于数组去重
④ 定义模块代码

```js
//module1.js
module.exports = {
  msg: "module1",
  foo() {
    console.log(this.msg);
  },
};
//module2.js
module.exports = function () {
  console.log("module2");
};
//module3.js
exports.foo = function () {
  console.log("foo() module3");
};
exports.arr = [1, 2, 3, 3, 2];
// app.js文件
// 引入第三方库，应该放置在最前面
let uniq = require("uniq");
let module1 = require("./modules/module1");
let module2 = require("./modules/module2");
let module3 = require("./modules/module3");

module1.foo(); //module1
module2(); //module2
module3.foo(); //foo() module3
console.log(uniq(module3.arr)); //[ 1, 2, 3 ]
```

⑤ 通过 node 运行 app.js
命令行输入 node app.js，运行 JS 文件

(6)浏览器端实现(借助 Browserify)
① 创建项目结构
② 下载 browserify

全局: npm install browserify -g
局部: npm install browserify --save-dev

③ 定义模块代码(同服务器端)
注意：index.html 文件要运行在浏览器上，需要借助 browserify 将 app.js 文件打包编译，如果直接在 index.html 引入 app.js 就会报错！
④ 打包处理 js
根目录下运行 browserify js/src/app.js -o js/dist/bundle.js
⑤ 页面使用引入
在 index.html 文件中引入<script type="text/javascript" src="js/dist/bundle.js"></script>

## AMD

(1)AMD 规范基本语法
定义暴露模块:

```js

//定义没有依赖的模块
define(function(){
return 模块
})
//定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
return 模块
})
引入使用模块:

require(['module1', 'module2'], function(m1, m2){
使用 m1/m2
})
```

(2)未使用 AMD 规范与使用 require.js
通过比较两者的实现方法，来说明使用 AMD 规范的好处。

未使用 AMD 规范

```js
// dataService.js文件
(function (window) {
  let msg = "www.baidu.com";
  function getMsg() {
    return msg.toUpperCase();
  }
  window.dataService = { getMsg };
})(window);
// alerter.js文件
(function (window, dataService) {
  let name = "Tom";
  function showMsg() {
    alert(dataService.getMsg() + ", " + name);
  }
  window.alerter = { showMsg };
})(window, dataService);
// main.js文件
(function (alerter) {
  alerter.showMsg();
})(alerter);
// index.html文件
<div><h1>Modular Demo 1: 未使用AMD(require.js)</h1></div>
<script type="text/javascript" src="js/modules/dataService.js"></script>
<script type="text/javascript" src="js/modules/alerter.js"></script>
<script type="text/javascript" src="js/main.js"></script>

```

这种方式缺点很明显：首先会发送多个请求，其次引入的 js 文件顺序不能搞错，否则会报错！
使用 require.js

RequireJS 是一个工具库，主要用于客户端的模块管理。它的模块管理遵守 AMD 规范，RequireJS 的基本思想是，通过 define 方法，将代码定义为模块；通过 require 方法，实现代码的模块加载。
接下来介绍 AMD 规范在浏览器实现的步骤：
① 下载 require.js, 并引入
官网: http://www.requirejs.cn/
github : https://github.com/requirejs/requirejs
然后将 require.js 导入项目: js/libs/require.js
② 创建项目结构

```js
|-js
  |-libs
    |-require.js
  |-modules
    |-alerter.js
    |-dataService.js
  |-main.js
|-index.html
```

③ 定义 require.js 的模块代码

```js
// dataService.js文件
// 定义没有依赖的模块
define(function () {
  let msg = "www.baidu.com";
  function getMsg() {
    return msg.toUpperCase();
  }
  return { getMsg }; // 暴露模块
});
//alerter.js文件
// 定义有依赖的模块
define(["dataService"], function (dataService) {
  let name = "Tom";
  function showMsg() {
    alert(dataService.getMsg() + ", " + name);
  }
  // 暴露模块
  return { showMsg };
});
// main.js文件
(function () {
  require.config({
    baseUrl: "js/", //基本路径 出发点在根目录下
    paths: {
      //映射: 模块标识名: 路径
      alerter: "./modules/alerter", //此处不能写成alerter.js,会报错
      dataService: "./modules/dataService",
    },
  });
  require(["alerter"], function (alerter) {
    alerter.showMsg();
  });
})();
// index.html文件
<!DOCTYPE html>
<html>
  <head>
    <title>Modular Demo</title>
  </head>
  <body>
    <!-- 引入require.js并指定js主文件的入口 -->
    <script data-main="js/main" src="js/libs/require.js"></script>
  </body>
</html>

```

④ 页面引入 require.js 模块:
在 index.html 引入 <script data-main="js/main" src="js/libs/require.js"></script>

此外在项目中如何引入第三方库？只需在上面代码的基础稍作修改：

```js
// alerter.js文件
define(["dataService", "jquery"], function (dataService, $) {
  let name = "Tom";
  function showMsg() {
    alert(dataService.getMsg() + ", " + name);
  }
  $("body").css("background", "green");
  // 暴露模块
  return { showMsg };
});
// main.js文件
(function () {
  require.config({
    baseUrl: "js/", //基本路径 出发点在根目录下
    paths: {
      //自定义模块
      alerter: "./modules/alerter", //此处不能写成alerter.js,会报错
      dataService: "./modules/dataService",
      // 第三方库模块
      jquery: "./libs/jquery-1.10.1", //注意：写成jQuery会报错
    },
  });
  require(["alerter"], function (alerter) {
    alerter.showMsg();
  });
})();
```

上例是在 alerter.js 文件中引入 jQuery 第三方库，main.js 文件也要有相应的路径配置。
小结：通过两者的比较，可以得出 AMD 模块定义的方法非常清晰，不会污染全局环境，能够清楚地显示依赖关系。AMD 模式可以用于浏览器环境，并且允许非同步加载模块，也可以根据需要动态加载模块。

## CMD

CMD 规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。CMD 规范整合了 CommonJS 和 AMD 规范的特点。在 Sea.js 中，所有 JavaScript 模块都遵循 CMD 模块定义规范。
(1)CMD 规范基本语法
定义暴露模块：

```js
//定义没有依赖的模块
define(function (require, exports, module) {
  exports.xxx = value;
  module.exports = value;
});
//定义有依赖的模块
define(function (require, exports, module) {
  //引入依赖模块(同步)
  var module2 = require("./module2");
  //引入依赖模块(异步)
  require.async("./module3", function (m3) {});
  //暴露模块
  exports.xxx = value;
});
//引入使用模块：
define(function (require) {
  var m1 = require("./module1");
  var m4 = require("./module4");
  m1.show();
  m4.show();
});
```

(2)sea.js 简单使用教程
① 下载 sea.js, 并引入
官网: seajs.org/
github : github.com/seajs/seajs
然后将 sea.js 导入项目: js/libs/sea.js

② 创建项目结构
③ 定义 sea.js 的模块代码

```js
// module1.js文件
define(function (require, exports, module) {
  //内部变量数据
  var data = "atguigu.com";
  //内部函数
  function show() {
    console.log("module1 show() " + data);
  }
  //向外暴露
  exports.show = show;
});
// module2.js文件
define(function (require, exports, module) {
  module.exports = {
    msg: "I Will Back",
  };
});
// module3.js文件
define(function (require, exports, module) {
  const API_KEY = "abc123";
  exports.API_KEY = API_KEY;
});
// module4.js文件
define(function (require, exports, module) {
  //引入依赖模块(同步)
  var module2 = require("./module2");
  function show() {
    console.log("module4 show() " + module2.msg);
  }
  exports.show = show;
  //引入依赖模块(异步)
  require.async("./module3", function (m3) {
    console.log("异步引入依赖模块3  " + m3.API_KEY);
  });
});
// main.js文件
define(function (require) {
  var m1 = require("./module1");
  var m4 = require("./module4");
  m1.show();
  m4.show();
});
//④在index.html中引入
<script type="text/javascript" src="js/libs/sea.js"></script>
<script type="text/javascript">
  seajs.use('./js/modules/main')
</script>
```

4.ES6 模块化
ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。
(1)ES6 模块化语法
export 命令用于规定模块的对外接口，import 命令用于输入其他模块提供的功能。

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
  return a + b;
};
export { basicNum, add };
/** 引用模块 **/
import { basicNum, add } from "./math";
function test(ele) {
  ele.textContent = add(99 + basicNum);
}
```

如上例所示，使用 import 命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到 export default 命令，为模块指定默认输出。

```js
// export-default.js
export default function () {
  console.log("foo");
}
// import-default.js
import customName from "./export-default";
customName(); // 'foo'
```

模块默认输出, 其他模块加载该模块时，import 命令可以为该匿名函数指定任意名字。

(2)ES6 模块与 CommonJS 模块的差异
它们有两个重大差异：
① CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

② CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

第二个差异是因为 CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
下面重点解释第一个差异，我们还是举上面那个 CommonJS 模块的加载机制例子:

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}
// main.js
import { counter, incCounter } from "./lib";
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

ES6 模块的运行机制与 CommonJS 不一样。ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
(3) ES6-Babel-Browserify 使用教程
简单来说就一句话：使用 Babel 将 ES6 编译为 ES5 代码，使用 Browserify 编译打包 js。
① 定义 package.json 文件
{
"name" : "es6-babel-browserify",
"version" : "1.0.0"
}

② 安装 babel-cli, babel-preset-es2015 和 browserify

npm install babel-cli browserify -g
npm install babel-preset-es2015 --save-dev
preset 预设(将 es6 转换成 es5 的所有插件打包)

③ 定义.babelrc 文件
{
"presets": ["es2015"]
}
④ 定义模块代码

```js
//module1.js文件
// 分别暴露
export function foo() {
  console.log("foo() module1");
}
export function bar() {
  console.log("bar() module1");
}
//module2.js文件
// 统一暴露
function fun1() {
  console.log("fun1() module2");
}
function fun2() {
  console.log("fun2() module2");
}
export { fun1, fun2 };
//module3.js文件
// 默认暴露 可以暴露任意数据类项，暴露什么数据，接收到就是什么数据
export default () => {
  console.log("默认暴露");
};
// app.js文件
import { foo, bar } from "./module1";
import { fun1, fun2 } from "./module2";
import module3 from "./module3";
foo();
bar();
fun1();
fun2();
module3();
```

⑤ 编译并在 index.html 中引入

使用 Babel 将 ES6 编译为 ES5 代码(但包含 CommonJS 语法) : babel js/src -d js/lib
使用 Browserify 编译 js : browserify js/lib/app.js -o js/lib/bundle.js

然后在 index.html 文件中引入

 <script type="text/javascript" src="js/lib/bundle.js"></script>

此外第三方库(以 jQuery 为例)如何引入呢？ 首先安装依赖 npm install jquery@1 然后在 app.js 文件中引入

```js
//app.js文件
import { foo, bar } from "./module1";
import { fun1, fun2 } from "./module2";
import module3 from "./module3";
import $ from "jquery";

foo();
bar();
fun1();
fun2();
module3();
$("body").css("background", "green");
```

## 总结

1、CommonJS 规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了 AMD CMD 解决方案。

2、AMD 规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，AMD 规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅。

3、CMD 规范与 AMD 规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在 Node.js 中运行。不过，依赖 SPM 打包，模块的加载逻辑偏重

4、ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。
