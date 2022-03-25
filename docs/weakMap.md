## 引用、浅拷贝及深拷贝 到 Map、Set（含对象 assign、freeze 方法、WeakMap、WeakSet 及数组 map、reduce 等等方法）

从引用聊到深浅拷贝，从深拷贝过渡到 ES6 新数据结构 Map 及 Set，再到另一个 map 即 Array.map()和与其类似的 Array.flatMap()，中间会有其他相关话题，例如 Object.freeze()与 Object.assign()等等。

一边复习一边学习，分清引用与深浅拷贝的区别，并实现浅拷贝与深拷贝，之后通过对深拷贝的了解，拓展到 ES6 新数据结构 Map 及 Set 的介绍，再引入对另一个数组的 map 方法的使用与类似数组遍历方法的使用。通过一条隐式链将一长串知识点串联介绍，可能会有点杂，但也会有对各知识点不同之处有明显区分，达到更好的记忆与理解。

### 引用、浅拷贝及深拷贝

#### 引用

```js
var testObj = {
  name: "currName",
};
var secObj = testObj;
secObj.name = "changedName";
console.log(testObj); // { name: 'changedName' }
```

### 浅拷贝

```js
function shallowCopy(obj) {
  var retObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      retObj[key] = obj[key];
    }
  }
  return retObj;
}
var testObj = {
  name: "currName",
  nums: [1, [2, 3]],
  objs: {
    innerobj: "content",
  },
};
var secObj = shallowCopy(testObj);
secObj.name = "changedName";
secObj.nums[0] = "一";
secObj.nums[1] = ["二", "三"];
console.log(testObj); // { name: 'currName',
//   nums: [ '一', [ '二', '三' ] ],
//   objs: { innerObj: 'changedContent' } }
console.log(secObj); // { name: 'changedName',
//   nums: [ '一', [ '二', '三' ] ],
//   objs: { innerObj: 'changedContent' } }
```

对于第一层数据其修改后已经不能影响之前的数据，但对于内部还存在迭代器的数据属性，还是有引用情况的存在，所以后者对这些属性的修改，依旧会影响前者中这些属性的内容。

引用与浅拷贝的区别就在于： 对第一层数据是否依旧修改后互相影响。

相关方法

Object.assign()
assign 方法效果类似于在数组中的 concat 拼接方法，其可以将源对象中可枚举属性进行复制到目标对象上，并返回目标对象，该方法中第一个参数便就是目标对象，其他参数为源对象。

因此该方法我们定义源对象为空对象时便可以在对拷贝的实现中使用，但需要注意的是 Object.assign()其方法自身实行的便是浅拷贝，而不是深拷贝，因此通过该方法实现的拷贝只能是浅拷贝。

Object.freeze()
freeze 方法其效果在有一定程度与浅拷贝相同，但效果上还要比拷贝多上一层，即 freeze 冻结，但因为该方法自身 内部属性，该方法的名称又可以称为“浅冻结”，对于第一层数据，如浅拷贝一般，不可被新对象改变，但被 freeze 方法冻结过的对象，其自身也无法添加、删除或修改其第一层数据，但因为“浅冻结”这名称中浅的这一明显属性，freeze 方法对于内部如果存在更深层的数据，是可以被自身修改，且也会被“=”号所引用给新的变量。

### 深拷贝

接上面对浅拷贝的介绍，很容易就可以想到深拷贝便是在浅拷贝的基础上，让内部存在更深层数据的对象，不止第一层不能改变原有数据，内部更深层次数据修改时也不能使原有数据改变，即消除了数据中所有存在引用的情况。通过对浅拷贝的实现，我们很容易就想到通过递归的方法对深拷贝进行实现。
深拷贝的方法具体参考手写 js

### ES6 中 Map、Set

#### map

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。

```js
const data = {};
const element = document.getElementById("myDiv");

data[element] = "metadata";
data["[object HTMLDivElement]"]; // "metadata"
```

上面代码原意是将一个 DOM 节点作为对象 data 的键，但是由于对象只接受字符串作为键名，所以 element 被自动转为字符串[object HTMLDivElement]。

为了解决这个问题，ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

对于 Hash 结构 即 键值对的集合，Object 对象只能用字符串作为 key 值，在使用上有很大的限制，ES6 提供的新的数据结构 Map 相对于 Object 对象，其“键”的范围不限于字符串类型，实现了“值-值”的对应，使用上可以有更广泛的运用。

但 Map 在赋值时，只能接受如数组一般有 lterator 接口且每个成员都是双元素的数组的数据结构作为参数，该数组成员是一个个表示键值对的数组，之外就只能通过 Map 自身 set 方法添加成员。

所以以下我们先介绍将对象转为 Map 的方法，再对 Map 自身方法做一个简单介绍
Object 转为 Map 方法

```js
function objToMap(object) {
  let map = new Map();
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      map.set(key, object[key]);
    }
  }
  return map;
}
var testObj = {
  name: "currName",
  nums: [1, [2, 3]],
  objs: {
    innerObj: "content",
  },
};
let map = objToMap(testObj);
map.set("name", "changedName");
console.log(testObj); // { name: 'currName',
//   nums: [ 1, [ 2, 3 ] ],
//   objs: { innerObj: 'content' } }
console.log(map); // Map {
// 'name' => 'changedName',
// 'nums' => [ 1, [ 2, 3 ] ],
// 'objs' => { innerObj: 'content' } }
```

#### map 自身方法介绍

含增删改查方法：set、get、has、delete；
遍历方法：keys、values、entries、forEach；
其他方法：size、clear。
需要注意的是 forEach 方法还可以接受第二个参数，改变第一个参数即回调函数的内部 this 指向。

#### 应用场景

对于经典算法问题中 上楼梯问题：共 n 层楼梯，一次仅能跨 1 或 2 步，总共有多少种走法？

这一类问题都有一个递归过程中内存溢出的 bug 存在，此时就可以运用 Map 减少递归过程中重复运算的部分，解决内存溢出的问题。

```js
let n = 100;
let map = new Map();
function upStairs(n) {
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (map.has(n)) return map.get(n);
  let ret = upStairs(n - 1) + upStairs(n - 2);
  map.set(n, ret);
  return ret;
}
console.log(upStairs(n)); // 573147844013817200000
```

### weakMap

#### 区别

![constructor](微信截图_20210420200210.png)

此处我们对强弱引用进行简单介绍：弱引用在回收机制上比强引用好，在“适当”的情况将会被回收，减少内存资源浪费，但由于不是强引用，WeakMap 不能进行遍历与 size 方法取得内部值数量。

WeakMap 与 Map 的区别有两点。

首先，WeakMap 只接受对象作为键名（null 除外），不接受其他类型的值作为键名。

```js
const map = new WeakMap();
map.set(1, 2);
// TypeError: 1 is not an object!
map.set(Symbol(), 2);
// TypeError: Invalid value used as weak map key
map.set(null, 2);
// TypeError: Invalid value used as weak map key
```

上面代码中，如果将数值 1 和 Symbol 值作为 WeakMap 的键名，都会报错。

其次，WeakMap 的键名所指向的对象，不计入垃圾回收机制。

WeakMap 的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。请看下面的例子。

```js
const e1 = document.getElementById("foo");
const e2 = document.getElementById("bar");
const arr = [
  [e1, "foo 元素"],
  [e2, "bar 元素"],
];
```

上面代码中，e1 和 e2 是两个对象，我们通过 arr 数组对这两个对象添加一些文字说明。这就形成了 arr 对 e1 和 e2 的引用。

一旦不再需要这两个对象，我们就必须手动删除这个引用，否则垃圾回收机制就不会释放 e1 和 e2 占用的内存。

```js
// 不需要 e1 和 e2 的时候
// 必须手动删除引用
arr[0] = null;
arr[1] = null;
```

上面这样的写法显然很不方便。一旦忘了写，就会造成内存泄露。

WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用 WeakMap 结构。当该 DOM 元素被清除，其所对应的 WeakMap 记录就会自动被移除。

```js
const wm = new WeakMap();

const element = document.getElementById("example");

wm.set(element, "some information");
wm.get(element); // "some information"
```

上面代码中，先新建一个 WeakMap 实例。然后，将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 WeakMap 里面。这时，WeakMap 里面对 element 的引用就是弱引用，不会被计入垃圾回收机制。

也就是说，上面的 DOM 节点对象除了 WeakMap 的弱引用外，其他位置对该对象的引用一旦消除，该对象占用的内存就会被垃圾回收机制释放。WeakMap 保存的这个键值对，也会自动消失。

总之，WeakMap 的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap 结构有助于防止内存泄漏。

注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

```js
const wm = new WeakMap();
let key = {};
let obj = { foo: 1 };

wm.set(key, obj);
obj = null;
wm.get(key);
// Object {foo: 1}
```

上面代码中，键值 obj 是正常引用。所以，即使在 WeakMap 外部消除了 obj 的引用，WeakMap 内部的引用依然存在。

#### 应用场景

WeakMap 因为键必须为对象，且在回收机制上的优越性，其可以用在以下两个场景：

1. 对特定 DOM 节点添加状态时。当 DOM 节点被删除，将 DOM 节点作为“键”的 WeakMap 也会自动被回收。
2. 对类或构造函数中私有属性绑定定义。当实例被删除，被作为“键”的 this 消失，WeakMap 自动回收。
   示例代码如下：

```js
<!--示例一-->
let element = document.getElementById('box')
let wMap = new WeakMap()
wMap.set(element, {clickCount: 0})
element.addEventListener('click', () => {
  let countObj = wMap.get(element)
  countObj.clickCount++

  console.log(wMap.get(element).clickCount) // click -> n+=1
})

<!--示例二-->
const _age = new WeakMap()
const _fn = new WeakMap()
class Girl {
  constructor (age, fn) {
    _age.set(this, age)
    _fn.set(this, fn)
  }
  changeAge () {
    let age = _age.get(this)
    age = age >= 18 ? 18 : null
    _age.set(this, age)

    _age.get(this) === 18
    ? _fn.get(this)()
    : console.log('error')
  }
}

const girl = new Girl(25, () => console.log('forever 18 !'))
girl.changeAge() // forever 18 !

```

### SET

介绍完 ES6 新增的 Map 与 WeakMap 数据结构，我们继续介绍一同新增的 Set 数据结构。

Set 之于 Array，其实有点像 Map 之于 Object，Set 是在数组的数据结构基础上做了一些改变，新出的一种类似于数组的数据结构，Set 的成员的值唯一，不存在重复的值。以下将对 Set 数据结构作一些简单的介绍。

#### Set 与 Array 之间的相互转换

Set 可以将具有 Iterable 接口的其他数据结构作为参数用于初始化，此处不止有数组，但仅以数组作为例子，单独讲述一下。

```js
// Set -> Array
let arr = [1, 2, 3, 3];
let set = new Set(arr);
console.log(set); // Set { 1, 2, 3 }

// Array -> Set
const arrFromSet1 = Array.from(set);
const arrFromSet2 = [...set];
console.log(arrFromSet1); // [ 1, 2, 3 ]
console.log(arrFromSet2); // [ 1, 2, 3 ]
```

去除重复字符串以及数组

```js
// 去除数组的重复成员
[...new Set(array)];

[...new Set("ababbc")].join("");
// "abc"
```

#### Set 自身方法

Set 内置的方法与 Map 类似

含增删查方法：add、has、delete；

遍历方法：keys、values、entries、forEach；

其他方法：size、clear。

```js
let arr = [1, 2, 3, 3];
let set = new Set(arr);
// 增删改查
set.add(4);
console.log(set); // Set { 1, 2, 3, 4 }
set.delete(3);
console.log(set); // Set { 1, 2, 4 }
console.log(set.has(4)); // true

// 遍历方法 因为在Set结构中没有键名只有健值，所以keys方法和values方法完全一致
console.log(set.keys()); // [Set Iterator] { 1, 2, 4 }
console.log(set.values()); // [Set Iterator] { 1, 2, 4 }

for (const item of set.entries()) {
  console.log(item); //[ 1, 1 ]
  // [ 2, 2 ]
  // [ 4, 4 ]
}

const obj = {
  name: "objName",
};
set.forEach(function (key, value) {
  console.log(key, value, this.name); // 1 1 'objName'
  // 2 2 'objName'
  // 4 4 'objName'
}, obj);

// 其他方法
console.log(set.size); // 3
set.clear();
console.log(set); // Set {}
```

#### Set 应用场景

因为扩展运算符...对 Set 作用，再通过 Array 遍历方法，很容易求得并集、交集及差集，也可以通过间接使用 Array 方法，构造新的数据赋给 Set 结构变量。

```js
let a = new Set([1, 2, 3]);
let b = new Set([2, 3, 4]);

// 并集
let union = new Set([...a, ...b]);
console.log(union); // Set { 1, 2, 3, 4 }
// 交集
let intersect = new Set([...a].filter((x) => b.has(x)));
console.log(intersect); // Set { 2, 3 }
// 差集
let difference = new Set([
  ...[...a].filter((x) => !b.has(x)),
  ...[...b].filter((x) => !a.has(x)),
]);
console.log(difference); // Set { 1, 4 }

// 赋新值
let aDouble = new Set([...a].map((x) => x * 2));
console.log(aDouble); // Set { 2, 4, 6 }

let bDouble = new Set(Array.from(b, (x) => x * 2));
console.log(bDouble); // Set { 4, 6, 8 }
```

### WeakSet

#### WeakSet 与 Set 对比

WeakSet 之于 Set，依旧相当于 WeakMap 之于 Map。

WeakSet 与 Set 之间不同之处，依然是：

1. WeakSet 内的值只能为对象；

2. WeakSet 依旧是弱引用。

WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

这是因为垃圾回收机制根据对象的可达性（reachability）来判断回收，如果对象还能被访问到，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

#### WeakSet 自身方法

因为弱引用的关系，WeakSet 只有简单的增删查方法：add、delete、has

```js
let obj1 = { name: 1 };
let obj2 = { name: 2 };
let wSet = new WeakSet();
wSet.add(obj1).add(obj2);
console.log(wSet.has(obj2)); // true
wSet.delete(obj2);
console.log(wSet.has(obj2)); // false
```

#### WeakSet 应用场景

对于 WeakSet 的应用场景，其与 WeakMap 类似，因为弱引用的优良回收机制，WeakSet 依旧可以存放 DOM 节点，避免删除这些节点后引发的内存泄漏的情况；也可以在构造函数和类中存放实例 this，同样避免删除实例的时候产生的内存泄漏的情况。

```js
// 1
let wSet = new WeakSet();
wSet.add(document.getElementById("box"));

const _boy = new WeakSet();
// 2
class Boy {
  constructor() {
    _boy.add(this);
  }
  method() {
    if (!_boy.has(this)) {
      throw new TypeError("Boy.prototype.method 只能在Boy的实例上调用！");
    }
  }
}
```
