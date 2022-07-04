```js
let a = document.createElement("div");
a.setAttribute("id", "a");
document.body.appendChild(a);
let b = document.createElement("div");
b.setAttribute("id", "b");
document.body.appendChild(b);
let data = {
  a: 1,
  b: 2,
};
let arr = [1, 2, 3, 4];
arr[0] = 2;
array.prototype.splice;
//发布
class Dep {
  constructor() {
    this.callBack = [];
  }
  depend(watch) {
    this.callBack.push(watch);
  }
  notify(nVal) {
    this.callBack.forEach((watch) => {
      watch.update(nVal);
    });
  }
}
//订阅
class Watch {
  constructor(key) {
    this.dom = document.getElementById(key);
  }
  update(nVal) {
    this.dom.innerHTML = nVal;
  }
}
Object.keys(data).forEach((key) => {
  let dep = new Dep();
  Object.defineProperty(data, key, {
    get: function () {
      let watch = new Watch(key);
      dep.depend(watch);
    },
    set: function (nVal) {
      dep.notify(nVal);
    },
  });
});
```
