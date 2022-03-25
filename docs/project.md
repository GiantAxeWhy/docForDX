# 项目经验

## 1、操作 dom 节点

```js
  1）
const myButton = document.getElementById("addDataId");
const father = document.getElementById("father");
father.childNodes[1].appendChild(myButton);
```

```js
    2）document.getElementsByClassName('el-table__empty-text')[0].innerHTML =
        '选择指标组后可进行指标规则配置'
    })
```

## 2、虚拟列表滚动

首先统计下直接渲染的时间 10000 条数据

```js
<button id="button">button</button><br>

<ul id="container"></ul>
```

```js
document.getElementById('button').addEventListener('click',function(){
// 记录任务开始时间
let now = Date.now();
// 插入一万条数据
const total = 10000;
// 获取容器
let ul = document.getElementById('container');
// 将数据插入容器中
for (let i = 0; i < total; i++) {
let li = document.createElement('li');
li.innerText = ~~(Math.random() \* total)
ul.appendChild(li);
}
console.log('JS 运行时间：',Date.now() - now);
setTimeout(()=>{
console.log('总运行时间：',Date.now() - now);
},0)

    // print JS运行时间： 38
    // print 总运行时间： 957

})
```

JS 的运行时间为 38ms,但渲染完成后的总时间为 957ms。
简单说明一下，为何两次 console.log 的结果时间差异巨大，并且是如何简单来统计 JS 运行时间和总渲染时间：
在 JS 的 Event Loop 中，当 JS 引擎所管理的执行栈中的事件以及所有微任务事件全部执行完后，才会触发渲染线程对页面进行渲染
第一个 console.log 的触发时间是在页面进行渲染之前，此时得到的间隔时间为 JS 运行所需要的时间
第二个 console.log 是放到 setTimeout 中的，它的触发时间是在渲染完成，在下一次 Event Loop 中执行的

从 Performance 可以看出，代码从执行到渲染结束，共消耗了 960.8ms,其中的主要时间消耗如下：

Event(click) : 40.84ms

Recalculate Style : 105.08ms

Layout : 731.56ms

Update Layer Tree : 58.87ms

Paint : 15.32ms

从这里我们可以看出，我们的代码的执行过程中，消耗时间最多的两个阶段是 Recalculate Style 和 Layout。

Recalculate Style：样式计算，浏览器根据 css 选择器计算哪些元素应该应用哪些规则，确定每个元素具体的样式。
Layout：布局，知道元素应用哪些规则之后，浏览器开始计算它要占据的空间大小及其在屏幕的位置。

在实际的工作中，列表项必然不会像例子中仅仅只由一个 li 标签组成，必然是由复杂 DOM 节点组成的。
那么可以想象的是，当列表项数过多并且列表项结构复杂的时候，同时渲染时，会在 Recalculate Style 和 Layout 阶段消耗大量的时间。
而虚拟列表就是解决这一问题的一种实现。

虚拟列表本质上是一种按需显示
可见区域为 500px 每个 item 的高度为 50px 那么可视区域内显示的就是 10 条

当滚动发生 滚动条距离顶部为 150px 那么可视区域第一项应当为 item4-item13

因此他的实现逻辑是 页面加载时实现可视区域的 item 加载，当滚动发生时，动态通过计算获得可视区域内的列表项，并将非可视区域内存在的列表项删除。
为了实现计算我们需要以下几项
1、计算当前可视区域的起始数据索引（startIndex）

2、计算当前可视区域的末尾数据索引（endIndex）

3、可视区域的数据，渲染到可视区域

4、计算起始数据索引 在整个列表数据索引中的偏移位置（startOffset）并且设置到列表中
因此整个可视区域的渲染结构如下

```js
<div class="infinite-list-container">
    <div class="infinite-list-phantom"></div>
    <div class="infinite-list">
      <!-- item-1 -->
      <!-- item-2 -->
      <!-- ...... -->
      <!-- item-n -->
    </div>
</div>
```

1）infinite-list-container 为可视区域的容器

2）infinite-list-phantom 为容器内的占位，高度为总列表高度，用于形成滚动条

3）infinite-list 为列表项的渲染区域
监听 infinite-list-container 的 scroll 事件，获取滚动位置 scrollTop

1）假定可视区域高度固定，称之为 screenHeight

2）假定列表每项高度固定，称之为 itemSize

3）假定列表数据称之为 listData

4）假定当前滚动位置称之为 scrollTop

由此可得出计算关系
1、列表总高度 listHeight = listData.length \* itemSize

2、可显示的列表项数 visibleCount = Math.ceil(screenHeight / itemSize)

3、数据的起始索引 startIndex = Math.floor(scrollTop / itemSize)

4、数据的结束索引 endIndex = startIndex + visibleCount

5、列表显示数据为 visibleData = listData.slice(startIndex,endIndex)

当滚动后，由于渲染区域相对于可视区域已经发生了偏移，此时我需要获取一个偏移量 startOffset，通过样式控制将渲染区域偏移至可视区域中。
偏移量 startOffset = scrollTop - (scrollTop % itemSize);

扩展 当需要渲染的 item 高度不固定时

以预估高度先行渲染，然后获取真实高度并缓存。

定义组件属性 estimatedItemSize,用于接收预估高度

```js
props: {
  //预估高度
  estimatedItemSize: {
    type: Number;
  }
}
```

并在初始时根据 estimatedItemSize 对 positions 进行初始化。

```js
initPositions(){
this.positions = this.listData.map((item,index)=>{
return {
index,
height:this.estimatedItemSize,
top:index _ this.estimatedItemSize,
bottom:(index + 1) _ this.estimatedItemSize
}
})
}
```

由于列表项高度不定，并且我们维护了 positions，用于记录每一项的位置，而列表高度实际就等于列表中最后一项的底部距离列表顶部的位置。

```js
//列表总高度
listHeight(){
return this.positions[this.positions.length - 1].bottom;
}
```

由于需要在渲染完成后，获取列表每项的位置信息并缓存，所以使用钩子函数 updated 来实现：

```js
updated(){
let nodes = this.$refs.items;
nodes.forEach((node)=>{
let rect = node.getBoundingClientRect();
let height = rect.height;
let index = +node.id.slice(1)
let oldHeight = this.positions[index].height;
let dValue = oldHeight - height;
//存在差值
if(dValue){
this.positions[index].bottom = this.positions[index].bottom - dValue;
this.positions[index].height = height;
for(let k = index + 1;k<this.positions.length; k++){
this.positions[k].top = this.positions[k-1].bottom;
this.positions[k].bottom = this.positions[k].bottom - dValue;
}
}
})
}
```

滚动后获取列表开始索引的方法修改为通过缓存获取：

```js
//获取列表起始索引
getStartIndex(scrollTop = 0){
let item = this.positions.find(i => i && i.bottom > scrollTop);
return item.index;
}
由于我们的缓存数据，本身就是有顺序的，所以获取开始索引的方法可以考虑通过二分查找的方式来降低检索次数：
//获取列表起始索引
getStartIndex(scrollTop = 0){
//二分法查找
return this.binarySearch(this.positions,scrollTop)
},
//二分法查找
binarySearch(list,value){
let start = 0;
let end = list.length - 1;
let tempIndex = null;
while(start <= end){
let midIndex = parseInt((start + end)/2);
let midValue = list[midIndex].bottom;
if(midValue === value){
return midIndex + 1;
}else if(midValue < value){
start = midIndex + 1;
}else if(midValue > value){
if(tempIndex === null || tempIndex > midIndex){
tempIndex = midIndex;
}
end = end - 1;
}
}
return tempIndex;
},
```

滚动后将偏移量的获取方式变更：

```js
scrollEvent() {
//...省略
if(this.start >= 1){
this.startOffset = this.positions[this.start - 1].bottom
}else{
this.startOffset = 0;
}
}
```

为了使页面平滑滚动，我们还需要在可见区域的上方和下方渲染额外的项目，在滚动时给予一些缓冲，所以将屏幕分为三个区域：

可视区域上方：above
可视区域：screen
可视区域下方：below
定义组件属性 bufferScale,用于接收缓冲区数据与可视区数据的比例
props: {
//缓冲区比例
bufferScale:{
type:Number,
default:1
}
}
可视区上方渲染条数 aboveCount 获取方式如下：

```js
aboveCount(){
return Math.min(this.start,this.bufferScale _ this.visibleCount)
}
```

可视区下方渲染条数 belowCount 获取方式如下：

```js
belowCount(){
return Math.min(this.listData.length - this.end,this.bufferScale _ this.visibleCount);
}
```

真实渲染数据 visibleData 获取方式如下：

```js
visibleData(){
let start = this.start - this.aboveCount;
let end = this.end + this.belowCount;
return this.\_listData.slice(start, end);
}
```

我们使用监听 scroll 事件的方式来触发可视区域中数据的更新，当滚动发生后，scroll 事件会频繁触发，很多时候会造成重复计算的问题，从性能上来说无疑存在浪费的情况。
可以使用 IntersectionObserver 替换监听 scroll 事件，IntersectionObserver 可以监听目标元素是否出现在可视区域内，在监听的回调事件中执行可视区域数据的更新，并且 IntersectionObserver 的监听回调是异步触发，不随着目标元素的滚动而触发，性能消耗极低。

## 3、内存泄露

引起内存泄露的几种情况
1、意外的全局变量
由于 js 对未声明变量的处理方式是在全局对象上创建该变量的引用。如果在浏览器中，全局对象就是 window 对象。变量在窗口关闭或重新刷新页面之前都不会被释放，如果未声明的变量缓存大量的数据，就会导致内存泄露。

```js
function fn() {
  a = "global variable";
}
fn();
function fn() {
  this.a = "global variable";
}
fn();
```

2、闭包引起的内存泄漏

闭包可以读取函数内部的变量，然后让这些变量始终保存在内存中。如果在使用结束后没有将局部变量清除，就可能导致内存泄露。

```js
function fn() {
  var a = "I'm a";
  return function () {
    console.log(a);
  };
}
```

3、没有清理的 DOM 元素引用

```js
// 在对象中引用 DOM
var elements = {
btn: document.getElementById('btn'),
}
解决方法：手动删除，elements.btn = null。
function doSomeThing() {
elements.btn.click()
}

function removeBtn() {
// 将 body 中的 btn 移除, 也就是移除 DOM 树中的 btn
document.body.removeChild(document.getElementById('button'))
// 但是此时全局变量 elements 还是保留了对 btn 的引用, btn 还是存在于内存中,不能被 GC 回收
}
```

vue 中容易出现内存泄露的几种情况
在 Vue SPA 开发应用，那么就更要当心内存泄漏的问题。因为在 SPA 的设计中，用户使用它时是不需要刷新浏览器的，所以 JavaScript 应用需要自行清理组件来确保垃圾回收以预期的方式生效。因此开发过程中，你需要时刻警惕内存泄漏的问题。
1、全局变量造成的内存泄露
声明的全局变量在切换页面的时候没有清空

```js
<template>

  <div id="home">这里是首页</div>
</template>

<script>
  export default {
    mounted() {
      window.test = {
        // 此处在全局window对象中引用了本页面的dom对象
        name: 'home',
        node: document.getElementById('home'),
      }
    },
  }
</script>
```

解决方案:在页面卸载的时候顺便处理掉该引用。

```js
destroyed () {
window.test = null // 页面卸载的时候解除引用
}
```

2、监听在 window/body 等事件没有解绑
特别注意 window.addEventListener 之类的时间监听

```js
<template>

<div id="home">这里是首页</div>
</template>

<script>
export default {
mounted () {
  window.addEventListener('resize', this.func) // window对象引用了home页面的方法
}
}
</script>
```

解决方法:在页面销毁的时候，顺便解除引用，释放内存

```js
mounted () {
window.addEventListener('resize', this.func)
},
beforeDestroy () {
window.removeEventListener('resize', this.func)
}
```

3、绑在 EventBus 的事件没有解绑
举个例子

```js
<template>

  <div id="home">这里是首页</div>
</template>

<script>
export default {
  mounted () {
   this.$EventBus.$on('homeTask', res => this.func(res))
  }
}
</script>
```

解决方法:在页面卸载的时候也可以考虑解除引用

```js
mounted () {
this.$EventBus.$on('homeTask', res => this.func(res))
},
destroyed () {
this.$EventBus.$off()
}
```

4、Echarts
每一个图例在没有数据的时候它会创建一个定时器去渲染气泡，页面切换后，echarts 图例是销毁了，但是这个 echarts 的实例还在内存当中，同时它的气泡渲染定时器还在运行。这就导致 Echarts 占用 CPU 高，导致浏览器卡顿，当数据量比较大时甚至浏览器崩溃。
解决方法：加一个 beforeDestroy()方法释放该页面的 chart 资源，我也试过使用 dispose()方法，但是 dispose 销毁这个图例，图例是不存在了，但图例的 resize()方法会启动，则会报没有 resize 这个方法，而 clear()方法则是清空图例数据，不影响图例的 resize，而且能够释放内存，切换的时候就很顺畅了。
beforeDestroy () {
this.chart.clear()
}

5、v-if 指令产生的内存泄露
v-if 绑定到 false 的值，但是实际上 dom 元素在隐藏的时候没有被真实的释放掉。
比如下面的示例中，我们加载了一个带有非常多选项的选择框，然后我们用到了一个显示/隐藏按钮，通过一个 v-if 指令从虚拟 DOM 中添加或移除它。这个示例的问题在于这个 v-if 指令会从 DOM 中移除父级元素，但是我们并没有清除由 Choices.js 新添加的 DOM 片段，从而导致了内存泄漏。

```js
<div id="app">
  <button v-if="showChoices" @click="hide">Hide</button>
  <button v-if="!showChoices" @click="show">Show</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>

<script>
  export default {
    data() {
      return {
        showChoices: true,
      }
    },
    mounted: function () {
      this.initializeChoices()
    },
    methods: {
      initializeChoices: function () {
        let list = []
        // 我们来为选择框载入很多选项，这样的话它会占用大量的内存
        for (let i = 0; i < 1000; i++) {
          list.push({
            label: 'Item ' + i,
            value: i,
          })
        }
        new Choices('#choices-single-default', {
          searchEnabled: true,
          removeItemButton: true,
          choices: list,
        })
      },
      show: function () {
        this.showChoices = true
        this.$nextTick(() => {
          this.initializeChoices()
        })
      },
      hide: function () {
        this.showChoices = false
      },
    },
  }
</script>
```

在上述的示例中，我们可以用 hide() 方法在将选择框从 DOM 中移除之前做一些清理工作，来解决内存泄露问题。为了做到这一点，我们会在 Vue 实例的数据对象中保留一个属性，并会使用 Choices API 中的 destroy() 方法将其清除。

```js
<div id="app">
  <button v-if="showChoices" @click="hide">Hide</button>
  <button v-if="!showChoices" @click="show">Show</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>

<script>
  export default {
    data() {
      return {
        showChoices: true,
        choicesSelect: null
      }
    },
    mounted: function () {
      this.initializeChoices()
    },
    methods: {
      initializeChoices: function () {
        let list = []
        for (let i = 0; i < 1000; i++) {
          list.push({
            label: 'Item ' + i,
            value: i,
          })
        }
         // 在我们的 Vue 实例的数据对象中设置一个 `choicesSelect` 的引用
        this.choicesSelect = new Choices("#choices-single-default", {
          searchEnabled: true,
          removeItemButton: true,
          choices: list,
        })
      },
      show: function () {
        this.showChoices = true
        this.$nextTick(() => {
          this.initializeChoices()
        })
      },
      hide: function () {
        // 现在我们可以让 Choices 使用这个引用，从 DOM 中移除这些元素之前进行清理工作
        this.choicesSelect.destroy()
        this.showChoices = false
      },
    },
  }
</script>
```

ES6 防止内存泄漏
前面说过，及时清除引用非常重要。但是，你不可能记得那么多，有时候一疏忽就忘了，所以才有那么多内存泄漏。
ES6 考虑到这点，推出了两种新的数据结构： weakset 和 weakmap 。他们对值的引用都是不计入垃圾回收机制的，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存。

```js
const wm = new WeakMap();
const element = document.getElementById("example");
vm.set(element, "something");
vm.get(element);
```

上面代码中，先新建一个 Weakmap 实例。然后，将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 WeakMap 里面。这时，WeakMap 里面对 element 的引用就是弱引用，不会被计入垃圾回收机制。
注册监听事件的 listener 对象很适合用 WeakMap 来实现。

```js
// 代码 1
ele.addEventListener("click", handler, false);

// 代码 2
const listener = new WeakMap();
listener.set(ele, handler);
ele.addEventListener("click", listener.get(ele), false);
```

代码 2 比起代码 1 的好处是：由于监听函数是放在 WeakMap 里面，一旦 dom 对象 ele 消失，与它绑定的监听函数 handler 也会自动消失。
