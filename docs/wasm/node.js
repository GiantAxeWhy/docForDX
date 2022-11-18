const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const PORT = 8888; // 服务器监听的端口号；

const mime = {
  html: "text/html;charset=UTF-8",
  wasm: "application/wasm", // 当遇到对 ".wasm" 格式文件的请求时，返回特定的 MIME 头；
};

http
  .createServer((req, res) => {
    let realPath = path.join(__dirname, `.${url.parse(req.url).pathname}`);
    // 检查所访问文件是否存在，且是否可读；
    fs.access(realPath, fs.constants.R_OK, (err) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end();
      } else {
        fs.readFile(realPath, "binary", (err, file) => {
          if (err) {
            // 文件读取失败时返回 500；
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end();
          } else {
            // 根据请求的文件返回相应的文件内容；
            let ext = path.extname(realPath);
            ext = ext ? ext.slice(1) : "unknown";
            let contentType = mime[ext] || "text/plain";
            res.writeHead(200, { "Content-Type": contentType });
            res.write(file, "binary");
            res.end();
          }
        });
      }
    });
  })
  .listen(PORT);
console.log("Server is runing at port: " + PORT + ".");

// 获取相关的 HTML 元素；
let video = document.querySelector(".video");
let canvas = document.querySelector(".canvas");

// 使用 getContext 方法获取 <canvas> 标签对应的一个 CanvasRenderingContext2D 接口；
let context = canvas.getContext("2d");

// 自动播放 <video> 载入的视频；
let promise = video.play();
if (promise !== undefined) {
  promise.catch((error) => {
    console.error("The video can not autoplay!");
  });
}
// 定义绘制函数；
function draw() {
  // 调用 drawImage 函数绘制图像到 <canvas>；
  context.drawImage(video, 0, 0);
  // 获得 <canvas> 上当前帧对应画面的像素数组；
  pixels = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
  // ...
  // 更新下一帧画面；
  requestAnimationFrame(draw);
}
// <video> 视频资源加载完毕后执行；
video.addEventListener("loadeddata", () => {
  // 根据 <video> 载入视频大小调整对应的 <canvas> 尺寸；
  canvas.setAttribute("height", video.videoHeight);
  canvas.setAttribute("width", video.videoWidth);
  // 绘制函数入口；
  draw(context);
});
