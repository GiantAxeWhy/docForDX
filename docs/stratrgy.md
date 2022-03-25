# JavaScript 设计模式核⼼原理与应⽤实践

```js
每一个模式描述了一个在我们周围不断重复发生的问题，以及该问题的解决方案的核心。这样，你就能一次又一次地使用该方案而不必做重复劳动。 —— Christopher Alexander
```

设计模式 SOLID 原则
单一功能原则（Single Responsibility Principle）
开放封闭原则（Opened Closed Principle）
里式替换原则（Liskov Substitution Principle）
接口隔离原则（Interface Segregation Principle）
依赖反转原则（Dependency Inversion Principle）

设计模式的核心思想，就是“封装变化”
封装变化，封装的正是软件中那些不稳定的要素，它是一种防患于未然的行为 —— 提前抽离了变化，就为后续的拓展提供了无限的可能性，如此，我们才能做到在变化到来的时候从容不迫。

## 构造器模式

有一天你写了个公司员工信息录入系统，这个系统开发阶段用户只有你自己，想怎么玩怎么玩。于是在创建“自己”这个唯一的用户的时候，你可以这么写：

```js
const liLei = {
  name: "李雷",
  age: 25,
  career: "coder",
};
```

过了两天你老板过来了，说李雷，系统今天提测了，先把部门的 500 人录入看看功能。李雷心想，500 个对象字面量，要死要死，还好我有构造函数。于是李雷写出了一个可以自动创建用户的 User 函数：

```js
function User(name, age, career) {
  this.name = name;
  this.age = age;
  this.career = career;
}
```

楼上个这 User，就是一个构造器。此处我们采用了 ES5 构造函数的写法，因为 ES6 中的 class 其实本质上还是函数，class 语法只是语法糖，构造函数，才是它的真面目。
接下来要做的事情，就是让程序自动地去读取数据库里面一行行的员工信息，然后把拿到的姓名、年龄等字段塞进 User 函数里，进行一个简单的调用：

```js
const user = new User(name, age, career);
```

JavaScript 中，我们使用构造函数去初始化对象，就是应用了构造器模式
那么构造器做了什么？

构造器是不是将 name、age、career 赋值给对象的过程封装，确保了每个对象都具备这些属性，确保了共性的不变，同时将 name、age、career 各自的取值操作开放，确保了个性的灵活？

如果在使用构造器模式的时候，我们本质上是去抽象了每个对象实例的变与不变。那么使用工厂模式时，我们要做的就是去抽象不同构造函数（类）之间的变与不变。

## 创建型 简单工厂模式

老板说这个系统录入的信息也太简单了，程序员和产品经理之间的区别一个简单的 career 字段怎么能说得清？我要求这个系统具备给不同工种分配职责说明的功能。

也就是说，要给每个工种的用户加上一个个性化的字段，来描述他们的工作内容。

Coder 和 ProductManager 两个工种的员工，是不是仍然存在都拥有 name、age、career、work 这四个属性这样的共性？

它们之间的区别，在于每个字段取值的不同，以及 work 字段需要随 career 字段取值的不同而改变。这样一来，我们是不是对共性封装得不够彻底？

那么相应地，共性与个性是不是分离得也不够彻底？

现在我们把相同的逻辑封装回 User 类里，然后把这个承载了共性的 User 类和个性化的逻辑判断写入同一个函数：

```js
function User(name , age, career, work) {
    this.name = name
    this.age = age
    this.career = career
    this.work = work
}

function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug']
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...

    return new User(name, age, career, work)
}

```

工厂模式其实就是将创建对象的过程单独封装。
将创建对象的过程单独封装，这样的操作就是工厂模式。同时它的应用场景也非常容易识别：有构造函数的地方，我们就应该想到简单工厂；

在写了大量构造函数、调用了大量的 new、自觉非常不爽的情况下，我们就应该思考是不是可以掏出工厂模式重构我们的代码了。

## 创建型 抽象工厂模式

大家知道一部智能手机的基本组成是操作系统（Operating System，我们下面缩写作 OS）和硬件（HardWare）组成。

所以说如果我要开一个山寨手机工厂，那我这个工厂里必须是既准备好了操作系统，也准备好了硬件，才能实现手机的量产。

考虑到操作系统和硬件这两样东西背后也存在不同的厂商，而我现在并不知道我下一个生产线到底具体想生产一台什么样的手机，我只知道手机必须有这两部分组成，所以我先来一个抽象类来约定住这台手机的基本组成：

```js
class MobilePhoneFactory {
  // 提供操作系统的接口
  createOS() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
  // 提供硬件的接口
  createHardWare() {
    throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
  }
}
```

楼上这个类，除了约定手机流水线的通用能力之外，啥也不干。

如果你尝试让它干点啥，比如 new 一个 MobilePhoneFactory 实例，并尝试调用它的实例方法。它还会给你报错，

提醒你“我不是让你拿去 new 一个实例的，我就是个定规矩的”。

在抽象工厂模式里，楼上这个类就是我们食物链顶端最大的 Boss——AbstractFactory（抽象工厂）。

抽象工厂不干活，具体工厂（ConcreteFactory）来干活！

当我们明确了生产方案，明确某一条手机生产流水线具体要生产什么样的手机了之后，就可以化抽象为具体，比如我现在想要一个专门生产 Android 系统 + 高通硬件的手机的生产线，我给这类手机型号起名叫 FakeStar，那我就可以为 FakeStar 定制一个具体工厂：

```js
// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
  createOS() {
    // 提供安卓系统实例
    return new AndroidOS();
  }
  createHardWare() {
    // 提供高通硬件实例
    return new QualcommHardWare();
  }
}
```

这里我们在提供安卓系统的时候，调用了两个构造函数：AndroidOS 和 QualcommHardWare，它们分别用于生成具体的操作系统和硬件实例。

像这种被我们拿来用于 new 出具体对象的类，叫做具体产品类（ConcreteProduct）。

具体产品类往往不会孤立存在，不同的具体产品类往往有着共同的功能，比如安卓系统类和苹果系统类，它们都是操作系统，都有着可以操控手机硬件系统这样一个最基本的功能。

因此我们可以用一个抽象产品（AbstractProduct）类来声明这一类产品应该具有的基本功能

```js
// 定义操作系统这类产品的抽象产品类
class OS {
    controlHardWare() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
    controlHardWare() {
        console.log('我会用安卓的方式去操作硬件')
    }
}

class AppleOS extends OS {
    controlHardWare() {
        console.log('我会用🍎的方式去操作硬件')
    }
}
...
```

硬件类产品同理

```js
// 定义手机硬件这类产品的抽象产品类
class HardWare {
    // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
    operateByOrder() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
    operateByOrder() {
        console.log('我会用高通的方式去运转')
    }
}

class MiWare extends HardWare {
    operateByOrder() {
        console.log('我会用小米的方式去运转')
    }
}
...
```

好了，如此一来，当我们需要生产一台 FakeStar 手机时，我们只需要这样做：

```js
// 这是我的手机
const myPhone = new FakeStarFactory();
// 让它拥有操作系统
const myOS = myPhone.createOS();
// 让它拥有硬件
const myHardWare = myPhone.createHardWare();
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare();
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder();
```

关键的时刻来了——假如有一天，FakeStar 过气了，我们需要产出一款新机投入市场，这时候怎么办？我们是不是不需要对抽象工厂 MobilePhoneFactory 做任何修改，只需要拓展它的种类：

```js
class newStarFactory extends MobilePhoneFactory {
  createOS() {
    // 操作系统实现代码
  }
  createHardWare() {
    // 硬件实现代码
  }
}
```

对比一下抽象工厂和简单工厂的思路
它们的共同点，在于都尝试去分离一个系统中变与不变的部分。它们的不同在于场景的复杂度。

在简单工厂的使用场景里，处理的对象是类，并且是一些非常好对付的类——它们的共性容易抽离，同时因为逻辑本身比较简单，故而不苛求代码可扩展性。

抽象工厂本质上处理的其实也是类，但是是一帮非常棘手、繁杂的类，这些类中不仅能划分出门派，还能划分出等级，同时存在着千变万化的扩展可能性——这使得我们必须对共性作更特别的处理、使用抽象类去降低扩展的成本，同时需要对类的性质作划分，于是有了这样的四个关键角色：

抽象工厂（抽象类，它不能被用于生成具体实例）： 用于声明最终目标产品的共性。在一个系统里，抽象工厂可以有多个（大家可以想象我们的手机厂后来被一个更大的厂收购了，这个厂里除了手机抽象类，还有平板、游戏机抽象类等等），每一个抽象工厂对应的这一类的产品，被称为“产品族”。

具体工厂（用于生成产品族里的一个具体的产品）： 继承自抽象工厂、实现了抽象工厂里声明的那些方法，用于创建具体的产品的类。

抽象产品（抽象类，它不能被用于生成具体实例）： 上面我们看到，具体工厂里实现的接口，会依赖一些类，这些类对应到各种各样的具体的细粒度产品（比如操作系统、硬件等），这些具体产品类的共性各自抽离，便对应到了各自的抽象产品类。

具体产品（用于生成产品族里的一个具体的产品所依赖的更细粒度的产品）： 比如我们上文中具体的一种操作系统、或具体的一种硬件等。

抽象工厂模式的定义，是围绕一个超级工厂创建其他工厂。抽象工厂目前来说在 JS 世界里也应用得并不广泛，所以只需留意以下三点：

学会用 ES6 模拟 JAVA 中的抽象类；

了解抽象工厂模式中四个角色的定位与作用；

对“开放封闭原则”形成自己的理解，知道它好在哪，知道执行它的必要性。

## 单例模式-vuex 的数据管理哲学

保证一个类只有一个实例，并提供一个访问它的全局访问节点

一般情况下，当我们创建了一个类（本质是构造函数）后，可以通过 new 关键字调用构造函数进而生成任意多的实例对象。像这样：

```js
class SingleDog {
  show() {
    console.log("我是一个单例对象");
  }
}

const s1 = new SingleDog();
const s2 = new SingleDog();

// false
s1 === s2;
```

楼上我们先 new 了一个 s1，又 new 了一个 s2，很明显 s1 和 s2 之间没有任何瓜葛，两者是相互独立的对象，各占一块内存空间。

而单例模式想要做到的是，不管我们尝试去创建多少次，它都只给你返回第一次所创建的那唯一的一个实例。

要做到这一点，就需要构造函数具备判断自己是否已经创建过一个实例的能力。

我们现在把这段判断逻辑写成一个静态方法(其实也可以直接写入构造函数的函数体里）：
