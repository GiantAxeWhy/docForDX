## BFC 是什么

Block Formatting Context

块级格式化上下文

W3C 官方解释为：BFC 它决定了元素如何对其内容进行定位，以及与其它元素的关系和相互作用，当涉及到可视化布局时，Block Formatting Context 提供了一个环境，HTML 在这个环境中按照一定的规则进行布局。

BFC 是一个完全独立的空间（布局环境）让空间里的子元素不会影响到外面的布局，可以将它堪称 css 元素属性

### 如何触发 BFC

overflow:hidden
display: inline-block
position: absolute
position: fixed
display: table-cell
display: flex

### 规则

1、是一个块级元素，在垂直方向一个接一个排列
2、BFC 是页面中一个隔离的独立容器，容器里的标签不会影响到外部标签
3、垂直方向的距离由 margin 决定,属于同一个 BFC 的两个相邻标签外边距会重叠
4、计算 BFC 高度时，浮动元素也会参与计算

### 解决了什么问题

1、使用 float 脱离文档流，高度塌陷

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>高度塌陷</title>
    <style>
      .box {
        margin: 100px;
        width: 100px;
        height: 100px;
        background: red;
        float: left;
      }
      .container {
        background: #000;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
      <div class="box"></div>
    </div>
  </body>
</html>
```

可以看到上面效果给 box 设置完 float 结果脱离文档流，使 container 高度没有被撑开，从而背景颜色没有颜色出来，解决此问题可以给 container 触发 BFC，上面我们所说到的触发 BFC 属性都可以设置。

2、margin 边距重叠

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .box {
        margin: 10px;
        width: 100px;
        height: 100px;
        background: #000;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
      <div class="box"></div>
    </div>
  </body>
</html>
```

可以看到上面我们为两个盒子的 margin 外边距设置的是 10px，可结果显示两个盒子之间只有 10px 的距离，这就导致了 margin 塌陷问题，这时 margin 边距的结果为最大值，而不是合，为了解决此问题可以使用 BFC 规则（为元素包裹一个盒子形成一个完全独立的空间，做到里面元素不受外面布局影响），或者简单粗暴方法一个设置 margin，一个设置 padding。

3、两栏布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>两栏布局</title>
    <style>
      div {
        width: 200px;
        height: 100px;
        border: 1px solid red;
      }
    </style>
  </head>
  <body>
    <div style="float: left;">
      两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局两栏布局
    </div>
    <div style="width: 300px;">
      12332123123112332132111111111111111111111111111111111
    </div>
  </body>
</html>
```

可以看到上面元素，第二个 div 元素为 300px 宽度，但是被第一个 div 元素设置 Float 脱离文档流给覆盖上去了，解决此方法我们可以把第二个 div 元素设置为一个 BFC。
