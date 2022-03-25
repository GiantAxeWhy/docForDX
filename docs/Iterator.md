# Iterator 和 for...of 循环

JavaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了 Map 和 Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是 Map，Map 的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。

遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费。
Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

每一次调用 next 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 value 和 done 两个属性的对象。其中，value 属性是当前成员的值，done 属性是一个布尔值，表示遍历是否结束。

下面是一个模拟 next 方法返回值的例子。

```js
var it = makeIterator(['a', 'b'])

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true }
    },
  }
}
```

上面代码定义了一个 makeIterator 函数，它是一个遍历器生成函数，作用就是返回一个遍历器对象。对数组['a', 'b']执行这个函数，就会返回该数组的遍历器对象（即指针对象）it。

指针对象的 next 方法，用来移动指针。开始时，指针指向数组的开始位置。然后，每次调用 next 方法，指针就会指向数组的下一个成员。第一次调用，指向 a；第二次调用，指向 b。

next 方法返回一个对象，表示当前数据成员的信息。这个对象具有 value 和 done 两个属性，value 属性返回当前位置的成员，done 属性是一个布尔值，表示遍历是否结束，即是否还有必要再一次调用 next 方法。

总之，调用指针对象的 next 方法，就可以遍历事先给定的数据结构。

对于遍历器对象来说，done: false 和 value: undefined 属性都是可以省略的，因此上面的 makeIterator 函数可以简写成下面的形式

```js
function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++] }
        : { done: true }
    },
  }
}
```

由于 Iterator 只是把接口规格加到数据结构之上，所以，遍历器与它所遍历的那个数据结构，实际上是分开的，完全可以写出没有对应数据结构的遍历器对象，或者说用遍历器对象模拟出数据结构。下面是一个无限运行的遍历器对象的例子。

```js
var it = idMaker()

it.next().value // 0
it.next().value // 1
it.next().value // 2
// ...

function idMaker() {
  var index = 0

  return {
    next: function () {
      return { value: index++, done: false }
    },
  }
}
```

# 默认 Iterator 接口

Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即 for...of 循环（详见下文）。当使用 for...of 循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。
一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，一个数据结构只要具有 Symbol.iterator 属性，就可以认为是“可遍历的”（iterable）。Symbol.iterator 属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名 Symbol.iterator，它是一个表达式，返回 Symbol 对象的 iterator 属性，这是一个预定义好的、类型为 Symbol 的特殊值.

```js
const obj = {
  [Symbol.iterator]: function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true,
        }
      },
    }
  },
}
```

上面代码中，对象 obj 是可遍历的（iterable），因为具有 Symbol.iterator 属性。执行这个属性，会返回一个遍历器对象。该对象的根本特征就是具有 next 方法。每次调用 next 方法，都会返回一个代表当前成员的信息对象，具有 value 和 done 两个属性。

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被 for...of 循环遍历。原因在于，这些数据结构原生部署了 Symbol.iterator 属性（详见下文），另外一些数据结构没有（比如对象）。凡是部署了 Symbol.iterator 属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。

原生具备 Iterator 接口的数据结构如下。

Array
Map
Set
String
TypedArray
函数的 arguments 对象
NodeList 对象
下面的例子是数组的 Symbol.iterator 属性。

```js
let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]()

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

上面代码中，变量 arr 是一个数组，原生就具有遍历器接口，部署在 arr 的 Symbol.iterator 属性上面。所以，调用这个属性，就得到遍历器对象。

对于原生部署 Iterator 接口的数据结构，不用自己写遍历器生成函数，for...of 循环会自动遍历它们。除此之外，其他数据结构（主要是对象）的 Iterator 接口，都需要自己在 Symbol.iterator 属性上面部署，这样才会被 for...of 循环遍历。

对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定。本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map 结构，而 ES6 原生提供了。

一个对象如果要具备可被 for...of 循环调用的 Iterator 接口，就必须在 Symbol.iterator 的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）。

```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }

  [Symbol.iterator]() {
    return this
  }

  next() {
    var value = this.value
    if (value < this.stop) {
      this.value++
      return { done: false, value: value }
    }
    return { done: true, value: undefined }
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop)
}

for (var value of range(0, 3)) {
  console.log(value) // 0, 1, 2
}
```

上面代码是一个类部署 Iterator 接口的写法。Symbol.iterator 属性对应一个函数，执行后返回当前对象的遍历器对象。

对于类似数组的对象（存在数值键名和 length 属性），部署 Iterator 接口，有一个简便方法，就是 Symbol.iterator 方法直接引用数组的 Iterator 接口。

```js
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
// 或者
NodeList.prototype[Symbol.iterator] = [][Symbol.iterator]
;[...document.querySelectorAll('div')] // 可以执行了
```

NodeList 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历。上面代码中，我们将它的遍历接口改成数组的 Symbol.iterator 属性，可以看到没有任何影响。

下面是另一个类似数组的对象调用数组的 Symbol.iterator 方法的例子。

```js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator],
}
for (let item of iterable) {
  console.log(item) // 'a', 'b', 'c'
}
```

如果 Symbol.iterator 方法对应的不是遍历器生成函数（即会返回一个遍历器对象），解释引擎将会报错。

```js
var obj = {}

obj[Symbol.iterator] = () => 1
;[...obj] // TypeError: [] is not a function
```

上面代码中，变量 obj 的 Symbol.iterator 方法对应的不是遍历器生成函数，因此报错。

有了遍历器接口，数据结构就可以用 for...of 循环遍历（详见下文），也可以使用 while 循环遍历。

```js
var $iterator = ITERABLE[Symbol.iterator]()
var $result = $iterator.next()
while (!$result.done) {
  var x = $result.value
  // ...
  $result = $iterator.next()
}
```

上面代码中，ITERABLE 代表某种可遍历的数据结构，$iterator 是它的遍历器对象。遍历器对象每次移动指针（next 方法），都检查一下返回值的 done 属性，如果遍历还没结束，就移动遍历器对象的指针到下一步（next 方法），不断循环。

# 调用 Iterator 接口的场合

有一些场合会默认调用 Iterator 接口（即 Symbol.iterator 方法），除了下文会介绍的 for...of 循环，还有几个别的场合。

（1）解构赋值

对数组和 Set 结构进行解构赋值时，会默认调用 Symbol.iterator 方法。

（2）扩展运算符

扩展运算符（...）也会调用默认的 Iterator 接口。

```js
// 例一
var str = 'hello'
;[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c']
;['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

上面代码的扩展运算符内部就调用 Iterator 接口。

实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。
let arr = [...iterable];

（3）yield\*

yield\*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```js
let generator = function* () {
  yield 1
  yield* [2, 3, 4]
  yield 5
}

var iterator = generator()

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

（4）其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

      for...of
      Array.from()
      Map(), Set(), WeakMap(), WeakSet()（比如 new Map([['a',1],['b',2]])）
      Promise.all()
      Promise.race()

# 字符串的 Iterator 接口 § ⇧

字符串是一个类似数组的对象，也原生具有 Iterator 接口。

```js
var someString = 'hi'
typeof someString[Symbol.iterator]
// "function"

var iterator = someString[Symbol.iterator]()

iterator.next() // { value: "h", done: false }
iterator.next() // { value: "i", done: false }
iterator.next() // { value: undefined, done: true }
```

上面代码中，调用 Symbol.iterator 方法返回一个遍历器对象，在这个遍历器上可以调用 next 方法，实现对于字符串的遍历。

可以覆盖原生的 Symbol.iterator 方法，达到修改遍历器行为的目的。

```js
var str = new String('hi')

;[...str] // ["h", "i"]

str[Symbol.iterator] = function () {
  return {
    next: function () {
      if (this._first) {
        this._first = false
        return { value: 'bye', done: false }
      } else {
        return { done: true }
      }
    },
    _first: true,
  }
}
;[...str] // ["bye"]
str // "hi"
```

上面代码中，字符串 str 的 Symbol.iterator 方法被修改了，所以扩展运算符（...）返回的值变成了 bye，而字符串本身还是 hi。

# Iterator 接口与 Generator 函数 § ⇧

Symbol.iterator()方法的最简单实现，还是使用下一章要介绍的 Generator 函数。

```js
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1
    yield 2
    yield 3
  },
}
;[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  *[Symbol.iterator]() {
    yield 'hello'
    yield 'world'
  },
}

for (let x of obj) {
  console.log(x)
}
// "hello"
// "world"
```

上面代码中，Symbol.iterator()方法几乎不用部署任何代码，只要用 yield 命令给出每一步的返回值即可。

# for...of 循环

ES6 借鉴 C++、Java、C# 和 Python 语言，引入了 for...of 循环，作为遍历所有数据结构的统一的方法。

一个数据结构只要部署了 Symbol.iterator 属性，就被视为具有 iterator 接口，就可以用 for...of 循环遍历它的成员。也就是说，for...of 循环内部调用的是数据结构的 Symbol.iterator 方法。

for...of 循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如 arguments 对象、DOM NodeList 对象）、后文的 Generator 对象，以及字符串。

# 数组给对象部署 for of for in foreach

数组原生具备 iterator 接口（即默认部署了 Symbol.iterator 属性），for...of 循环本质上就是调用这个接口产生的遍历器，可以用下面的代码证明。

```js
const arr = ['red', 'green', 'blue']

for (let v of arr) {
  console.log(v) // red green blue
}

const obj = {}
obj[Symbol.iterator] = arr[Symbol.iterator].bind(arr)

for (let v of obj) {
  console.log(v) // red green blue
}
```

上面代码中，空对象 obj 部署了数组 arr 的 Symbol.iterator 属性，结果 obj 的 for...of 循环，产生了与 arr 完全一样的结果。

for...of 循环可以代替数组实例的 forEach 方法。

```js
const arr = ['red', 'green', 'blue']

arr.forEach(function (element, index) {
  console.log(element) // red green blue
  console.log(index) // 0 1 2
})
```

JavaScript 原有的 for...in 循环，只能获得对象的键名，不能直接获取键值。ES6 提供 for...of 循环，允许遍历获得键值。

```js
var arr = ['a', 'b', 'c', 'd']

for (let a in arr) {
  console.log(a) // 0 1 2 3
}

for (let a of arr) {
  console.log(a) // a b c d
}
```

上面代码表明，for...in 循环读取键名，for...of 循环读取键值。如果要通过 for...of 循环，获取数组的索引，可以借助数组实例的 entries 方法和 keys 方法。

for...of 循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟 for...in 循环也不一样。

```js
let arr = [3, 5, 7]
arr.foo = 'hello'

for (let i in arr) {
  console.log(i) // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i) //  "3", "5", "7"
}
```

# 对象

对于普通的对象，for...of 结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。但是，这样情况下，for...in 循环依然可以用来遍历键名。

```js
let es6 = {
  edition: 6,
  committee: 'TC39',
  standard: 'ECMA-262',
}

for (let e in es6) {
  console.log(e)
}
// edition
// committee
// standard

for (let e of es6) {
  console.log(e)
}

// TypeError: es6[Symbol.iterator] is not a function
```

上面代码表示，对于普通的对象，for...in 循环可以遍历键名，for...of 循环会报错。

一种解决方法是，使用 Object.keys 方法将对象的键名生成一个数组，然后遍历这个数组。

```js
for (var key of Object.keys(someObject)) {
  console.log(key + ': ' + someObject[key])
}
```

另一个方法是使用 Generator 函数将对象重新包装一下。

```js
const obj = { a: 1, b: 2, c: 3 }

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]]
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, '->', value)
}
// a -> 1
// b -> 2
// c -> 3
```

# 与其他遍历语法的比较 § ⇧

以数组为例，JavaScript 提供多种遍历语法。最原始的写法就是 for 循环。

```js
for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index])
}
```

这种写法比较麻烦，因此数组提供内置的 forEach 方法。

```js
myArray.forEach(function (value) {
  console.log(value)
})
```

这种写法的问题在于，无法中途跳出 forEach 循环，break 命令或 return 命令都不能奏效。

for...in 循环可以遍历数组的键名。

```js
for (var index in myArray) {
  console.log(myArray[index])
}
```

for...in 循环有几个缺点。

数组的键名是数字，但是 for...in 循环是以字符串作为键名“0”、“1”、“2”等等。
for...in 循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
某些情况下，for...in 循环会以任意顺序遍历键名。
总之，for...in 循环主要是为遍历对象而设计的，不适用于遍历数组。

for...of 循环相比上面几种做法，有一些显著的优点。

```js
for (let value of myArray) {
  console.log(value)
}
```

有着同 for...in 一样的简洁语法，但是没有 for...in 那些缺点。
不同于 forEach 方法，它可以与 break、continue 和 return 配合使用。
提供了遍历所有数据结构的统一操作接口。
下面是一个使用 break 语句，跳出 for...of 循环的例子。

```js
for (var n of fibonacci) {
  if (n > 1000) break
  console.log(n)
}
```

上面的例子，会输出斐波纳契数列小于等于 1000 的项。如果当前项大于 1000，就会使用 break 语句跳出 for...of 循环。

## for 和 foreach 的区别

for 循环是 js 提出时就有的循环方法。forEach 是 ES5 提出的，挂载在可迭代对象原型上的方法，例如 Array Set Map。

forEach 是一个迭代器，负责遍历可迭代对象。那么遍历，迭代，可迭代对象分别是什么呢。

    遍历：指的对数据结构的每一个成员进行有规律的且为一次访问的行为。
    迭代：迭代是递归的一种特殊形式，是迭代器提供的一种方法，默认情况下是按照一定顺序逐个访问数据结构成员。迭代也是一种遍历行为。
    可迭代对象：ES6中引入了 iterable 类型，Array Set Map String arguments NodeList 都属于 iterable，他们特点就是都拥有 [Symbol.iterator] 方法，包含他的对象被认为是可迭代的 iterable。

在了解这些后就知道 forEach 其实是一个迭代器，他与 for 循环本质上的区别是 forEach 是负责遍历（Array Set Map）可迭代对象的，而 for 循环是一种循环机制，只是能通过它遍历出数组。

再来聊聊究竟什么是迭代器，还记得之前提到的 Generator 生成器，当它被调用时就会生成一个迭代器对象（Iterator Object），它有一个 .next()方法，每次调用返回一个对象{value:value,done:Boolean}，value 返回的是 yield 后的返回值，当 yield 结束，done 变为 true，通过不断调用并依次的迭代访问内部的值。

迭代器是一种特殊对象。ES6 规范中它的标志是返回对象的 next() 方法，迭代行为判断在 done 之中。在不暴露内部表示的情况下，迭代器实现了遍历。看代码

```js
let arr = [1, 2, 3, 4] // 可迭代对象
let iterator = arr[Symbol.iterator]() // 调用 Symbol.iterator 后生成了迭代器对象
console.log(iterator.next()) // {value: 1, done: false}  访问迭代器对象的next方法
console.log(iterator.next()) // {value: 2, done: false}
console.log(iterator.next()) // {value: 3, done: false}
console.log(iterator.next()) // {value: 4, done: false}
console.log(iterator.next()) // {value: undefined, done: true}
```

我们看到了。只要是可迭代对象，调用内部的 Symbol.iterator 都会提供一个迭代器，并根据迭代器返回的 next 方法来访问内部，这也是 for...of 的实现原理。

把调用 next 方法返回对象的 value 值并保存在 item 中，直到 value 为 undefined 跳出循环，所有可迭代对象可供 for...of 消费。 再来看看其他可迭代对象：

```js
function num(params) {
  console.log(arguments) // Arguments(6) [1, 2, 3, 4, callee: ƒ, Symbol(Symbol.iterator): ƒ]
  let iterator = arguments[Symbol.iterator]()
  console.log(iterator.next()) // {value: 1, done: false}
  console.log(iterator.next()) // {value: 2, done: false}
  console.log(iterator.next()) // {value: 3, done: false}
  console.log(iterator.next()) // {value: 4, done: false}
  console.log(iterator.next()) // {value: undefined, done: true}
}
num(1, 2, 3, 4)

let set = new Set('1234')
set.forEach((item) => {
  console.log(item) // 1 2 3 4
})
let iterator = set[Symbol.iterator]()
console.log(iterator.next()) // {value: 1, done: false}
console.log(iterator.next()) // {value: 2, done: false}
console.log(iterator.next()) // {value: 3, done: false}
console.log(iterator.next()) // {value: 4, done: false}
console.log(iterator.next()) // {value: undefined, done: true}
```

所以我们也能很直观的看到可迭代对象中的 Symbol.iterator 属性被调用时都能生成迭代器，而 forEach 也是生成一个迭代器，在内部的回调函数中传递出每个元素的值。
（感兴趣的同学可以搜下 forEach 源码， Array Set Map 实例上都挂载着 forEach ，但网上的答案大多数是通过 length 判断长度， 利用 for 循环机制实现的。但在 Set Map 上使用会报错，所以我认为是调用的迭代器，不断调用 next，传参到回调函数。）

## foreach 的语法区别

      forEach 的参数。
      forEach 的中断。
      forEach 删除自身元素，index不可被重置。
      for 循环可以控制循环起点。

### 传参

forEach 的参数
我们真正了解 forEach 的完整传参内容吗？它大概是这样：

```js
arr.forEach((self, index, arr) => {}, this)
```

self： 数组当前遍历的元素，默认从左往右依次获取数组元素。
index： 数组当前元素的索引，第一个元素索引为 0，依次类推。
arr： 当前遍历的数组。
this： 回调函数中 this 指向。

```js
let arr = [1, 2, 3, 4]
let person = {
  name: '技术直男星辰',
}
arr.forEach(function (self, index, arr) {
  console.log(`当前元素为${self}索引为${index},属于数组${arr}`)
  console.log((this.name += '真帅'))
}, person)
```

### forEach 的中断

在 js 中有 break return continue 对函数进行中断或跳出循环的操作，我们在 for 循环中会用到一些中断行为，对于优化数组遍历查找是很好的，但由于 forEach 属于迭代器，只能按序依次遍历完成，所以不支持上述的中断行为。

### forEach 删除自身元素，index 不可被重置

在 forEach 中我们无法控制 index 的值，它只会无脑的自增直至大于数组的 length 跳出循环。所以也无法删除自身进行 index 重置，先看一个简单例子：

```js
let arr = [1, 2, 3, 4]
arr.forEach((item, index) => {
  console.log(item) // 1 2 3 4
  index++
})
```

index 不会随着函数体内部对它的增减而发生变化。在实际开发中，遍历数组同时删除某项的操作十分常见，在使用 forEach 删除时要注意。

### for 循环可以控制循环起点

如上文提到的 forEach 的循环起点只能为 0 不能进行人为干预，而 for 循环不同：

```js
let arr = [1, 2, 3, 4],
  i = 1,
  length = arr.length

for (; i < length; i++) {
  console.log(arr[i]) // 2 3 4
}
```

那之前的数组遍历并删除滋生的操作就可以写成

```js
let arr = [1, 2, 1],
  i = 0,
  length = arr.length

for (; i < length; i++) {
  // 删除数组中所有的1
  if (arr[i] === 1) {
    arr.splice(i, 1)
    //重置i，否则i会跳一位
    i--
  }
}
console.log(arr) // [2]
//等价于
var arr1 = arr.filter((index) => index !== 1)
console.log(arr1) // [2]
```

# for 循环和 forEach 的性能区别

在性能对比方面我们加入一个 map 迭代器，它与 filter 一样都是生成新数组。我们对比 for forEach map 的性能在浏览器环境中都是什么样的：
性能比较：for > forEach > map
在 chrome 62 和 Node.js v9.1.0 环境下：for 循环比 forEach 快 1 倍，forEach 比 map 快 20%左右。 原因分析

      for：for循环没有额外的函数调用栈和上下文，所以它的实现最为简单。
      forEach：对于forEach来说，它的函数签名中包含了参数和上下文，所以性能会低于 for 循环。
      map：map 最慢的原因是因为 map 会返回一个新的数组，数组的创建和赋值会导致分配内存空间，因此会带来较大的性能开销。如果将map嵌套在一个循环中，便会带来更多不必要的内存消耗。

当大家使用迭代器遍历一个数组时，如果不需要返回一个新数组却使用 map 是违背设计初衷的。在我前端合作开发时见过很多人只是为了遍历数组而用 map 的：
