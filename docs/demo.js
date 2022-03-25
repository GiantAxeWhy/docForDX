function mysettimeOut(fn, time) {
  let timer = null;

  function settime() {
    fn();
    timer = setTimeout(interval, time);
  }
  settime();
  mysettimeOut.cancel = () => {
    clearTimeout(timer);
  };
}

function setinterval(fn, time) {
  const timer = setInterval(() => {
    clearInterval(timer);
    fn();
  }, time);
}

class emit {
  constructor() {
    this.events = {};
  }
  on(type, callback) {
    if (this.events[type]) {
      this.events[type].push(callback);
    } else {
      this.events[type] = [callback];
    }
  }
  emit(type, ...rest) {
    this.events[type] &&
      this.events[type].forEach((fn) => {
        fn.apply(this, rest);
      });
  }
  off(type, callback) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filters((item) => {
      return item !== callback;
    });
  }
  once(type, callback) {
    function fn() {
      callback();
      this.off(type, fn);
    }
    this.on(type, fn);
  }
}

function falten(arr) {
  if (!arr.length) return;
  arr.reduce((pre, cur) => {
    Array.isArray(cur) ? [...pre, falten(cur)] : [...pre, cur];
  });
}

//继承

function Animal(val) {
  this.name = val;
}
Animal.prototype.getName = function () {
  return this.name;
};
function Cat(name) {
  Animal.call(this, name);
}
Cat.prototype = Object.create(Animal.prototype, { constructor: Cat });
Cat.prototype.memow = function () {
  return this.getName();
};
const cat = new Cat("石榴");
console.log(cat.memow());

//call
Function.prototype.myCall()=function(context,){

}


//数据双向绑定
var a =document.createElement('div')
a.setAttribute("id","a")
var b =document.createElement('div')
b.setAttribute("id","b")
document.body.appendChild(a)
document.body.appendChild(b)
var data = {
  a:2,
  b:3
}
class Dep{
  constructor(){
    this.callBacks = [];
  }
  depend(watch){
    this.callBacks.push(watch)
  }
  notify(value){
    this.callBacks.forEach(watch=>{
      console.log('value',value)
      watch.update(value)
    })
  }
}

class Watcher{
    constructor(key){
      this.dom = document.getElementById(key);
  }
  update(value){
    this.dom.innerHTML = value
  }
}

Object.keys(data).forEach(key=>{
  var dep = new Dep()
  Object.defineProperty(data,key,{
    get:function(){
      var watch = new Watcher(key)
      dep.depend(watch)//收集依赖
    },
    set:function(nvalue){
      dep.notify(nvalue)//变化了通知我
    }
  })
})

//调用
data.a; //首先get上
data.a = 123; //设置即可


