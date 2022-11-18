<template>
  <view class="content-canvas">
    <canvas
      class="canvas"
      canvas-id="myCanvas"
      id="myCanvas"
      :style="
        'width:' +
        system.w +
        'px; height:' +
        height +
        'px;position: fixed; left:0rpx;top:0px;'
      "
      :width="system.w"
      :height="height"
    >
    </canvas>
    <canvas
      class="canvas"
      canvas-id="idcard"
      id="idcard"
      :style="
        'width:' +
        system.w +
        'px; height:' +
        height +
        'px;position: fixed;  right: -999999999rpx;'
      "
      :width="system.w"
      :height="height"
    >
    </canvas>
  </view>
</template>

<script>
import { gaussianBlur } from "./gauss.js";
import { getSystem } from "../hch-poster/utils/index.js";
export default {
  data() {
    return {
      system: {},
      canvasShow: false,
      height: 0,
      isAct: {},
    };
  },
  created() {
    // 获取设备信息
    this.system = getSystem();
    this.height = this.system.h;
    this.init();
  },
  methods: {
    getImageData(img, rect = [0, 0, img.width, img.height]) {
      let context;
      const imageDataContext = new WeakMap();
      if (imageDataContext.has(img)) context = imageDataContext.get(img);
      else {
        const canvas = new OffscreenCanvas(img.width, img.height);
        context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        imageDataContext.set(img, context);
      }
      return context.getImageData(...rect);
    },
    async loadImage(src) {
      // 创建离屏 2D canvas 实例
      const canvas = wx.createOffscreenCanvas({
        type: "2d",
        width: 300,
        height: 150,
      });
      // 获取 context。注意这里必须要与创建时的 type 一致
      const context = canvas.getContext("2d");
      // 创建一个图片
      const image = canvas.createImage();
      // 等待图片加载
      await new Promise((resolve) => {
        image.onload = resolve;
        image.src = src; // 要加载的图片 url
      });
      // 把图片画到离屏 canvas 上
      context.clearRect(0, 0, 300, 150);
      context.drawImage(image, 0, 0, 300, 150);
      // 获取画完后的数据
      const imgData = context.getImageData(0, 0, 300, 150);
      console.log("imgData", imgData);
      return imgData;
    },
    traverse(imageData, pass) {
      const { width, height, data } = imageData;
      for (let i = 0; i < width * height * 4; i += 4) {
        const [r, g, b, a] = pass({
          r: data[i] / 255,
          g: data[i + 1] / 255,
          b: data[i + 2] / 255,
          a: data[i + 3] / 255,
          index: i,
          width,
          height,
          x: ((i / 4) % width) / width,
          y: Math.floor(i / 4 / width) / height,
        });
        data.set(
          [r, g, b, a].map((v) => Math.round(v * 255)),
          i
        );
      }
      return imageData;
    },
    async init() {
      let that = this;
      // const canvas = document.getElementById("myCanvas");
      // const context = canvas.getContext("2d");
      const context = uni.createCanvasContext("myCanvas", this);
      //const img = await this.loadImage("assets/girl1.jpeg");
      let res = await wx.getImageInfo({
        src: "http://xbk.189.cn/dev-api/profile/upload/2022/08/15/画板 1_20220815162553A014.png",
      });
      const resData = await this.loadImage(res.path);
      const { width, height, data } = resData;
      //let gaussian = gaussianBlur(data, width, height)
      let gaussian = this.traverse(resData, ({ r, g, b, a, x, y }) => {
        const d = Math.hypot(x - 0.5, y - 0.5);
        a *= 1.0 - 2 * d;
        return [r, g, b, a];
      });
      let resD = gaussian.data;
      console.log("resD", resD);

      wx.canvasPutImageData(
        {
          canvasId: "myCanvas",
          x: 10,
          y: 100,
          width: 300,
          height: 150,
          data: resD,
          success(res) {
            console.log("resSuc", res);
          },
        },
        this
      );
      //console.log('img',img)
      //context.putImageData(gaussian, 0, 0)
    },
  },
};
</script>

<style scoped>
.content-canvas {
  position: fixed;
  top: 0;
  left: 0;
}

.canvas {
  z-index: 999;
}
</style>
