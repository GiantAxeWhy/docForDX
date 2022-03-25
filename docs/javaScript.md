### js 永不休

# 1.介绍一下 js 的数据类型有哪些，值是如何存储的， null 和 undefined 的区别？

      一共有七个基本数据类型：number、string、undefined、null、boollen、symbol、bigint
      一个基本引用类型：object

其中原始数据类型是直接储存在栈中 ,占据空间小，大小固定，使用频繁，
引用数据类型放在堆和栈中，占据空间大，大小不固定，引用数据类型在栈中存放了指针指向该实体的实际存放地址。
当解释器实际寻找引用值时，检索其栈中的地址，取得地址获得实体

首先 Undefined 和 Null 都是基本数据类型，这两个基本数据类型分别都只有一个值，就是 undefined 和 null。
undefined 代表的含义是未定义，
null 代表的含义是空对象（其实不是真的对象，请看下面的注意！）。一般变量声明了但还没有定义的时候会返回 undefined，null
主要用于赋值给一些可能会返回对象的变量，作为初始化。
其实 null 不是对象，虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

# 2.JS 中判断类型 typeof，instanceof，constructor，Object.prototype.toString.call()

    typeof对于原始类型来说，除了 null 都可以显示正确的类型，typeof 对于对象来说，除了函数都会显示 object，所以说 typeof 并不能准确判断变量到底是什么类型,所以想判断一个对象的正确类型，这时候可以考虑使用 instanceof

    instanceof内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。可以看出直接的字面量值判断数据类型，instanceof可以精准判断引用数据类型（Array，Function，Object），而基本数据类型不能被instanceof精准判断。

```js
console.log((2).constructor === Number); // true
console.log(true.constructor === Boolean); // true
console.log("str".constructor === String); // true
console.log([].constructor === Array); // true
console.log(function () {}.constructor === Function); // true
console.log({}.constructor === Object); // true

//这里有一个坑，如果我创建一个对象，更改它的原型，constructor就会变得不可靠了
function Fn() {}

Fn.prototype = new Array();

var f = new Fn();

console.log(f.constructor === Fn); // false
console.log(f.constructor === Array); // true
```

Object.prototype.toString.call()使用 Object 对象的原型方法 toString ，使用 call 进行狸猫换太子，借用 Object 的 toString 方法

# 3.js 中的内置对象

全局的对象（ global objects ）或称标准内置对象，不要和 "全局对象（global object）" 混淆。这里说的全局的对象是说在
全局作用域里的对象。全局作用域中的其他对象可以由用户的脚本创建或由宿主程序提供。

标准内置对象的分类

（1）值属性，这些全局属性返回一个简单值，这些值没有自己的属性和方法。

例如 Infinity、NaN、undefined、null 字面量

（2）函数属性，全局函数可以直接调用，不需要在调用时指定所属对象，执行结束后会将结果直接返回给调用者。

例如 eval()、parseFloat()、parseInt() 等

（3）基本对象，基本对象是定义或使用其他对象的基础。基本对象包括一般对象、函数对象和错误对象。

例如 Object、Function、Boolean、Symbol、Error 等

（4）数字和日期对象，用来表示数字、日期和执行数学计算的对象。

例如 Number、Math、Date

（5）字符串，用来表示和操作字符串的对象。

例如 String、RegExp

（6）可索引的集合对象，这些对象表示按照索引值来排序的数据集合，包括数组和类型数组，以及类数组结构的对象。例如 Array

（7）使用键的集合对象，这些集合对象在存储数据时会使用到键，支持按照插入顺序来迭代元素。

例如 Map、Set、WeakMap、WeakSet

（8）矢量集合，SIMD 矢量集合中的数据会被组织为一个数据序列。

例如 SIMD 等

（9）结构化数据，这些对象用来表示和操作结构化的缓冲区数据，或使用 JSON 编码的数据。

例如 JSON 等

（10）控制抽象对象

例如 Promise、Generator 等

（11）反射

例如 Reflect、Proxy

（12）国际化，为了支持多语言处理而加入 ECMAScript 的对象。

例如 Intl、Intl.Collator 等

（13）WebAssembly

（14）其他

例如 arguments

# 4.Javascript 的作用域和作用域链

作用域：作用域是定义变量的区域，它有一套访问变量的规则，这套规则来管理浏览器引擎如何在当前作用域以及嵌套的作用域中根据变量（标识符）进行变量查找。
作用域链：保证对执行环境有权访问的所有变量和函数的有序访问，通过作用域链，我们可以访问到外层环境的变量和 函数。
作用域链的本质上是一个指向变量对象的指针列表。变量对象是一个包含了执行环境中所有变量和函数的对象。作用域链的前 端始终都是当前执行上下文的变量对象。全局执行上下文的变量对象（也就是全局对象）始终是作用域链的最后一个对象。

# 5.js 创建对象的几种方式

我们一般使用字面量的形式直接创建对象，但是这种创建方式对于创建大量相似对象的时候，会产生大量的重复代码。但 js
和一般的面向对象的语言不同，在 ES6 之前它没有类的概念。但是我们可以使用函数来进行模拟，从而产生出可复用的对象
创建方式，我了解到的方式有这么几种：

（1）第一种是工厂模式，工厂模式的主要工作原理是用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。但是它有一个很大的问题就是创建出来的对象无法和某个类型联系起来，它只是简单的封装了复用代码，而没有建立起对象和类型间的关系。

（2）第二种是构造函数模式。js 中每一个函数都可以作为构造函数，只要一个函数是通过 new 来调用的，那么我们就可以把它称为构造函数。执行构造函数首先会创建一个对象，然后将对象的原型指向构造函数的 prototype 属性，然后将执行上下文中的 this 指向这个对象，最后再执行整个函数，如果返回值不是对象，则返回新建的对象。因为 this 的值指向了新建的对象，因此我们可以使用 this 给对象赋值。构造函数模式相对于工厂模式的优点是，所创建的对象和构造函数建立起了联系，因此我们可以通过原型来识别对象的类型。但是构造函数存在一个缺点就是，造成了不必要的函数对象的创建，因为在 js 中函数也是一个对象，因此如果对象属性中如果包含函数的话，那么每次我们都会新建一个函数对象，浪费了不必要的内存空间，因为函数是所有的实例都可以通用的。

（3）第三种模式是原型模式，因为每一个函数都有一个 prototype 属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此我们可以使用原型对象来添加公用属性和方法，从而实现代码的复用。这种方式相对于构造函数模式来说，解决了函数对象的复用问题。但是这种模式也存在一些问题，一个是没有办法通过传入参数来初始化值，另一个是如果存在一个引用类型如 Array 这样的值，那么所有的实例将共享一个对象，一个实例对引用类型值的改变会影响所有的实例。

（4）第四种模式是组合使用构造函数模式和原型模式，这是创建自定义类型的最常见方式。因为构造函数模式和原型模式分开使用都存在一些问题，因此我们可以组合使用这两种模式，通过构造函数来初始化对象的属性，通过原型对象来实现函数方法的复用。这种方法很好的解决了两种模式单独使用时的缺点，但是有一点不足的就是，因为使用了两种不同的模式，所以对于代码的封装性不够好。

（5）第五种模式是动态原型模式，这一种模式将原型方法赋值的创建过程移动到了构造函数的内部，通过对属性是否存在的判断，可以实现仅在第一次调用函数时对原型对象赋值一次的效果。这一种方式很好地对上面的混合模式进行了封装。

（6）第六种模式是寄生构造函数模式，这一种模式和工厂模式的实现基本相同，我对这个模式的理解是，它主要是基于一个已有的类型，在实例化时对实例化的对象进行扩展。这样既不用修改原来的构造函数，也达到了扩展对象的目的。它的一个缺点和工厂模式一样，无法实现对象的识别。

# 6.实现继承的几种方式以及如何实现寄生式组合继承

我了解的 js 中实现继承的几种方式有：

（1）第一种是以原型链的方式来实现继承，但是这种实现方式存在的缺点是，在包含有引用类型的数据时，会被所有的实例对象所共享，容易造成修改的混乱。还有就是在创建子类型的时候不能向超类型传递参数。

（2）第二种方式是使用借用构造函数的方式，这种方式是通过在子类型的函数中调用超类型的构造函数来实现的，这一种方法解决了不能向超类型传递参数的缺点，但是它存在的一个问题就是无法实现函数方法的复用，并且超类型原型定义的方法子类型也没有办法访问到。

（3）第三种方式是组合继承，组合继承是将原型链和借用构造函数组合起来使用的一种方式。通过借用构造函数的方式来实现类型的属性的继承，通过将子类型的原型设置为超类型的实例来实现方法的继承。这种方式解决了上面的两种模式单独使用时的问题，但是由于我们是以超类型的实例来作为子类型的原型，所以调用了两次超类的构造函数，造成了子类型的原型中多了很多不必要的属性。

（4）第四种方式是原型式继承，原型式继承的主要思路就是基于已有的对象来创建新的对象，实现的原理是，向函数中传入一个对象，然后返回一个以这个对象为原型的对象。这种继承的思路主要不是为了实现创造一种新的类型，只是对某个对象实现一种简单继承，ES5 中定义的 Object.create() 方法就是原型式继承的实现。缺点与原型链方式相同。

（5）第五种方式是寄生式继承，寄生式继承的思路是创建一个用于封装继承过程的函数，通过传入一个对象，然后复制一个对象的副本，然后对象进行扩展，最后返回这个对象。这个扩展的过程就可以理解是一种继承。这种继承的优点就是对一个简单对象实现继承，如果这个对象不是我们的自定义类型时。缺点是没有办法实现函数的复用。

（6）第六种方式是寄生式组合继承，组合继承的缺点就是使用超类型的实例做为子类型的原型，导致添加了不必要的原型属性。寄生式组合继承的方式是使用超类型的原型的副本来作为子类型的原型，这样就避免了创建不必要的属性。

寄生式组合继承

```js
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function () {
  console.log("My name is " + this.name + ".");
};

function Student(name, grade) {
  Person.call(this, name);
  this.grade = grade;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.sayMyGrade = function () {
  console.log("My grade is " + this.grade + ".");
};
```

# 7.谈谈你对 this、call、apply 和 bind 的理解

this 设计的初衷是在函数内部使用，用来指代当前的运行环境。为什么这么说呢？
JavaScript 中的对象的赋值行为是将地址赋给一个变量，引擎在读取变量的时候其实就是要了个地址然后再从原始地址中读取对象。而 JavaScript 允许函数体内部引用当前环境的其他变量，而这个变量是由运行环境提供的。由于函数又可以在不同的运行环境执行（如全局作用域内执行，对象内执行...），所以需要一个机制来表明代码到底在哪里执行！于是 this 出现了，它的设计目的就是在函数体内部，指代函数当前的运行环境。

global this
在浏览器里，在全局范围内：

1、this 等价于 window 对象；
2、用 var 声明一个变量和给 this 或者 window 添加属性是等价的；
3、如果你在声明一个变量的时候没有使用 var 或者 let、const(es6),你就是在给全局的 this 添加或者改变属性值。

function this
对于函数中的 this 的指向问题，有一句话很好用：运行时 this 永远指向最后调用它的那个对象。

举一个栗子

```js
var name = "windowsName";
function sayName() {
  var name = "Jake";
  console.log(this.name); // windowsName
  console.log(this); // Window
}
sayName();
console.log(this); // Window
```

我们看最后调用 sayName 的地方 sayName();，前面没有调用的对象那么就是全局对象 window，这就相当于是 window.sayName()。

```js
function foo() {
  console.log(this.age);
}

var obj1 = {
  age: 23,
  foo: foo,
};

var obj2 = {
  age: 18,
  obj1: obj1,
};

obj2.obj1.foo(); // 23
```

还是开头的那句话，最后调用 foo()的是 obj1，所以 this 指向 obj1，输出 23。

构造函数中的 this
所谓构造函数，就是通过这个函数生成一个新对象（object）。当一个函数作为构造器使用时(通过 new 关键字), 它的 this 值绑定到新创建的那个对象。如果没使用 new 关键字, 那么他就只是一个普通的函数, this 将指向 window 对象。

```js
var a = new Foo("zhang","jake");

new Foo{
    var obj = {};
    obj.__proto__ = Foo.prototype;
    var result = Foo.call(obj,"zhang","jake");
    return typeof result === 'obj'? result : obj;
}

```

若执行 new Foo()，过程如下：
1）创建新对象 obj；
2）给新对象的内部属性赋值，构造原型链（将新对象的隐式原型指向其构造函数的显示原型）；
3）执行函数 Foo，执行过程中内部 this 指向新创建的对象 obj（这里使用了 call 改变 this 指向）；
4）如果 Foo 内部显式返回对象类型数据，则返回该数据，执行结束；否则返回新创建的对象 obj。

```js
var name = "Jake";
jiuzhixiang;
function testThis() {
  this.name = "jakezhang";
  this.sayName = function () {
    return this.name;
  };
}
console.log(this.name); // Jake

new testThis();
console.log(this.name); // Jake

var result = new testThis();
console.log(result.name); // jakezhang
console.log(result.sayName()); // jakezhang

testThis();
console.log(this.name); // jakezhang
```

class 中的 this
在 es6 中，类，是 JavaScript 应用程序中非常重要的一个部分。类通常包含一个 constructor ， this 可以指向任何新创建的对象。
不过在作为方法时，如果该方法作为普通函数被调用， this 也可以指向任何其他值。与方法一样，类也可能失去对接收器的跟踪。

```js
class Hero {
  constructor(heroName) {
    this.heroName = heroName;
  }
  dialogue() {
    console.log(`I am ${this.heroName}`);
  }
}
const batman = new Hero("Batman");
batman.dialogue();
```

构造函数里的 this 指向新创建的 类实例。当我们调用 batman.dialogue()时， dialogue()作为方法被调用， batman 是它的接收器。
但是如果我们将 dialogue()方法的引用存储起来，并稍后将其作为函数调用，我们会丢失该方法的接收器，此时 this 参数指向 undefined 。

```js
const say = batman.dialogue;
say();
```

出现错误的原因是 JavaScript 类是隐式的运行在严格模式下的。我们是在没有任何自动绑定的情况下调用 say()函数的。要解决这个问题，我们需要手动使用 bind()将 dialogue()函数与 batman 绑定在一起。

```js
const say = batman.dialogue.bind(batman);
say();
```

箭头函数中的 this
es5 中的 this 要看函数在什么地方调用（即要看运行时），通过谁是最后调用它该函数的对象来判断 this 指向。但 es6 的箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined。箭头函数的 this 始终指向函数定义时的 this，而非执行时。

```js
let name = "zjk";

let o = {
  name: "Jake",

  sayName: function () {
    console.log(this.name);
  },

  func: function () {
    setTimeout(() => {
      this.sayName();
    }, 100);
  },
};

o.func(); // Jake
```

使用 call 、 apply 或 bind 等方法给 this 传值，箭头函数会忽略。箭头函数引用的是箭头函数在创建时设置的 this 值。

call & apply

```js
var name = "zjk";
function fun() {
  console.log(this.name);
}

var obj = {
  name: "jake",
};
fun(); // zjk
fun.call(obj); //Jake
```

每个函数都包含两个非继承而来的方法：apply()和 call()。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 this 对象的值。
apply()
apply()方法接收两个参数：一个是在其中运行函数的作用域，另一个是参数数组。其中，第二个参数可以是 Array 的实例，也可以是 arguments 对象。

```js
function sum(num1, num2) {
  return num1 + num2;
}
function callSum1(num1, num2) {
  return sum.apply(this, arguments); // 传入 arguments 对象
}
function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2]); // 传入数组
}
console.log(callSum1(10, 10)); //20
console.log(callSum2(10, 10)); //20
```

call()
call()方法与 apply()方法的作用相同，它们的唯一区别在于接收参数的方式不同。在使用 call()方法时，传递给函数的参数必须逐个列举出来。

```js
function sum(num1, num2) {
  return num1 + num2;
}
function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}
console.log(callSum(10, 10)); //20
```

call()方法与 apply()方法返回的结果是完全相同的，至于是使用 apply()还是 call()，完全取决于你采取哪种给函数传递参数的方式最方便。

参数数量/顺序确定就用 call，参数数量/顺序不确定的话就用 apply。
考虑可读性：参数数量不多就用 call，参数数量比较多的话，把参数整合成数组，使用 apply。
bind()
bind()方法会创建一个函数的实例，其 this 值会被绑定到传给 bind()函数的值。意思就是 bind() 会返回一个新函数。例如：

```js
window.color = "red";
var o = { color: "blue" };
function sayColor() {
  alert(this.color);
}
var objectSayColor = sayColor.bind(o);
objectSayColor(); //blue
```

call/apply 与 bind 的区别
执行：

call/apply 改变了函数的 this 上下文后马上执行该函数
bind 则是返回改变了上下文后的函数,不执行该函数

```js
function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

add.bind(sub, 5, 3); // 这时，并不会返回 8
add.bind(sub, 5, 3)(); // 调用后，返回 8
```

返回值:

call/apply 返回 fun 的执行结果
bind 返回 fun 的拷贝，并指定了 fun 的 this 指向，保存了 fun 的参数。

从上面几个简单的例子可以看出 call/apply/bind 是在向其他对象借用方法，这也符合我们的正常思维，举个简单的栗子。
我和我高中一个同学玩的超级好，衣服鞋子都是共穿的，去买衣服的时候，他买衣服，我买鞋子；回来后某天我想穿他买的衣服了，但是我没有，于是我就借用他的穿。这样我就既达到了穿新衣服的目的，又节省了 money~
A 对象有个方法，B 对象因为某种原因也需要用到同样的方法，这时候就可以让 B 借用 A 对象的方法啦，既达到了目的，又节省了内存。
这就是 call/apply/bind 的核心理念：借。

手写实现 apply、call、bind
apply
1、先给 Function 原型上扩展个方法并接收 2 个参数,

```js
Function.prototype.myApply = function (context, args) {};
```

2、因为不传 context 的话,this 会指向 window,所以这里将 context 和 args 做一下容错处理

```js
Function.prototype.myApply = function (context, args) {
  // 处理容错
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
};
```

3、使用隐式绑定去实现显式绑定

```js
Function.prototype.myApply = function (context, args) {
  // 处理容错
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this;
  //通过隐式绑定的方式调用函数
  context[key](...args);
};
```

4、最后一步要返回函数调用的返回值,并且把 context 上的属性删了才不会造成影响

```js
Function.prototype.myApply = function (context, args) {
  // 处理容错
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this;
  //通过隐式绑定的方式调用函数
  const result = context[key](...args);
  //删除添加的属性
  delete context[key];
  //返回函数调用的返回值
  return result;
};
```

验证

```js
function fun(...args) {
  console.log(this.name, ...args);
}
const result = {
  name: "Jake",
};
// 参数为数组;方法立即执行
fun.myApply(result, [1, 2]);
```

call

```js
//传递参数从一个数组变成逐个传参了,不用...扩展运算符的也可以用arguments代替
Function.prototype.NealCall = function (context, ...args) {
  //这里默认不传就是给window,也可以用es6给参数设置默认参数
  context = typeof context === "object" ? context : window;
  args = args ? args : [];
  //给context新增一个独一无二的属性以免覆盖原有属性
  const key = Symbol();
  context[key] = this;
  //通过隐式绑定的方式调用函数
  const result = context[key](...args);
  //删除添加的属性
  delete context[key];
  //返回函数调用的返回值
  return result;
};
```

bind
bind 的实现要稍微麻烦一点，因为 bind 是返回一个绑定好的函数,apply 是直接调用.但其实简单来说就是返回一个函数,里面执行了 apply 上述的操作而已.不过有一个需要判断的点,因为返回新的函数,要考虑到使用 new 去调用,并且 new 的优先级比较高,所以需要判断 new 的调用,还有一个特点就是 bind 调用的时候可以传参,调用之后生成的新的函数也可以传参,效果是一样的,所以这一块也要做处理。

```js
Function.prototype.myBind = function (objThis, ...params) {
  const thisFn = this; // 存储源函数以及上方的params(函数参数)
  // 对返回的函数 secondParams 二次传参
  let fToBind = function (...secondParams) {
    const isNew = this instanceof fToBind; // this是否是fToBind的实例 也就是返回的fToBind是否通过new调用
    const context = isNew ? this : Object(objThis); // new调用就绑定到this上,否则就绑定到传入的objThis上
    return thisFn.call(context, ...params, ...secondParams); // 用call调用源函数绑定this的指向并传递参数,返回执行结果
  };
  if (thisFn.prototype) {
    // 复制源函数的prototype给fToBind 一些情况下函数没有prototype，比如箭头函数
    fToBind.prototype = Object.create(thisFn.prototype);
  }
  return fToBind; // 返回拷贝的函数
};
```

      总结
      在浏览器里，在全局范围内 this 指向 window 对象；
      在函数中，this 永远指向最后调用他的那个对象；
      构造函数中，this 指向 new 出来的那个新的对象；
      call、apply、bind 中的 this 被强绑定在指定的那个对象上；
      箭头函数中 this 比较特殊,箭头函数 this 为父作用域的 this，不是调用时的 this.要知道前四种方式,都是调用时确定,也就是动态的,而箭头函数的 this 指向是静态的,声明的时候就确定了下来；
      apply、call、bind 都是 js 给函数内置的一些 API，调用他们可以为函数指定 this 的执行,同时也可以传参。

# 8.JavaScript 原型，原型链？ 有什么特点？

在 js 中我们是使用构造函数来新建一个对象的，每一个构造函数的内部都有一个 prototype 属性值，这个属性值是一个对
象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法。当我们使用构造函数新建一个对象后，在这个对象的内部
将包含一个指针，这个指针指向构造函数的 prototype 属性对应的值，在 ES5 中这个指针被称为对象的原型。一般来说我们
是不应该能够获取到这个值的，但是现在浏览器中都实现了 proto 属性来让我们访问这个属性，但是我们最好不要使用这
个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，我们可以通过这个方法来获取对
象的原型。
当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又
会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 Object.prototype 所以这就
是我们新建的对象为什么能够使用 toString() 等方法的原因。
特点：
JavaScript 对象是通过引用来传递的，我们创建的每个新对象实体中并没有一份属于自己的原型副本。当我们修改原型时，与
之相关的对象也会继承这一改变。
可以参考

[原型与原型链](prototype)

js 获取原型的方法
p.proto
p.constructor.prototype
Object.getPrototypeOf(p)

# 9.什么是闭包，为什么要用它？

闭包是指有权访问另一个函数作用域内变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，创建的函数可以
访问到当前函数的局部变量。
闭包有两个常用的用途。

闭包的第一个用途是使我们在函数外部能够访问到函数内部的变量。通过使用闭包，我们可以通过在外部调用闭包函数，从而在外部访问到函数内部的变量，可以使用这种方法来创建私有变量。
函数的另一个用途是使已经运行结束的函数上下文中的变量对象继续留在内存中，因为闭包函数保留了这个变量对象的引用，所以这个变量对象不会被回收。
其实闭包的本质就是作用域链的一个特殊的应用，只要了解了作用域链的创建过程，就能够理解闭包的实现原理。
[闭包](closure)

# 10.什么是 DOM 和 BOM？

DOM 指的是文档对象模型，它指的是把文档当做一个对象来对待，这个对象主要定义了处理网页内容的方法和接口。
BOM 指的是浏览器对象模型，它指的是把浏览器当做一个对象来对待，这个对象主要定义了与浏览器进行交互的法和接口。BOM
的核心是 window，而 window 对象具有双重角色，它既是通过 js 访问浏览器窗口的一个接口，又是一个 Global（全局）
对象。这意味着在网页中定义的任何对象，变量和函数，都作为全局对象的一个属性或者方法存在。window 对象含有 locati
on 对象、navigator 对象、screen 对象等子对象，并且 DOM 的最根本的对象 document 对象也是 BOM 的 window 对
象的子对象。

# 11.三种事件模型是什么

事件 是用户操作网页时发生的交互动作或者网页本身的一些操作，现代浏览器一共有三种事件模型。\

      1、DOM0 级别模型：
      不会传播，没有事件流，但是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义监听函数，也可以通过 js 属性来指定监听函数。这种方式是所有浏览器都兼容的。
      2、IE 事件模型：
      事件有两个过程：1、事件处理过程。2、事件冒泡阶段。事件处理首先会执行目标元素绑定的监听事件。事件冒泡阶段，冒泡指的是事件从目标元素冒泡到 dom，依次检查经过的节点是否绑定了事件监听函数，有绑定就执行，这种模型通过 attachEvent 来添加监听函数，可以添加多个监听函数，按顺序依次执行
      3、DOM2 级事件模型：在该事件模型中，一次事件共有三个过程，第一个过程是事件捕获阶段。捕获指的是事件从 document 一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。后面两个阶段和 IE 事件模型的两个阶段相同。这种事件模型，事件绑定的函数是 addEventListener，其中第三个参数可以指定事件是否在捕获阶段执行。

一个 DOM 元素绑定多个事件时，先执行冒泡还是捕获：
https://blog.csdn.net/u013217071/article/details/77613706
绑定在被点击元素的事件是按照代码顺序发生，其他元素通过冒泡或者捕获“感知”的事件，按照 W3C 的标准，先发生捕获事件，后发生冒泡事件。所有事件的顺序是：其他元素捕获阶段事件 -> 本元素代码顺序事件 -> 其他元素冒泡阶段事件 。
从上往下，如有捕获事件，则执行；一直向下到目标元素后，从目标元素开始向上执行冒泡元素，即第三个参数为 true 表示捕获阶段调用事件处理程序，如果是 false 则是冒泡阶段调用事件处理程序。(在向上执行过程中，已经执行过的捕获事件不再执行，只执行冒泡事件。)

# 12.事件委托是什么？

事件委托 本质上是利用了浏览器事件冒泡的机制。因为事件在冒泡过程中会上传到父节点，并且父节点可以通过事件对象获取到
目标节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为事件代理。
使用事件代理我们可以不必要为每一个子元素都绑定一个监听事件，这样减少了内存上的消耗。并且使用事件代理我们还可以实现事件的动态绑定，比如说新增了一个子节点，我们并不需要单独地为它添加一个监听事件，它所发生的事件会交给父元素中的监听函数来处理。

事件委托，通俗地来讲，就是把一个元素响应事件（click、keydown......）的函数委托到另一个元素；
一般来讲，会把一个或者一组元素的事件委托到它的父层或者更外层元素上，真正绑定事件的是外层元素，当事件响应到需要绑定的元素上时，会通过事件冒泡机制从而触发它的外层元素的绑定事件上，然后在外层元素上去执行函数。

        举个例子，比如一个宿舍的同学同时快递到了，一种方法就是他们都傻傻地一个个去领取，还有一种方法就是把这件事情委托给宿舍长，让一个人出去拿好所有快递，然后再根据收件人一一分发给每个宿舍同学；

        在这里，取快递就是一个事件，每个同学指的是需要响应事件的 DOM 元素，而出去统一领取快递的宿舍长就是代理的元素，所以真正绑定事件的是这个元素，按照收件人分发快递的过程就是在事件执行中，需要判断当前响应的事件应该匹配到被代理元素中的哪一个或者哪几个。

事件冒泡

前面提到 DOM 中事件委托的实现是利用事件冒泡的机制，那么事件冒泡是什么呢？
在 document.addEventListener 的时候我们可以设置事件模型：事件冒泡、事件捕获，一般来说都是用事件冒泡的模型；

如上图所示，事件模型是指分为三个阶段：

捕获阶段：在事件冒泡的模型中，捕获阶段不会响应任何事件；
目标阶段：目标阶段就是指事件响应到触发事件的最底层元素上；
冒泡阶段：冒泡阶段就是事件的触发响应会从最底层目标一层层地向外到最外层（根节点），事件代理即是利用事件冒泡的机制把里层所需要响应的事件绑定到外层；### 事件

# 13.什么事件传播

当事件发生在 DOM 元素上时，该事件并不完全发生在那个元素上。在“当事件发生在 DOM 元素上时，该事件并不完全发生在那个元素上。
事件传播有三个阶段：

捕获阶段–事件从 window 开始，然后向下到每个元素，直到到达目标元素事件或 event.target。
目标阶段–事件已达到目标元素。
冒泡阶段–事件从目标元素冒泡，然后上升到每个元素，直到到达 window。

# 14.什么是事件捕获

当事件发生在 DOM 元素上时，该事件并不完全发生在那个元素上。在捕获阶段，事件从 window 开始，一直到触发事件的元素。window----> document----> html----> body ---->目标元素

addEventListener 方法具有第三个可选参数 useCapture，其默认值为 false，事件将在冒泡阶段中发生，如果为 true，则事件将在捕获阶段中发生。如果单击 child 元素，它将分别在控制台上打印 window，document，html，grandparent 和 parent，这就是事件捕获。

# 15. 什么是事件冒泡？

事件冒泡刚好与事件捕获相反，当前元素---->body ----> html---->document ---->window。当事件发生在 DOM 元素上时，该事件并不完全发生在那个元素上。在冒泡阶段，事件冒泡，或者事件发生在它的父代，祖父母，祖父母的父代，直到到达 window 为止。

addEventListener 方法具有第三个可选参数 useCapture，其默认值为 false，事件将在冒泡阶段中发生，如果为 true，则事件将在捕获阶段中发生。如果单击 child 元素，它将分别在控制台上打印 child，parent，grandparent，html，document 和 window，这就是事件冒泡。

# 16. DOM 操作——怎样添加、移除、移动、复制、创建和查找节点？

1、新键

```js
createDocumentFragment(); //创建一个DOM片段
createElement(); //创建一个具体的元素
createTextNode(); //创建一个文本节点
```

2、添加、移除、替换、插入

```js
appendChild(node)
removeChild(node)
replaceChild(new,old)
insertBefore(new,old)

```

3、查找

```js
getElementById();
getElementsByName();
getElementsByTagName();
getElementsByClassName();
querySelector();
querySelectorAll();
```

4、属性操作

```js
getAttribute(key);
setAttribute(key, value);
hasAttribute(key);
removeAttribute(key);
```

# 17.正则表达式

```js
//（1）匹配 16 进制颜色值
var color = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g;

//（2）匹配日期，如 yyyy-mm-dd 格式
var date = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

//（3）匹配 qq 号
var qq = /^[1-9][0-9]{4,10}$/g;

//（4）手机号码正则
var phone = /^1[34578]\d{9}$/g;

//（5）用户名正则
var username = /^[a-zA-Z\$][a-zA-Z0-9_\$]{4,16}$/;

//（6）Email正则
var email = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

//（7）身份证号（18位）正则
var cP =
  /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

//（8）URL正则
var urlP =
  /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// (9)ipv4地址正则
var ipP =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// (10)//车牌号正则
var cPattern =
  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;

// (11)强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间)：var pwd = /^(?=.\d)(?=.[a-z])(?=.[A-Z]).{8,10}$/
```

# 18. Ajax 是什么? 如何创建一个 Ajax？

我对 ajax 的理解是，它是一种异步通信的方法，通过直接由 js 脚本向服务器发起 http 通信，然后根据服务器返回的数据，更新网页的相应部分，而不用刷新整个页面的一种方法。

```js
//1：创建Ajax对象
var xhr = window.XMLHttpRequest
  ? new XMLHttpRequest()
  : new ActiveXObject("Microsoft.XMLHTTP"); // 兼容IE6及以下版本
//2：配置 Ajax请求地址
xhr.open("get", "index.xml", true);
//3：发送请求
xhr.send(null); // 严谨写法
//4:监听请求，接受响应
xhr.onreadysatechange = function () {
  if ((xhr.readySate == 4 && xhr.status == 200) || xhr.status == 304)
    console.log(xhr.responsetXML);
};
```

promise

```js
// promise 封装实现：

function getJSON(url) {
  // 创建一个 promise 对象
  let promise = new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    // 新建一个 http 请求
    xhr.open("GET", url, true);

    // 设置状态的监听函数
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      // 当请求成功或失败时，改变 promise 的状态
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };

    // 设置错误监听函数
    xhr.onerror = function () {
      reject(new Error(this.statusText));
    };

    // 设置响应的数据类型
    xhr.responseType = "json";

    // 设置请求头信息
    xhr.setRequestHeader("Accept", "application/json");

    // 发送 http 请求
    xhr.send(null);
  });

  return promise;
}
```

# 19.谈谈你对模块化的理解

我对模块的理解是，一个模块是实现一个特定功能的一组方法。在最开始的时候，js 只实现一些简单的功能，所以并没有模块的概念
，但随着程序越来越复杂，代码的模块化开发变得越来越重要。
由于函数具有独立作用域的特点，最原始的写法是使用函数来作为模块，几个函数作为一个模块，但是这种方式容易造成全局变量的污
染，并且模块间没有联系。
后面提出了对象写法，通过将函数作为一个对象的方法来实现，这样解决了直接使用函数作为模块的一些缺点，但是这种办法会暴露所
有的所有的模块成员，外部代码可以修改内部属性的值。
现在最常用的是立即执行函数的写法，通过利用闭包来实现模块私有作用域的建立，同时不会对全局作用域造成污染。

# 20. js 的几种模块规范？

js 中现在比较成熟的有四种模块加载方案：

第一种是 CommonJS 方案，它通过 require 来引入模块，通过 module.exports 定义模块的输出接口。这种模块加载方案是服务器端的解决方案，它是以同步的方式来引入模块的，因为在服务端文件都存储在本地磁盘，所以读取非常快，所以以同步的方式加载没有问题。但如果是在浏览器端，由于模块的加载是使用网络请求，因此使用异步加载的方式更加合适。
第二种是 AMD 方案，这种方案采用异步加载的方式来加载模块，模块的加载不影响后面语句的执行，所有依赖这个模块的语句都定义在一个回调函数里，等到加载完成后再执行回调函数。require.js 实现了 AMD 规范。
第三种是 CMD 方案，这种方案和 AMD 方案都是为了解决异步模块加载的问题，sea.js 实现了 CMD 规范。它和 require.js 的区别在于模块定义时对依赖的处理不同和对依赖模块的执行时机的处理不同。
第四种方案是 ES6 提出的方案，使用 import 和 export 的形式来导入导出模块。

# 21. AMD 和 CMD 规范的区别？

它们之间的主要区别有两个方面。

第一个方面是在模块定义时对依赖的处理不同。AMD 推崇依赖前置，在定义模块的时候就要声明其依赖的模块。而 CMD 推崇就近依赖，只有在用到某个模块的时候再去 require。
第二个方面是对依赖模块的执行时机处理不同。首先 AMD 和 CMD 对于模块的加载方式都是异步加载，不过它们的区别在于

模块的执行时机，AMD 在依赖模块加载完成后就直接执行依赖模块，依赖模块的执行顺序和我们书写的顺序不一定一致。而 CMD
在依赖模块加载完成后并不执行，只是下载而已，等到所有的依赖模块都加载好后，进入回调函数逻辑，遇到 require 语句
的时候才执行对应的模块，这样模块的执行顺序就和我们书写的顺序保持一致了。

```js
// CMD
define(function (require, exports, module) {
  var a = require("./a");
  a.doSomething();
  // 此处略去 100 行
  var b = require("./b"); // 依赖可以就近书写
  b.doSomething();
  // ...
});

// AMD 默认推荐
define(["./a", "./b"], function (a, b) {
  // 依赖必须一开始就写好
  a.doSomething();
  // 此处略去 100 行
  b.doSomething();
  // ...
});
```

# 22. ES6 模块与 CommonJS 模块、AMD、CMD 的差异。

1.CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。CommonJS 模块输出的是值的

，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

2.CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。CommonJS 模块就是对象，即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

# 23. requireJS 的核心原理是什么？

require.js 的核心原理是通过动态创建 script 脚本来异步引入模块，然后对每个脚本的 load 事件进行监听，如果每个脚本都加载完成了，再调用回调函数。
1，概念

requireJS 是基于 AMD 模块加载规范，使用回调函数来解决模块加载的问题。

2，原理 （如何动态加载的？）

requireJS 是使用创建 script 元素，通过指定 script 元素的 src 属性来实现加载模块的。

3，特点

1. 实现 js 文件的异步加载，避免网页失去响应

2，管理模块之间的依赖，便于代码的编写和维护

4，requireJS 为何不会多次加载同一个文件?怎么理解内部机制?

模块的定义是一个 function，这个 function 实际是一个 factory（工厂模式），这个 factory 在需要使用的时候（require("xxxx") 的时候）才有可能会被调用。因为如果检查到已经调用过，已经生成了模块实例，就直接返回模块实例，而不再次调用工厂方法了。

# 24.JS 的运行机制

1.  js 单线程
    JavaScript 语言的一大特点就是单线程，即同一时间只能做一件事情。

          JavaScript的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

2.  js 事件循环
    微任务包括了 promise 的回调、node 中的 process.nextTick 、对 Dom 变化监听的 MutationObserver。

    宏任务包括了 script 脚本的执行、setTimeout ，setInterval ，setImmediate 一类的定时事件，还有如 I/O 操作、UI 渲
    染等。

1、首先 js 是单线程运行的，在代码执行的时候，通过将不同函数的执行上下文压入执行栈中来保证代码的有序执行。

2、在执行同步代码的时候，如果遇到了异步事件，js 引擎并不会一直等待其返回结果，而是会将这个事件挂起，继续执行执行栈中的其他任务

3、当同步事件执行完毕后，再将异步事件对应的回调加入到与当前执行栈中不同的另一个任务队列中等待执行。

4、任务队列可以分为宏任务对列和微任务对列，当当前执行栈中的事件执行完毕后，js 引擎首先会判断微任务对列中是否有任务可以执行，如果有就将微任务队首的事件压入栈中执行。

5、当微任务对列中的任务都执行完成后再去判断宏任务对列中的任务。

# 25. arguments 的对象是什么？

arguments 对象是函数中传递的参数值的集合。它是一个类似数组的对象，因为它有一个 length 属性，我们可以使用数组索引表示法 arguments[1]来访问单个值，但它没有数组中的内置方法，如：forEach、reduce、filter 和 map。

我们可以使用 Array.prototype.slice 将 arguments 对象转换成一个数组。

```js
function one() {
  return Array.prototype.slice.call(arguments);
}
```

注意:箭头函数中没有 arguments 对象。

# 26.V8 引擎的垃圾回收机制

v8 的垃圾回收机制基于分代回收机制，这个机制又基于世代假说，这个假说有两个特点，一是新生的对象容易早死，另一个是不死的对象会活得更久。基于这个假说，v8 引擎将内存分为了新生代和老生代。

新创建的对象或者只经历过一次的垃圾回收的对象被称为新生代。经历过多次垃圾回收的对象被称为老生代。

新生代被分为 From 和 To 两个空间，To 一般是闲置的。当 From 空间满了的时候会执行 Scavenge 算法进行垃圾回收。当我们执行垃圾回收算法的时候应用逻辑将会停止，等垃圾回收结束后再继续执行。这个算法分为三步：

（1）首先检查 From 空间的存活对象，如果对象存活则判断对象是否满足晋升到老生代的条件，如果满足条件则晋升到老生代。如果不满足条件则移动 To 空间。

（2）如果对象不存活，则释放对象的空间。

（3）最后将 From 空间和 To 空间角色进行交换。

新生代对象晋升到老生代有两个条件：

（1）第一个是判断是对象否已经经过一次 Scavenge 回收。若经历过，则将对象从 From 空间复制到老生代中；若没有经历，则复制到 To 空间。

（2）第二个是 To 空间的内存使用占比是否超过限制。当对象从 From 空间复制到 To 空间时，若 To 空间使用超过 25%，则对象直接晋升到老生代中。设置 25% 的原因主要是因为算法结束后，两个空间结束后会交换位置，如果 To 空间的内存太小，会影响后续的内存分配。

老生代采用了标记清除法和标记压缩法。标记清除法首先会对内存中存活的对象进行标记，标记结束后清除掉那些没有标记的对象。由于标记清除后会造成很多的内存碎片，不便于后面的内存分配。所以了解决内存碎片的问题引入了标记压缩法。

由于在进行垃圾回收的时候会暂停应用的逻辑，对于新生代方法由于内存小，每次停顿的时间不会太长，但对于老生代来说每次垃圾回收的时间长，停顿会造成很大的影响。 为了解决这个问题 V8 引入了增量标记的方法，将一次停顿进行的过程分为了多步，每次执行完一小步就让运行逻辑执行一会，就这样交替运行。

# 27. 哪些操作会造成内存泄漏？

1.意外的全局变量 2.被遗忘的计时器或回调函数 3.脱离 DOM 的引用 4.闭包

第一种情况是我们由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。
第二种情况是我们设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。
第三种情况是我们获取一个 DOM 元素的引用，而后面这个元素被删除，由于我们一直保留了对这个元素的引用，所以它也无法被回收。
第四种情况是不合理的使用闭包，从而导致某些变量一直被留在内存当中。

# 28.ECMAScript 2015（ES6）有哪些新特性？

块作用域

类

箭头函数

模板字符串

加强的对象字面

对象解构

Promise

模块

Symbol

代理（proxy）Set

函数默认参数

rest 和展开

# 29.var,let 和 const 的区别是什么？

三个方面：
1、var 声明的变量存在变量提升，即变量可以在声明之前调用，值为 undefined
et 和 const 不存在变量提升问题(注意这个‘问题’后缀，其实是有提升的，只不过是 let 和 const 具有一个暂时性死区的概念，即没有到其赋值时，之前就不能用)，即它们所声明的变量一定要在声明后使用，否则报错。
2、块级作用域方面：var 不存在块级作用域,let 和 const 存在块级作用域
3、声明方面：var 允许重复声明变量,let 和 const 在同一作用域不允许重复声明变量。其中 const 声明一个只读的常量(因为如此，其声明时就一定要赋值，不然报错)。一旦声明，常量的值就不能改变。
4、如何使 const 声明的对象内属性不可变，只可读呢？：如果 const 声明了一个对象，对象里的属性是可以改变的。

```js
const obj = { name: "蟹黄" };
obj.name = "同学";
console.log(obj.name); //同学
```

因为 const 声明的 obj 只是保存着其对象的引用地址，只要地址不变，就不会出错。
使用 Object.freeze(obj) 冻结 obj,就能使其内的属性不可变,但它有局限，就是 obj 对象中要是有属性是对象，该对象内属性还能改变，要全不可变，就需要使用递归等方式一层一层全部冻结。

# 30. 什么是箭头函数？

箭头函数表达式的语法比函数表达式更简洁，并且没有自己的 this，arguments，super 或 new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

```js
//ES5 Version
var getCurrentDate = function () {
  return new Date();
};

//ES6 Version
const getCurrentDate = () => new Date();
```

在本例中，ES5 版本中有 function(){}声明和 return 关键字，这两个关键字分别是创建函数和返回值所需要的。在箭头函数版本中，我们只需要()括号，不需要 return 语句，因为如果我们只有一个表达式或值需要返回，箭头函数就会有一个隐式的返回。
我们还可以在箭头函数中使用与函数表达式和函数声明相同的参数。如果我们在一个箭头函数中有一个参数，则可以省略括号。

```js
const getArgs = () => arguments;

const getArgs2 = (...rest) => rest;
```

箭头函数不能访问 arguments 对象。所以调用第一个 getArgs 函数会抛出一个错误。相反，我们可以使用 rest 参数来获得在箭头函数中传递的所有参数。

```js
const data = {
  result: 0,
  nums: [1, 2, 3, 4, 5],
  computeResult() {
    // 这里的“this”指的是“data”对象
    const addAll = () => {
      return this.nums.reduce((total, cur) => total + cur, 0);
    };
    this.result = addAll();
  },
};
```

1、箭头函数没有自己的 this 值。它捕获词法作用域函数的 this 值，在此示例中，addAll 函数将复制 computeResult 方法中的 this 值，如果我们在全局作用域声明箭头函数，则 this 值为 window 对象。
2、箭头函数没有 prototype(原型)，所以箭头函数本身没有 this
3、箭头函数的 this 在定义的时候继承自外层第一个普通函数的 this。
4、如果箭头函数外层没有普通函数，严格模式和非严格模式下它的 this 都会指向 window(全局对象)
5、箭头函数本身的 this 指向不能改变，但可以修改它要继承的对象的 this。
6、箭头函数的 this 指向全局，使用 arguments 会报未声明的错误。
7、箭头函数的 this 指向普通函数时,它的 argumens 继承于该普通函数
8、使用 new 调用箭头函数会报错，因为箭头函数没有 constructor
9、箭头函数不支持 new.target
10、箭头函数不支持重命名函数参数,普通函数的函数参数支持重命名
11、箭头函数相对于普通函数语法更简洁优雅

箭头函数有几个使用注意点。

（1）箭头函数没有自己的 this 对象（详见下文）。

（2）不可以当作构造函数，也就是说，不可以对箭头函数使用 new 命令，否则会抛出一个错误。

（3）不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。

上面四点中，最重要的是第一点。对于普通函数来说，内部的 this 指向函数运行时所在的对象，但是这一点对箭头函数不成立。它没有自己的 this 对象，内部的 this 就是定义时上层作用域中的 this。也就是说，箭头函数内部的 this 指向是固定的，相比之下，普通函数的 this 指向是可变的。

```js
function foo() {
  setTimeout(() => {
    console.log("id:", this.id);
  }, 100);
}

var id = 21;

foo.call({ id: 42 });
// id: 42
```

上面代码中，setTimeout()的参数是一个箭头函数，这个箭头函数的定义生效是在 foo 函数生成时，而它的真正执行要等到 100 毫秒后。如果是普通函数，执行时 this 应该指向全局对象 window，这时应该输出 21。但是，箭头函数导致 this 总是指向函数定义生效时所在的对象（本例是{id: 42}），所以打印出来的是 42。

下面例子是回调函数分别为箭头函数和普通函数，对比它们内部的 this 指向。

```js
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // 箭头函数
  setInterval(() => this.s1++, 1000);
  // 普通函数
  setInterval(function () {
    this.s2++;
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log("s1: ", timer.s1), 3100);
setTimeout(() => console.log("s2: ", timer.s2), 3100);
// s1: 3
// s2: 0
```

上面代码中，Timer 函数内部设置了两个定时器，分别使用了箭头函数和普通函数。前者的 this 绑定定义时所在的作用域（即 Timer 函数），后者的 this 指向运行时所在的作用域（即全局对象）。所以，3100 毫秒之后，timer.s1 被更新了 3 次，而 timer.s2 一次都没更新。

箭头函数实际上可以让 this 指向固定化，绑定 this 使得它不再可变，这种特性很有利于封装回调函数。下面是一个例子，DOM 事件的回调函数封装在一个对象里面。

```js
var handler = {
  id: "123456",

  init: function () {
    document.addEventListener(
      "click",
      (event) => this.doSomething(event.type),
      false
    );
  },

  doSomething: function (type) {
    console.log("Handling " + type + " for " + this.id);
  },
};
```

上面代码的 init()方法中，使用了箭头函数，这导致这个箭头函数里面的 this，总是指向 handler 对象。如果回调函数是普通函数，那么运行 this.doSomething()这一行会报错，因为此时 this 指向 document 对象。

总之，箭头函数根本没有自己的 this，导致内部的 this 就是外层代码块的 this。正是因为它没有 this，所以也就不能用作构造函数。

下面是 Babel 转箭头函数产生的 ES5 代码，就能清楚地说明 this 的指向。

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log("id:", this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log("id:", _this.id);
  }, 100);
}
```

上面代码中，转换后的 ES5 版本清楚地说明了，箭头函数里面根本没有自己的 this，而是引用外层的 this。

请问下面的代码之中，this 的指向有几个？

```js
function foo() {
  return () => {
    return () => {
      return () => {
        console.log("id:", this.id);
      };
    };
  };
}

var f = foo.call({ id: 1 });

var t1 = f.call({ id: 2 })()(); // id: 1
var t2 = f().call({ id: 3 })(); // id: 1
var t3 = f()().call({ id: 4 }); // id: 1
```

答案是 this 的指向只有一个，就是函数 foo 的 this，这是因为所有的内层函数都是箭头函数，都没有自己的 this，它们的 this 其实都是最外层 foo 函数的 this。所以不管怎么嵌套，t1、t2、t3 都输出同样的结果。如果这个例子的所有内层函数都写成普通函数，那么每个函数的 this 都指向运行时所在的不同对象。

除了 this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target。

```js
function foo() {
  setTimeout(() => {
    console.log("args:", arguments);
  }, 100);
}

foo(2, 4, 6, 8);
// args: [2, 4, 6, 8]
```

上面代码中，箭头函数内部的变量 arguments，其实是函数 foo 的 arguments 变量。

另外，由于箭头函数没有自己的 this，所以当然也就不能用 call()、apply()、bind()这些方法去改变 this 的指向。

```js
(function () {
  return [(() => this.x).bind({ x: "inner" })()];
}.call({ x: "outer" }));
// ['outer']
```

上面代码中，箭头函数没有自己的 this，所以 bind 方法无效，内部的 this 指向外部的 this。

长期以来，JavaScript 语言的 this 对象一直是一个令人头痛的问题，在对象方法中使用 this，必须非常小心。箭头函数”绑定”this，很大程度上解决了这个困扰。

不适用场合
由于箭头函数使得 this 从“动态”变成“静态”，下面两个场合不应该使用箭头函数。

第一个场合是定义对象的方法，且该方法内部包括 this。

```js
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  },
};
```

上面代码中，cat.jumps()方法是一个箭头函数，这是错误的。调用 cat.jumps()时，如果是普通函数，该方法内部的 this 指向 cat；如果写成上面那样的箭头函数，使得 this 指向全局对象，因此不会得到预期结果。这是因为对象不构成单独的作用域，导致 jumps 箭头函数定义时的作用域就是全局作用域。

再看一个例子。

```js
globalThis.s = 21;

const obj = {
  s: 42,
  m: () => console.log(this.s),
};

obj.m(); // 21`
```

上面例子中，obj.m()使用箭头函数定义。JavaScript 引擎的处理方法是，先在全局空间生成这个箭头函数，然后赋值给 obj.m，这导致箭头函数内部的 this 指向全局对象，所以 obj.m()输出的是全局空间的 21，而不是对象内部的 42。上面的代码实际上等同于下面的代码。

```js
globalThis.s = 21;
globalThis.m = () => console.log(this.s);

const obj = {
  s: 42,
  m: globalThis.m,
};

obj.m(); // 21
```

由于上面这个原因，对象的属性建议使用传统的写法定义，不要用箭头函数定义。

第二个场合是需要动态 this 的时候，也不应使用箭头函数。

```js
var button = document.getElementById("press");
button.addEventListener("click", () => {
  this.classList.toggle("on");
});
```

上面代码运行时，点击按钮会报错，因为 button 的监听函数是一个箭头函数，导致里面的 this 就是全局对象。如果改成普通函数，this 就会动态指向被点击的按钮对象。

另外，如果函数体很复杂，有许多行，或者函数内部有大量的读写操作，不单纯是为了计算值，这时也不应该使用箭头函数，而是要使用普通函数，这样可以提高代码可读性。

嵌套的箭头函数
箭头函数内部，还可以再使用箭头函数。下面是一个 ES5 语法的多重嵌套函数。

```js
function insert(value) {
  return {
    into: function (array) {
      return {
        after: function (afterValue) {
          array.splice(array.indexOf(afterValue) + 1, 0, value);
          return array;
        },
      };
    },
  };
}

insert(2).into([1, 3]).after(1); //[1, 2, 3]
```

上面这个函数，可以使用箭头函数改写。

```js
let insert = (value) => ({
  into: (array) => ({
    after: (afterValue) => {
      array.splice(array.indexOf(afterValue) + 1, 0, value);
      return array;
    },
  }),
});

insert(2).into([1, 3]).after(1); //[1, 2, 3]
```

下面是一个部署管道机制（pipeline）的例子，即前一个函数的输出是后一个函数的输入。

```js
const pipeline =
  (...funcs) =>
  (val) =>
    funcs.reduce((a, b) => b(a), val);

const plus1 = (a) => a + 1;
const mult2 = (a) => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5);
// 12
```

如果觉得上面的写法可读性比较差，也可以采用下面的写法。

```js
const plus1 = (a) => a + 1;
const mult2 = (a) => a * 2;

mult2(plus1(5));
// 12
```

箭头函数还有一个功能，就是可以很方便地改写 λ 演算。

```js
// λ演算的写法
fix = λf.(λx.f(λv.x(x)(v)))(λx.f(λv.x(x)(v)))

// ES6的写法
var fix = f => (x => f(v => x(x)(v)))
               (x => f(v => x(x)(v)));
```

上面两种写法，几乎是一一对应的。由于 λ 演算对于计算机科学非常重要，这使得我们可以用 ES6 作为替代工具，探索计算机科学。

# 30. 什么是类？

类(class)是在 JS 中编写构造函数的新方法。它是使用构造函数的语法糖，在底层中使用仍然是原型和基于原型的继承。

```js
//ES5 Version
function Person(firstName, lastName, age, address) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
  this.address = address;
}

Person.self = function () {
  return this;
};

Person.prototype.toString = function () {
  return "[object Person]";
};

Person.prototype.getFullName = function () {
  return this.firstName + " " + this.lastName;
};

//ES6 Version
class Person {
  constructor(firstName, lastName, age, address) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.age = age;
    this.address = address;
  }

  static self() {
    return this;
  }

  toString() {
    return "[object Person]";
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

重写方法并从另一个类继承。

```js
//ES5 Version
Employee.prototype = Object.create(Person.prototype);

function Employee(firstName, lastName, age, address, jobTitle, yearStarted) {
  Person.call(this, firstName, lastName, age, address);
  this.jobTitle = jobTitle;
  this.yearStarted = yearStarted;
}

Employee.prototype.describe = function () {
  return `I am ${this.getFullName()} and I have a position of ${
    this.jobTitle
  } and I started at ${this.yearStarted}`;
};

Employee.prototype.toString = function () {
  return "[object Employee]";
};

//ES6 Version
class Employee extends Person {
  //Inherits from "Person" class
  constructor(firstName, lastName, age, address, jobTitle, yearStarted) {
    super(firstName, lastName, age, address);
    this.jobTitle = jobTitle;
    this.yearStarted = yearStarted;
  }

  describe() {
    return `I am ${this.getFullName()} and I have a position of ${
      this.jobTitle
    } and I started at ${this.yearStarted}`;
  }

  toString() {
    // Overriding the "toString" method of "Person"
    return "[object Employee]";
  }
}
```

所以我们要怎么知道它在内部使用原型？

```js
class Something {}

function AnotherSomething() {}
const as = new AnotherSomething();
const s = new Something();

console.log(typeof Something); // "function"
console.log(typeof AnotherSomething); // "function"
console.log(as.toString()); // "[object Object]"
console.log(as.toString()); // "[object Object]"
console.log(as.toString === Object.prototype.toString); // true
console.log(s.toString === Object.prototype.toString); // true
```

# 31. 什么是 Set 对象，它是如何工作的？

Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。
我们可以使用 Set 构造函数创建 Set 实例。

```js
const set1 = new Set();
const set2 = new Set(["a", "b", "c", "d", "d", "e"]);
```

我们可以使用 add 方法向 Set 实例中添加一个新值，因为 add 方法返回 Set 对象，所以我们可以以链式的方式再次使用 add。如果一个值已经存在于 Set 对象中，那么它将不再被添加。

```js
set2.add("f");
set2.add("g").add("h").add("i").add("j").add("k").add("k");
// 后一个“k”不会被添加到set对象中，因为它已经存在了
```

我们可以使用 has 方法检查 Set 实例中是否存在特定的值。

```js
set2.has("a"); // true
set2.has("z"); // true
```

我们可以使用 size 属性获得 Set 实例的长度。

```js
set2.size; // returns 10
```

可以使用 clear 方法删除 Set 中的数据。

```js
set2.clear();
```

我们可以使用 Set 对象来删除数组中重复的元素。

```js
const numbers = [1, 2, 3, 4, 5, 6, 6, 7, 8, 8, 5];
const uniqueNums = [...new Set(numbers)]; // [1,2,3,4,5,6,7,8]
```

另外还有 WeakSet， 与 Set 类似，也是不重复的值的集合。但是 WeakSet 的成员只能是对象，而不能是其他类型的值。WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。

Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。但是 WeakMap 只接受对象作为键名（ null 除外），不接受其他类型的值作为键名。而且 WeakMap 的键名所指向的对象，不计入垃圾回收机制。

# 32.实现 array.prototype.map && filter && reduce && foreach && find

假设我们有一个数组，每个元素是一个人。你面前站了一排人。foreach 就是你按顺序一个一个跟他们做点什么，具体做什么，随便:people.forEach(function (dude) {
dude.pickUpSoap();
});
map 就是你手里拿一个盒子（一个新的数组），一个一个叫他们把钱包扔进去。结束的时候你获得了一个新的数组，里面是大家的钱包，钱包的顺序和人的顺序一一对应。

```js
var wallets = people.map(function (dude) {
  return dude.wallet;
});
```

reduce 就是你拿着钱包，一个一个数过去看里面有多少钱啊？每检查一个，你就和前面的总和加一起来。这样结束的时候你就知道大家总共有多少钱了。

```js
var totalMoney = wallets.reduce(function (countedMoney, wallet) {
  return countedMoney + wallet.money;
}, 0);
```

补充一个 filter 的：你一个个钱包数过去的时候，里面钱少于 100 块的不要（留在原来的盒子里），多于 100 块的丢到一个新的盒子里。这样结束的时候你又有了一个新的数组，里面是所有钱多于 100 块的钱包：

```js
var fatWallets = wallets.filter(function (wallet) {
  return wallet.money > 100;
});
```

最后要说明一点这个类比和实际代码的一个区别，那就是 map 和 filter 都是 immutable methods，也就是说它们只会返回一个新数组，而不会改变原来的那个数组，

map
map 方法接收一个回调函数，函数内接收三个参数，当前项、索引、原数组，返回一个新的数组，并且数组长度不变。 知道了这些特征之后，我们用 reduce 重塑 map 。
map 方法会给原数组中的每个元素都按顺序调用一次 callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组。 callback 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。让数组通过某种计算产生一个新数组,影射成一个新的数组,

```js
function map(arr, mapcallback) {
  if (!Array.isArray(arr) || !arr.length || typeof mapcallback !== "function") {
    return [];
  } else {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(mapcallback(arr[i], i, arr));
    }
    return result;
  }
}
//reduce实现
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

foreach

forEach 接收一个回调函数作为参数，函数内接收四个参数当前项、索引、原函数、当执行回调函数 callback 时，用作 this 的值，并且不返回值。

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

forEach 方法对数组的每个元素执行一次提供的 CALLBACK 函数,forEach 是一个数组方法，可以用来把一个函数套用在一个数组中的每个元素上，forEach 为每个数组元素执行 callback 函数只可用于数组.遍历一个数组让数组每个元素做一件事情.那些已删除（使用 delete 方法等情况）或者未初始化的项将被跳过（但不包括那些值为 undefined 的项）（例如在稀疏数组上)；不像 map() 或者 reduce() ，它总是返回 undefined 值，并且不可链式调用。典型用例是在一个链的最后执行副作用。

find
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

filter
filter 同样接收一个回调函数，回调函数返回 true 则返回当前项，反之则不返回。回调函数接收的参数同 forEach 。
filter 为数组中的每个元素调用一次 callback 函数，并利用所有使得 callback 返回 true 或 等价于 true 的值 的元素创建一个新数组。callback 只会在已经赋值的索引上被调用，对于那些已经被删除或者从未被赋值的索引不会被调用。那些没有通过 callback 测试的元素会被跳过，不会被包含在新数组中。筛选出过滤出数组中符合条件的项,组成新数组.

```js
function filter(arr, filterCallback) {
  // 首先，检查传递的参数是否正确。
  if (
    !Array.isArray(arr) ||
    !arr.length ||
    typeof filterCallback !== "function"
  ) {
    return [];
  } else {
    let result = [];
    // 每次调用此函数时，我们都会创建一个 result 数组
    // 因为我们不想改变原始数组。
    for (let i = 0, len = arr.length; i < len; i++) {
      // 检查 filterCallback 的返回值是否是真值
      if (filterCallback(arr[i], i, arr)) {
        // 如果条件为真，则将数组元素 push 到 result 中
        result.push(arr[i]);
      }
    }
    return result; // return the result array
  }
}

//reduce
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

## for-in

一般会使用 for-in 来遍历对象的属性的,不过属性需要 enumerable,才能被读取到.
for-in 循环只遍历可枚举属性。一般常用来遍历对象，包括非整数类型的名称和继承的那些原型链上面的属性也能被遍历。像 Array 和 Object 使用内置构造函数所创建的对象都会继承自 Object.prototype 和 String.prototype 的不可枚举属性就不能遍历了.

## for-of 语句 (ES 6)

for-of 语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句。只要是一个 iterable 的对象,就可以通过 for-of 来迭代.
for-of 和 for-in 的区别
for-in 语句以原始插入顺序迭代对象的可枚举属性。for-in 会把继承链的对象属性都会遍历一遍,所以会更花时间.

## every

方法为数组中的每个元素执行一次 callback 函数，直到它找到一个使 callback 返回 false（表示可转换为布尔值 false 的值）的元素。如果发现了一个这样的元素，every 方法将会立即返回 false。否则，callback 为每一个元素返回 true，every 就会返回 true。检测数组中的每一项是否符合条件,如果每一项都符合条件,就会返回 true,否则返回 false,有点像遍历数组且操作 callback。只会为那些已经被赋值的索引调用。不会为那些被删除或从来没被赋值的索引调用。

## some 方法

some 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”（即可转换为布尔值 true 的值）。如果找到了这样一个值，some 将会立即返回 true。否则，some 返回 false。callback 只会在那些”有值“的索引上被调用，不会在那些被删除或从来未被赋值的索引上调用。检查数组中是否有某些项符号条件,如果有一项就返回 true,否则返回 false,有点像遍历数组或者操作.

## reduce  接收 2 个参数：

第一个参数是回调函数（必选），第二个参数是初始值 initialValue（可选） 。
而第一个参数（回调函数），接收下面四个参数：

    Accumulator (acc) (累计器)
    Current Value (cur) (当前值)
    Current Index (idx) (当前索引)
    Source Array (src) (源数组)

```js
[1, 2, 3, 4].reduce((acc, cur) => {
  return acc + cur;
}, 10);
// 10 + 1 + 2 + 3 + 4
// 20

[1, 2, 3, 4].reduce((acc, cur) => {
  return acc + cur;
});
// 1 + 2 + 3 + 4
// 10
```

遍历速度
for > for-of > forEach > filter > map > for-in

# 33 .深浅拷贝

JavaScript 的深浅拷贝一直是个难点，如果现在面试官让我写一个深拷贝，我可能也只是能写出个基础版的。所以在写这条之前我拜读了收藏夹里各路大佬写的博文。具体可以看下面我贴的链接，这里只做简单的总结。

浅拷贝： 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
深拷贝： 将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。

浅拷贝的实现方式：

Object.assign() 方法： 用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
**Array.prototype.slice()：**slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end（不包括 end）决定的原数组的浅拷贝。原始数组不会被改变。
拓展运算符...：

深拷贝的实现方式：

乞丐版： JSON.parse(JSON.stringify(object))，缺点诸多（会忽略 undefined、symbol、函数；不能解决循环引用；不能处理正则、new Date()）

基础版（面试够用）： 浅拷贝+递归 （只考虑了普通的 object 和 array 两种数据类型）

```js
function cloneDeep(target,map = new WeakMap()) {
  if(typeOf taret ==='object'){
     let cloneTarget = Array.isArray(target) ? [] : {};

     if(map.get(target)) {
        return target;
    }
     map.set(target, cloneTarget);
     for(const key in target){
        cloneTarget[key] = cloneDeep(target[key], map);
     }
     return cloneTarget
  }else{
       return target
  }

}


```

终极版：

```js
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const objectTag = "[object Object]";
const argsTag = "[object Arguments]";

const boolTag = "[object Boolean]";
const dateTag = "[object Date]";
const numberTag = "[object Number]";
const stringTag = "[object String]";
const symbolTag = "[object Symbol]";
const errorTag = "[object Error]";
const regexpTag = "[object RegExp]";
const funcTag = "[object Function]";

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

function forEach(array, iteratee) {
  let index = -1;
  const length = array.length;
  while (++index < length) {
    iteratee(array[index], index);
  }
  return array;
}

function isObject(target) {
  const type = typeof target;
  return target !== null && (type === "object" || type === "function");
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

function getInit(target) {
  const Ctor = target.constructor;
  return new Ctor();
}

function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe) {
  const reFlags = /\w*$/;
  const result = new targe.constructor(targe.source, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}

function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  if (func.prototype) {
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      if (param) {
        const paramArr = param[0].split(",");
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}

function cloneOtherType(targe, type) {
  const Ctor = targe.constructor;
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(targe);
    case regexpTag:
      return cloneReg(targe);
    case symbolTag:
      return cloneSymbol(targe);
    case funcTag:
      return cloneFunction(targe);
    default:
      return null;
  }
}

function clone(target, map = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    return target;
  }

  // 初始化
  const type = getType(target);
  let cloneTarget;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type);
  } else {
    return cloneOtherType(target, type);
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget);

  // 克隆set
  if (type === setTag) {
    target.forEach((value) => {
      cloneTarget.add(clone(value, map));
    });
    return cloneTarget;
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value, map));
    });
    return cloneTarget;
  }

  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target);
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value;
    }
    cloneTarget[key] = clone(target[key], map);
  });

  return cloneTarget;
}

module.exports = {
  clone,
};
```

# 34. 手写 call、apply 及 bind 函数

call 函数的实现步骤：

      1.判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
      2.判断传入上下文对象是否存在，如果不存在，则设置为 window 。
      3.处理传入的参数，截取第一个参数后的所有参数。
      4.将函数作为上下文对象的一个属性。
      5.使用上下文对象来调用这个方法，并保存返回结果。
      6.删除刚才新增的属性。
      7.返回结果。

```js
// call函数实现
Function.prototype.myCall = function (context) {
  // 判断调用对象
  if (typeof this !== "function") {
    console.error("type error");
  }

  // 获取参数
  let args = [...arguments].slice(1),
    result = null;

  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;

  // 将调用函数设为对象的方法
  context.fn = this;

  // 调用函数
  result = context.fn(...args);

  // 将属性删除
  delete context.fn;

  return result;
};
```

apply 函数的实现步骤：

判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。

判断传入上下文对象是否存在，如果不存在，则设置为 window 。

将函数作为上下文对象的一个属性。

判断参数值是否传入

使用上下文对象来调用这个方法，并保存返回结果。

删除刚才新增的属性

返回结果

```js
// apply 函数实现

Function.prototype.myApply = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }

  let result = null;

  // 判断 context 是否存在，如果未传入则为 window
  context = context || window;

  // 将函数设为对象的方法
  context.fn = this;

  // 调用方法
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }

  // 将属性删除
  delete context.fn;

  return result;
};
```

bind 函数的实现步骤：

      1.判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
      2.保存当前函数的引用，获取其余传入参数值。
      3.创建一个函数返回
      4.函数内部使用 apply 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用，其余情况都传入指定的上下文对象。

```js
// bind 函数实现
Function.prototype.myBind = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }

  // 获取参数
  var args = [...arguments].slice(1),
    fn = this;

  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
};
```

# 35.函数柯里化

```js
// 函数柯里化指的是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

function curry(fn, args) {
  // 获取函数需要的参数长度
  let length = fn.length;

  args = args || [];

  return function () {
    let subArgs = args.slice(0);

    // 拼接得到现有的所有参数
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i]);
    }

    // 判断参数的长度是否已经满足函数所需参数的长度
    if (subArgs.length >= length) {
      // 如果满足，执行函数
      return fn.apply(this, subArgs);
    } else {
      // 如果不满足，递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, subArgs);
    }
  };
}

// es6 实现
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}
```

# 36.js 模拟 new 操作符的实现

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。new 关键字会进行如下的操作：

      创建一个空的简单JavaScript对象（即{}）；
      链接该对象（即设置该对象的构造函数）到另一个对象 ；
      将步骤1新创建的对象作为this的上下文 ；
      如果该函数没有返回对象，则返回this。

接下来我们看实现：

```js
function Dog(name, color, age) {
  this.name = name;
  this.color = color;
  this.age = age;
}

Dog.prototype = {
  getName: function () {
    return this.name;
  },
};

var dog = new Dog("大黄", "yellow", 3);
```

按照上述的 1,2,3,4 步来解析 new 背后的操作。
第一步：创建一个简单空对象

```js
var obj = {};
```

第二步：链接该对象到另一个对象（原型链）

```js
// 设置原型链
obj.__proto__ = Dog.prototype;
```

第三步：将步骤 1 新创建的对象作为 this 的上下文

```js
// this指向obj对象
Dog.apply(obj, ["大黄", "yellow", 3]);
```

第四步：如果该函数没有返回对象，则返回 this

```js
// 因为 Dog() 没有返回值，所以返回obj
var dog = obj;
dog.getName(); // '大黄'
```

需要注意的是如果 Dog() 有 return 则返回 return 的值

```js
var rtnObj = {};
function Dog(name, color, age) {
  // ...
  //返回一个对象
  return rtnObj;
}

var dog = new Dog("大黄", "yellow", 3);
console.log(dog === rtnObj); // true
```

接下来我们将以上步骤封装成一个对象实例化方法，即模拟 new 的操作：

```js
function objectFactory() {
  var obj = {};
  //取得该方法的第一个参数(并删除第一个参数)，该参数是构造函数
  var Constructor = [].shift.apply(arguments);
  //将新对象的内部属性__proto__指向构造函数的原型，这样新对象就可以访问原型中的属性和方法
  obj.__proto__ = Constructor.prototype;
  //取得构造函数的返回值
  var ret = Constructor.apply(obj, arguments);
  //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
  return typeof ret === "object" ? ret : obj;
}
```

# 37.什么是回调函数

回调函数是一段可执行的代码段，它作为一个参数传递给其他的代码，其作用是在需要的时候方便调用这段（回调函数）代码。

在 JavaScript 中函数也是对象的一种，同样对象可以作为参数传递给函数，因此函数也可以作为参数传递给另外一个函数，这个作为参数的函数就是回调函数。

```js
const btnAdd = document.getElementById("btnAdd");

btnAdd.addEventListener("click", function clickCallback(e) {
  // do something useless
});
```

在本例中，我们等待 id 为 btnAdd 的元素中的 click 事件，如果它被单击，则执行 clickCallback 函数。回调函数向某些数据或事件添加一些功能。
回调函数有一个致命的弱点，就是容易写出回调地狱（Callback hell）。假设多个事件存在依赖性：

```js
setTimeout(() => {
  console.log(1);
  setTimeout(() => {
    console.log(2);
    setTimeout(() => {
      console.log(3);
    }, 3000);
  }, 2000);
}, 1000);
```

这就是典型的回调地狱，以上代码看起来不利于阅读和维护，事件一旦多起来就更是乱糟糟，所以在 es6 中提出了 Promise 和 async/await 来解决回调地狱的问题。当然，回调函数还存在着别的几个缺点，比如不能使用 try catch 捕获错误，不能直接 return。接下来的两条就是来解决这些问题的，咱们往下看。

# 38.Promise 是什么，可以手写实现一下吗？

Promise 对象是一个代理对象（代理一个值），被代理的值在 Promise 对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 promise 对象。
一个 Promise 有以下几种状态:

pending: 初始状态，既不是成功，也不是失败状态。
fulfilled: 意味着操作成功完成。
rejected: 意味着操作失败。

这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了，也就是说一旦状态变为 fulfilled/rejected 后，就不能再次改变。
可能光看概念大家不理解 Promise，我们举个简单的栗子；

假如我有个女朋友，下周一是她生日，我答应她生日给她一个惊喜，那么从现在开始这个承诺就进入等待状态，等待下周一的到来，然后状态改变。如果下周一我如约给了女朋友惊喜，那么这个承诺的状态就会由 pending 切换为 fulfilled，表示承诺成功兑现，一旦是这个结果了，就不会再有其他结果，即状态不会在发生改变；反之如果当天我因为工作太忙加班，把这事给忘了，说好的惊喜没有兑现，状态就会由 pending 切换为 rejected，时间不可倒流，所以状态也不能再发生变化。

上一条我们说过 Promise 可以解决回调地狱的问题，没错，pending 状态的 Promise 对象会触发 fulfilled/rejected 状态，一旦状态改变，Promise 对象的 then 方法就会被调用；否则就会触发 catch。我们将上一条回调地狱的代码改写一下：

```js
new Promise((resolve，reject) => {
     setTimeout(() => {
            console.log(1)
            resolve()
        },1000)

}).then((res) => {
    setTimeout(() => {
            console.log(2)
        },2000)
}).then((res) => {
    setTimeout(() => {
            console.log(3)
        },3000)
}).catch((err) => {
console.log(err)
})

```

执行 JS 代码的时候其实就是往执行栈中放入函数，那么遇到异步代码的时候该怎么办？其实当遇到异步的代码时，会被挂起并在需要执行的时候加入到 Task（有多种 Task） 队列中。一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 微任务（microtask） 和 宏任务（macrotask）

```js
console.log("script start");
async function async1() {
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2 end");
}
async1();
setTimeout(function () {
  console.log("setTimeout");
}, 0);
new Promise((resolve) => {
  console.log("Promise");
  resolve();
  console.log("7");
})
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  });
console.log("script end");
// script start => async2 end => Promise =>7=> script end => promise1 => promise2 => async1 end => setTimeout
```

      执行顺序
      首先执行同步代码，这属于宏任务
      当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
      执行所有微任务
      当执行完所有微任务后，如有必要会渲染页面
      然后开始下一轮 Event Loop，执行宏任务中的异步代码，也就是 setTimeout 中的回调函数
      而宏任务一般是：包括整体代码script，setTimeout，setInterval。

      微任务：Promise，process.nextTick。
      处理同步任务，依次把同步任务加入到执行栈中执行
      等待执行栈中的同步任务都处理完成，处理任务队列
      按顺序执行所有微任务
      进行必要的UI渲染
      执行宏任务中的异步代码
      开始下一轮事件循环
      其实 Promise 也是存在一些缺点的，比如无法取消 Promise，错误需要通过回调函数捕获。

promise 手写实现，面试够用版：

```js
function myPromise(constructor) {
  let self = this;
  self.status = "pending"; //定义状态改变前的初始状态
  self.value = undefined; //定义状态为resolved的时候的状态
  self.reason = undefined; //定义状态为rejected的时候的状态
  function resolve(value) {
    //两个==="pending"，保证了状态的改变是不可逆的
    if (self.status === "pending") {
      self.value = value;
      self.status = "resolved";
    }
  }
  function reject(reason) {
    //两个==="pending"，保证了状态的改变是不可逆的
    if (self.status === "pending") {
      self.reason = reason;
      self.status = "rejected";
    }
  }
  //捕获构造异常
  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
// 定义链式调用的then方法
myPromise.prototype.then = function (onFullfilled, onRejected) {
  let self = this;
  switch (self.status) {
    case "resolved":
      onFullfilled(self.value);
      break;
    case "rejected":
      onRejected(self.reason);
      break;
    default:
  }
};
```

# 39.Iterator 是什么，有什么作用？

Iterator 是理解第 61 条的先决知识，也许是我 IQ 不够 😭，Iterator 和 Generator 看了很多遍还是一知半解，即使当时理解了，过一阵又忘得一干二净。。。
Iterator（迭代器）是一种接口，也可以说是一种规范。为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。
Iterator 语法：

```js
const obj = {
  [Symbol.iterator]: function () {},
};
```

[Symbol.iterator] 属性名是固定的写法，只要拥有了该属性的对象，就能够用迭代器的方式进行遍历。
迭代器的遍历方法是首先获得一个迭代器的指针，初始时该指针指向第一条数据之前，接着通过调用 next 方法，改变指针的指向，让其指向下一条数据
每一次的 next 都会返回一个对象，该对象有两个属性

value 代表想要获取的数据
done 布尔值，false 表示当前指针指向的数据有值，true 表示遍历已经结束

Iterator 的作用有三个：

    为各种数据结构，提供一个统一的、简便的访问接口；
    使得数据结构的成员能够按某种次序排列；
    ES6 创造了一种新的遍历命令for…of循环，Iterator 接口主要供for…of消费。

遍历过程：

    创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
    第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
    第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
    不断调用指针对象的next方法，直到它指向数据结构的结束位置。

每一次调用 next 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 value 和 done 两个属性的对象。其中，value 属性是当前成员的值，done 属性是一个布尔值，表示遍历是否结束。

```js
let arr = [{ num: 1 }, 2, 3];
let it = arr[Symbol.iterator](); // 获取数组中的迭代器
console.log(it.next()); // { value: Object { num: 1 }, done: false }
console.log(it.next()); // { value: 2, done: false }
console.log(it.next()); // { value: 3, done: false }
console.log(it.next()); // { value: undefined, done: true }
```

# 40.Generator 函数是什么，有什么作用？

Generator 函数可以说是 Iterator 接口的具体实现方式。Generator 最大的特点就是可以控制函数的执行。

```js
function* foo(x) {
  let y = 2 * (yield x + 1);
  let z = yield y / 3;
  return x + y + z;
}
let it = foo(5);
console.log(it.next()); // => {value: 6, done: false}
console.log(it.next(12)); // => {value: 8, done: false}
console.log(it.next(13)); // => {value: 42, done: true}
```

上面这个示例就是一个 Generator 函数，我们来分析其执行过程：

      首先 Generator 函数调用时它会返回一个迭代器
      当执行第一次 next 时，传参会被忽略，并且函数暂停在 yield (x + 1) 处，所以返回 5 + 1 = 6
      当执行第二次 next 时，传入的参数等于上一个 yield 的返回值，如果你不传参，yield 永远返回 undefined。此时 let y = 2 * 12，所以第二个 yield 等于 2 * 12 / 3 = 8
      当执行第三次 next 时，传入的参数会传递给 z，所以 z = 13, x = 5, y = 24，相加等于 42

Generator 函数一般见到的不多，其实也于他有点绕有关系，并且一般会配合 co 库去使用。当然，我们可以通过 Generator 函数解决回调地狱的问题。

# 41.什么是 async/await 及其如何工作,有什么优缺点？

async/await 是一种建立在 Promise 之上的编写异步或非阻塞代码的新方法，被普遍认为是 JS 异步操作的最终且最优雅的解决方案。相对于 Promise 和回调，它的可读性和简洁度都更高。毕竟一直 then()也很烦。
async 是异步的意思，而 await 是 async wait 的简写，即异步等待。
所以从语义上就很好理解 async 用于声明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。
一个函数如果加上 async ，那么该函数就会返回一个 Promise

```js
async function test() {
  return "1";
}
console.log(test()); // -> Promise {<resolved>: "1"}
```

可以看到输出的是一个 Promise 对象。所以，async 函数返回的是一个 Promise 对象，如果在 async 函数中直接 return 一个直接量，async 会把这个直接量通过 PromIse.resolve() 封装成 Promise 对象返回。
相比于 Promise，async/await 能更好地处理 then 链

```js
function takeLongTime(n) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(n + 200), n);
  });
}

function step1(n) {
  console.log(`step1 with ${n}`);
  return takeLongTime(n);
}

function step2(n) {
  console.log(`step2 with ${n}`);
  return takeLongTime(n);
}

function step3(n) {
  console.log(`step3 with ${n}`);
  return takeLongTime(n);
}
```

现在分别用 Promise 和 async/await 来实现这三个步骤的处理。

使用 Promise

```js
function doIt() {
  console.time("doIt");
  const time1 = 300;
  step1(time1)
    .then((time2) => step2(time2))
    .then((time3) => step3(time3))
    .then((result) => {
      console.log(`result is ${result}`);
    });
}
doIt();
// step1 with 300
// step2 with 500
// step3 with 700
// result is 900
```

使用 async/await

```js
async function doIt() {
  console.time("doIt");
  const time1 = 300;
  const time2 = await step1(time1);
  const time3 = await step2(time2);
  const result = await step3(time3);
  console.log(`result is ${result}`);
}
doIt();
```

结果和之前的 Promise 实现是一样的，但是这个代码看起来是不是清晰得多，优雅整洁，几乎跟同步代码一样。

await 关键字只能在 async function 中使用。在任何非 async function 的函数中使用 await 关键字都会抛出错误。await 关键字在执行下一行代码之前等待右侧表达式(可能是一个 Promise)返回。

优缺点：

async/await 的优势在于处理 then 的调用链，能够更清晰准确的写出代码，并且也能优雅地解决回调地狱问题。当然也存在一些缺点，因为 await 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 await 会导致性能上的降低。

# 42. instanceof 的原理是什么，如何实现

instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。
实现 instanceof：

首先获取类型的原型
然后获得对象的原型
然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null

```js
function myInstanceof(left, right) {
  let prototype = right.prototype;
  left = left.__proto__;
  while (true) {
    if (left === null || left === undefined) return false;
    if (prototype === left) return true;
    left = left.__proto__;
  }
}
```

# 43. js 的节流与防抖

函数防抖 是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求。
函数节流 是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。节流可以使用在 scroll 函数的事件监听上，通过事件节流来降低事件调用的频率。

```js
// 函数防抖的实现
function debounce(fn, wait) {
  var timer = null;

  return function () {
    var context = this,
      args = arguments;

    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

// 函数节流的实现;
function throttle(fn, delay) {
  var preTime = Date.now();

  return function () {
    var context = this,
      args = arguments,
      nowTime = Date.now();

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - preTime >= delay) {
      preTime = Date.now();
      return fn.apply(context, args);
    }
  };
}
```

# 44. eventloop

事件触发线程管理的任务队列是如何产生的呢？事实上这些任务就是从 JS 引擎线程本身产生的，主线程在运行时会产生执行栈，栈中的代码调用某些异步 API 时会在任务队列中添加事件，栈中的代码执行完毕后，就会读取任务队列中的事件，去执行事件对应的回调函数，如此循环往复，形成事件循环机制。JS 中有两种任务类型：微任务（microtask）和宏任务（macrotask），在 ES6 中，microtask 称为 jobs，macrotask 称为 task：

      宏任务： script （主代码块）、setTimeout 、setInterval 、setImmediate 、I/O 、UI rendering
      微任务：process.nextTick（Nodejs） 、Promise 、Object.observe 、MutationObserver

Node.js 中 Event Loop 和浏览器中 Event Loop 有什么区别

```js
   ┌───────────────────────┐
┌─>│        timers         │<————— 执行 setTimeout()、setInterval() 的回调
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
│  │     pending callbacks │<————— 执行由上一个 Tick 延迟下来的 I/O 回调（待完善，可忽略）
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
│  │     idle, prepare     │<————— 内部调用（可忽略）
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
|             |                   ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │ - (执行几乎所有的回调，除了 close callbacks、timers、setImmediate)
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│             |                   |               |
|             |                   └───────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
|  ┌──────────┴────────────┐
│  │        check          │<————— setImmediate() 的回调将会在这个阶段执行
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
└──┤    close callbacks    │<————— socket.on('close', ...)
   └───────────────────────┘

```

Node.js 中宏任务分成了几种类型，并且放在了不同的 task queue 里。不同的 task queue 在执行顺序上也有区别，微任务放在了每个 task queue 的末尾：

      setTimeout/setInterval 属于 timers 类型；
      setImmediate 属于 check 类型；
      socket 的 close 事件属于 close callbacks 类型；
      其他 MacroTask 都属于 poll 类型。
      process.nextTick 本质上属于 MicroTask，但是它先于所有其他 MicroTask 执行；
      所有 MicroTask 的执行时机在不同类型的 MacroTask 切换后。
      idle/prepare 仅供内部调用，我们可以忽略。
      pending callbacks 不太常见，我们也可以忽略。
