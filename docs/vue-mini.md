### 手写简易 vue

```js
var a = document.createElement("div");
a.setAttribute("id", "a");
var b = document.createElement("div");
b.setAttribute("id", "b");
document.body.appendChild(a);
document.body.appendChild(b);
var data = {
  a: 1,
  b: 2,
};
var Dep = function () {
  this.callBacks = [];
};
Dep.prototype.add = function (wacth) {
  this.callBacks.push(wacth);
};
Dep.prototype.notify = function (value) {
  this.callBacks.forEach((wacth) => {
    wacth.updata(value);
  });
};

var Watch = function (key) {
  this.dom = document.getElementById(key);
};

Watch.prototype.updata = function (value) {
  this.dom.innerHTML = value;
};

Object.keys(data).forEach((key) => {
  var dep = new Dep();
  Object.defineProperty(data, key, {
    get: function () {
      var wacth = new Watch(key);
      dep.add(wacth);
    },
    set: function (nvalue) {
      dep.notify(nvalue);
    },
  });
});

//调用
data.a; //首先get上
data.a = 123; //设置即可
```
