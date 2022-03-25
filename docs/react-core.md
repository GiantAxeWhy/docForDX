# React 概述

> 官网：https://react.docschina.org/

## 什么是 React？

React 是由**Facebook**研发的、用于**解决 UI 复杂度**的开源**JavaScript 库**，目前由 React 联合社区维护。

> 它不是框架，只是为了解决 UI 复杂度而诞生的一个库

## React 的特点

- 轻量：React 的开发版所有源码（包含注释）仅 3000 多行
- 原生：所有的 React 的代码都是用原生 JS 书写而成的，不依赖其他任何库
- 易扩展：React 对代码的封装程度较低，也没有过多的使用魔法，所以 React 中的很多功能都可以扩展。
- 不依赖宿主环境：React 只依赖原生 JS 语言，不依赖任何其他东西，包括运行环境。因此，它可以被轻松的移植到浏览器、桌面应用、移动端。
- 渐近式：React 并非框架，对整个工程没有强制约束力。这对与那些已存在的工程，可以逐步的将其改造为 React，而不需要全盘重写。
- 单向数据流：所有的数据自顶而下的流动
- 用 JS 代码声明界面
- 组件化

## 对比 Vue

|   对比项   | Vue | React |
| :--------: | :-: | :---: |
| 全球使用量 |     |   ✔   |
| 国内使用量 |  ✔  |       |
|    性能    |  ✔  |   ✔   |
|   易上手   |  ✔  |       |
|   灵活度   |     |   ✔   |
|    生态    |     |   ✔   |

## 学习路径

整体原则：熟悉 API --> 深入理解原理

1. React

   1. 核心：jsx、组件以及属性、组件状态、事件、setstate、生命周期、传递元素、表单
   2. 进阶：默认属性、HOC、ref、pureComponent、了解渲染过程、router 源码
   3. 生态：HOOK、router、redux、umi、adtD

2. React-Router：相当于 vue-router
3. Redux：相当于 Vuex
   1. Redux 本身
   2. 各种中间件
4. 第三方脚手架：umi
5. UI 库：Ant Design，相当于 Vue 的 Element-UI 或 IView
6. 源码部分
   1. React 源码分析
   2. Redux 源码分析

# jsx

## 什么是 JSX

- Facebook 起草的 JS 扩展语法
- 本质是一个 JS 对象，会被 babel 编译，最终会被转换为 React.createElement
- 每个 JSX 表达式，有且仅有一个根节点
  - React.Fragment
- 每个 JSX 元素必须结束（XML 规范）

```js
const h1 = (
  <>
  <h1>
    Hello world
    <span>1231</span>
  </h1>
  <p></p>
  <>
);

ReactDOM.render(h1, document.getElementById("root"));

React.createElement(
  "h1",
  {},
  "hello world",
  React.createElement("span", {}, "span元素")
);
```

```js
const img = (
  <img
    src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2962719555,3613138778&fm=27&gp=0.jpg"
    alt=""
  />
);

ReactDOM.render(img, document.getElementById("root"));
```

## 在 JSX 中嵌入表达式

```js
const a = 1234,
  b = 4321;
const div = (
  <div>
    {a}*{b} = {a * b}
  </div>
);
ReactDOM.render(div, document.getElementById("root"));
const div = React.createElement("div", {}, `${a} * ${b} = ${a * b}`);

// 普通对象
//const obj = {
//     a: 1,
//     b: 2
// }
//元素对象
//const obj = <span>这是一个span元素</span>;
//数组
//遍历数组每一个元素放进来
//const arr = [2, null, false, undefined, 3,{a:1,b:2}];
```

- 在 JSX 中使用注释
- 将表达式作为内容的一部分
  - null、undefined、false 不会显示
  - 普通对象，不可以作为子元素
  - 可以放置 React 元素对象
- 将表达式作为元素属性

```js
const url =
  "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2962719555,3613138778&fm=27&gp=0.jpg";
const cls = "image";
const div = (
  <div>
    <img
      src={url}
      className={cls}
      style={{
        marginLeft: "50px",
        width: "200px",
      }}
      alt=""
    />
  </div>
);

ReactDOM.render(div, document.getElementById("root"));
```

- 属性使用小驼峰命名法
- 防止注入攻击
  - 自动编码
  - dangerouslySetInnerHTML

```js
const content = "<h1>afasfasfd</h1><p>阿斯顿法定发送</p>";
const div = (
  <div
    dangerouslySetInnerHTML={{
      __html: content,
    }}
  ></div>
);

ReactDOM.render(div, document.getElementById("root"));
```

## 元素的不可变性

- 虽然 JSX 元素是一个对象，但是该对象中的所有属性不可更改
- 如果确实需要更改元素的属性，需要重新创建 JSX 元素

```js
let num = 0;

setInterval(() => {
  num++;
  const div = <div title="asdfadf">{num}</div>;
  ReactDOM.render(div, document.getElementById("root"));
}, 1000);
```

效率？

# 组件和组件属性

组件：包含内容、样式和功能的 UI 单元

## 创建一个组件

**特别注意：组件的名称首字母必须大写**

1. 函数组件

返回一个 React 元素

```js
export default function MyFuncComp(props) {
  // return <h1>函数组件的内容</h1>
  //组件结构
  return <h1>函数组件，目前的数字：{props.number}</h1>;
}

//ReactDOM.render(<div>{MyFuncComp}</div>,document.getElementById("root"))

ReactDOM.render(
  <div>
    <MyFuncComp></MyFuncComp>
  </div>,
  document.getElementById("root")
);

//react组件小写会认为是普通的html元素
//使用组件生成的，仍然是React元素，变化的是type
const comp =<MyFuncComp>
ReactDOM.render(
  <div>
   {comp}
  </div>,
  document.getElementById("root")
);
```

2. 类组件

必须继承 React.Component

必须提供 render 函数，用于渲染组件

## 组件的属性

1. 对于函数组件，属性会作为一个对象的属性，传递给函数的参数
2. 对于类组件，属性会作为一个对象的属性，传递给构造函数的参数

注意：组件的属性，应该使用小驼峰命名法

```js
import React from "react";

export default class MyClassComp extends React.Component {
  // constructor(props) {
  //     super(props); // this.props = props;
  //     console.log(props, this.props, props === this.props);
  // }

  /**
   * 该方法必须返回React元素
   */
  render() {
    if (this.props.obj) {
      return (
        <>
          <p>姓名：{this.props.obj.name}</p>
          <p>年龄：{this.props.obj.age}</p>
        </>
      );
    } else if (this.props.ui) {
      return (
        <div>
          <h1>下面是传入的内容</h1>
          {this.props.ui}
        </div>
      );
    }
    return <h1>类组件的内容，数字：{this.props.number}</h1>;
  }
}
```

**组件无法改变自身的属性**。

之前学习的 React 元素，本质上，就是一个组件（内置组件）

React 中的哲学：数据属于谁，谁才有权力改动

# 组件状态

组件状态：组件可以自行维护的数据

组件状态仅在类组件中有效

状态（state），本质上是类组件的一个属性，是一个对象

**状态初始化**
**状态的变化**

不能直接改变状态：因为 React 无法监控到状态发生了变化

必须使用 this.setState({})改变状态

一旦调用了 this.setState，会导致当前组件重新渲染

```js
//计时器，用作倒计时
import React, { Component } from "react";

export default class Tick extends Component {
  //初始化状态，JS Next 语法，目前处于实验阶段
  state = {
    left: this.props.number,
    n: 123,
  };

  constructor(props) {
    super(props);
    //初始化状态
    // this.state = {
    //     left: this.props.number
    // };
    this.timer = setInterval(() => {
      this.setState({
        left: this.state.left - 1,
      }); //重新设置状态，触发自动的重新渲染
      if (this.state.left === 0) {
        //停止计时器
        clearInterval(this.timer);
      }
    }, 1000);
  }

  render() {
    return (
      <>
        <h1>倒计时剩余时间：{this.state.left}</h1>
        <p>{this.state.n}</p>
      </>
    );
  }
}
```

**组件中的数据**

1. props：该数据是由组件的使用者传递的数据，所有权不属于组件自身，因此组件无法改变该数组
2. state：该数组是由组件自身创建的，所有权属于组件自身，因此组件有权改变该数据

```js
import React, { Component } from "react";

export default class A extends Component {
  state = {
    n: 123,
  };

  constructor(props) {
    super(props);
    setInterval(() => {
      this.setState({
        n: this.state.n - 1,
      });
    }, 1000);
  }

  render() {
    console.log("A组件重新渲染了");
    return (
      <div>
        <B n={this.state.n} />
      </div>
    );
  }
}

function B(props) {
  return (
    <div>
      B组件：{props.n}
      <C n={props.n} />
    </div>
  );
}

function C(props) {
  return <div>C组件：{props.n}</div>;
}
```

# 事件

在 React 中，组件的事件，本质上就是一个属性

按照之前 React 对组件的约定，由于事件本质上是一个属性，因此也需要使用小驼峰命名法

**如果没有特殊处理，在事件处理函数中，this 指向 undefined**

1. 使用 bind 函数，绑定 this
2. 使用箭头函数

```js
import React, { Component } from "react";
import Tick from "./Tick";

export default class TickControl extends Component {
  state = {
    isOver: false, //倒计时是否完成
  };
  // constructor(props){
  //   super(props);
  //   this.handleClick = this.handleClick.bind(this)
  // }
  // 结果：handleClick不在原型上，而在对象上
  handleClick = () => {
    console.log(this);
    console.log("点击了");
  };

  handleOver = () => {
    this.setState({
      isOver: true,
    });
  };

  render() {
    let status = "正在倒计时";
    if (this.state.isOver) {
      status = "倒计时完成";
    }
    return (
      <div>
        <Tick
          onClick={this.handleClick}
          onOver={this.handleClick}
          number={10}
        />
        <h2>{status}</h2>
      </div>
    );
  }
}
```

```js
export default class Tick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: props.number,
    };
    // console.log(props)
    const timer = setInterval(() => {
      this.setState({
        number: this.state.number - 1,
      });
      if (this.state.number === 0) {
        clearInterval(timer);
        //倒计时完成
        this.props.onOver && this.props.onOver();
      }
    }, 1000);
  }

  render() {
    return <h1 onClick={this.props.onClick}>倒计时：{this.state.number}</h1>;
  }
}
```

# 深入认识 setState

setState，它对状态的改变，**可能**是异步的

> 如果改变状态的代码处于某个 HTML 元素的事件中，则其是异步的，否则是同步

如果遇到某个事件中，需要同步调用多次，需要使用函数的方式得到最新状态

最佳实践：

1. 把所有的 setState 当作是异步的
2. 永远不要信任 setState 调用之后的状态
3. 如果要使用改变之后的状态，需要使用回调函数（setState 的第二个参数）
4. 如果新的状态要根据之前的状态进行运算，使用函数的方式改变状态（setState 的第一个函数）

React 会对异步的 setState 进行优化，将多次 setState 进行合并（将多次状态改变完成后，再统一对 state 进行改变，然后触发 render）

```js
import React, { Component } from "react";

export default class Comp extends Component {
  state = {
    n: 0,
  };

  // constructor(props) {
  //     super(props);
  //     setInterval(() => {
  //         this.setState({
  //             n: this.state.n + 1
  //         });

  //         this.setState({
  //             n: this.state.n + 1
  //         });
  //         this.setState({
  //             n: this.state.n + 1
  //         });
  //     }, 1000)
  // }

  handleClick = () => {
    // this.setState({
    //   n: this.state.n + 1,
    // });
    //console.log(this.state.n)
    this.setState(
      (cur) => {
        //参数prev表示当前的状态
        //该函数的返回结果，会混合（覆盖）掉之前的状态
        //该函数是异步执行
        return {
          n: cur.n + 1,
        };
      },
      () => {
        //所有状态全部更新完成，并且重新渲染后执行
        console.log("state更新完成", this.state.n);
      }
    );

    this.setState((cur) => ({
      n: cur.n + 1,
    }));

    this.setState((cur) => ({
      n: cur.n + 1,
    }));
  };

  render() {
    console.log("render");
    return (
      <div>
        <h1>{this.state.n}</h1>
        <p>
          <button onClick={this.handleClick}>+</button>
        </p>
      </div>
    );
  }
}
```

# 生命周期

生命周期：组件从诞生到销毁会经历一系列的过程，该过程就叫做生命周期。React 在组件的生命周期中提供了一系列的钩子函数（类似于事件），可以让开发者在函数中注入代码，这些代码会在适当的时候运行。

**生命周期仅存在于类组件中，函数组件每次调用都是重新运行函数，旧的组件即刻被销毁**

## 旧版生命周期

React < 16.0.0

1. constructor
   1. 同一个组件对象只会创建一次
   2. 不能在第一次挂载到页面之前，调用 setState，为了避免问题，构造函数中严禁使用 setState
2. componentWillMount
   1. 正常情况下，和构造函数一样，它只会运行一次
   2. 可以使用 setState，但是为了避免 bug，不允许使用，因为在某些特殊情况下，该函数可能被调用多次
3. **render**
   1. 返回一个虚拟 DOM，会被挂载到虚拟 DOM 树中，最终渲染到页面的真实 DOM 中
   2. render 可能不只运行一次，只要需要重新渲染，就会重新运行
   3. 严禁使用 setState，因为可能会导致无限递归渲染
4. **componentDidMount**
   1. 只会执行一次
   2. 可以使用 setState
   3. 通常情况下，会将网络请求、启动计时器等一开始需要的操作，书写到该函数中
5. 组件进入活跃状态
6. componentWillReceiveProps
   1. 即将接收新的属性值
   2. 参数为新的属性对象
   3. 该函数可能会导致一些 bug，所以不推荐使用
7. **shouldComponentUpdate**
   1. 指示 React 是否要重新渲染该组件，通过返回 true 和 false 来指定
   2. 默认情况下，会直接返回 true
8. componentWillUpdate
   1. 组件即将被重新渲染
9. componentDidUpdate
   1. 往往在该函数中使用 dom 操作，改变元素
10. **componentWillUnmount**
    1. 通常在该函数中销毁一些组件依赖的资源，比如计时器

```js
import React, { Component } from "react";

export default class OldLifeCycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 0,
    };
    console.log("constructor", "一个新的组件诞生了！！！");
  }

  componentWillMount() {
    console.log("componentWillMount", "组件即将被挂载");
  }

  componentDidMount() {
    console.log("componentDidMount", "挂载完成");
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "componentWillReceiveProps",
      "接收到新的属性值",
      this.props,
      nextProps
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "shouldComponentUpdate",
      "是否应该重新渲染",
      this.props,
      nextProps,
      this.state,
      nextState
    );
    if (this.props.n === nextProps.n && this.state.n === nextState.n) {
      return false;
    }
    return true;
    // return false;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate", "组件即将被重新渲染");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      "componentDidUpdate",
      "组件已完成重新渲染",
      prevProps,
      prevState
    );
  }

  componentWillUnmount() {
    console.log("componentWillUnmount", "组件被销毁");
  }

  render() {
    console.log("render", "渲染，返回的React元素会被挂载到虚拟DOM树中");
    return (
      <div>
        <h1>旧版生命周期组件</h1>
        <h2>属性n: {this.props.n}</h2>
        <h2>状态n：{this.state.n}</h2>
        <button
          onClick={() => {
            this.setState({
              n: this.state.n + 1,
            });
          }}
        >
          状态n+1
        </button>
      </div>
    );
  }
}
```

## 新版生命周期

React >= 16.0.0

React 官方认为，某个数据的来源必须是单一的

1. getDerivedStateFromProps
   1. 通过参数可以获取新的属性和状态
   2. 该函数是静态的
   3. 该函数的返回值会覆盖掉组件状态
   4. 该函数几乎是没有什么用
2. getSnapshotBeforeUpdate
   1. 真实的 DOM 构建完成，但还未实际渲染到页面中。
   2. 在该函数中，通常用于实现一些附加的 dom 操作
   3. 该函数的返回值，会作为 componentDidUpdate 的第三个参数

```js
import React, { Component } from "react";

export default class NewLifeCycle extends Component {
  state = {
    n: this.props.n,
  };

  // static getDerivedStateFromProps(props, state) {
  //     console.log("getDerivedStateFromProps");
  //     // return null;//不改变当前状态
  //     return { //用新的对象替换掉之前的状态
  //         n: props.n
  //     }
  // }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    console.log("getSnapshotBeforeUpdate");
    return 132;
  };

  componentDidUpdate(prevProps, prevState, snap) {
    console.log("componentDidUpdate", snap);
  }

  render() {
    return (
      <div>
        <h1>{this.state.n}</h1>
        <p>
          <button
            onClick={() => {
              this.setState({
                n: this.state.n + 1,
              });
            }}
          >
            +1
          </button>
        </p>
      </div>
    );
  }
}
```

# mobx

## observable 和 autorun

```js
import { observable, autorun } from "mobx";

const value = observable(0);
const number = observable(100);

autorun(() => {
  console.log(value.get());
});

value.set(1);
value.set(2);
number.set(101);
```

observable 可以用来观测一个数据，这个数据可以数字、字符串、数组、对象等类型(相关知识点具体会在后文中详述)，而当观测到的数据发生变化的时候，如果变化的值处在 autorun 中，那么 autorun 就会自动执行。
上例中的 autorun 函数中，只对 value 值进行了操作，而并没有 number 值的什么事儿，所以 number.set(101)这步并不会触发 autorun，只有 value 的变化才触发了 autorun。

## 计算属性——computed

假如现在我们一个数字，但我们对它的值不感兴趣，而只关心这个数组是否为正数。这个时候我们就可以用到 computed 这个属性了。

```js
const number = observable(10);
const plus = computed(() => number.get() > 0);

autorun(() => {
  console.log(plus.get());
});

number.set(-19);
number.set(-1);
number.set(1);
```

依次输出了 true，false，true。
第一个 true 是 number 初始化值的时候，10>0 为 true 没有问题。
第二个 false 将 number 改变为-19，输出 false，也没有问题。
但是当-19 改变为-1 的时候，虽然 number 变了，但是 number 的改变实际上并没有改变 plus 的值，所以没有其它地方收到通知，因此也就并没有输出任何值。
直到 number 重新变为 1 时才输出 true。

```js
const price = observable(199);
const number = observable(15);

//computed的其它简单例子
const allPrice = computed(() => price.get() * number.get());
```

## action，runInAction 和严格模式（useStrict）

mobx 推荐将修改被观测变量的行为放在 action 中。
来看看以下例子:

```js
import { observable, action } from "mobx";
class Store {
  @observable number = 0;
  @action add = () => {
    this.number++;
  };
}

const newStore = new Store();
newStore.add();
```

以上例子使用了 ES7 的 decorator，在实际开发中非常建议用上它，它可以给你带来更多的便捷

这个类中有一个 add 函数，用来将 number 的值加 1，也就是修改了被观测的变量，根据规范，我们要在这里使用 action 来修饰这个 add 函数。
勇于动手的你也许会发现，就算我把@action 去掉，程序还是可以运行呀。
这是因为现在我们使用的 Mobx 的非严格模式，如果在严格模式下，就会报错了。
接下来让我们来启用严格模式

嗯，Mobx 里启用严格模式的函数就是 useStrict，注意和原生 JS 的"use strict"不是一个东西。
现在再去掉@action 就会报错了。
实际开发的时候建议开起严格模式，这样不至于让你在各个地方很轻易地区改变你所需要的值，降低不确定性。
action 的写法大概有如下几种(摘自 mobx 英文文档):

action(fn)
action(name, fn)
@action classMethod() {}
@action(name) classMethod () {}
@action boundClassMethod = (args) => { body }
@action(name) boundClassMethod = (args) => { body }
@action.bound classMethod() {}
@action.bound(function() {})

可以看到，action 在修饰函数的同时，我们还可以给它设置一个 name，这个 name 应该没有什么太大的作用，但可以作为一个注释更好地让其他人理解这个 action 的意图。

接下来说一个重点 action 只能影响正在运行的函数，而无法影响当前函数调用的异步操作
比如官网中给了如下例子

```js
@action createRandomContact() {
  this.pendingRequestCount++;
  superagent
    .get('https://randomuser.me/api/')
    .set('Accept', 'application/json')
    .end(action("createRandomContact-callback", (error, results) => {
      if (error)
        console.error(error);
      else {
        const data = JSON.parse(results.text).results[0];
        const contact = new Contact(this, data.dob, data.name, data.login.username, data.picture);
        contact.addTag('random-user');
        this.contacts.push(contact);
        this.pendingRequestCount--;
      }
  }));
}
```

重点关注程序的第六行。在 end 中触发的回调函数，被 action 给包裹了，这就很好验证了上面加粗的那句话，action 无法影响当前函数调用的异步操作，而这个回调毫无疑问是一个异步操作，所以必须再用一个 action 来包裹住它，这样程序才不会报错。。

当然如果你说是在非严格模式下……那当我没说吧。。

如果你使用 async function 来处理业务，那么我们可以使用 runInAction 这个 API 来解决之前的问题。

```js
import { observable, action, useStrict, runInAction } from "mobx";
useStrict(true);

class Store {
  @observable name = "";
  @action load = async () => {
    const data = await getData();
    runInAction(() => {
      this.name = data.name;
    });
  };
}
```

你可以把 runInAction 有点类似 action(fn)()的语法糖，调用后，这个 action 方法会立刻执行。

结合 React 使用
在 React 中，我们一般会把和页面相关的数据放到 state 中，在需要改变这些数据的时候，我们会去用 setState 这个方法来进行改变。
先设想一个最简单的场景，页面上有个数字 0 和一个按钮。点击按钮我要让这个数字增加 1，就让我们要用 Mobx 来处理这个试试。

```js
import React from "react";
import { observable, useStrict, action } from "mobx";
import { observer } from "mobx-react";
useStrict(true);

class MyState {
  @observable num = 0;
  @action addNum = () => {
    this.num++;
  };
}

const newState = new MyState();

@observer
export default class App extends React.Component {
  render() {
    return (
      <div>
        <p>{newState.num}</p>
        <button onClick={newState.addNum}>+1</button>
      </div>
    );
  }
}
```

上例中我们使用了一个 MyState 类，在这个类中定义了一个被观测的 num 变量和一个 action 函数 addNum 来改变这个 num 值。
之后我们实例化一个对象，叫做 newState，之后在我的 React 组件中，我只需要用@observer 修饰一下组件类，便可以愉悦地使用这个 newState 对象中的值和函数了。

跨组件交互
在不使用其它框架、类库的情况下，React 要实现跨组件交互这一功能相对有些繁琐。通常我们需要在父组件上定义一个 state 和一个修改该 state 的函数。然后把 state 和这个函数分别传到两个子组件里，在逻辑简单，且子组件很少的时候可能还好，但当业务复杂起来后，这么写就非常繁琐，且难以维护。而用 Mobx 就可以很好地解决这个问题。来看看以下的例子

```js
class MyState {
  @observable num1 = 0;
  @observable num2 = 100;

  @action addNum1 = () => {
    this.num1++;
  };
  @action addNum2 = () => {
    this.num2++;
  };
  @computed get total() {
    return this.num1 + this.num2;
  }
}

const newState = new MyState();

const AllNum = observer((props) => (
  <div>num1 + num2 = {props.store.total}</div>
));

const Main = observer((props) => (
  <div>
    <p>num1 = {props.store.num1}</p>
    <p>num2 = {props.store.num2}</p>
    <div>
      <button onClick={props.store.addNum1}>num1 + 1</button>
      <button onClick={props.store.addNum2}>num2 + 1</button>
    </div>
  </div>
));

@observer
export default class App extends React.Component {
  render() {
    return (
      <div>
        <Main store={newState} />
        <AllNum store={newState} />
      </div>
    );
  }
}
```

有两个子组件，Main 和 AllNum (均采用无状态函数的方式声明的组件)
在 MyState 中存放了这些组件要用到的所有状态和函数。
之后只要在父组件需要的地方实例化一个 MyState 对象，需要用到数据的子组件，只需要将这个实例化的对象通过 props 传下去就好了。

接下来看看网络请求的情况。

```js
useStrict(true);

class MyState {
  @observable data = null;
  @action initData = async () => {
    const data = await getData("xxx");
    runInAction("说明一下这个action是干什么的。不写也可以", () => {
      this.data = data;
    });
  };
}
```

严格模式下，只能在 action 中修改数据，但是 action 只能影响到函数当前状态下的情景，也就是说在 await 之后发生的事情，这个 action 就修饰不到了，于是我们必须要使用了 runInAction(详细解释见上文)。
当然如果你不开启严格模式，不写 runInAction 也不会报错。

个人强烈建议开启严格模式，这样可以防止数据被任意修改，降低程序的不确定性

关于@observer 的一些说明
通常，在和 Mobx 数据有关联的时候，你需要给你的 React 组件加上@observer，你不必太担心性能上的问题，加上这个@observer 不会对性能产生太大的影响，而且@observer 还有一个类似于 pure render 的功能，甚至能起到性能上的一些优化。

所谓 pure render 见下例:

```js
@observer
export default class App extends React.Component {
  state = {
    a: 0,
  };
  add = () => {
    this.setState({
      a: this.state.a + 1,
    });
  };
  render() {
    return (
      <div>
        {this.state.a}
        <button onClick={this.add}>+1</button>
        <PureItem />
      </div>
    );
  }
}

@observer
class PureItem extends React.Component {
  render() {
    console.log("PureItem的render触发了");
    return <div>你们的事情跟我没关系</div>;
  }
}
```
