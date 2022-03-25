# css 汇总

# 1.标准的 CSS 盒子模型及其和低版本的 IE 盒子模型的区别？

      标准（W3C）盒子模型：width = 内容宽度（content） + border + padding + margin
      低版本IE盒子模型： width = 内容宽度（content + border + padding）+ margin

区别： 标准盒子模型盒子的 height 和 width 是 content（内容）的宽高，而 IE 盒子模型盒子的宽高则包括 content+padding+border 部分。

# 2.几种解决 IE6 存在的 bug 的方法

      由 float 引起的双边距的问题，使用 display 解决；
      由 float 引起的 3 像素问题，使用 display: inline -3px;
      使用正确的书写顺序 link visited hover active，解决超链接 hover 点击失效问题；
      对于 IE 的 z-index 问题，通过给父元素增加 position: relative 解决；
      使用!important 解决 Min-height 最小高度问题；
      使用 iframe 解决 select 在 IE6 下的覆盖问题；
      使用 over: hidden, zoom: 0.08, line-height: 1px 解决定义 1px 左右的容器宽度问题；

注意：有关 IE6 支不支持!important 的问题，对于单个类是支持的。例如：

```css
.content {
  color: pink !importent;
}
.content {
  color: orange;
}
// 这里IE6及以上，FF，google等都将显示粉红色
```

但是，当一个样式内部有多个相同属性的时候。例如

```css
.content {
  color: pink !importent;
  color: orange;
}
// IE7及以上，FF, google显示粉红色，而IE6将显示橙色（原因是一个样式内重复设置了属性，后面的就会覆盖掉之前的）
```

# 3.CSS 选择符有哪些？哪些属性可以继承？

常见的选择符有一下：
id 选择器（#content），类选择器（.content）, 标签选择器（div, p, span 等）, 相邻选择器（h1+p）, 子选择器（ul>li）, 后代选择器（li a）， 通配符选择器（\*）, 属性选择器（a[rel = "external"]）， 伪类选择器（a:hover, li:nth-child）

可继承的样式属性： font-size, font-family, color, ul, li, dl, dd, dt;

不可继承的样式属性： border, padding, margin, width, height；

# 4.CSS 优先级算法如何计算？

        权重决定了你css规则怎样被浏览器解析直到生效。“css权重关系到你的css规则是怎样显示的”。
        当很多的样式被应用到某一个元素上时，权重是一个决定哪种样式生效，或者是优先级的过程。
        每个选择器都有自己的权重。你的每条css规则，都包含一个权重级别。 这个级别是由不同的选择器加权计算的，通过权重，不同的样式最终会作用到你的网页中 。
        如果两个选择器同时作用到一个元素上，权重高者生效。

考虑到就近原则，同权重情况下样式定义以最近者为准
载入的样式按照最后的定位为准

优先级排序：
同权重情况下： 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）
!important > # > . > tag
🍀 注意： !important 比 内联优先级高

      元素选择符 1
      class 选择器 10
      id 选择器 100
      元素标签 1000

（1）、!important 声明的样式优先级最高，若有冲突会再进行计算；
（2）、优先级相同时，以最后出现的样式为准；
（3）、继承得到的样式的优先级是最低的。

# 5.CSS3 新增伪类有那些？

    :root 选择文档的根元素，等同于html元素
    :empty 选择没有子元素的元素
    :target 选取当前活动的目标元素
    :not(selector) 选择除 selector 元素意外的元素
    :enabled 选择可用的表单元素
    :disabled 选择禁用的表单元素
    :checked 选择被选中的表单元素
    :nth-child(n) 匹配父元素下指定子元素，在所有子元素中排序第n
    :nth-last-child(n) 匹配父元素下指定子元素，在所有子元素中排序第n，从后向前数
    :nth-child(odd)
    :nth-child(even)
    :nth-child(3n+1)
    :first-child
    :last-child
    :only-child
    :nth-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第n
    :nth-last-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第n，从后向前数
    :nth-of-type(odd)
    :nth-of-type(even)
    :nth-of-type(3n+1)
    :first-of-type
    :last-of-type
    :only-of-type
    ::selection 选择被用户选取的元素部分（伪元素）
    :first-line 选择元素中的第一行（伪元素）
    :first-letter 选择元素中的第一个字符（伪元素）
    :after 在元素在该元素之后添加内容（伪元素）
    :before 在元素在该元素之前添加内容（伪元素）

# 6.如何居中 div？如何居中一个浮动元素？如何让绝对定位的 div 居中？

水平居中

```css

// 方式1： 使用margin： 0 auto居中

    * {margin: 0; padding: 0;}
    .content {
        margin: 0 auto;
    	width: 100px;
    	height: 100px;
        background: pink;
    }

// 方式2： 使用 定位 + left 居中


    * {margin: 0; padding: 0;}
    .content {
    	width: 100px;
        height: 100px;
        background: pink;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }


   <div class="content"></div>

```

垂直居中

```css
/* 1.已知父元素高度情况下
方法1： */
css:
    * {
  margin: 0;
  padding: 0;
}
.content {
  width: 600px;
  height: 600px;
  border: 1px solid #ccc;
}
.content-one {
  width: 100px;
  height: 100px;
  background: pink;
  position: relative; // 父元素无定位，子元素直接用相对定位
  top: 50%;
  transform: translateY(-50%);
}

html:
    <div class="content">
       <div class="content-one"></div>
    </div>
/* 方法2： */
css:
* {
  margin: 0;
  padding: 0;
}
.content {
  width: 600px;
  height: 600px;
  border: 1px solid #ccc;
  position: relative; // 给父元素定位，子绝父相
}
.content-one {
  width: 100px;
  height: 100px;
  background: pink;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

html: <div class= "content" > <div class= "content-one" ></div> </div>;
```

如何让绝对定位的 div 居中

```css
css: * {
  margin: 0;
  padding: 0;
}
.content {
  margin: 0 auto;
  position: absolute;
  width: 1500px;
  background: pink;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

html: <div class= "content" ></div>;
```

css div 垂直水平居中，并完成 div 高度永远是宽度的一半（宽度可以不指定）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      html,
      body {
        width: 100%;
        height: 100%;
      }

      .outer {
        width: 400px;
        height: 100%;
        background: blue;
        margin: 0 auto;

        display: flex;
        align-items: center;
      }

      .inner {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 50%;
        background: red;
      }

      .box {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner">
        <div class="box">hello</div>
      </div>
    </div>
  </body>
</html>
```

用 css2 和 css3 分别写一下垂直居中和水平居中
水平居中：

div + margin: auto;
span + text-align

垂直居中

使用 position 然后 left/top 和 margin 的方式垂直居中（已知宽高和未知宽高）
使用 position + margin
使用 display: table-cell;

已知宽高，进行水平垂直居中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        position: relative;
        width: 400px;
        height: 600px;
        background: blue;
      }

      .inner {
        position: absolute;
        width: 200px;
        height: 300px;
        background: red;
        left: 50%;
        top: 50%;
        margin: -150px 0 0 -100px;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

宽高未知，比如 内联元素，进行水平垂直居中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        width: 400px;
        height: 600px;
        /* background: blue; */
        border: 1px solid red;
        background-color: transparent;
        position: relative;
      }

      .inner {
        position: absolute;
        background: red;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <span class="inner">我想居中显示</span>
    </div>
  </body>
</html>
```

绝对定位的 div 水平垂直居中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        width: 400px;
        height: 600px;
        /* background: blue; */
        border: 1px solid red;
        background-color: transparent;
        position: relative;
      }

      .inner {
        position: absolute;
        background: red;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 200px;
        height: 300px;
        margin: auto;
        border: 1px solid blue;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner">我想居中显示</div>
    </div>
  </body>
</html>
```

图片和其他元素使用 display: table-cell; 进行垂直居中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        width: 400px;
        height: 600px;
        /* background: blue; */
        border: 1px solid red;
        background-color: transparent;
        display: table-cell;
        vertical-align: middle;
      }

      .inner {
        background: red;
        width: 200px;
        height: 300px;
        border: 1px solid blue;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner">我想居中显示</div>
    </div>
  </body>
</html>
```

CSS3
垂直、水平居中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        width: 400px;
        height: 600px;

        display: flex;

        /* 垂直居中 */
        align-items: center;

        /* 水平居中 */
        justify-content: center;
        border: 1px solid red;
        background-color: transparent;
      }

      .inner {
        background: red;
        width: 200px;
        height: 300px;
        border: 1px solid blue;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner">我想居中显示</div>
    </div>
  </body>
</html>
```

# 7.display 有哪些值？他们的作用是什么？

      none 使用后元素将不会显示
      grid 定义一个容器属性为网格布局
      flex 定义一个弹性布局
      block 使用后元素将变为块级元素显示，元素前后带有换行符
      inlinedisplay 默认值。使用后原色变为行内元素显示，前后无换行符
      list-item 使用后元素作为列表显示
      run-in 使用后元素会根据上下文作为块级元素或行内元素显示
      table 使用后将作为块级表格来显示（类似<table>），前后带有换行符
      inline-table 使用后元素将作为内联表格显示（类似<table>），前后没有换行符
      table-row-group 元素将作为一个或多个行的分组来显示（类似<tbody>）
      table-hewder-group 元素将作为一个或多个行的分组来表示（类似<thead>）
      table-footer-group 元素将作为一个或多个行分组显示（类似<tfoot>）
      table-row 元素将作为一个表格行显示（类似<tr>）
      table-column-group 元素将作为一个或多个列的分组显示（类似<colgroup>）
      table-column 元素将作为一个单元格列显示（类似<col>）
      table-cell 元素将作为一个表格单元格显示（类似<td>和<th>）
      table-caption 元素将作为一个表格标题显示（类似<caption>）
      inherit 规定应该从父元素集成 display 属性的值

其中，常用的有：block， inline-block， none， table， line。

# 8.position 的值 relative 和 absolute 定位原点？

首先，使用 position 的时候，应该记住一个规律是‘子绝父相’。

        relative（相对定位）： 生成相对定位的元素，定位原点是元素本身所在的位置；
        absolute（绝对定位）：生成绝对定位的元素，定位原点是离自己这一级元素最近的一级 position 设置为 absolute 或者 relative 的父元素的左上角为原点的。
        fixed （老 IE 不支持）：生成绝对定位的元素，相对于浏览器窗口进行定位。
        static：默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right、z-index 声明）。
        inherit：规定从父元素继承 position 属性的值。

更新一个属性
sticky: (新增元素，目前兼容性可能不是那么的好)，可以设置 position:sticky 同时给一个 (top,bottom,right,left) 之一即可。
注意：

使用 sticky 时，必须指定 top、bottom、left、right4 个值之一，不然只会处于相对定位；
sticky 只在其父元素内其效果，且保证父元素的高度要高于 sticky 的高度；
父元素不能 overflow:hidden 或者 overflow:auto 等属性。

# 9.CSS3 有哪些新特性？

关于 CSS 新增的特性，有以下：

      选择器;
      圆角（border-raduis）;
      多列布局（multi-column layout）;
      阴影（shadow）和反射（reflect）;
      文字特效（text-shadow）;
      文字渲染（text-decoration）;
      线性渐变（gradient）;
      旋转（rotate）/缩放（scale）/倾斜（skew）/移动（translate）;
      媒体查询（@media）;
      RGBA和透明度 ;
      @font-face属性;
      多背景图 ;
      盒子大小;
      语音;

# 10.用纯 CSS 创建一个三角形的原理是什么？

方法一：隐藏上，左，右三条边，颜色设定为（transparent）

```html
css: * {margin: 0; padding: 0;} .content { width: 0; height: 0; margin: 0 auto;
border-width: 20px; border-style: solid; border-color: transparent transparent
pink transparent; // 对应上右下左，此处为 下 粉色 } html:
<div class="content"></div>
```

方法二： 采用的是均分原理
实现步骤： 1.首先保证元素是块级元素；2.设置元素的边框；3.不需要显示的边框使用透明色。

```html
css: * {margin: 0; padding: 0;} .content { width:0; height:0; margin:0 auto;
border:50px solid transparent; border-top: 50px solid pink; } html:
<div class="content"></div>
```

# 11.浮动原理以及为什么会出现浮动和什么时候需要清除浮动？清除浮动的方式？

非 IE 浏览器下，容器不设定高度且子元素浮动时，容器高度不能被内容撑开。此时，内容会溢出到容器外面而影响布局。此类现象被称为浮动（溢出）。
原理：

浮动元素脱离文档流，不占据空间（引起“高度塌陷”现象）；
浮动元素碰到包含它的边框或其他浮动元素的边框停留。

浮动元素碰到包含他的边框或者浮动元素的边框停留。由于浮动元素不在文档流之中，文档流的块级框会表现的就像浮动框不存在一样。浮动元素会漂浮在文档流的块级框之上。
浮动会带来的问题：

父级元素的高度将会无法被撑开，会影响与父级元素同级的元素
与浮动元素同级的非浮动元素（内联元素）会跟随其后
若浮动的元素不是第一个元素，则该元素之前的元素也要浮动，否则会影响页面的显示结构

清除方式：

父级盒子定义高度（height）;
最后一个浮动元素后面加一个 div 空标签，并且添加样式 clear: both;
包含浮动元素的父级标签添加样式 overflow 为 hidden/both;
父级 div 定义 zoom;

# 12.CSS 优化、提高性能的方法有哪些？

      多个css可合并，并尽量减少http请求
      属性值为0时，不加单位
      将css文件放在页面最上面
      避免后代选择符，过度约束和链式选择符
      使用紧凑的语法
      避免不必要的重复
      使用语义化命名，便于维护
      尽量少的使用!impotrant，可以选择其他选择器
      精简规则，尽可能合并不同类的重复规则
      遵守盒子模型规则

# 13.CSS 预处理器/后处理器是什么？为什么要使用它们？

预处理器，如：less，sass，stylus,用来预编译 sass 或者 less，增加了 css 代码的复用性，还有层级，mixin， 变量，循环， 函数等，对编写以及开发 UI 组件都极为方便。
后处理器， 如： postCss,通常被视为在完成的样式表中根据 css 规范处理 css，让其更加有效。目前最常做的是给 css 属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。
css 预处理器为 css 增加一些编程特性，无需考虑浏览器的兼容问题，我们可以在 CSS 中使用变量，简单的逻辑程序，函数等在编程语言中的一些基本的性能，可以让我们的 css 更加的简洁，增加适应性以及可读性，可维护性等。
其它 css 预处理器语言：Sass（Scss）, Less, Stylus, Turbine, Swithch css, CSS Cacheer, DT Css。
使用原因：

结构清晰， 便于扩展
可以很方便的屏蔽浏览器私有语法的差异
可以轻松实现多重继承
完美的兼容了 CSS 代码，可以应用到老项目中

# 14.::before 和 :after 中双冒号和单冒号有什么区别？解释一下这 2 个伪元素的作用

（1）、冒号(:)用于 CSS3 伪类，双冒号(::)用于 CSS3 伪元素。
（2）、::before 就是以一个子元素的存在，定义在元素主体内容之前的一个伪元素。并不存在于 dom 之中，只存在在页面之中。
🍀 注意： :before 和 :after 这两个伪元素，是在 CSS2.1 里新出现的。起初，伪元素的前缀使用的是单冒号语法，但随着 Web 的进化，在 CSS3 的规范里，伪元素的语法被修改成使用双冒号，成为::before ::after。

# 15.如果需要手动写动画，你认为最小时间间隔是多久，为什么？

多数显示器默认频率是 60Hz，即 1 秒刷新 60 次，所以理论上最小间隔为 1/60＊1000ms ＝ 16.7ms

# 16. rgba() 和 opacity 的透明效果有什么不同？

opacity 作用于元素以及元素内的所有内容（包括文字）的透明度；

rgba() 只作用于元素自身的颜色或其背景色，子元素不会继承透明效果；

# 17.flex 布局

Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

任何一个容器都可以指定为 Flex 布局。
采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做 main start，结束位置叫做 main end；交叉轴的开始位置叫做 cross start，结束位置叫做 cross end。

项目默认沿主轴排列。单个项目占据的主轴空间叫做 main size，占据的交叉轴空间叫做 cross size。

容器的属性
以下 6 个属性设置在容器上。

flex-direction
flex-wrap
flex-flow
justify-content
align-items
align-content

## flex-direction 属性

flex-direction 属性决定主轴的方向（即项目的排列方向）。

row（默认值）：主轴为水平方向，起点在左端。
row-reverse：主轴为水平方向，起点在右端。
column：主轴为垂直方向，起点在上沿。
column-reverse：主轴为垂直方向，起点在下沿。

## flex-wrap 属性

默认情况下，项目都排在一条线（又称"轴线"）上。flex-wrap 属性定义，如果一条轴线排不下，如何换行。
.box{
flex-wrap: nowrap | wrap | wrap-reverse;
}

## flex-flow

flex-flow 属性是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap。

## justify-content 属性

justify-content 属性定义了项目在主轴上的对齐方式。

    flex-start（默认值）：左对齐
    flex-end：右对齐
    center： 居中
    space-between：两端对齐，项目之间的间隔都相等。
    space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

## align-items 属性

align-items 属性定义项目在交叉轴上如何对齐

    flex-start：交叉轴的起点对齐。
    flex-end：交叉轴的终点对齐。
    center：交叉轴的中点对齐。
    baseline: 项目的第一行文字的基线对齐。
    stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

## align-content 属性

align-content 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
flex-start：与交叉轴的起点对齐。
flex-end：与交叉轴的终点对齐。
center：与交叉轴的中点对齐。
space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
stretch（默认值）：轴线占满整个交叉轴。

## order 属性

order 属性定义项目的排列顺序。数值越小，排列越靠前，默认为 0。

## flex-grow 属性

flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的 flex-grow 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

## flex-shrink 属性

flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。

## flex-basis 属性

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。

## flex 属性

flex 属性是 flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。后两个属性可选。
该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

## align-self 属性

align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。

# 18.display:inline-block 什么时候会显示间隙？

有空格时候会有间隙， 可以删除空格解决；
margin 正值的时候， 可以让 margin 使用负值解决；
使用 font-size 时候，可通过设置 font-size:0、letter-spacing、word-spacing 解决；

# 19.png、jpg、 jpeg、 bmp、gif 这些图片格式解释一下，分别什么时候用。有没有了解过 webp？

（1）、png-便携式网络图片（Portable Network Graphics）,是一种无损数据压缩位图文件格式。优点是：压缩比高，色彩好。 大多数地方都可以用。
（2）、jpg 是一种针对相片使用的一种失真压缩方法，是一种破坏性的压缩，在色调及颜色平滑变化做的不错。在 www 上，被用来储存和传输照片的格式。
（3）、gif 是一种位图文件格式，以 8 位色重现真色彩的图像。可以实现动画效果。
（4）、bmp 的优点： 高质量图片；缺点： 体积太大； 适用场景： windows 桌面壁纸；
（4）、webp 格式是谷歌在 2010 年推出的图片格式，压缩率只有 jpg 的 2/3，大小比 png 小了 45%。缺点是压缩的时间更久了，兼容性不好，目前谷歌和 opera 支持。

# 20.在 CSS 样式中常使用 px、em 在表现上有什么区别？

px 相对于显示器屏幕分辨率，无法用浏览器字体放大功能。

em 值不是固定的，会继承父级的字体大小： em = 像素值 / 父级 font-size。

# 21.什么是外边距重叠？ 重叠的结果是什么？

首先，外边距重叠就是 margin-collapse。相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距。 这种合并外边距的方式被称为折叠，结合而成的外边距称为折叠外边距。
折叠结果遵循下列计算原则：

两个相邻的外面边距是正数时，折叠结果就是他们之中的较大值；
两个相邻的外边距都是负数时，折叠结果是两者绝对值的较大值；
两个外边距一正一负时，折叠结果是两者的相加的和；

# 22.display: none; 与 visibility: hidden; 有什么区别？

联系： 这两个属性的值都可以让元素变得不可见；
区别：

从占据空间角度看：display: none;会让元素完全从渲染树中消失，渲染的时候不占据任何空间；visibility: hidden;不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见；
从继承方面角度看：display: none;是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；visibility:hidden;是继承属性，子孙节点消失由于继承了 hidden，通过设置 visibility: visible;可以让子孙节点显式；
从重绘和重排角度看：修改常规流中元素的 display 通常会造成文档重排。修改 visibility 属性只会造成本元素的重绘

# 23.link 与 @import 的区别？

link 是 HTML 方式， @import 是 CSS 方式；
link 最大限度支持并行下载，@import 过多嵌套导致串行下载，出现 FOUC；
link 可以通过 rel="alternate stylesheet" 指定候选样式；
浏览器对 link 支持早于@import ，可以使用 @import 对老浏览器隐藏样式；
@import 必须在样式规则之前，可以在 css 文件中引用其他文件；

总的来说： link 优于@import。

什么是 FOUC(Flash of Unstyled Content)？ 如何来避免 FOUC？

当使用@import 导入 CSS 时，会导致某些页面在 IE 出现奇怪的现象： 没有样式的页面内容显示瞬间闪烁，这种现象被称为“文档样式暂时失效”，简称 FOUC。
产生原因： 当样式表晚于结构性 html 加载时，加载到此样式表时，页面将会停止之前的渲染。等待此样式表被下载和解析后，再重新渲染页面，期间导致短暂的花屏现象。
解决办法： 只要在<head>之间加入一个<link>或者<script>``</script>元素即可。

# 24.全屏滚动的原理是什么？用到了 CSS 的哪些属性？

全屏滚动有点类似于轮播，整体的元素一直排列下去，假设有 5 个需要展示的全屏页面，那么高度是 500%，只是展示 100%。也可以理解为超出隐藏部分，滚动时显示。
可能用到的 CSS 属： overflow:hidden; transform:translate(100%, 100%); display:none;
❤️ 拓展 ： 也可以利用全屏视觉滚动差，使用 background-attachment: fixed; 来实现全屏效果。（这里是细心的小伙伴提出的另一个 idea🤨）

# 25.对 BFC 规范(块级格式化上下文：block formatting context)的理解

## BFC 到底是什么东西

BFC 全称：Block Formatting Context， 名为 "块级格式化上下文"。
W3C 官方解释为：BFC 它决定了元素如何对其内容进行定位，以及与其它元素的关系和相互作用，当涉及到可视化布局时，Block Formatting Context 提供了一个环境，HTML 在这个环境中按照一定的规则进行布局。
简单来说就是，BFC 是一个完全独立的空间（布局环境），让空间里的子元素不会影响到外面的布局。那么怎么使用 BFC 呢，BFC 可以看做是一个 CSS 元素属性

## 怎样触发 BFC

这里简单列举几个触发 BFC 使用的 CSS 属性

overflow: hidden
display: inline-block
position: absolute
position: fixed
display: table-cell
display: flex

## BFC 的规则

BFC 就是一个块级元素，块级元素会在垂直方向一个接一个的排列
BFC 就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签
垂直方向的距离由 margin 决定， 属于同一个 BFC 的两个相邻的标签外边距会发生重叠
计算 BFC 的高度时，浮动元素也参与计算

## BFC 解决了什么问题

1.使用 Float 脱离文档流，高度塌陷
display: inline-block;

2、Margin 边距重叠
可以看到上面我们为两个盒子的 margin 外边距设置的是 10px，可结果显示两个盒子之间只有 10px 的距离，这就导致了 margin 塌陷问题，这时 margin 边距的结果为最大值，而不是合，为了解决此问题可以使用 BFC 规则（为元素包裹一个盒子形成一个完全独立的空间，做到里面元素不受外面布局影响），或者简单粗暴方法一个设置 margin，一个设置 padding。

3.两栏布局
可以看到上面元素，第二个 div 元素为 300px 宽度，但是被第一个 div 元素设置 Float 脱离文档流给覆盖上去了，解决此方法我们可以把第二个 div 元素设置为一个 BFC（display:flex;。

两个 div 上下排列，都设 margin，有什么现象？

都正取大
一正一负相加

问：为什么会有这种现象？你能解释一下吗
是由块级格式上下文决定的，BFC，元素在 BFC 中会进行上下排列，然后垂直距离由 margin 决定，并且会发生重叠，具体表现为同正取最大的，同负取绝对值最大的，一正一负，相加
BFC 是页面中一个独立的隔离容器，内部的子元素不会影响到外部的元素。

# 26.一个满屏'品字'布局如何设计?

方法有挺多种，但是比较简单的方式就是： 上面的 div 宽度设置为 100%，底下两个 div 设置成 50%，并使用 float 或者 inline 使其保持在同一行即可（具体的样式可以自己微调）。如下：

```html
css: .content { width: 50%; height: 150px; margin: 0 auto; } .top { width: 40%;
height: 50px; background-color: pink; margin-bottom: 50px; margin-left: 30%; }
.left { width: 45%; height: 50px; background-color: pink; float: left; } .right
{ width: 45%; height: 50px; background-color: pink; float: right; } html:
<div class="content">
  <div class="top"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
>
```

# 27.margin 和 padding 分别适合什么场景使用？

（1）、需要在 border 外侧添加空白且空白处不需要背景（色），或上下相连的两个盒子之间的空白需要相互抵消时，可以使用 margin；
（2）、需要在 border 内侧添加空白且空白处需要背景（色），或上下相连的两个盒子之间的空白，希望等于两者 时，可以使用 padding。

# 28.伪元素和伪类的区别和作用？

首先，伪类的效果可以通过添加实际的类来实现，而伪元素的效果可以通过添加实际的元素来实现。所以它们的本质区别就是是否抽象创造了新元素。
伪元素/伪对象： 不存在在 DOM 文档中，是虚拟的元素，是创建新元素。代表某个元素的子元素，这个子元素虽然在逻辑上存在，但却并不实际存在于文档树中。

```css
p::first-child {
  color: red;
}
/*
伪类：存在DOM文档中，逻辑上存在但在文档树中却无须标识的“幽灵”分类。 */
a:hover {
  color: #ff00ff;
}
p:first-child {
  color: red;
}
```

🍀 注意：

伪类只能使用“：”；
而伪元素既可以使用“:”，也可以使用“::”；
因为伪类是类似于添加类所以可以是多个，而伪元素在一个选择器中只能出现一次，并且只能出现在末尾。

伪类和伪元素是用来修饰不在文档树中的部分，比如，一句话中的第一个字母，或者是列表中的第一个元素。下面分别对伪类和伪元素进行解释：
伪类用于当已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，当用户悬停在指定的元素时，我们可以通过:hover 来描述这个元素的状态。虽然它和普通的 css 类相似，可以为已有的元素添加样式，但是它只有处于 dom 树无法描述的状态下才能为元素添加样式，所以将其称为伪类。
伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before 来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。
区别
伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。因此，伪类与伪元素的区别在于：有没有创建一个文档树之外的元素。
CSS3 规范中的要求使用双冒号(::)表示伪元素，以此来区分伪元素和伪类，比如::before 和::after 等伪元素使用双冒号(::)，:hover 和:active 等伪类使用单冒号(:)。除了一些低于 IE8 版本的浏览器外，大部分浏览器都支持伪元素的双冒号(::)表示方法。

# 29.rem 为什么可以缩放，以什么为基准？其优缺点有哪些？

rem``以 html 的字号为基准，比如 2rem，而 html 的字号时 16px，此时 rem 就是 32px。可以写一段 js 让 html 根元素的字号随着浏览器宽度的变化而等比例变化，此时造成页面等比例缩放的现象。
优点：
相对于 em 的好处来说，不会发生逐渐增大或者减小字体尺寸的情况，因为始终集成根元素的字体大小；rem 单位不仅仅是可应用于字体大小，还可以用于设定高度等其它大小，使页面可以适配不同屏幕尺寸。
🍀 注意： rem 一般只用于移动端。

# 31.回顾 position 的值及其作用？

static（默认）：按照正常文档流进行排列；
relative（相对定位）： 不脱离文档流，参考自身静态位置通过 top, bottom, left, right 定位；
absolute（绝对定位）： 参考距离最近一个不为 static 的父级元素通过 top, bottom, left, right 定位；
fixed（固定定位）： 所固定的参照对象是可视窗口。

# 32. 常见的 CSS 布局有几种？

常见的 CSS 布局有： 固定布局、流式布局、弹性布局、浮动布局、定位布局、margin 和 padding。

# 33. 行内元素有哪些?块级元素有哪些? 空(void)元素有那些?

行内元素： a、b、 span、img、 input、 strong、 select、 label、 em、 button、 textarea；
块级元素： div、 ul、 li、 dl、 dt、 dd、 p、 h1-h6、 blockquote；
空元素： 即没有实际内容内容的 html 元素，如：br、 meta、 hr、 link、 input、 img；
1，块级元素独占一行，其宽度自动填满父元素宽度
行内元素不独占一行，相邻行内元素排在同一行，直到排不下，才换行，其宽度随元素的内容而变化
2，一般情况下，块级元素可设置 width, height 属性，行内元素设置 width, height 无效（置换元素除外）
(注意：块级元素即使设置了宽度，仍然是独占一行的)
3，块级元素可以设置 margin 和 padding. 行内元素的水平方向的 padding-left,padding-right,margin-left,margin-right 都产生边距效果，但竖直方向的 padding-top,padding-bottom,margin-top,margin-bottom 都不会产生边距效果。（水平方向有效，竖直方向无效）

# 34. style 标签写在 body 后与 body 前有什么区别？

一般情况下，页面加载时自上而下的。将 style 标签至于 body 之前，为的是先加载样式。
若是写在 body 标签之后，由于浏览器以逐行方式对 html 文档进行解析，当解析到写在写在文档尾部的样式表时，会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后会重新渲染，在 windows 的 IE 下可能会出现 FOUC 现象（页面闪烁）。

# 35.如何优化图像以及图像格式有什么区别？

优化图像：

不用图片，尽量使用 CSS3 代替。对于一些要实现的修饰效果，例如阴影，圆角，半透明等，可以用 CSS3 完成；
尽可能使用矢量图 SVG 代替位图。对于绝大多数图案和图标等，矢量图更小，而且可以缩放而无需生成多套图。现代的主流浏览器大多数都能稳定的支持 SVG。

图像格式区别：

矢量图： 图标字体，如 font-awesome、svg；
位图： GIF、jpg（JPEG）、png；

矢量图和位图的区别：

PNG：它可以细分为三种格式： PNG8，PNG24，PNG32。后面的数字代表这种 PNG 格式最多可以索引和存储的颜色值；
JPG: 一种大小与质量相对平衡的压缩图片格式。适用于允许轻微失真的色彩丰富的照片，不适用于色彩简单（色调少）的图片，比如图标啊，logo 等；
GIF： 一种无损的，8 位图片格式。具有支持动画，索引透明，压缩等特性。使用色彩简单的图片。

优点： 能保证在最不失真的情况下尽可能压缩图像文件的大小；
缺点： 对于需要高保真的较为复杂的图像，PNG 虽然能无损压缩，但是图片较大，不适合应用在 web 页面上；

# 36.什么是回流（重排）和重绘以及其区别？

回流（重排），reflow:当 render tree 中的一部分（或全部）因为元素的规模尺寸，布局，隐藏等改变时而需要重新构建；
重绘（repaint）:当 render tree 中的一些元素需要更新属性，而这些属性只影响元素的外观，风格，而不会影响布局时，称其为重绘，例如颜色改变等。

🍀 注意：每个页面至少需要引发一次重排+重绘，而且重排（回流）一定会引发重绘。
触发重排（回流）的条件：

增加或者删除可见的 dom 元素；
元素的位置发生了改变；
元素的尺寸发生了改变，例如边距，宽高等几何属性改变；
内容改变，例如图片大小，字体大小改变等；
页面渲染初始化；
浏览器窗口尺寸改变，例如 resize 事件发生时等；

# 37.了解 box-sizing 吗？

box-sizing 属性可以被用来调整这些表现:

content-box  是默认值。如果你设置一个元素的宽为 100px，那么这个元素的内容区会有 100px 宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。
border-box 告诉浏览器：你想要设置的边框和内边距的值是包含在 width 内的。也就是说，如果你将一个元素的 width 设为 100px，那么这 100px 会包含它的 border 和 padding，内容区的实际宽度是 width 减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高。

# 38.CSS 动画有哪些？

animation、transition、transform、translate 这几个属性要搞清楚：

    animation：用于设置动画属性，他是一个简写的属性，包含6个属性
    transition：用于设置元素的样式过度，和animation有着类似的效果，但细节上有很大的不同
    transform：用于元素进行旋转、缩放、移动或倾斜，和设置样式的动画并没有什么关系
    translate：translate只是transform的一个属性值，即移动，除此之外还有 scale 等

# 39.CSS 实现自适应正方形、等宽高比矩形

双重嵌套，外层 relative，内层 absolute
padding 撑高
如果只是要相对于 body 而言的话，还可以使用 vw 和 vh
伪元素设置 margin-top: 100%撑高

双重嵌套，外层 relative，内层 absolute

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        padding-top: 50%;
        height: 0;
        background: #ccc;
        width: 50%;
        position: relative;
      }

      .inner {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: blue;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner">hello</div>
    </div>
  </body>
</html>
```

padding 撑高画正方形

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .outer {
        width: 400px;
        height: 600px;
        background: blue;
      }

      .inner {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        background: red;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

相对于视口 VW VH

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .inner {
        width: 1vw;
        height: 1vw;
        background: blue;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

伪元素设置 margin-top

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .inner {
        width: 100px;
        overflow: hidden;
        background: blue;
      }

      .inner::after {
        content: "";
        margin-top: 100%;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="outer">
      <div class="inner"></div>
    </div>
  </body>
</html>
```

# 40.两栏布局

左 float，然后右 margin-left（右边自适应）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      div {
        height: 500px;
      }

      .aside {
        width: 300px;
        float: left;
        background: yellow;
      }

      .main {
        background: aqua;
        margin-left: 300px;
      }
    </style>
  </head>
  <body>
    <div class="aside"></div>
    <div class="main"></div>
  </body>
</html>
```

BFC + float

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      div {
        height: 500px;
      }

      .aside {
        width: 300px;
        float: left;
        background: yellow;
      }

      .main {
        overflow: hidden;
        background: aqua;
      }
    </style>
  </head>
  <body>
    <div class="aside"></div>
    <div class="main"></div>
  </body>
</html>
```

圣杯布局实现两栏布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      /* div {
        height: 500px;
      } */

      /* .box {
        overflow: hidden;
      } */

      /* .container {
        padding: 0 300px 0 200px;
        border: 1px solid black;
      } */

      html,
      body {
        height: 100%;
      }

      div {
        height: 100%;
      }

      .container {
        display: flex;
      }

      .content {
        flex: 1 1;
        order: 2;
        background: #f00;
      }

      .left {
        float: left;
        width: 100%;
        background: #0f0;
      }

      .right {
        float: left;
        width: 300px;
        margin-left: -300px;
        background: #00f;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left">你好</div>
      <div class="right">我好</div>
    </div>
  </body>
</html>
```

flex 实现两栏布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      /* div {
        height: 500px;
      } */

      /* .box {
        overflow: hidden;
      } */

      /* .container {
        padding: 0 300px 0 200px;
        border: 1px solid black;
      } */

      html,
      body {
        height: 100%;
      }

      div {
        height: 100%;
      }

      .container {
        display: flex;
      }

      .content {
        flex: 1 1;
        order: 2;
        background: #f00;
      }

      .left {
        flex: 0 0 200px;
        background: #0f0;
      }

      .right {
        flex: 1 1;
        background: #00f;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left">你好</div>
      <div class="right">我好</div>
    </div>
  </body>
</html>
```

# 41.实现三列布局的方式

通过 float + margin

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      div {
        height: 500px;
      }

      .left {
        float: left;
        width: 200px;
        height: 200px;
        background: green;
      }

      .right {
        float: right;
        width: 200px;
        height: 200px;
        background: red;
      }

      .middle {
        margin-left: 210px;
        margin-right: 210px;
        background: black;
        height: 200px;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <div class="left"></div>
      <div class="right"></div>
      <div class="middle"></div>
    </div>
  </body>
</html>
```

圣杯布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .container {
        padding: 0 300px 0 200px;
        border: 1px solid black;
      }

      .content {
        float: left;
        width: 100%;
        background: #f00;
      }

      .left {
        width: 200px;
        background: #0f0;
        float: left;
        margin-left: -100%;
        position: relative;
        left: -200px;
      }

      .right {
        width: 300px;
        background: #00f;
        float: left;
        margin-left: -300px;
        position: relative;
        right: -300px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">中间内容</div>
      <div class="left">左侧区域</div>
      <div class="right">右侧区域</div>
    </div>
  </body>
</html>
```

双飞翼布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      html,
      body {
        height: 100%;
      }

      div {
        height: 100%;
      }

      .main {
        float: left;
        width: 100%;
        background: #f00;
      }

      .main .content {
        margin-left: 200px;
        margin-right: 300px;
      }

      .left {
        width: 200px;
        background: #0f0;
        float: left;
        margin-left: -100%;
      }

      .right {
        width: 300px;
        background: #00f;
        float: left;
        margin-left: -300px;
      }
    </style>
  </head>
  <body>
    <div class="main">
      <div class="content">hello world</div>
    </div>
    <div class="left">你好</div>
    <div class="right">王鹏浩</div>
  </body>
</html>
```

flex 布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      html,
      body {
        height: 100%;
      }

      div {
        height: 100%;
      }

      .container {
        display: flex;
      }

      .content {
        flex: 1 1;
        order: 2;
        background: #f00;
      }

      .left {
        flex: 0 0 200px;
        order: 1;
        background: #0f0;
      }

      .right {
        flex: 0 0 300px;
        order: 3;
        background: #00f;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">hello world</div>
      <div class="left">你好</div>
      <div class="right">王鹏浩</div>
    </div>
  </body>
</html>
```

# 42.红绿灯

```css
<div id="lamp"></div>
/* 思路：
总共三个灯，分别红黄绿，要一个一个按顺序点亮，我们可以这样暂定一个循环需要10秒中，每盏灯点亮3秒，
那么在keyframes中对应写法就如下所示（红灯点亮时间为10%--40%，黄灯点亮时间为40%--70%，绿灯点亮时间为70%--100%）
*/ @keyframes redLamp {
  0% {
    background-color: #999;
  }
  9.9% {
    background-color: #999;
  }
  10% {
    background-color: red;
  }
  40% {
    background-color: red;
  }
  40.1% {
    background-color: #999;
  }
  100% {
    background-color: #999;
  }
}
@keyframes yellowLamp {
  0% {
    background-color: #999;
  }
  39.9% {
    background-color: #999;
  }
  40% {
    background-color: yellow;
  }
  70% {
    background-color: yellow;
  }
  70.1% {
    background-color: #999;
  }
  100% {
    background-color: #999;
  }
}
@keyframes greenLamp {
  0% {
    background-color: #999;
  }
  69.9% {
    background-color: #999;
  }
  70% {
    background-color: green;
  }
  100% {
    background-color: green;
  }
}
#lamp,
#lamp:before,
#lamp:after {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #999;
  position: relative;
}
#lamp {
  left: 100px;
  animation: yellowLamp 10s ease infinite;
}
#lamp:before {
  display: block;
  content: "";
  left: -100px;
  animation: redLamp 10s ease infinite;
}
#lamp:after {
  display: block;
  content: "";
  left: 100px;
  top: -100px;
  animation: greenLamp 10s ease infinite;
}
```

# 43 H5 与 css3 新特性

h5

    语义化标签：header、footer、section、nav、aside、article
    增强型表单：input 的多个 type
    新增表单元素：datalist、keygen、output
    新增表单属性：placehoder、required、min 和 max
    音频视频：audio、video
    canvas
    地理定位
    拖拽
    本地存储：localStorage - 没有时间限制的数据存储；sessionStorage - 针对一个 session 的数据存储，当用户关闭浏览器窗口后，数据会被删除
    新事件：onresize、ondrag、onscroll、onmousewheel、onerror、onplay、onpause
    WebSocket：单个 TCP 连接上进行全双工通讯的协议

css3

      选择器
      背景和边框
      文本效果
      2D/3D 转换
      动画、过渡
      多列布局
      用户界面

```css
     :last-child /* 选择元素最后一个孩子 */
:first-child /* 选择元素第一个孩子 */
:nth-child(1) /* 按照第几个孩子给它设置样式 */
:nth-child(even) /* 按照偶数 */
:nth-child(odd)  /* 按照奇数 */
:disabled /* 选择每个禁用的E元素 */
:checked /* 选择每个被选中的E元素 */
:not(selector) /* 选择非 selector 元素的每个元素 */
::selection /* 选择被用户选取的元素部分 */
```

2D/3D 转换

2D/3D 转换
2D 转换（transform）
translate()：元素从其当前位置移动，根据给定的 left（x 坐标） 和 top（y 坐标） 位置参数。 transform: translate(50px, 100px);
rotate()：元素顺时针旋转给定的角度。若为负值，元素将逆时针旋转。transform: rotate(30deg);
scale()：元素的尺寸会增加或减少，根据给定的宽度（X 轴）和高度（Y 轴）参数，也可以一个值（宽高）。transform: scale(2,4);
skew()：元素翻转给定的角度，根据给定的水平线（X 轴）和垂直线（Y 轴）参数。transform: skew(30deg, 20deg);
matrix()： 把所有 2D 转换方法组合在一起，需要六个参数，包含数学函数，允许您：旋转、缩放、移动以及倾斜元素。transform:matrix(0.866,0.5,-0.5,0.866,0,0);

    3D 转换
    rotateX()：元素围绕其 X 轴以给定的度数进行旋转。transform: rotateX(120deg);
    rotateY()：元素围绕其 Y 轴以给定的度数进行旋转。transform: rotateY(130deg);
    perspective：规定 3D 元素的透视效果

动画、过渡
过渡效果（transition），使页面变化更平滑，以下参数可直接写在 transition 后面
transition-property ：执行动画对应的属性，例如 color，background 等，可以使用 all 来指定所有的属性。
transition-duration：过渡动画的一个持续时间。
transition-timing-function：在延续时间段，动画变化的速率，常见的有：ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier
transition-delay：延迟多久后开始动画

动画（animation）
先定义 @keyframes 规则（0%，100% | from，to）
然后定义 animation，以下参数可直接写在 animation 后面
animation-name: 定义动画名称
animation-duration: 指定元素播放动画所持续的时间长
animation-timing-function: ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier(, , , )： 指元素根据时间的推进来改变属性值的变换速率，即动画的播放方式
animation-delay: 指定元素动画开始时间
animation-iteration-count: infinite | number：指定元素播放动画的循环次数
animation-direction: normal | alternate： 指定元素动画播放的方向，其只有两个值，默认值为 normal，如果设置为 normal 时，动画的每次循环都是向前播放；另一个值是 alternate，规定动画在下一周期逆向地播放（来去播放）
animation-play-state: running | paused ：控制元素动画的播放状态

多列布局
通过 CSS3，能够创建多个列来对文本进行布局

column-count: 规定元素应该被分隔的列数
column-gap: 规定列之间的间隔
column-rule: 设置列之间的宽度、样式和颜色规则
用户界面
CSS3 中，新的用户界面特性包括重设元素尺寸、盒尺寸以及轮廓等

resize
box-sizing
outline-offset

# CSS 兼容内核

-moz-：代表 FireFox 浏览器私有属性
-ms-：代表 IE 浏览器私有属性
-webkit-：代表 safari、chrome 浏览器私有属性
-o-：代表 opera 浏览器私有属性
