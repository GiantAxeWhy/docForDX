# 36 道 JS 手写题

# 数据类型判断

```js
function typeOf(obj) {
  let res = Object.prototype.toString.call(obj).slice(8, -1);
  return res;
}
```

# 继承

### 原型链继承

```js
function Animal() {
  this.color = ["black", "white"];
}
Animal.prototype.getColor = function () {
  return this.color;
};
function Dog() {}

Dog.prototype = new Animal();
let dog1 = new Dog();
dog1.color.push("red");
let dog2 = new Dog();
console.log(dog2);
```

原型中包含的引用类型将于所有实例共享

子类在实例化时不能给父类构造函数传参

### 构造函数实现继承

```js
function Animal(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
}
function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = new Animal();
```

借用构造函数实现继承解决了原型链继承的 2 个问题：引用类型共享问题以及传参问题。但是由于方法必须定义在构造函数中，所以会导致每次创建子类实例都会创建一遍方法。

### 组合继承

使用原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性。可以把方法定义在原型上以实现重用，又让每个实例都有自己的属性

```js
function Animal(name) {
  this.name = name;
  this.color = ["black", "red"];
}
Animal.prototype.getName() = function () {
  return this.name;
};

function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}
Dog.prototype = new Animal();
Dog.prototype.contructor = Dog;
let dog1 = new Dog("奶昔", 2);
dog1.color.push("brown");
let dog2 = new Dog('石榴'，1);
console.log(dog2)
```

### 寄生式组合继承

组合继承的问题是调用了 2 次父类构造函数，第一次是在 new Animal(),第二次是 Animal.call()
解决方案不直接调用父类构造函数给子类原型赋值 通过创建空函数 F 获取父类原型

```js
function Animal(name) {
  this.name = name;
  this.color = ["blue", "red"];
}

Animal.prototype.getName = function () {
  return this.name;
};

function Dog(name, age) {
  Animal.call(this, name);
  this.age = age;
}

function F() {}
F.prototype = Animal.prototype;
let f = new F();
f.contructor = Dog;
Dog.prototype = f;
```

### class 继承

```js
class Animal {
  constructor(name){
    this.name = name
  }
  getName(){
    return this.name
  }
}
class Dog extend Animal{
  constructor(name,age){
      super(name)
      this.age = age
  }
}
```

# 实现一个 compose 函数

```js
// 用法如下:
function fn1(x) {
  return x + 1;
}
function fn2(x) {
  return x + 2;
}
function fn3(x) {
  return x + 3;
}
function fn4(x) {
  return x + 4;
}
const a = compose(fn1, fn2, fn3, fn4);
console.log(a(1)); // 1+4+3+2+1=11
//实现
function compose(...fn) {
  if (!fn.length) return (v) => v;
  if (fn.length === 1) return fn[0];
  return fn.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  );
}
```

# settimeout 模拟实现 setinterval(带清除定时器的版本)

题目描述:setinterval 用来实现循环定时调用 可能会存在一定的问题 能用 settimeout 解决吗

```js
function mySettimeout(fn, t) {
  let timer = null;
  function interval() {
    fn();
    timer = setTimeout(interval, t);
  }
  interval();
  return {
    cancel: () => {
      clearTimeout(timer);
    },
  };
}
// let a=mySettimeout(()=>{
//   console.log(111);
// },1000)
// let b=mySettimeout(() => {
//   console.log(222)
// }, 1000)
```

使用 setinterval 模拟实现 settimeout 吗？

```js
const mySetTimeout = (fn, time) => {
  const timer = setInterval(() => {
    clearInterval(timer);
    fn();
  }, time);
};
// mySetTimeout(()=>{
//   console.log(1);
// },1000)
```

# 数组去重

es5

```js
function unique(arr) {
  var res = arr.filter(function (item, index, array) {
    return array.indexOf(item) === index;
  });
  return res;
}

const testArr = [1, 2, 2, 3, 4, 4, 5, 5, 5, 6, 7];
testArr.reduce((acc, cur) => {
  if (!acc.includes(cur)) {
    acc.push(cur);
  }
  return acc;
}, []);
// [1, 2, 3, 4, 5, 6, 7]
```

es6

```js
var unique = (arr) => [...new Set(arr)];
```

# 数组扁平化

flat 的实现
递归

```js
function flatten(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i]){
      result = result.concat(flatten(arr[i]))
    }else{
      result.push(arr[i])
    }
  }
    return result;
}
```

es6

```js
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
```

统计数组有几层

```js
var arr = [1, 2, 3, [1, 5, 6, [7, 9, [11, 32]]], 10];
var a = 1;
function multiarr(arr) {
  for (i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      a++;
      arr = arr[i];
      multiarr(arr);
    }
  }
  return a;
}
console.log(multiarr(arr));
```

# 深浅拷贝

浅拷贝：只考虑对象类型。

```js
function shallowCopy(obj) {
  if (typeof obj !== "object") return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
```

简单版深拷贝：只考虑普通对象属性，不考虑内置对象和函数。

```js
function deepClone(obj) {
  if (typeof obj !== "object") return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
}
```

复杂版深拷贝 内置对象的处理 Date、RegExp 等对象和函数以及解决了循环引用的问题。
(map)
https://segmentfault.com/a/1190000020255831

```js
const isObject = (target) =>
  (typeof target === "object" || typeof target === "function") &&
  target !== null;

function deepClone(target, map = new WeakMap()) {
  if (map.get(target)) {
    return target;
  }
  // 获取当前值的构造函数：获取它的类型
  let constructor = target.constructor;
  // 检测当前对象target是否与正则、日期格式对象匹配
  if (/^(RegExp|Date)$/i.test(constructor.name)) {
    // 创建一个新的特殊对象(正则类/日期类)的实例
    return new constructor(target);
  }
  if (isObject(target)) {
    map.set(target, true); // 为循环引用的对象做标记
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

递归
对象分类型讨论
解决循环引用（环）

```js
class DeepClone {
  constructor() {
    this.cacheList = [];
  }
  clone(source) {
    if (source instanceof Object) {
      const cache = this.findCache(source);
      if (cache) return cache;
      // 如果找到缓存，直接返回
      else {
        let target;
        if (source instanceof Array) {
          target = new Array();
        } else if (source instanceof Function) {
          target = function () {
            return source.apply(this, arguments);
          };
        } else if (source instanceof Date) {
          target = new Date(source);
        } else if (source instanceof RegExp) {
          target = new RegExp(source.source, source.flags);
        }
        this.cacheList.push([source, target]); // 把源对象和新对象放进缓存列表
        for (let key in source) {
          if (source.hasOwnProperty(key)) {
            // 不拷贝原型上的属性，太浪费内存
            target[key] = this.clone(source[key]); // 递归克隆
          }
        }
        return target;
      }
    }
    return source;
  }
  findCache(source) {
    for (let i = 0; i < this.cacheList.length; ++i) {
      if (this.cacheList[i][0] === source) {
        return this.cacheList[i][1]; // 如果有环，返回对应的新对象
      }
    }
    return undefined;
  }
}
```

尤雨希版本

```js
function find(list, f) {
  return list.filter(f)[0];
}

function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, (c) => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy,
  });
  Object.keys(obj).forEach((key) => (copy[key] = deepCopy(obj[key], cache)));

  return copy;
}
```

# 模板引擎实现

```js
let template = "我是{{name}}，年龄{{age}}，性别{{sex}}";
let data = {
  name: "姓名",
  age: 18,
};
render(template, data); // 我是姓名，年龄18，性别undefined
```

```js
function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
  if (reg.test(template)) {
    // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}
```

# 事件总线（发布订阅）

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }
  // 实现订阅
  on(type, callBack) {
    if (!this.events[type]) {
      this.events[type] = [callBack];
    } else {
      this.events[type].push(callBack);
    }
  }
  // 删除订阅
  off(type, callBack) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter((item) => {
      return item !== callBack;
    });
  }
  // 只执行一次订阅事件
  once(type, callBack) {
    function fn() {
      callBack();
      this.off(type, fn);
    }
    this.on(type, fn);
  }
  // 触发事件
  emit(type, ...rest) {
    this.events[type] &&
      this.events[type].forEach((fn) => fn.apply(this, rest));
  }
}
// 使用如下
// const event = new EventEmitter();

// const handle = (...rest) => {
//   console.log(rest);
// };

// event.on("click", handle);

// event.emit("click", 1, 2, 3, 4);

// event.off("click", handle);

// event.emit("click", 1, 2);

// event.once("dbClick", () => {
//   console.log(123456);
// });
// event.emit("dbClick");
// event.emit("dbClick");
```

# 解析 URL 参数为对象

```js
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("="); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}
```

# 字符串模板

```js
function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
  if (reg.test(template)) {
    // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}
```

测试

```js
let template = "我是{{name}}，年龄{{age}}，性别{{sex}}";
let person = {
  name: "布兰",
  age: 12,
};
render(template, person); // 我是布兰，年龄12，性别undefined
```

# 图片懒加载

与普通的图片懒加载不同，如下这个多做了 2 个精心处理：

图片全部加载完成后移除事件监听；
加载完的图片，从 imgList 移除；

```js
let imgList = [...document.querySelectorAll("img")];
let length = imgList.length;

const imgLazyLoad = function () {
  let count = 0;
  // 修正错误，需要加上自执行

  return (function () {
    let deleteIndexList = [];
    imgList.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src;
        deleteIndexList.push(index);
        count++;
        if (count === length) {
          document.removeEventListener("scroll", imgLazyLoad);
        }
      }
    });
    imgList = imgList.filter((img, index) => !deleteIndexList.includes(index));
  })();
};

// 这里最好加上防抖处理
document.addEventListener("scroll", imgLazyLoad);
```

# 防抖

触发高频事件 N 秒后只会执行一次，如果 N 秒内事件再次触发，则会重新计时。

简单版：函数内部支持使用 this 和 event 对象；

```js
function debounce(func, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait);
  };
}
```

使用

```js
var node = document.getElementById("layout");
function getUserAction(e) {
  console.log(this, e); // 分别打印：node 这个节点 和 MouseEvent
  node.innerHTML = count++;
}
node.onmousemove = debounce(getUserAction, 1000);
```

最终版：除了支持 this 和 event 外，还支持以下功能：

支持立即执行；
函数可能有返回值；
支持取消功能；

```js
function debounce(func, wait, immediate) {
  var timeout, result;

  var debounced = function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
```

使用

```js
var setUseAction = debounce(getUserAction, 10000, true);
// 使用防抖
node.onmousemove = setUseAction;

// 取消防抖
setUseAction.cancel();
```

# 函数节流

触发高频事件，且 N 秒内只执行一次。

简单版：使用时间戳来实现，立即执行一次，然后每 N 秒执行一次。

```js
function throttle(func, wait) {
  var context, args;
  var previous = 0;

  return function () {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```

最终版：支持取消节流；另外通过传入第三个参数，options.leading 来表示是否可以立即执行一次，opitons.trailing 表示结束调用的时候是否还要执行一次，默认都是 true。
注意设置的时候不能同时将 leading 或 trailing 设置为 false。

```js
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };
  return throttled;
}
```

# 函数柯里化

什么叫函数柯里化？其实就是将使用多个参数的函数转换成一系列使用一个参数的函数的技术。还不懂？来举个例子。

```js
function curry(fn) {
  let judge = (...args) => {
    if (args.length == fn.length) return fn(...args);
    return (...arg) => judge(...args, ...arg);
  };
  return judge;
}

function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3);
let addCurry = curry(add);
addCurry(1)(2)(3);
```

高阶函数 实现 sum(2)(3)

```js
function add() {
  var args = [].slice.call(arguments);

  var fn = function () {
    var arg_fn = [].slice.call(arguments);
    return add.apply(null, args.concat(arg_fn));
  };

  fn.valueOf = function () {
    return args.reduce((a, b) => a + b);
  };
  return fn;
}
let s = add(1)(2)(3);
// function
console.log(typeof s);
// 6
console.log(Number(s));
```

# 偏函数

什么是偏函数？偏函数就是将一个 n 参的函数转换成固定 x 参的函数，剩余参数（n - x）将在下次调用全部传入。举个例子：

```js
function add(a, b, c) {
  return a + b + c;
}
let partialAdd = partial(add, 1);
partialAdd(2, 3);
```

发现没有，其实偏函数和函数柯里化有点像，所以根据函数柯里化的实现，能够能很快写出偏函数的实现：

```js
function partial(fn, ...args) {
  return (...arg) => {
    return fn(...args, ...arg);
  };
}
```

如上这个功能比较简单，现在我们希望偏函数能和柯里化一样能实现占位功能，比如：

```js
function clg(a, b, c) {
  console.log(a, b, c);
}
let partialClg = partial(clg, "_", 2);
partialClg(1, 3); // 依次打印：1, 2, 3
```

\_ 占的位其实就是 1 的位置。相当于：partial(clg, 1, 2)，然后 partialClg(3)。明白了原理，我们就来写实现：

```js
function partial(fn, ...args) {
    return (...arg) => {
        args[index] =
        return fn(...args, ...arg)
    }
}

```

# JSONP

JSONP 核心原理：script 标签不受同源策略约束，所以可以用来进行跨域请求，优点是兼容性好，但是只能用于 GET 请求；

```js
const jsonp = ({ url, params, callbackName }) => {
  const generateUrl = () => {
    let dataSrc = "";
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        dataSrc += `${key}=${params[key]}&`;
      }
    }
    dataSrc += `callback=${callbackName}`;
    return `${url}?${dataSrc}`;
  };
  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement("script");
    scriptEle.src = generateUrl();
    document.body.appendChild(scriptEle);
    window[callbackName] = (data) => {
      resolve(data);
      document.removeChild(scriptEle);
    };
  });
};
```

# AJAX

```js
const getJSON = function (url) {
  return new Promise((resolve, reject) => {
    const xhr = XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Mscrosoft.XMLHttp");
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.send();
  });
};
```

# 实现数组原型的方法

# 实现 map

map 方法接收一个回调函数，函数内接收三个参数，当前项、索引、原数组，返回一个新的数组，并且数组长度不变。 知道了这些特征之后，我们用 reduce 重塑 map 。

```js
const testArr = [1, 2, 3, 4];
Array.prototype.reduceMap = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    const item = callback(cur, index, array);
    acc.push(item);
    return acc;
  }, []);
};
testArr.reduceMap((item, index) => {
  return item + index;
});
// [1, 3, 5, 7]
```

在 Array  的原型链上添加 reduceMap  方法，接收一个回调函数 callback 作为参数（就是 map  传入的回调函数），内部通过 this  拿到当前需要操作的数组，这里 reduce  方法的第二个参数初始值很关键，需要设置成一个 [] ，这样便于后面把操作完的单项塞入 acc 。我们需要给 callback  方法传入三个值，当前项、索引、原数组，也就是原生 map  回调函数能拿到的值。返回 item  塞进 acc，并且返回 acc ，作为下一个循环的 acc（贪吃蛇原理）。最终 this.reduce  返回了新的数组，并且长度不变。

# forEach

forEach 接收一个回调函数作为参数，函数内接收四个参数当前项、索引、原函数、当执行回调函数 callback 时，用作 this 的值，并且不返回值

```js
const testArr = [1, 2, 3, 4];
Array.prototype.reduceForEach = function (callback) {
  this.reduce((acc, cur, index, array) => {
    callback(cur, index, array);
  }, []);
};

testArr.reduceForEach((item, index, array) => {
  console.log(item, index);
});
// 1234
// 0123
```

# filter

filter 同样接收一个回调函数，回调函数返回 true 则返回当前项，反之则不返回。回调函数接收的参数同 forEach 。

```js
const testArr = [1, 2, 3, 4];
Array.prototype.reduceFilter = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    if (callback(cur, index, array)) {
      acc.push(cur);
    }
    return acc;
  }, []);
};
testArr.reduceFilter((item) => item % 2 == 0); // 过滤出偶数项。
// [2, 4]
```

filter 方法中 callback 返回的是 Boolean 类型，所以通过 if 判断是否要塞入累计器 acc ，并且返回 acc 给下一次对比。最终返回整个过滤后的数组。

# find

find 方法中 callback 同样也是返回 Boolean 类型，返回你要找的第一个符合要求的项。

```js
const testArr = [1, 2, 3, 4];
const testObj = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
Array.prototype.reduceFind = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    if (callback(cur, index, array)) {
      if (acc instanceof Array && acc.length == 0) {
        acc = cur;
      }
    }
    // 循环到最后若 acc 还是数组，且长度为 0，代表没有找到想要的项，则 acc = undefined
    if (index == array.length - 1 && acc instanceof Array && acc.length == 0) {
      acc = undefined;
    }
    return acc;
  }, []);
};
testArr.reduceFind((item) => item % 2 == 0); // 2
testObj.reduceFind((item) => item.a % 2 == 0); // {a: 2}
testObj.reduceFind((item) => item.a % 9 == 0); // undefined
```

你不知道操作的数组是对象数组还是普通数组，所以这里只能直接覆盖 acc 的值，找到第一个符合判断标准的值就不再进行赋值操作。

# some

```js
O.length >>> 0 是什么操作？就是无符号右移 0 位，那有什么意义嘛？就是为了保证转换后的值为正整数。其实底层做了 2 层转换，第一是非 number 转成 number 类型，第二是将 number 转成 Uint32 类型。
Array.prototype.some2 = function (callback, thisArg) {
  if (this == null) {
    throw new TypeError("this is null or not defined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0;
  while (k < len) {
    if (k in O) {
      if (callback.call(thisArg, O[k], k, O)) {
        return true;
      }
    }
    k++;
  }
  return false;
};
```

# reduce

```js
Array.prototype.reduce2 = function (callback, initialValue) {
  if (this == null) {
    throw new TypeError("this is null or not defined");
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  const O = Object(this);
  const len = O.length >>> 0;
  let k = 0,
    acc;

  if (arguments.length > 1) {
    acc = initialValue;
  } else {
    // 没传入初始值的时候，取数组中第一个非 empty 的值为初始值
    while (k < len && !(k in O)) {
      k++;
    }
    if (k > len) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    acc = O[k++];
  }
  while (k < len) {
    if (k in O) {
      acc = callback(acc, O[k], k, O);
    }
    k++;
  }
  return acc;
};
```

# 实现函数原型

使用一个指定的 this 值和一个或多个参数来调用一个函数。

实现要点：

this 可能传入 null；
传入不固定个数的参数；
函数可能有返回值；

# call

```js
Function.prototype.call2 = function (context) {
  var context = context || window;
  context.fn =this;
  var args = []
  for(let i = 0;len = arguments.length; i < len; i++){
    args.push("arguments["+i+"]")
  }
  var result =eval('context.fn('+args+")")
    delete context.fn
    return result;
};
```

# apply

apply 和 call 一样，唯一的区别就是 call 是传入不固定个数的参数，而 apply 是传入一个数组。

实现要点：

this 可能传入 null；
传入一个数组；
函数可能有返回值；

```js
Function.prototype.apply2 = function (context, arr) {
  var context = context || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
  }

  delete context.fn;
  return result;
};
```

# bind

bind 方法会创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
实现要点：

bind() 除了 this 外，还可传入多个参数；
bing 创建的新函数可能传入多个参数；
新函数可能被当做构造函数调用；
函数可能有返回值；

```js
Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

# 使用 new 关键字

new 运算符用来创建用户自定义的对象类型的实例或者具有构造函数的内置对象的实例。
实现要点
new 会产生一个新对象；
新对象需要能够访问到构造函数的属性，所以需要重新指定它的原型；
构造函数可能会显示返回；

```js
function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);

  // ret || obj 这里这么写考虑了构造函数显示返回 null 的情况
  return typeof ret === "object" ? ret || obj : obj;
}

//使用
function person(name, age) {
  this.name = name;
  this.age = age;
}
let p = objectFactory(person, "布兰", 12);
console.log(p); // { name: '布兰', age: 12 }
```

# instanceof 实现

instanceof 就是判断构造函数的 prototype 属性是否出现在实例的原型链上。

```js
function instanceof(left, right) {
  let proto = left._proto_;
  while (true) {
    if (proto === null) return false;
    if (proto === right.prototype) {
      return true;
    }
    proto = proto._proto_;
  }
}
```

上面的 left.proto 这种写法可以换成 Object.getPrototypeOf(left)。

# 实现 Object.create

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的*proto*。

```js
Object.create2 = function (proto, propertyObject = undefined) {
  if (typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Object prototype may only be an Object or null.");
    if (propertyObject == null) {
      new TypeError("Cannot convert undefined or null to object");
    }
    function F() {}
    F.prototype = proto;
    const obj = new F();
    if (propertyObject != undefined) {
      Object.defineProperties(obj, propertyObject);
    }
    if (proto === null) {
      // 创建一个没有原型对象的对象，Object.create(null)
      obj.__proto__ = null;
    }
    return obj;
  }
};
```

# Object.assign

```js
Object.assign2 = function (target, ...source) {
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  let ret = Object(target);
  source.forEach(function (obj) {
    if (obj != null) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          ret[key] = obj[key];
        }
      }
    }
  });
  return ret;
};
```

# 实现 JSON.stringify

JSON.stringify([, replacer [, space]) 方法是将一个 JavaScript 值(对象或者数组)转换为一个 JSON 字符串。此处模拟实现，不考虑可选的第二个参数 replacer 和第三个参数 space，如果对这两个参数的作用还不了解，建议阅读 MDN 文档。

基本数据类型：

undefined 转换之后仍是 undefined(类型也是 undefined)
boolean 值转换之后是字符串 "false"/"true"
number 类型(除了 NaN 和 Infinity)转换之后是字符串类型的数值
symbol 转换之后是 undefined
null 转换之后是字符串 "null"
string 转换之后仍是 string
NaN 和 Infinity 转换之后是字符串 "null"

函数类型：转换之后是 undefined
如果是对象类型(非函数)

如果是一个数组：如果属性值中出现了 undefined、任意的函数以及 symbol，转换成字符串 "null" ；
如果是 RegExp 对象：返回 {} (类型是 string)；
如果是 Date 对象，返回 Date 的 toJSON 字符串值；
如果是普通对象；

如果有 toJSON() 方法，那么序列化 toJSON() 的返回值。
如果属性值中出现了 undefined、任意的函数以及 symbol 值，忽略。
所有以 symbol 为属性键的属性都会被完全忽略掉。

对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

```js
function jsonStringify(data) {
  let dataType = typeof data;

  if (dataType !== "object") {
    let result = data;
    //data 可能是 string/number/null/undefined/boolean
    if (Number.isNaN(data) || data === Infinity) {
      //NaN 和 Infinity 序列化返回 "null"
      result = "null";
    } else if (
      dataType === "function" ||
      dataType === "undefined" ||
      dataType === "symbol"
    ) {
      //function 、undefined 、symbol 序列化返回 undefined
      return undefined;
    } else if (dataType === "string") {
      result = '"' + data + '"';
    }
    //boolean 返回 String()
    return String(result);
  } else if (dataType === "object") {
    if (data === null) {
      return "null";
    } else if (data.toJSON && typeof data.toJSON === "function") {
      return jsonStringify(data.toJSON());
    } else if (data instanceof Array) {
      let result = [];
      //如果是数组
      //toJSON 方法可以存在于原型链中
      data.forEach((item, index) => {
        if (
          typeof item === "undefined" ||
          typeof item === "function" ||
          typeof item === "symbol"
        ) {
          result[index] = "null";
        } else {
          result[index] = jsonStringify(item);
        }
      });
      result = "[" + result + "]";
      return result.replace(/'/g, '"');
    } else {
      //普通对象
      /**
       * 循环引用抛错(暂未检测，循环引用时，堆栈溢出)
       * symbol key 忽略
       * undefined、函数、symbol 为属性值，被忽略
       */
      let result = [];
      Object.keys(data).forEach((item, index) => {
        if (typeof item !== "symbol") {
          //key 如果是symbol对象，忽略
          if (
            data[item] !== undefined &&
            typeof data[item] !== "function" &&
            typeof data[item] !== "symbol"
          ) {
            //键值如果是 undefined、函数、symbol 为属性值，忽略
            result.push('"' + item + '"' + ":" + jsonStringify(data[item]));
          }
        }
      });
      return ("{" + result + "}").replace(/'/g, '"');
    }
  }
}
```

# 实现 JSON.parse

介绍 2 种方法实现：

eval 实现；
new Function 实现；
eval 实现
第一种方式最简单，也最直观，就是直接调用 eval，代码如下：

```js
var json = '{"a":"1", "b":2}';
var obj = eval("(" + json + ")"); // obj 就是 json 反序列化之后得到的对象
```

但是直接调用 eval 会存在安全问题，如果数据中可能不是 json 数据，而是可执行的 JavaScript 代码，那很可能会造成 XSS 攻击。因此，在调用 eval 之前，需要对数据进行校验。

```js
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three =
  /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

if (
  rx_one.test(
    json.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, "")
  )
) {
  var obj = eval("(" + json + ")");
}
```

new Function 实现
Function 与 eval 有相同的字符串参数特性。

```js
var json = '{"name":"小姐姐", "age":20}';
var obj = new Function("return " + json)();
```

# 链式调用

```js
// 实现一个find函数，并且find函数能够满足下列条件

// title数据类型为string|null
// userId为主键，数据类型为number

// 原始数据
const data = [
  { userId: 8, title: "title1" },
  { userId: 11, title: "other" },
  { userId: 15, title: null },
  { userId: 19, title: "title2" },
];

// 查找data中，符合条件的数据，并进行排序
const result = find(data)
  .where({
    title: /\d$/,
  })
  .orderBy("userId", "desc");

// 输出
[
  { userId: 19, title: "title2" },
  { userId: 8, title: "title1" },
];
```

```js
function find(origin) {
  return {
    data: origin,
    where: function (searchObj) {
      const keys = Reflect.ownKeys(searchObj);

      for (let i = 0; i < keys.length; i++) {
        this.data = this.data.filter((item) =>
          searchObj[keys[i]].test(item[keys[i]])
        );
      }

      return find(this.data);
    },
    orderBy: function (key, sorter) {
      this.data.sort((a, b) => {
        return sorter === "desc" ? b[key] - a[key] : a[key] - b[key];
      });

      return this.data;
    },
  };
}
```

# 对象深度的比较

```js
// 已知有两个对象obj1和obj2，实现isEqual函数判断对象是否相等
const obj1 = {
  a: 1,
  c: 3,
  b: {
    c: [1, 2],
  },
};
const obj2 = {
  c: 4,
  b: {
    c: [1, 2],
  },
  a: 1,
};

// isEqual函数，相等输出true，不相等输出false
isEqual(obj1, obj2);
```

```js
// 答案仅供参考
// 更详细的解答建议参考Underscore源码[https://github.com/lessfish/underscore-analysis/blob/master/underscore-1.8.3.js/src/underscore-1.8.3.js#L1094-L1190](https://github.com/lessfish/underscore-analysis/blob/master/underscore-1.8.3.js/src/underscore-1.8.3.js#L1094-L1190)
function isEqual(A, B) {
  const keysA = Object.keys(A);
  const keysB = Object.keys(B);

  // 健长不一致的话就更谈不上相等了
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];

    // 类型不等的话直接就不相等了
    if (typeof A[key] !== typeof B[key]) return false;

    // 当都不是对象的时候直接判断值是否相等
    if (
      typeof A[key] !== "object" &&
      typeof B[key] !== "object" &&
      A[key] !== B[key]
    ) {
      return false;
    }

    if (Array.isArray(A[key]) && Array.isArray(B[key])) {
      if (!arrayEqual(A[key], B[key])) return false;
    }

    // 递归判断
    if (typeof A[key] === "object" && typeof B[key] === "object") {
      if (!isEqual(A[key], B[key])) return false;
    }
  }

  return true;
}

function arrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}
isEqual(obj1, obj2);
```

# 是否存在循环引用

```js
// 判断JS对象是否存在循环引用
const obj = {
  a: 1,
  b: 2,
};

obj.c = obj;

// isHasCircle函数， 存在环输出true，不存在的话输出false
isHasCircle(obj);
```

```js
function isHasCircle(obj) {
  let hasCircle = false;
  const map = new Map();

  function loop(obj) {
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      const value = obj[key];
      if (typeof value == "object" && value !== null) {
        if (map.has(value)) {
          hasCircle = true;
          return;
        } else {
          map.set(value);
          loop(value);
        }
      }
    });
  }

  loop(obj);

  return hasCircle;
}
```

# 实现 promise

实现 Promise 需要完全读懂 Promise A+ 规范，不过从总体的实现上看，有如下几个点需要考虑到：

1、then 需要支持链式调用，所以得返回一个新的 Promise；
2、处理异步问题，所以得先用 onResolvedCallbacks 和 onRejectedCallbacks 分别把成功和失败的回调存起来；
3、为了让链式调用正常进行下去，需要判断 onFulfilled 和 onRejected 的类型；
4、onFulfilled 和 onRejected 需要被异步调用，这里用 setTimeout 模拟异步；
5、处理 Promise 的 resolve；

```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        let resolve = (value) = > {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach((fn) = > fn());
            }
        };

        let reject = (reason) = > {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach((fn) = > fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        // 解决 onFufilled，onRejected 没有传值的问题
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) = > v;
        // 因为错误的值要让后面访问到，所以这里也要抛出错误，不然会在之后 then 的 resolve 中捕获
        onRejected = typeof onRejected === "function" ? onRejected : (err) = > {
            throw err;
        };
        // 每次调用 then 都返回一个新的 promise
        let promise2 = new Promise((resolve, reject) = > {
            if (this.status === FULFILLED) {
                //Promise/A+ 2.2.4 --- setTimeout
                setTimeout(() = > {
                    try {
                        let x = onFulfilled(this.value);
                        // x可能是一个proimise
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.status === REJECTED) {
                //Promise/A+ 2.2.3
                setTimeout(() = > {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() = > {
                    setTimeout(() = > {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });

                this.onRejectedCallbacks.push(() = > {
                    setTimeout(() = > {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });

        return promise2;
    }
}
const resolvePromise = (promise2, x, resolve, reject) = > {
    // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
    if (promise2 === x) {
        return reject(
            new TypeError("Chaining cycle detected for promise #<Promise>"));
    }
    // Promise/A+ 2.3.3.3.3 只能调用一次
    let called;
    // 后续的条件要严格判断 保证代码能和别的库一起使用
    if ((typeof x === "object" && x != null) || typeof x === "function") {
        try {
            // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
            let then = x.then;
            if (typeof then === "function") {
            // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
                then.call(
                    x, (y) = > {
                        // 根据 promise 的状态决定是成功还是失败
                        if (called) return;
                        called = true;
                        // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
                        resolvePromise(promise2, y, resolve, reject);
                    }, (r) = > {
                        // 只要失败就失败 Promise/A+ 2.3.3.3.2
                        if (called) return;
                        called = true;
                        reject(r);
                    });
            } else {
                // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
                resolve(x);
            }
        } catch (e) {
            // Promise/A+ 2.3.3.2
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4
        resolve(x);
    }
};

```

Promise 写完之后可以通过 promises-aplus-tests 这个包对我们写的代码进行测试，看是否符合 A+ 规范。不过测试前还得加一段代码：

```js
// promise.js
// 这里是上面写的 Promise 全部代码
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = Promise;
```

全局安装：

npm i promises-aplus-tests -g
复制代码
终端下执行验证命令：

promises-aplus-tests promise.js
复制代码
上面写的代码可以顺利通过全部 872 个测试用例。

# Promise.resolve

Promsie.resolve(value) 可以将任何值转成值为 value 状态是 fulfilled 的 Promise，但如果传入的值本身是 Promise 则会原样返回它。

```js
Promise.resolve = function (value) {
  // 如果是 Promsie，则直接输出它
  if (value instanceof Promise) {
    return value;
  }
  return new Promise((resolve) => resolve(value));
};
```

# Promise.reject

和 Promise.resolve() 类似，Promise.reject() 会实例化一个 rejected 状态的 Promise。但与 Promise.resolve() 不同的是，如果给 Promise.reject() 传递一个 Promise 对象，则这个对象会成为新 Promise 的值。

```js
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};
```

# Promise.all

Promise.all 的规则是这样的：

传入的所有 Promsie 都是 fulfilled，则返回由他们的值组成的，状态为 fulfilled 的新 Promise；
只要有一个 Promise 是 rejected，则返回 rejected 状态的新 Promsie，且它的值是第一个 rejected 的 Promise 的值；
只要有一个 Promise 是 pending，则返回一个 pending 状态的新 Promise；

```js
Promise.all = function (promiseArr) {
  let index = 0,
    result = [];
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          index++;
          result[i] = val;
          if (index === promiseArr.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};
```

# Promise.race

Promise.race 会返回一个由所有可迭代实例中第一个 fulfilled 或 rejected 的实例包装后的新实例。

```js
Promise.race = function (promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p) => {
      Promise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          rejecte(err);
        }
      );
    });
  });
};
```

# Promise.allSettled

Promise.allSettled 的规则是这样：

所有 Promise 的状态都变化了，那么新返回一个状态是 fulfilled 的 Promise，且它的值是一个数组，数组的每项由所有 Promise 的值和状态组成的对象；
如果有一个是 pending 的 Promise，则返回一个状态是 pending 的新实例；

```js
Promise.allSettled = function (promiseArr) {
  let result = [];

  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          result.push({
            status: "fulfilled",
            value: val,
          });
          if (result.length === promiseArr.length) {
            resolve(result);
          }
        },
        (err) => {
          result.push({
            status: "rejected",
            reason: err,
          });
          if (result.length === promiseArr.length) {
            resolve(result);
          }
        }
      );
    });
  });
};
```

# Promise.any

Promise.any 的规则是这样：

空数组或者所有 Promise 都是 rejected，则返回状态是 rejected 的新 Promsie，且值为 AggregateError 的错误；
只要有一个是 fulfilled 状态的，则返回第一个是 fulfilled 的新实例；
其他情况都会返回一个 pending 的新实例；

```js
Promise.any = function (promiseArr) {
  let index = 0;
  return new Promise((resolve, reject) => {
    if (promiseArr.length === 0) return;
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          index++;
          if (index === promiseArr.length) {
            reject(new AggregateError("All promises were rejected"));
          }
        }
      );
    });
  });
};
```

# 异步并发数限制

/\*\*

- 关键点
- 1.  new promise 一经创建，立即执行
- 2.  使用 Promise.resolve().then 可以把任务加到微任务队列，防止立即执行迭代方法
- 3.  微任务处理过程中，产生的新的微任务，会在同一事件循环内，追加到微任务队列里
- 4.  使用 race 在某个任务完成时，继续添加任务，保持任务按照最大并发数进行执行
- 5.  任务完成后，需要从 doingTasks 中移出
      \*/

```js
function limit(count, array, iterateFunc) {
  const tasks = [];
  const doingTasks = [];
  let i = 0;
  const enqueue = () => {
    if (i === array.length) {
      return Promise.resolve();
    }
    const task = Promise.resolve().then(() => iterateFunc(array[i++]));
    tasks.push(task);
    const doing = task.then(() =>
      doingTasks.splice(doingTasks.indexOf(doing), 1)
    );
    doingTasks.push(doing);
    const res =
      doingTasks.length >= count ? Promise.race(doingTasks) : Promise.resolve();
    return res.then(enqueue);
  };
  return enqueue().then(() => Promise.all(tasks));
}

// test
const timeout = (i) =>
  new Promise((resolve) => setTimeout(() => resolve(i), i));
limit(2, [1000, 1000, 1000, 1000], timeout).then((res) => {
  console.log(res);
});
```

JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个

```js
 addTask(1000,"1");
 addTask(500,"2");
 addTask(300,"3");
 addTask(400,"4");
 的输出顺序是：2 3 1 4

 整个的完整执行流程：

一开始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4


```

实现

```js
class Scheduler {
  constructor(limit) {
    this.queue = [];
    this.maxCount = limit;
    this.runCounts = 0;
  }
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, time);
      });
    };
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    this.queue
      .shift()()
      .then(() => {
        this.runCounts--;
        this.request();
      });
  }
}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
  scheduler.add(time, order);
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
scheduler.taskStart();
```

# 异步串行 | 异步并行

```js
// 字节面试题，实现一个异步加法
function asyncAdd(a, b, callback) {
  setTimeout(function () {
    callback(null, a + b);
  }, 500);
}

// 解决方案
// 1. promisify
const promiseAdd = (a, b) =>
  new Promise((resolve, reject) => {
    asyncAdd(a, b, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

// 2. 串行处理
async function serialSum(...args) {
  return args.reduce(
    (task, now) => task.then((res) => promiseAdd(res, now)),
    Promise.resolve(0)
  );
}

// 3. 并行处理
async function parallelSum(...args) {
  if (args.length === 1) return args[0];
  const tasks = [];
  for (let i = 0; i < args.length; i += 2) {
    tasks.push(promiseAdd(args[i], args[i + 1] || 0));
  }
  const results = await Promise.all(tasks);
  return parallelSum(...results);
}

// 测试
(async () => {
  console.log("Running...");
  const res1 = await serialSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12);
  console.log(res1);
  const res2 = await parallelSum(1, 2, 3, 4, 5, 8, 9, 10, 11, 12);
  console.log(res2);
  console.log("Done");
})();
```

# vue reactive

```js
// Dep module
class Dep {
  static stack = [];
  static target = null;
  deps = null;

  constructor() {
    this.deps = new Set();
  }

  depend() {
    if (Dep.target) {
      this.deps.add(Dep.target);
    }
  }

  notify() {
    this.deps.forEach((w) => w.update());
  }

  static pushTarget(t) {
    if (this.target) {
      this.stack.push(this.target);
    }
    this.target = t;
  }

  static popTarget() {
    this.target = this.stack.pop();
  }
}

// reactive
function reactive(o) {
  if (o && typeof o === "object") {
    Object.keys(o).forEach((k) => {
      defineReactive(o, k, o[k]);
    });
  }
  return o;
}

function defineReactive(obj, k, val) {
  let dep = new Dep();
  Object.defineProperty(obj, k, {
    get() {
      dep.depend();
      return val;
    },
    set(newVal) {
      val = newVal;
      dep.notify();
    },
  });
  if (val && typeof val === "object") {
    reactive(val);
  }
}

// watcher
class Watcher {
  constructor(effect) {
    this.effect = effect;
    this.update();
  }

  update() {
    Dep.pushTarget(this);
    this.value = this.effect();
    Dep.popTarget();
    return this.value;
  }
}

// 测试代码
const data = reactive({
  msg: "aaa",
});

new Watcher(() => {
  console.log("===> effect", data.msg);
});

setTimeout(() => {
  data.msg = "hello";
}, 1000);
```

        拦截 set，所有赋值都在 copy （原数据浅拷贝的对象）中进行，这样就不会影响到原对象
        拦截 get，通过属性是否修改的逻辑分别从 copy 或者原数据中取值
        最后生成不可变对象的时候遍历原对象，判断属性是否被修改过，也就是判断是否存在 copy。如果没有修改过的话，就返回原属性，并且也不再需要对子属性对象遍历，提高了性能。如果修改过的话，就需要把 copy 赋值到新对象上，并且递归遍历

接下来是实现，我们既然要用 Proxy 实现，那么肯定得生成一个 Proxy 对象，因此我们首先来实现一个生成 Proxy 对象的函数。

```js
// 用于判断是否为 proxy 对象
const isProxy = (value) => !!value && !!value[MY_IMMER];
// 存放生成的 proxy 对象
const proxies = new Map();
const getProxy = (data) => {
  if (isProxy(data)) {
    return data;
  }
  if (isPlainObject(data) || Array.isArray(data)) {
    if (proxies.has(data)) {
      return proxies.get(data);
    }
    const proxy = new Proxy(data, objectTraps);
    proxies.set(data, proxy);
    return proxy;
  }
  return data;
};
```

首先我们需要判断传入的属性是不是已经为一个 proxy 对象，已经是的话直接返回即可。这里判断的核心是通过 value[MY_IMMER]，因为只有当是 proxy 对象以后才会触发我们自定义的拦截 get 函数，在拦截函数中判断如果 key 是 MY_IMMER 的话就返回 target
接下来我们需要判断参数是否是一个正常 Object 构造出来的对象或数组，isPlainObject 网上有很多实现，这里就不贴代码了，有兴趣的可以在文末阅读源码
最后我们需要判断相应的 proxy 是否已经创建过，创建过的话直接从 Map 中拿即可，否则就新创建一个。注意这里用于存放 proxy 对象的容器是 Map 而不是一个普通对象，这是因为如果用普通对象存放的话，在取值的时候会出现爆栈，具体原因大家可以自行思考 🤔

    拦截 get 的时候首先需要判断 key 是不是 MY_IMMER，是的话说明这时候被访问的对象是个 proxy，我们需要把正确的 target 返回出去。然后就是正常返回值了，如果存在 copy 就返回 copy，否则返回原数据
    拦截 set 的时候第一步肯定是生成一个 copy，因为赋值操作我们都需要在 copy 上进行，否则会影响原数据。然后在 copy 中赋值时不能把 proxy 对象赋值进去，否则最后生成的不可变对象内部会内存 proxy 对象，所以这里我们需要判断下是否为 proxy 对象
    创建 copy 的逻辑很简单，就是判断数据的类型然后进行浅拷贝操作

```js
// 注意这里还是用到了 Map，原理和上文说的一致
const copies = new Map();
const objectTraps = {
  get(target, key) {
    if (key === MY_IMMER) return target;
    const data = copies.get(target) || target;
    return getProxy(data[key]);
  },
  set(target, key, val) {
    const copy = getCopy(target);
    const newValue = getProxy(val);
    // 这里的判断用于拿 proxy 的 target
    // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
    copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue;
    return true;
  },
};
const getCopy = (data) => {
  if (copies.has(data)) {
    return copies.get(data);
  }
  const copy = Array.isArray(data) ? data.slice() : { ...data };
  copies.set(data, copy);
  return copy;
};
```

这里的逻辑上文其实已经说过了，就是判断传入的参数是否被修改过。没有修改过的话就直接返回原数据并且停止这个分支的遍历，如果修改过的话就从 copy 中取值，然后把整个 copy 中的属性都执行一遍 finalize 函数。

```js
const MY_IMMER = Symbol("my-immer1");

const isPlainObject = (value) => {
  if (
    !value ||
    typeof value !== "object" ||
    {}.toString.call(value) != "[object Object]"
  ) {
    return false;
  }
  var proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor == "function" &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) ===
      Function.prototype.toString.call(Object)
  );
};

const isProxy = (value) => !!value && !!value[MY_IMMER];

function produce(baseState, fn) {
  const proxies = new Map();
  const copies = new Map();

  const objectTraps = {
    get(target, key) {
      if (key === MY_IMMER) return target;
      const data = copies.get(target) || target;
      return getProxy(data[key]);
    },
    set(target, key, val) {
      const copy = getCopy(target);
      const newValue = getProxy(val);
      // 这里的判断用于拿 proxy 的 target
      // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
      copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue;
      return true;
    },
  };

  const getProxy = (data) => {
    if (isProxy(data)) {
      return data;
    }
    if (isPlainObject(data) || Array.isArray(data)) {
      if (proxies.has(data)) {
        return proxies.get(data);
      }
      const proxy = new Proxy(data, objectTraps);
      proxies.set(data, proxy);
      return proxy;
    }
    return data;
  };

  const getCopy = (data) => {
    if (copies.has(data)) {
      return copies.get(data);
    }
    const copy = Array.isArray(data) ? data.slice() : { ...data };
    copies.set(data, copy);
    return copy;
  };

  const isChange = (data) => {
    if (proxies.has(data) || copies.has(data)) return true;
  };

  const finalize = (data) => {
    if (isPlainObject(data) || Array.isArray(data)) {
      if (!isChange(data)) {
        return data;
      }
      const copy = getCopy(data);
      Object.keys(copy).forEach((key) => {
        copy[key] = finalize(copy[key]);
      });
      return copy;
    }
    return data;
  };

  const proxy = getProxy(baseState);
  fn(proxy);
  return finalize(baseState);
}

const state = {
  info: {
    name: "yck",
    career: {
      first: {
        name: "111",
      },
    },
  },
  data: [1],
};

const data = produce(state, (draftState) => {
  draftState.info.age = 26;
  draftState.info.career.first.name = "222";
});

console.log(data, state);
console.log(data.data === state.data);
```

# 二维数组转化为一维

```js
const testArr = [
  [1, 2],
  [3, 4],
  [5, 6],
];
testArr.reduce((acc, cur) => {
  return acc.concat(cur);
}, []);
// [1,2,3,4,5,6]
```

# 计算每个元素出现的次数

```js
const testArr = [1, 3, 4, 1, 3, 2, 9, 8, 5, 3, 2, 0, 12, 10];
testArr.reduce((acc, cur) => {
  if (!(cur in acc)) {
    acc[cur] = 1;
  } else {
    acc[cur] += 1;
  }
  return acc;
}, {});

// {0: 1, 1: 2, 2: 2, 3: 3, 4: 1, 5: 1, 8: 1, 9: 1, 10: 1, 12: 1}
```

这里注意，我初始化的值变成了 {} ,这个需求需要键值对的形式，利用 cur in acc  判断累计器 acc  中是否含有 cur  属性，如果没有默认赋值 1，如果已经存在 += 1  累加一次。
在实际的开发业务中，这个方法非常常用，变种也很多。比如给你一个账单列表（项与项之间的消费类型有相同情况），让你统计账单列表中各个消费类型的支出情况，如 购物  、 学习  、 转账   等消费类型的支出情况。这就用到了上述方法，去通过归类。

# 按属性给数组分类

什么叫按照属性给数组分类，其实就是给定一个依据，把符合条件的归并到一起。再拿账单举例，就是按各个消费类型归为一类。

```js
const bills = [
  { type: "shop", momey: 223 },
  { type: "study", momey: 341 },
  { type: "shop", momey: 821 },
  { type: "transfer", momey: 821 },
  { type: "study", momey: 821 },
];
bills.reduce((acc, cur) => {
  // 如果不存在这个键，则设置它赋值 [] 空数组
  if (!acc[cur.type]) {
    acc[cur.type] = [];
  }
  acc[cur.type].push(cur);
  return acc;
}, {});
```

# 求数组对象中属性最大值最小值

第一次没有对比直接 acc 赋值 cur ，后面进入对比判断，如果 acc 的 age 属性小于 cur 的 age 属性，重制 acc 。相等的话默认返回 acc 。

```js
const testArr = [{ age: 20 }, { age: 21 }, { age: 22 }];
testArr.reduce((acc, cur) => {
  if (!acc) {
    acc = cur;
    return acc;
  }
  if (acc.age < cur.age) {
    acc = cur;
    return acc;
  }
  return acc;
}, 0);
// {age: 22}
```

# const

```js
      var __const = function __const (data, value) {
        window.data = value // 把要定义的data挂载到window下，并赋值value
        Object.defineProperty(window, data, { // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
          enumerable: false,
          configurable: false,
          get: function () {
            return value
          },
          set: function (data) {
            if (data !== value) { // 当要对当前属性进行赋值时，则抛出错误！
              throw new TypeError('Assignment to constant variable.')
            } else {
              return value
            }
          }
        })
      }
      __const('a', 10)
      console.log(a)
      delete a
      console.log(a)
      for (let item in window) { // 因为const定义的属性在global下也是不存在的，所以用到了enumerable: false来模拟这一功能
        if (item === 'a') { // 因为不可枚举，所以不执行
          console.log(window[item])
        }
      }
      a = 20 // 报错

```

# 数据双向绑定

      这里初始化的顺序依次是 prop>methods>data>computed>watch

```js
var a = document.createElement("div");
a.setAttribute("id", "a");
var b = document.createElement("div");
b.setAttribute("id", "b");
document.body.appendChild(a);
document.body.appendChild(b);
var data = {
  a: 2,
  b: 3,
};
class Dep {
  constructor() {
    this.callBacks = [];
  }
  depend(watch) {
    this.callBacks.push(watch);
  }
  notify(value) {
    this.callBacks.forEach((watch) => {
      console.log("value", value);
      watch.update(value);
    });
  }
}

class Watcher {
  constructor(key) {
    this.dom = document.getElementById(key);
  }
  update(value) {
    this.dom.innerHTML = value;
  }
}

Object.keys(data).forEach((key) => {
  var dep = new Dep();
  Object.defineProperty(data, key, {
    get: function () {
      var watch = new Watcher(key);
      dep.depend(watch); //收集依赖
    },
    set: function (nvalue) {
      dep.notify(nvalue); //变化了通知我
    },
  });
});

//调用
data.a; //首先get上
data.a = 123; //设置即可
```

# 斐波那契

```js
function fibo2(n) {
  if (n <= 0) return -1;
  if (n == 1) return 0;
  if (n == 2) return 1;
  return fibo2(n - 1) + fibo2(n - 2);
}
console.log(fibo2(7));
//变态青蛙跳
function jump(n) {
  if (n <= 0) return -1;
  if (n == 1) return 1;
  if (n == 2) return 2;
  var result = 0;
  for (var i = 1; i < n; i++) {
    result += jump(n - i);
  }
  return result + 1; // +1代表从0级台阶直接跳上去的情况
}
/*
 * 1,1,1,1,
 * 1,1,2
 * 1,2,1,
 * 2,1,1,
 * 1,3,
 * 3,1,
 * 2,2,
 * 4
 * */
console.log(jump(4));
```

# 二叉树深度广度 diff

```js
//构造二叉树
function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}
var a = new Node("a");
var b = new Node("b");
var c = new Node("c");
var d = new Node("d");
var e = new Node("e");
var f = new Node("f");
var g = new Node("g");
a.left = c;
a.right = b;
c.left = f;
c.right = g;
b.left = d;
b.right = e;
//二叉树深度优先算法
//对于二叉树来说，深度优先搜索，和前序遍历的顺序是一样的。
function deepSearch(root, target) {
  if (root == null) return false;
  if (root.value == target) return true;
  var left = deepSearch(root.left, target);
  var right = deepSearch(root.right, target);
  return left || right;
}

console.log(deepSearch(a, "n"));
//广度优先
function f1(rootList, target) {
  if (rootList == null || rootList.length == 0) return false;
  var childList = []; //当前层所有节点的子节点，都在这个list中，这样传入下一层级的时候，就可以遍历整个层级的节点。
  for (var i = 0; i < rootList.length; i++) {
    if (rootList[i] != null && rootList[i].value == target) {
      return true;
    } else {
      childList.push(rootList[i].left);
      childList.push(rootList[i].right);
    }
  }
  return f1(childList, target);
}
console.log(f1([a], "e"));
//二叉树的diff算法
//新增了什么，修改了什么，删除了什么

// {type: "新增", origin: null, now: c2},
// {type: "修改", origin: c1, now: c2},
// {type: "删除", origin: c2, now: null }
// var diffList = [];
function diffTree(root1, root2, diffList) {
  if (root1 == root2) return diffList;
  if (root1 == null && root2 != null) {
    // 新增了节点
    diffList.push({ type: "新增", origin: null, now: root2 });
  } else if (root1 != null && root2 == null) {
    // 删除了节点
    diffList.push({ type: "删除", origin: root1, now: null });
  } else if (root1.value != root2.value) {
    //相同位置的节点值不同了，修改了节点
    diffList.push({ type: "修改", origin: root1, now: root2 });
    diffTree(root1.left, root2.left, diffList);
    diffTree(root1.right, root2.right, diffList);
  } else {
    diffTree(root1.left, root2.left, diffList);
    diffTree(root1.right, root2.right, diffList);
  }
}
var diffList = [];
diffTree(a1, a2, diffList);
console.log(diffList);

//反转二叉树
var invertTree = function (root) {
  if (root !== null) {
    var temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
  }
  return root;
};
```

# 二叉树前序中序后序 以及还原二叉树

```js
//二叉树的前序
function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}
var a = new Node("a");
var b = new Node("b");
var c = new Node("c");
var d = new Node("d");
var e = new Node("e");
var f = new Node("f");
var g = new Node("g");
a.left = c;
a.right = b;
c.left = f;
c.right = g;
b.left = d;
b.right = e;
function f1(root) {
  if (root == null) return;
  console.log(root.value);
  f1(root.left);
  f1(root.right);
}
f1(a);

//中序
function f1(root) {
  if (root == null) return;
  f1(root.left);
  console.log(root.value);
  f1(root.right);
}
f1(a);
//后序
function f1(root) {
  if (root == null) return;
  f1(root.left);
  f1(root.right);
  console.log(root.value);
}

f1(a);

//前序中序还原二叉树
var qian = ["a", "c", "f", "g", "b", "d", "e"];
var zhong = ["f", "c", "g", "a", "d", "b", "e"];
function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}
function f1(qian, zhong) {
  if (
    qian == null ||
    zhong == null ||
    qian.length == 0 ||
    zhong.length == 0 ||
    qian.length != zhong.length
  )
    return null;
  var root = new Node(qian[0]);
  var index = zhong.indexOf(root.value); //找到根节点在中序遍历中的位置
  var qianLeft = qian.slice(1, 1 + index); //前序遍历的左子树
  var qianRight = qian.slice(1 + index, qian.length); //前序遍历的右子树
  var zhongLeft = zhong.slice(0, index); //中序遍历的左子树
  var zhongRight = zhong.slice(index + 1, zhong.length); //中序遍历的右子树
  root.left = f1(qianLeft, zhongLeft); //根据左子树的前序和中序还原左子树并赋值给root.left
  root.right = f1(qianRight, zhongRight); //根绝右子树的前序和中序还原右子树并赋值给root.right
  return root;
}
var root = f1(qian, zhong);
console.log(root.left);
console.log(root.right);
//中序后序
var zhong = ["f", "c", "g", "a", "d", "b", "e"];
var hou = ["f", "g", "c", "d", "e", "b", "a"];
function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}
function f1(zhong, hou) {
  if (
    zhong == null ||
    hou == null ||
    zhong.length == 0 ||
    hou.length == 0 ||
    zhong.length != hou.length
  )
    return null;
  var root = new Node(hou[hou.length - 1]);
  var index = zhong.indexOf(root.value);
  var leftZhong = zhong.slice(0, index);
  var rightZhong = zhong.slice(index + 1, zhong.length);
  var leftHou = hou.slice(0, index);
  var rightHou = hou.slice(index, hou.length - 1);
  root.left = f1(leftZhong, leftHou);
  root.right = f1(rightZhong, rightHou);
  return root;
}
var root = f1(zhong, hou);
console.log(root.left);
console.log(root.right);
```

## 1. 求二叉树中的节点个数

```js
public static int getNodeNumRec(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return getNodeNumRec(root.left) + getNodeNumRec(root.right) + 1;
}

```

## 2. 求二叉树的最大层数(最大深度)

```js
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        if(root == null)
            return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right))+1;
    }
}

```

# 2.1 二叉树的最小深度

```js
class Solution {
    public int minDepth(TreeNode root) {
        if(root == null)
            return 0;
        int left = minDepth(root.left);
        int right = minDepth(root.right);
        return (left == 0 || right == 0) ? left + right + 1 : Math.min(left, right) + 1;
    }
}

```

## 求二叉树第 K 层的节点个数

```js
void get_k_level_number(TreeNode root, int k){
    if(root == null || k <=0){
        return 0;
    }
    if(root != null && k == 1){
        return 1;
    }
    return get_k_level_number(root.left, k-1) + get_k_level_number(root.right, k-1);
}

```

## 求二叉树第 K 层的叶子节点个数

```js
void get_k_level_leaf_number(TreeNode root, int k){
    if(root == null || k <=0){
        return 0;
    }
    if(root != null && k == 1){
        if(root.left == null && root.right == null)
            return 1;
        else
            return 0;
    }
    return get_k_level_number(root.left, k-1) + get_k_level_number(root.right, k-1);
}

```

## 判断二叉树是不是平衡二叉树

```js
class Solution {
    public boolean isBalanced(TreeNode root) {
        if(root == null)
            return true;
        return Math.abs(maxHigh(root.left) - maxHigh(root.right)) <= 1
            && isBalanced(root.left) && isBalanced(root.right);
    }

    public int maxHigh(TreeNode root){
        if(root == null)
            return 0;
        return Math.max(maxHigh(root.left), maxHigh(root.right))+1;
    }
}

```

## 求二叉树的镜像

```js
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if(root == null)
            return root;

        TreeNode node = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(node);

        return root;
    }
}

```

## 对称二叉树

```js
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || isSymmetricHelper(root.left, root.right);
    }
    public boolean isSymmetricHelper(TreeNode left, TreeNode right){
        if(left == null && right == null)
            return true;
        if(left == null || right == null)
            return false;
        if(left.val != right.val)
            return false;
        return isSymmetricHelper(left.left, right.right) && isSymmetricHelper(left.right, right.left);
    }
}

```

# 各种排序

```js
//冒泡排序
function bubbleSort(arr) {
  // 缓存数组长度
  const len = arr.length;
  // 外层循环用于控制从头到尾的比较+交换到底有多少轮
  for (let i = 0; i < len; i++) {
    // 内层循环用于完成每一轮遍历过程中的重复比较+交换
    for (let j = 0; j < len - 1; j++) {
      // 若相邻元素前面的数比后面的大
      if (arr[j] > arr[j + 1]) {
        // 交换两者
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  // 返回数组
  return arr;
}
// console.log(bubbleSort([3, 6, 2, 4, 1]));

//选择排序

//选择排序，内层循环，每一圈选出一个最大的，然后放在后面
function selectSort(arr) {
  // 缓存数组长度
  const len = arr.length;
  // 定义 minIndex，缓存当前区间最小值的索引，注意是索引
  let minIndex;
  // i 是当前排序区间的起点
  for (let i = 0; i < len - 1; i++) {
    // 初始化 minIndex 为当前区间第一个元素
    minIndex = i;
    // i、j分别定义当前区间的上下界，i是左边界，j是右边界
    for (let j = i; j < len; j++) {
      // 若 j 处的数据项比当前最小值还要小，则更新最小值索引为 j
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // 如果 minIndex 对应元素不是目前的头部元素，则交换两者
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}
// console.log(quickSort([3, 6, 2, 4, 1]));

//快速排序
function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  const cur = arr[arr.length - 1];
  const left = arr.filter((v, i) => v <= cur && i !== arr.length - 1);
  const right = arr.filter((v) => v > cur);
  return [...quickSort(left), cur, ...quickSort(right)];
}
// console.log(quickSort([3, 6, 2, 4, 1]));

//插入排序
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    let target = arr[j];
    while (j > 0 && arr[j - 1] > target) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = target;
  }
  return arr;
}
// console.log(insertSort([3, 6, 2, 4, 1]));

//选择排序
function selection(array) {
  if (!checkArray(array)) return;
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      minIndex = array[j] < array[minIndex] ? j : minIndex;
    }
    swap(array, i, minIndex);
  }
  return array;
}
//归并排序
function merge(left, right) {
  let res = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      res.push(left[i]);
      i++;
    } else {
      res.push(right[j]);
      j++;
    }
  }
  if (i < left.length) {
    res.push(...left.slice(i));
  } else {
    res.push(...right.slice(j));
  }
  return res;
}

function mergeSort(arr) {
  if (arr.length < 2) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
// console.log(mergeSort([3, 6, 2, 4, 1]));

//二分查找
function search(arr, target, start, end) {
  let targetIndex = -1;

  let mid = Math.floor((start + end) / 2);

  if (arr[mid] === target) {
    targetIndex = mid;
    return targetIndex;
  }

  if (start >= end) {
    return targetIndex;
  }

  if (arr[mid] < target) {
    return search(arr, target, mid + 1, end);
  } else {
    return search(arr, target, start, mid - 1);
  }
}
// const dataArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const position = search(dataArr, 6, 0, dataArr.length - 1);
// if (position !== -1) {
//   console.log(`目标元素在数组中的位置:${position}`);
// } else {
//   console.log("目标元素不在数组中");
// }

//数组中第k大元素

let findKthLargest = function (nums, k) {
  nums.sort((a, b) => b - a).slice(0, k);
  return nums[k - 1];
};
```

# 链表

# 反转单向链表

```js
function reverse(list) {
  var p = list.head,
    q = null;
  while (p.next !== null) {
    q = p.next;
    p.next = q.next;
    q.next = list.head.next;
    list.head.next = q;
  }
  return list;
}
```

定义两个指针 P，Q；
Q 是 P 的 next；
贯穿的思想是将 P 后面的一个插入到 Head 之后，后面的连接起来；
前提是 P 的后一个非空

# 链表中倒数第 k 个节点;

```js
var getKthFromEnd = function (head, k) {
  //双指针
  var p = head,
    q = head;
  while (p) {
    if (k > 0) {
      p = p.next; //p先走k步，保证p、q之间相差k步
      k--;
    } else {
      p = p.next; //当p走到结尾时，此时的q就是倒数的第k个
      q = q.next;
    }
  }
  return q;
};
```

# 逆置;

```js
function nizhi() {
  if (root.next.next === null) {
    root.next.next = root;
    return root.next;
  } else {
    let result = nizhi(root.next);
    root.next.next = root;
    root.next = null;
    return result;
  }
}
var nextRoot = nizhi(node1);
function blan(root) {
  if (root === null) return;
  blan(root.next);
}
blan(nextRoot);
```

# //实现单链表

```js
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
//单链表插入、删除、查找
class LinkedList {
  constructor(val) {
    val = val === undefined ? "head" : val;
    this.head = new ListNode(val);
  }

  // 找val值节点，没有找到返回-1
  findByVal(val) {
    let current = this.head;
    while (current !== null && current.val !== val) {
      current = current.next;
    }
    return current ? current : -1;
  }

  // 插入节点,在值为val后面插入
  insert(newVal, val) {
    let current = this.findByVal(val);
    if (current === -1) return false;
    let newNode = new ListNode(newVal);
    newNode.next = current.next;
    current.next = newNode;
  }

  // 获取值为nodeVal的前一个节点,找不到为-1,参数是val
  // 适用于链表中无重复节点
  findNodePreByVal(nodeVal) {
    let current = this.head;
    while (current.next !== null && current.next.val !== nodeVal)
      current = current.next;
    return current !== null ? current : -1;
  }

  // 根据index查找当前节点, 参数为index
  // 可以作为比较链表是否有重复节点

  findByIndex(index) {
    let current = this.head,
      pos = 1;
    while (current.next !== null && pos !== index) {
      current = current.next;
      pos++;
    }

    return current && pos === index ? current : -1;
  }

  // 删除某一个节点,删除失败放回false
  remove(nodeVal) {
    if (nodeVal === "head") return false;
    let needRemoveNode = this.findByVal(nodeVal);
    if (needRemoveNode === -1) return false;
    let preveNode = this.findNodePreByVal(nodeVal);

    preveNode.next = needRemoveNode.next;
  }

  //遍历节点

  disPlay() {
    let res = new Array();
    let current = this.head;
    while (current !== null) {
      res.push(current.val);
      current = current.next;
    }
    return res;
  }

  // 在链表末尾插入一个新的节点
  push(nodeVal) {
    let current = this.head;
    let node = new ListNode(nodeVal);
    while (current.next !== null) current = current.next;
    current.next = node;
  }
  // 在头部插入
  frontPush(nodeVal) {
    let newNode = new ListNode(nodeVal);
    this.insert(nodeVal, "head");
  }
}
```

# //合并两个有序链表

/_ 模拟题+链表
思路当然简单，重要的是模拟过程，在算法程度上，这种题目可以较为模拟题，模拟你思考的过程，每次比较两个 l1.val 与 l2.val 的大小，取小的值，同时更新小的值指向下一个节点
主要注意的就是循环终止的条件：当两者其中有一个为空时，即指向 null
最后需要判断两个链表哪个非空，在将非空的链表与 tmp 哨兵节点连接就好。 _/

```js
var mergeTwoLists = function (l1, l2) {
  let newNode = new ListNode("start"), // 做题套路,头节点
    tmp = newNode; // tmp作为哨兵节点
  while (l1 && l2) {
    // 循环结束的条件就是两者都要为非null
    if (l1.val >= l2.val) {
      tmp.next = l2;
      l2 = l2.next;
    } else {
      tmp.next = l1;
      l1 = l1.next;
    }
    tmp = tmp.next; // 哨兵节点更新指向下一个节点
  }
  // 最后需要判断哪个链表还存在非null
  tmp.next = l1 == null ? l2 : l1;
  return newNode.next;
};
/* 递归思路: 「递归解法要注意递归主题里每次返回值较小得节点，这样才能保证我们最后得到得是链表得最小开头」 */
```

# //链表区间反转

```js
var reverseBetween = function (head, m, n) {
  let count = n - m,
    newNode = new ListNode("head");
  tmp = newNode;
  tmp.next = head; // 哨兵节点,这样子同时也保证了newNode下一个节点就是head
  for (let i = 0; i < m - 1; i++) {
    tmp = tmp.next;
  }
  // 此时循环后,tmp保留的就是反转区间前一个节点,需要用front保留下来
  let front, prev, curr, tail;
  front = tmp; // 保留的是区间首节点
  // 同时tail指针的作用是将反转后的链接到最后节点

  prev = tail = tmp.next; // 保留反转后的队尾节点 也就是tail
  curr = prev.next;
  for (let i = 0; i < count; i++) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // 将原本区间首节点链接到后结点
  tail.next = curr;
  // font是区间前面一个节点,需要链接的就是区间反转的最后一个节点
  front.next = prev;

  return newNode.next; // 最后返回newNode.next就行,一开始我们指向了head节点
};
```

# //交换链表中的节点

```js
var swapPairs = function (head) {
  let newNode = new ListNode("start");
  (newNode.next = head), // 链表头节点套路操作
    (tmp = newNode); // tmp哨兵节点,这里要从newNode节点开始,并不是从head开始的

  while (tmp.next !== null && tmp.next.next !== null) {
    let start = tmp.next,
      end = start.next;
    tmp.next = end;
    start.next = end.next;
    end.next = start;
    tmp = start;
  }

  return newNode.next; // 返回的自然就是指向 链表头节点的next指针
};
```

# //链表相交

```js
var getIntersectionNode = function (headA, headB) {
  let p1 = headA,
    p2 = headB;
  while (p1 != p2) {
    p1 = p1 === null ? headB : p1.next;
    p2 = p2 === null ? headA : p2.next;
  }
  return p1;
};
```

# //链表中间元素

```js
    public Node getMid(Node head){
      if(head == null){
         return null;
      }

      Node slow = head;
      Node fast = head;

      // fast.next = null 表示 fast 是链表的尾节点
      while(fast != null && fast.next != null){
         fast = fast.next.next;
         slow = slow.next;
      }
      return slow;
    }
```

# //循环链表

```js
private static boolean isLoopList(Node head){

        if (head == null){
            return false;
        }


        Node slow = head;
        Node fast = head.next;

        //如果不是循环链表那么一定有尾部节点 此节点 node.next = null
        while(slow != null && fast != null && fast.next != null){
            if (fast == slow || fast.next == slow){
                return true;
            }
            // fast 每次走两步  slow 每次走一步
            fast =fast.next.next;
            slow = slow.next;
        }
        //如果不是循环链表返回 false
        return false;
    }
```

# //删除有序链表中的重复元素

```js
 private void delSortSame(Node head) {
        if (head == null || head.next == null) {
            return;
        }

        Node dummy = head;
        while (dummy.next != null) {
            if (dummy.value == dummy.next.value) {
                dummy.next = dummy.next.next;
            } else {
                dummy = dummy.next;
            }
        }
    }

```

# //k 个为一组逆序

```js
/* 给定一个单链表的头节点 head,实现一个调整单链表的函数，使得每K个节点之间为一组进行逆序，并且从链表的尾部开始组起，头部剩余节点数量不够一组的不需要逆序。（不能使用队列或者栈作为辅助） */


    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode temp = head;
        for (int i = 1; i < k && temp != null; i++) {
            temp = temp.next;
        }
        //判断节点的数量是否能够凑成一组
        if(temp == null)
            return head;

        ListNode t2 = temp.next;
        temp.next = null;
        //把当前的组进行逆序
        ListNode newHead = reverseList(head);
        //把之后的节点进行分组逆序
        ListNode newTemp = reverseKGroup(t2, k);
        // 把两部分连接起来
        head.next = newTemp;

        return newHead;
    }
```

# //逆序单链表

```js
   private static ListNode reverseList(ListNode head) {
       if(head == null || head.next == null)
           return head;
       ListNode result = reverseList(head.next);
       head.next.next = head;
       head.next = null;
       return result;
   }
public ListNode solve(ListNode head, int k) {
   // 调用逆序函数
   head = reverse(head);
   // 调用每 k 个为一组的逆序函数（从头部开始组起）
   head = reverseKGroup(head, k);
   // 在逆序一次
   head = reverse(head);
   return head;

}
```

# //链表求和

```js
private Node addLists(Node head1, Node head2) {
        head1 = reverseList(head1);
        head2 = reverseList(head2);
        //进位标识
        int ca = 0;
        int n1 = 0;
        int n2 = 0;
        int sum = 0;

        Node addHead = new Node(0);
        Node dummyHead = addHead;

        Node cur1 = head1;
        Node cur2 = head2;

        while (cur1 != null || cur2 != null) {
            n1 = cur1 == null ? 0 : cur1.value;
            n2 = cur2 == null ? 0 : cur2.value;

            sum = n1 + n2 + ca;

            Node node = new Node(sum % 10);
            System.out.println( sum % 10);
            ca = sum / 10;

            dummyHead.next = node;

            dummyHead = dummyHead.next;

            cur1 = cur1 == null ? null : cur1.next;
            cur2 = cur2 == null ? null : cur2.next;
        }

        if (ca > 0) {
            dummyHead.next = new Node(ca);
        }

        head1 = reverseList(head1);
        head2 = reverseList(head2);

        addHead = addHead.next;
        return reverseList(addHead);
    }

    private  Node reverseList(Node head) {
        Node cur = head;
        Node pre = null;
        Node next = null;

        while (cur != null) {
            next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }
        //注意这里返回的是赋值当前比较元素
        return pre;
    }


```

# LRU 算法

```js
//  一个Map对象在迭代时会根据对象中元素的插入顺序来进行
// 新添加的元素会被插入到map的末尾，整个栈倒序查看
class LRUCache {
  constructor(capacity) {
    this.secretKey = new Map();
    this.capacity = capacity;
  }
  get(key) {
    if (this.secretKey.has(key)) {
      let tempValue = this.secretKey.get(key);
      this.secretKey.delete(key);
      this.secretKey.set(key, tempValue);
      return tempValue;
    } else return -1;
  }
  put(key, value) {
    // key存在，仅修改值
    if (this.secretKey.has(key)) {
      this.secretKey.delete(key);
      this.secretKey.set(key, value);
    }
    // key不存在，cache未满
    else if (this.secretKey.size < this.capacity) {
      this.secretKey.set(key, value);
    }
    // 添加新key，删除旧key
    else {
      this.secretKey.set(key, value);
      // 删除map的第一个元素，即为最长未使用的
      this.secretKey.delete(this.secretKey.keys().next().value);
    }
  }
}
// let cache = new LRUCache(2);
// cache.put(1, 1);
// cache.put(2, 2);
// console.log("cache.get(1)", cache.get(1))// 返回  1
// cache.put(3, 3);// 该操作会使得密钥 2 作废
// console.log("cache.get(2)", cache.get(2))// 返回 -1 (未找到)
// cache.put(4, 4);// 该操作会使得密钥 1 作废
// console.log("cache.get(1)", cache.get(1))// 返回 -1 (未找到)
// console.log("cache.get(3)", cache.get(3))// 返回  3
// console.log("cache.get(4)", cache.get(4))// 返回  4
```

# 大数相加

```js
let a = "9007199254740991";
let b = "1234567899999999999";

function add(a, b) {
  //取两个数字的最大长度
  let maxLength = Math.max(a.length, b.length);
  //用0去补齐长度
  a = a.padStart(maxLength, 0); //"0009007199254740991"
  b = b.padStart(maxLength, 0); //"1234567899999999999"
  //定义加法过程中需要用到的变量
  let t = 0;
  let f = 0; //"进位"
  let sum = "";
  for (let i = maxLength - 1; i >= 0; i--) {
    t = parseInt(a[i]) + parseInt(b[i]) + f;
    f = Math.floor(t / 10);
    sum = (t % 10) + sum;
  }
  if (f == 1) {
    sum = "1" + sum;
  }
  return sum;
}
```

# 扁平数据结构转 Tree

```js
//输入
let arr = [
  { id: 1, name: "部门1", pid: 0 },
  { id: 2, name: "部门2", pid: 1 },
  { id: 3, name: "部门3", pid: 1 },
  { id: 4, name: "部门4", pid: 3 },
  { id: 5, name: "部门5", pid: 4 },
];
//输出
[
  {
    id: 1,
    name: "部门1",
    pid: 0,
    children: [
      {
        id: 2,
        name: "部门2",
        pid: 1,
        children: [],
      },
      {
        id: 3,
        name: "部门3",
        pid: 1,
        children: [
          // 结果 ,,,
        ],
      },
    ],
  },
];
```

```js
/**
 * 递归查找，获取children
 */
const getChildren = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = { ...item, children: [] };
      result.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
};

/**
 * 转换方法
 */
const arrayToTree = (data, pid) => {
  const result = [];
  getChildren(data, result, pid);
  return result;
};
```

```js
function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //

  // 先转成map存储
  for (const item of items) {
    itemMap[item.id] = { ...item, children: [] };
  }

  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    const treeItem = itemMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}
```

# 翻转字符串

```js
const reverseStr = (str) => [...str].reduce((a, v) => v + a);
```

# 用 promise 和 reduce 来实现异步流程控制

```ts
const createPromise = (id: number) => () =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`${id}:${new Date()}`);
    }, 1000)
  );
const task = [createPromise(1), createPromise(2), createPromise(3)];
const doTask = task.reduce(
  (pre, next: Function) => pre.then(() => next()),
  Promise.resolve()
);
doTask.then(() => console.log("done"));
```
