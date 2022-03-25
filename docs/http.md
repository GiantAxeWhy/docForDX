# 网络相关

# 1.HTTP 缓存

HTTP 缓存又分为强缓存和协商缓存：

首先通过 Cache-Control 验证强缓存是否可用，如果强缓存可用，那么直接读取缓存
如果不可以，那么进入协商缓存阶段，发起 HTTP 请求，服务器通过请求头中是否带上 If-Modified-Since 和 If-None-Match 这些条件请求字段检查资源是否更新：

若资源更新，那么返回资源和 200 状态码
如果资源未更新，那么告诉浏览器直接使用缓存获取资源

首先，不管是强制缓存还是协商缓存，主要针对的都是前端的静态资源，最完美的效果就是我们发起请求然后取到相应的静态资源。如果服务端的静态资源没有更新，我们就下次访问的时候直接从本地读取即可；如果服务端的静态资源已经更新，那么我们再次请求的时候就要到服务器请求最新的资源，然后进行拉取。

expires
expires 是强制缓存策略的关键字段，字段值是一个时间戳，expires 是 HTTP1.0 的字段，通过指定一个具体的绝对时间值作为缓存资源的过期时间

如果在这个时间之前发起请求去请求资源，就不会发起新的请求，直接使用本地已经缓存好的资源，这样可以有效减少了不必要的 HTTP 请求，不仅提升了性能，而且节省了流量，减少网络资源的消耗。

expires 的时间和服务端的时间是保持一致的，可是我们最终比较的时候是用本地时间和 expires 设置的时间进行比较。如果服务端的时间和本地的时间存在误差，那么这个时候缓存很容易就失去效果。

Cache-Control
Cache-Control 同样也是强制缓存的关键字段。是 HTTP1.1 才有的字段，Cache-Control 设置的是一个相对时间，可以更加精准地控制资源缓存

Cache-Control 可设置的字段：

    public：设置了该字段值的资源表示可以被任何对象（包括：发送请求的客户端、代理服务器等等）缓存。
    private：设置了该字段值的资源只能被用户浏览器缓存，不允许任何代理服务器缓存。
    no-cache：设置了该字段需要先和服务端确认返回的资源是否发生了变化，如果资源未发生变化，则直接使用缓存好的资源；
    no-store：设置了该字段表示禁止任何缓存，每次都会向服务端发起新的请求，拉取最新的资源；
    max-age=：设置缓存的最大有效期，单位为秒；
    s-maxage=：优先级高于 max-age=，只有在代理服务器才会生效；
    max-stale[=]：设置了该字段表明客户端愿意接收已经过期的资源，但是不能超过给定的时间限制。

上面就是强制缓存的常用字段，实际开发当中 expires 和 Cache-Control 一般都要进行设置。两者同时存在，Cache-Control 的优先级要高于 expires。

协商缓存
如果命中强制缓存，无需发起新的请求，直接使用缓存内容，如果没有命中强制缓存，如果设置了协商缓存，这个时候协商缓存就会发挥作用了。

Last-Modified/If-Modified-Since

Last-Modified 从字面意思就可以看出是最后一次的修改时间，设置方法和我们上面讲的强制缓存的设置方法一样，都是设置一个时间戳，同样它也是由服务端放到 Response Headers 返回给前端

如果设置了协商缓存，在首次请求的时候，返回的 Response Headers 会带有 Last-Modified。当再次请求没有命中强制缓存的时候，这个时候 Request Headers 就会携带 If-Modified-Since 字段，它的值就是第一次请求返回的 Last-Modified 值。服务端接收到资源请求之后，根据 If-Modified-Since 的字段值和服务端资源最后的修改时间是否一致来判断资源是否有修改。如果没有修改，则返回的状态码为 304；如果有修改，则返回新的资源，状态码为 200。

缺陷
服务端对 Last-Modified 标注的最后修改时间只能精确到秒级，如果某些文件在 1 秒钟以内被修改多次的话，这个时候服务端无法准确标注文件的修改时间。
服务端有时候会定期生成一些文件，有时候文件的内容并没有任何变化，但这个时候 Last-Modified 会发生改变，导致文件无法使用缓存。

Etag/If-None-Match

Etag 比 Last-Modified/If-Modified-Since 更准确。它通常是根据文件的具体内容计算出一个 hash 值，只要文件的内容不变，它就不会发生改变，保证了唯一性。

Etag/If-None-Match 的用法对应 Last-Modified/If-Modified-Since。如果有设置协商缓存，在首次请求的时候，返回的 Response Headers 会带有 Etag 值。当再次请求没有命中强制缓存的时候，这个时候的 Request Headers 就会携带 If-None-Match 字段，它的值就是第一次请求返回的 Etag 值。服务端再用 Etag 来进行比较，如果相同就直接使用缓存，如果不同再从服务端拉取新的资源。

cookie
Cookie 一旦创建成功，那么名字无法进行修改；
Cookie 无法跨域名，也就是www.baidu.com和www.imooc.com这2个域名下的Cookie是无法进行共享的，这是由Cookie隐私安全性所决定的，这样能够阻止非法获取其它网站的Cookie；
每个单独的域名下面的 Cookie 数量不能超过 20 个。
如何保证 Cookie 不会被泄露：httpOnly、设置合理的过期时间

      version: 设置Cookie使用的版本号；
      path: 该Cookie的使用路径。如果设置为“/sub1/”，则只有contextPath为“/sub1”的程序可以访问该Cookie；如果设置为“/”，则本域名下contextPath都可以访问该Cookie。注意最后一个字符必须为“/”；
      httpOnly: 如果在Cookie中设置了HttpOnly属性，那么通过JavaScript脚本将无法读取到cookie信息，这样能有效的防止XSS攻击；
      name: Cookie的名称，Cookie一旦创建，名称便不可更改；
      value: Cookie的值。如果值为Unicode字符，需要为字符编码；如果值为二进制数据，则需要使用BASE64编码；
      expires: 具体的过期时间，一般设置我们用document.cookie = 'expires = + GMT格式的日期型字符串’即可；
      maxAge: 该Cookie失效的时间，单位秒。默认为–1；
      domain: 可以访问该Cookie的域名，如果设置为“.jd.com”，则所有以“jd.com”结尾的域名都可以访问该Cookie。注意第一个字符必须为“.”；
      comment: Cookie的用处说明，浏览器显示Cookie信息的时候显示该说明。

Cookie 和 Session 结合使用是最常见的使用场景。我们把 session_id 存储在 Cookie 当中，然后每次请求的时候携带这个 session_id，这样我们就知道是谁发起的请求，从而返回对应的信息；
统计页面的点击次数。

# 2.HTTP 常用的状态码及使用场景？

1xx：表示目前是协议的中间状态，还需要后续请求
2xx：表示请求成功
3xx：表示重定向状态，需要重新请求
4xx：表示请求报文错误
5xx：服务器端错误

常用状态码：

101 切换请求协议，从 HTTP 切换到 WebSocket
200 请求成功，有响应体
301 永久重定向：会缓存
302 临时重定向：不会缓存
304 协商缓存命中
403 服务器禁止访问
404 资源未找到
400 请求错误
500 服务器端错误
503 服务器繁忙

# 3.你知道 302 状态码是什么嘛？你平时浏览网页的过程中遇到过哪些 302 的场景？

而 302 表示临时重定向，这个资源只是暂时不能被访问了，但是之后过一段时间还是可以继续访问，一般是访问某个网站的资源需要权限时，会需要用户去登录，跳转到登录页面之后登录之后，还可以继续访问。
301 类似，都会跳转到一个新的网站，但是 301 代表访问的地址的资源被永久移除了，以后都不应该访问这个地址，搜索引擎抓取的时候也会用新的地址替换这个老的。可以在返回的响应的 location 首部去获取到返回的地址。301 的场景如下：

比如从 baidu.com，跳转到 baidu.com
域名换了

# 4.HTTP 常用的请求方式，区别和用途？

http/1.1 规定如下请求方法：

GET：通用获取数据
HEAD：获取资源的元信息
POST：提交数据
PUT：修改数据
DELETE：删除数据
CONNECT：建立连接隧道，用于代理服务器
OPTIONS：列出可对资源实行的请求方法，常用于跨域
TRACE：追踪请求-响应的传输路径

# 5.你对计算机网络的认识怎么样

应用层、表示层、会话层、传输层、网络层、数据链路层、物理层

# 6.HTTPS 是什么？具体流程

HTTPS 是在 HTTP 和 TCP 之间建立了一个安全层，HTTP 与 TCP 通信的时候，必须先进过一个安全层，对数据包进行加密，然后将加密后的数据包传送给 TCP，相应的 TCP 必须将数据包解密，才能传给上面的 HTTP。
浏览器传输一个 client_random 和加密方法列表，服务器收到后，传给浏览器一个 server_random、加密方法列表和数字证书（包含了公钥），然后浏览器对数字证书进行合法验证，如果验证通过，则生成一个 pre_random，然后用公钥加密传给服务器，服务器用 client_random、server_random 和 pre_random ，使用公钥加密生成 secret，然后之后的传输使用这个 secret 作为秘钥来进行数据的加解密。

# 7.三次握手和四次挥手

为什么要进行三次握手：为了确认对方的发送和接收能力。
三次握手
三次握手主要流程：

一开始双方处于 CLOSED 状态，然后服务端开始监听某个端口进入 LISTEN 状态
然后客户端主动发起连接，发送 SYN，然后自己变为 SYN-SENT，seq = x
服务端收到之后，返回 SYN seq = y 和 ACK ack = x + 1（对于客户端发来的 SYN），自己变成 SYN-REVD
之后客户端再次发送 ACK seq = x + 1, ack = y + 1 给服务端，自己变成 EASTABLISHED 状态，服务端收到 ACK，也进入 ESTABLISHED

SYN 需要对端确认，所以 ACK 的序列化要加一，凡是需要对端确认的，一点要消耗 TCP 报文的序列化

为什么不是两次？

无法确认客户端的接收能力。

如果首先客户端发送了 SYN 报文，但是滞留在网络中，TCP 以为丢包了，然后重传，两次握手建立了连接。
等到客户端关闭连接了。但是之后这个包如果到达了服务端，那么服务端接收到了，然后发送相应的数据表，就建立了链接，但是此时客户端已经关闭连接了，所以带来了链接资源的浪费。
为什么不是四次？
四次以上都可以，只不过 三次就够了
四次挥手

一开始都处于 ESTABLISH 状态，然后客户端发送 FIN 报文，带上 seq = p，状态变为 FIN-WAIT-1
服务端收到之后，发送 ACK 确认，ack = p + 1，然后进入 CLOSE-WAIT 状态
客户端收到之后进入 FIN-WAIT-2  状态
过了一会等数据处理完，再次发送 FIN、ACK，seq = q，ack = p + 1，进入 LAST-ACK 阶段
客户端收到 FIN 之后，客户端收到之后进入 TIME_WAIT（等待 2MSL），然后发送 ACK 给服务端 ack = 1 + 1
服务端收到之后进入 CLOSED 状态

客户端这个时候还需要等待两次 MSL 之后，如果没有收到服务端的重发请求，就表明 ACK 成功到达，挥手结束，客户端变为 CLOSED 状态，否则进行 ACK 重发
为什么需要等待 2MSL（Maximum Segement Lifetime）：
因为如果不等待的话，如果服务端还有很多数据包要给客户端发，且此时客户端端口被新应用占据，那么就会接收到无用的数据包，造成数据包混乱，所以说最保险的方法就是等服务器发来的数据包都死翘翘了再启动新应用。

1 个 MSL 保证四次挥手中主动关闭方最后的 ACK 报文能最终到达对端
1 个 MSL 保证对端没有收到 ACK 那么进行重传的 FIN 报文能够到达

为什么是四次而不是三次？
\*\*
如果是三次的话，那么服务端的 ACK 和 FIN 合成一个挥手，那么长时间的延迟可能让 TCP 一位 FIN 没有达到服务器端，然后让客户的不断的重发 FIN

# 8.在交互过程中如果数据传送完了，还不想断开连接怎么办，怎么维持？

在 HTTP 中响应体的 Connection 字段指定为 keep-alive

# 9.你对 TCP 滑动窗口有了解嘛？

在 TCP 链接中，对于发送端和接收端而言，TCP 需要把发送的数据放到发送缓存区, 将接收的数据放到接收缓存区。而经常会存在发送端发送过多，而接收端无法消化的情况，所以就需要流量控制，就是在通过接收缓存区的大小，控制发送端的发送。如果对方的接收缓存区满了，就不能再继续发送了。而这种流量控制的过程就需要在发送端维护一个发送窗口，在接收端维持一个接收窗口。
TCP 滑动窗口分为两种: 发送窗口和接收窗口。

# 10.WebSocket 与 Ajax 的区别

本质不同
Ajax 即异步 JavaScript 和 XML，是一种创建交互式网页的应用的网页开发技术
websocket 是 HTML5 的一种新协议，实现了浏览器和服务器的实时通信
生命周期不同：

websocket 是长连接，会话一直保持
ajax 发送接收之后就会断开

适用范围：

websocket 用于前后端实时交互数据
ajax 非实时

发起人：

AJAX 客户端发起
WebSocket 服务器端和客户端相互推送

# 11、HTTP 如何实现长连接？在什么时候会超时？

通过在头部（请求和响应头）设置 Connection: keep-alive，HTTP1.0 协议支持，但是默认关闭，从 HTTP1.1 协议以后，连接默认都是长连接

HTTP 一般会有 httpd 守护进程，里面可以设置 keep-alive timeout，当 tcp 链接闲置超过这个时间就会关闭，也可以在 HTTP 的 header 里面设置超时时间
TCP 的 keep-alive 包含三个参数，支持在系统内核的 net.ipv4  里面设置：当 TCP 链接之后，闲置了 tcp_keepalive_time，则会发生侦测包，如果没有收到对方的 ACK，那么会每隔 tcp_keepalive_intvl 再发一次，直到发送了 tcp_keepalive_probes，就会丢弃该链接。

tcp_keepalive_intvl = 15
tcp_keepalive_probes = 5
tcp_keepalive_time = 1800

实际上 HTTP 没有长短链接，只有 TCP 有，TCP 长连接可以复用一个 TCP 链接来发起多次 HTTP 请求，这样可以减少资源消耗，比如一次请求 HTML，可能还需要请求后续的 JS/CSS/图片等

# 12.Fetch API 与传统 Request 的区别

fetch 符合关注点分离，使用 Promise，API 更加丰富，支持 Async/Await
语意简单，更加语意化
可以使用 isomorphic-fetch ，同构方便

# 13.POST 一般可以发送什么类型的文件，数据处理的问题

文本、图片、视频、音频等都可以
text/image/audio/ 或 application/json 等

# 14.TCP 如何保证有效传输及拥塞控制原理。

tcp 是面向连接的、可靠的、传输层通信协议

可靠体现在：有状态、可控制

有状态是指 TCP 会确认发送了哪些报文，接收方受到了哪些报文，哪些没有收到，保证数据包按序到达，不允许有差错
可控制的是指，如果出现丢包或者网络状况不佳，则会跳转自己的行为，减少发送的速度或者重发

所以上面能保证数据包的有效传输。
拥塞控制原理
原因是有可能整个网络环境特别差，容易丢包，那么发送端就应该注意了。
主要用三种方法：

慢启动阈值 + 拥塞避免
快速重传
快速回复

慢启动阈值 + 拥塞避免
对于拥塞控制来说，TCP 主要维护两个核心状态：

拥塞窗口（cwnd）
慢启动阈值（ssthresh）

在发送端使用拥塞窗口来控制发送窗口的大小。

然后采用一种比较保守的慢启动算法来慢慢适应这个网络，在开始传输的一段时间，发送端和接收端会首先通过三次握手建立连接，确定各自接收窗口大小，然后初始化双方的拥塞窗口，接着每经过一轮 RTT（收发时延），拥塞窗口大小翻倍，直到达到慢启动阈值。
然后开始进行拥塞避免，拥塞避免具体的做法就是之前每一轮 RTT，拥塞窗口翻倍，现在每一轮就加一个。
快速重传
在 TCP 传输过程中，如果发生了丢包，接收端就会发送之前重复 ACK，比如 第 5 个包丢了，6、7 达到，然后接收端会为 5，6，7 都发送第四个包的 ACK，这个时候发送端受到了 3 个重复的 ACK，意识到丢包了，就会马上进行重传，而不用等到 RTO （超时重传的时间）
选择性重传：报文首部可选性中加入 SACK 属性，通过 left edge 和 right edge 标志那些包到了，然后重传没到的包
快速恢复
如果发送端收到了 3 个重复的 ACK，发现了丢包，觉得现在的网络状况已经进入拥塞状态了，那么就会进入快速恢复阶段：

    会将拥塞阈值降低为 拥塞窗口的一半
    然后拥塞窗口大小变为拥塞阈值
    接着 拥塞窗口再进行线性增加，以适应网络状况

# 15.OPTION 是干啥的？举个用到 OPTION 的例子？

旨在发送一种探测请求，以确定针对某个目标地址的请求必须具有怎么样的约束，然后根据约束发送真正的请求。

比如针对跨域资源的预检，就是采用 HTTP 的 OPTIONS 方法先发送的。用来处理跨域请求

# 16.：http 知道嘛？哪一层的协议？（应用层）

灵活可扩展，除了规定空格分隔单词，换行分隔字段以外，其他都没有限制，不仅仅可以传输文本，还可以传输图片、视频等任意资源
可靠传输，基于 TCP/IP 所以继承了这一特性
请求-应答，有来有回
无状态，每次 HTTP 请求都是独立的，无关的、默认不需要保存上下文信息

缺点：

明文传输不安全
复用一个 TCP 链接，会发生对头拥塞
无状态在长连接场景中，需要保存大量上下文，以避免传输大量重复的信息

# 17.OSI 七层模型和 TCP/IP 四层模型

应用层
表示层
会话层
传输层
网络层
数据链路层
物理层

TCP/IP 四层概念：

应用层：应用层、表示层、会话层：HTTP
传输层：传输层：TCP/UDP
网络层：网络层：IP
数据链路层：数据链路层、物理层

# 18.TCP 协议怎么保证可靠的，UDP 为什么不可靠？

TCP 是面向连接的、可靠的、传输层通信协议
UDP 是无连接的传输层通信协议，继承 IP 特性,基于数据报

为什么 TCP 可靠？TCP 的可靠性体现在有状态和控制

会精准记录那些数据发送了，那些数据被对方接收了，那些没有被接收，而且保证数据包按序到达，不允许半点差错，这就是有状态
当意识到丢包了或者网络环境不佳，TCP 会根据具体情况调整自己的行为，控制自己的发送速度或者重发，这是可控制的

反之 UDP 就是无状态的和不可控制的

# 19.HTTP 2 改进

改进性能：

头部压缩
多路信道复用
Server Push

# 20.简要概括一下 HTTP 的特点？HTTP 有哪些缺点？

HTTP 特点
HTTP 的特点概括如下:

灵活可扩展，主要体现在两个方面。一个是语义上的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。

可靠传输。HTTP 基于 TCP/IP，因此把这一特性继承了下来。这属于 TCP 的特性，不具体介绍了。

请求-应答。也就是一发一收、有来有回， 当然这个请求方和应答方不单单指客户端和服务器之间，如果某台服务器作为代理来连接后端的服务端，那么这台服务器也会扮演请求方的角色。

无状态。这里的状态是指通信过程的上下文信息，而每次 http 请求都是独立、无关的，默认不需要保留状态信息。

HTTP 缺点
无状态
所谓的优点和缺点还是要分场景来看的，对于 HTTP 而言，最具争议的地方在于它的无状态。
在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点了。
但与此同时，另外一些应用仅仅只是为了获取一些数据，不需要保存连接上下文信息，无状态反而减少了网络开销，成为了 http 的优点。
明文传输
即协议里的报文(主要指的是头部)不使用二进制数据，而是文本形式。
这当然对于调试提供了便利，但同时也让 HTTP 的报文信息暴露给了外界，给攻击者也提供了便利。WIFI 陷阱就是利用 HTTP 明文传输的缺点，诱导你连上热点，然后疯狂抓你所有的流量，从而拿到你的敏感信息。
队头阻塞问题
当 http 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态，也就是著名的队头阻塞问题。接下来会有一小节讨论这个问题。

# 21.get post 区别？

有哪些请求方法？
http/1.1 规定了以下请求方法(注意，都是大写):

GET: 通常用来获取资源
HEAD: 获取资源的元信息
POST: 提交数据，即上传数据
PUT: 修改数据
DELETE: 删除资源(几乎用不到)
CONNECT: 建立连接隧道，用于代理服务器
OPTIONS: 列出可对资源实行的请求方法，用来跨域请求
TRACE: 追踪请求-响应的传输路径

GET 和 POST 有什么区别？
首先最直观的是语义上的区别。
而后又有这样一些具体的差别:

      从缓存的角度，GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会。
      从编码的角度，GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制。
      从参数的角度，GET 一般放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。
      从幂等性的角度，GET 是幂等的，而 POST 不是。(幂等表示执行相同的操作，结果也是相同的)
      从 TCP 的角度，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)

# 22 HTTP 如何处理大文件的传输？

对于几百 M 甚至上 G 的大文件来说，如果要一口气全部传输过来显然是不现实的，会有大量的等待时间，严重影响用户体验。因此，HTTP 针对这一场景，采取了范围请求的解决方案，允许客户端仅仅请求一个资源的一部分。
如何支持
当然，前提是服务器要支持范围请求，要支持这个功能，就必须加上这样一个响应头:

      Accept-Ranges: none

用来告知客户端这边是支持范围请求的。
Range 字段拆解
而对于客户端而言，它需要指定请求哪一部分，通过 Range 这个请求头字段确定，格式为 bytes=x-y。接下来就来讨论一下这个 Range 的书写格式:
0-499 表示从开始到第 499 个字节。
500- 表示从第 500 字节到文件终点。
-100 表示文件的最后 100 个字节。

服务器收到请求之后，首先验证范围是否合法，如果越界了那么返回 416 错误码，否则读取相应片段，返回 206 状态码。
同时，服务器需要添加 Content-Range 字段，这个字段的格式根据请求头中 Range 字段的不同而有所差异。
具体来说，请求单段数据和请求多段数据，响应头是不一样的。
举个例子:

```js
// 单段数据
Range: bytes = 0 - 9;
// 多段数据
Range: (bytes = 0 - 9), 30 - 39;
```

接下来我们就分别来讨论着两种情况。

单段数据
对于单段数据的请求，返回的响应如下:

```js
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

i am xxxxx

```

值得注意的是 Content-Range 字段，0-9 表示请求的返回，100 表示资源的总大小，很好理解。

多段数据
接下来我们看看多段请求的情况。得到的响应会是下面这个形式:

```js
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101--

```

这个时候出现了一个非常关键的字段 Content-Type: multipart/byteranges;boundary=00000010101，它代表了信息量是这样的:

请求一定是多段数据请求
响应体中的分隔符是 00000010101

因此，在响应体中各段数据之间会由这里指定的分隔符分开，而且在最后的分隔末尾添上--表示结束。
以上就是 http 针对大文件传输所采用的手段。

# 23. HTTP 中如何处理表单数据的提交？

在 http 中，有两种主要的表单提交的方式，体现在两种不同的 Content-Type 取值:

application/x-www-form-urlencoded
multipart/form-data

由于表单提交一般是 POST 请求，很少考虑 GET，因此这里我们将默认提交的数据放在请求体中。
application/x-www-form-urlencoded
对于 application/x-www-form-urlencoded 格式的表单内容，有以下特点:

其中的数据会被编码成以&分隔的键值对
字符以 URL 编码方式编码。

```js
// 转换过程: {a: 1, b: 2} -> a=1&b=2 -> 如下(最终形式)
"a%3D1%26b%3D2";
```

multipart/form-data
对于 multipart/form-data 而言:

请求头中的 Content-Type 字段会包含 boundary，且 boundary 的值有浏览器默认指定。例: Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe。
数据会分为多个部分，每两个部分之间通过分隔符来分隔，每部分表述均有 HTTP 头部描述子包体，如 Content-Type，在最后的分隔符会加上--表示结束。

相应的请求体是下面这样:

```js
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
----WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
----WebkitFormBoundaryRRJKeWfHPGrS4LKe--

```

小结
值得一提的是，multipart/form-data 格式最大的特点在于:每一个表单元素都是独立的资源表述。另外，你可能在写业务的过程中，并没有注意到其中还有 boundary 的存在，如果你打开抓包工具，确实可以看到不同的表单元素被拆分开了，之所以在平时感觉不到，是以为浏览器和 HTTP 给你封装了这一系列操作。
而且，在实际的场景中，对于图片等文件的上传，基本采用 multipart/form-data 而不用 application/x-www-form-urlencoded，因为没有必要做 URL 编码，带来巨大耗时的同时也占用了更多的空间。

# 24.HTTP1.1 如何解决 HTTP 的队头阻塞问题？

什么是 HTTP 队头阻塞？
从前面的小节可以知道，HTTP 传输是基于请求-应答的模式进行的，报文必须是一发一收，但值得注意的是，里面的任务被放在一个任务队列中串行执行，一旦队首的请求处理太慢，就会阻塞后面请求的处理。这就是著名的 HTTP 队头阻塞问题。
并发连接
对于一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其它所有任务。在 RFC2616 规定过客户端最多并发 2 个连接，不过事实上在现在的浏览器标准中，这个上限要多很多，Chrome 中是 6 个。
但其实，即使是提高了并发连接，还是不能满足人们对性能的需求。
域名分片
一个域名不是可以并发 6 个长连接吗？那我就多分几个域名。
比如 content1.sanyuan.com 、content2.sanyuan.com。
这样一个 sanyuan.com 域名下可以分出非常多的二级域名，而它们都指向同样的一台服务器，能够并发的长连接数更多了，事实上也更好地解决了队头阻塞的问题。

# 25.对 Cookie 了解多少？

Cookie 简介
前面说到了 HTTP 是一个无状态的协议，每次 http 请求都是独立、无关的，默认不需要保留状态信息。但有时候需要保存一些状态，怎么办呢？
HTTP 为此引入了 Cookie。Cookie 本质上就是浏览器里面存储的一个很小的文本文件，内部以键值对的方式来存储(在 chrome 开发者面板的 Application 这一栏可以看到)。向同一个域名下发送请求，都会携带相同的 Cookie，服务器拿到 Cookie 进行解析，便能拿到客户端的状态。而服务端可以通过响应头中的 Set-Cookie 字段来对客户端写入 Cookie。举例如下:
// 请求头
Cookie: a=xxx;b=xxx
// 响应头
Set-Cookie: a=xxx
set-Cookie: b=xxx

Cookie 属性

生存周期
Cookie 的有效期可以通过 Expires 和 Max-Age 两个属性来设置。

Expires 即过期时间
Max-Age 用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算。

若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

作用域
关于作用域也有两个属性: Domain 和 path, 给 Cookie 绑定了域名和路径，在发送请求之前，发现域名或者路径和这两个属性不匹配，那么就不会带上 Cookie。值得注意的是，对于路径来说，/表示域名下的任意路径都允许使用 Cookie。

安全相关

如果带上 Secure，说明只能通过 HTTPS 传输 cookie。
如果 cookie 字段带上 HttpOnly，那么说明只能通过 HTTP 协议传输，不能通过 JS 访问，这也是预防 XSS 攻击的重要手段。
相应的，对于 CSRF 攻击的预防，也有 SameSite 属性。
SameSite 可以设置为三个值，Strict、Lax 和 None。
a. 在 Strict 模式下，浏览器完全禁止第三方请求携带 Cookie。比如请求 sanyuan.com 网站只能在 sanyuan.com 域名当中请求才能携带 Cookie，在其他网站请求都不能。
b. 在 Lax 模式，就宽松一点了，但是只能在 get 方法提交表单况或者 a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。
c. 在 None 模式下，也就是默认模式，请求会自动携带上 Cookie。
Cookie 的缺点

容量缺陷。Cookie 的体积上限只有 4KB，只能用来存储少量的信息。

性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过 Domain 和 Path 指定作用域来解决。

安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在 HttpOnly 为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

# 26 如何理解 HTTP 缓存及缓存代理？

关于强缓存和协商缓存的内容，我已经在能不能说一说浏览器缓存做了详细分析，小结如下:
首先通过 Cache-Control 验证强缓存是否可用

如果强缓存可用，直接使用
否则进入协商缓存，即发送 HTTP 请求，服务器通过请求头中的 If-Modified-Since 或者 If-None-Match 这些条件请求字段检查资源是否更新

若资源更新，返回资源和 200 状态码
否则，返回 304，告诉浏览器直接从缓存获取资源

这一节我们主要来说说另外一种缓存方式: 代理缓存。
为什么产生代理缓存？
对于源服务器来说，它也是有缓存的，比如 Redis, Memcache，但对于 HTTP 缓存来说，如果每次客户端缓存失效都要到源服务器获取，那给源服务器的压力是很大的。
由此引入了缓存代理的机制。让代理服务器接管一部分的服务端 HTTP 缓存，客户端缓存过期后就近到代理缓存中获取，代理缓存过期了才请求源服务器，这样流量巨大的时候能明显降低源服务器的压力。
那缓存代理究竟是如何做到的呢？
总的来说，缓存代理的控制分为两部分，一部分是源服务器端的控制，一部分是客户端的控制。
源服务器的缓存控制
private 和 public
在源服务器的响应头中，会加上 Cache-Control 这个字段进行缓存控制字段，那么它的值当中可以加入 private 或者 public 表示是否允许代理服务器缓存，前者禁止，后者为允许。
比如对于一些非常私密的数据，如果缓存到代理服务器，别人直接访问代理就可以拿到这些数据，是非常危险的，因此对于这些数据一般是不会允许代理服务器进行缓存的，将响应头部的 Cache-Control 设为 private，而不是 public。
proxy-revalidate
must-revalidate 的意思是客户端缓存过期就去源服务器获取，而 proxy-revalidate 则表示代理服务器的缓存过期后到源服务器获取。
s-maxage
s 是 share 的意思，限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的 max-age 并不冲突。
讲了这几个字段，我们不妨来举个小例子，源服务器在响应头中加入这样一个字段:
Cache-Control: public, max-age=1000, s-maxage=2000
复制代码相当于源服务器说: 我这个响应是允许代理服务器缓存的，客户端缓存过期了到代理中拿，并且在客户端的缓存时间为 1000 秒，在代理服务器中的缓存时间为 2000 s。
客户端的缓存控制
max-stale 和 min-fresh
在客户端的请求头中，可以加入这两个字段，来对代理服务器上的缓存进行宽容和限制操作。比如：
max-stale: 5
复制代码表示客户端到代理服务器上拿缓存的时候，即使代理缓存过期了也不要紧，只要过期时间在 5 秒之内，还是可以从代理中获取的。
又比如:
min-fresh: 5
复制代码表示代理缓存需要一定的新鲜度，不要等到缓存刚好到期再拿，一定要在到期前 5 秒之前的时间拿，否则拿不到。
only-if-cached
这个字段加上后表示客户端只会接受代理缓存，而不会接受源服务器的响应。如果代理缓存无效，则直接返回 504（Gateway Timeout）。
以上便是缓存代理的内容，涉及的字段比较多，希望能好好回顾一下，加深理解。

# 27.跨域

## JSONP

1.  JSONP 原理
    利用 script 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要对方的服务器做支持才可以。
    JSONP 优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持 get 方法具有局限性,不安全可能会遭受 XSS 攻击。

    实现流程

声明一个回调函数，其函数名(如 show)当做参数值，要传递给跨域请求数据的服务器，函数形参为要获取目标数据(服务器返回的 data)。
创建一个 script 标签，把那个跨域的 API 数据接口地址，赋值给 script 的 src,还要在这个地址中向服务器传递该函数名（可以通过问号传参:?callback=show）。
服务器接收到请求后，需要进行特殊的处理：把传递进来的函数名和它需要给你的数据拼接成一个字符串,例如：传递进去的函数名是 show，它准备好的数据是 show('我不爱你')。
最后服务器把准备的数据通过 HTTP 协议返回给客户端，客户端再调用执行之前声明的回调函数（show），对返回的数据进行操作。

## cors

CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。

1. 简单请求
   只要同时满足以下两大条件，就属于简单请求
   条件 1：使用下列方法之一：

GET
HEAD
POST

条件 2：Content-Type 的值仅限于下列三者之一：

text/plain
multipart/form-data
application/x-www-form-urlencoded

请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器； XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。 2) 复杂请求
不符合以上条件的请求就肯定是复杂请求了。
复杂请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求,该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求。
我们用 PUT 向后台请求时，属于复杂请求，后台需做如下配置：

```js
// 允许哪个方法访问我
res.setHeader("Access-Control-Allow-Methods", "PUT");
// 预检的存活时间
res.setHeader("Access-Control-Max-Age", 6);
// OPTIONS请求不做任何处理
if (req.method === "OPTIONS") {
  res.end();
}
// 定义后台返回的内容
app.put("/getData", function (req, res) {
  console.log(req.headers);
  res.end("我不爱你");
});
```

接下来我们看下一个完整复杂请求的例子，并且介绍下 CORS 请求相关的字段

```js
// index.html
let xhr = new XMLHttpRequest();
document.cookie = "name=xiamen"; // cookie不能跨域
xhr.withCredentials = true; // 前端设置是否带cookie
xhr.open("PUT", "http://localhost:4000/getData", true);
xhr.setRequestHeader("name", "xiamen");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      console.log(xhr.response);
      //得到响应头，后台需设置Access-Control-Expose-Headers
      console.log(xhr.getResponseHeader("name"));
    }
  }
};
xhr.send();
//server1.js
let express = require("express");
let app = express();
app.use(express.static(__dirname));
app.listen(3000);
```

```js
//server2.js
let express = require("express");
let app = express();
let whitList = ["http://localhost:3000"]; //设置白名单
app.use(function (req, res, next) {
  let origin = req.headers.origin;
  if (whitList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader("Access-Control-Allow-Origin", origin);
    // 允许携带哪个头访问我
    res.setHeader("Access-Control-Allow-Headers", "name");
    // 允许哪个方法访问我
    res.setHeader("Access-Control-Allow-Methods", "PUT");
    // 允许携带cookie
    res.setHeader("Access-Control-Allow-Credentials", true);
    // 预检的存活时间
    res.setHeader("Access-Control-Max-Age", 6);
    // 允许返回的头
    res.setHeader("Access-Control-Expose-Headers", "name");
    if (req.method === "OPTIONS") {
      res.end(); // OPTIONS请求不做任何处理
    }
  }
  next();
});
app.put("/getData", function (req, res) {
  console.log(req.headers);
  res.setHeader("name", "jw"); //返回一个响应头，后台需设置
  res.end("我不爱你");
});
app.get("/getData", function (req, res) {
  console.log(req.headers);
  res.end("我不爱你");
});
app.use(express.static(__dirname));
app.listen(4000);
```

上述代码由 http://localhost:3000/index.html 向 http://localhost:4000/跨域请求，正如我们上面所说的，后端是实现 CORS 通信的关键。

## 3.postMessage

postMessage 是 HTML5 XMLHttpRequest Level 2 中的 API，且是为数不多可以跨域操作的 window 属性之一，它可用于解决以下方面的问题：

页面和其打开的新窗口的数据传递
多窗口之间消息传递
页面与嵌套的 iframe 消息传递
上面三个场景的跨域数据传递

postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

otherWindow.postMessage(message, targetOrigin, [transfer]);

message: 将要发送到其他 window 的数据。
targetOrigin:通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
transfer(可选)：是一串和 message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

## 4.websocket

Websocket 是 HTML5 的一个持久化的协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案。WebSocket 和 HTTP 都是应用层协议，都基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。同时，WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。
我们先来看个例子：本地文件 socket.html 向 localhost:3000 发生数据和接受数据
原生 WebSocket API 使用起来不太方便，我们使用 Socket.io，它很好地封装了 webSocket 接口，提供了更简单、灵活的接口，也对不支持 webSocket 的浏览器提供了向下兼容。

```js
// socket.html

<script>
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('我爱你');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>

// server.js
let express = require('express');
let app = express();
let WebSocket = require('ws');//记得安装 ws
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws) {
ws.on('message', function (data) {
console.log(data);
ws.send('我不爱你')
});
})
```

## 5. Node 中间件代理(两次跨域)

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。 代理服务器，需要做以下几个步骤：

接受客户端请求 。
将请求 转发给服务器。
拿到服务器 响应 数据。
将 响应 转发给客户端

## 6.nginx 反向代理

实现原理类似于 Node 中间件代理，需要你搭建一个中转 nginx 服务器，用于转发请求。
使用 nginx 反向代理实现跨域，是最简单的跨域方式。只需要修改 nginx 的配置即可解决跨域问题，支持所有浏览器，支持 session，不需要修改任何代码，并且不会影响服务器性能。
实现思路：通过 nginx 配置一个代理服务器（域名与 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口，并且可以顺便修改 cookie 中 domain 信息，方便当前域 cookie 写入，实现跨域登录。
先下载 nginx，然后将 nginx 目录下的 nginx.conf 修改如下:

```js

// proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;
    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```

## 7.window.name + iframe

window.name 属性的独特之处：name 值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。
其中 a.html 和 b.html 是同域的，都是 http://localhost:3000;而 c.html 是 http://localhost:4000

```js

 // a.html(http://localhost:3000/b.html)
  <iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
  <script>
    let first = true
    // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
    function load() {
      if(first){
      // 第1次onload(跨域页)成功后，切换到同域代理页面
        let iframe = document.getElementById('iframe');
        iframe.src = 'http://localhost:3000/b.html';
        first = false;
      }else{
      // 第2次onload(同域b.html页)成功后，读取同域window.name中数据
        console.log(iframe.contentWindow.name);
      }
    }
  </script>
```

b.html 为中间代理页，与 a.html 同域，内容为空。

```js
// c.html(http://localhost:4000/c.html)
<script>window.name = '我不爱你'</script>
```

总结：通过 iframe 的 src 属性由外域转向本地域，跨域数据即由 iframe 的 window.name 从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。

## 8.location.hash + iframe

实现原理： a.html 欲与 c.html 跨域相互通信，通过中间页 b.html 来实现。 三个页面，不同域之间利用 iframe 的 location.hash 传值，相同域之间直接 js 访问来通信。
具体实现步骤：一开始 a.html 给 c.html 传一个 hash 值，然后 c.html 收到 hash 值后，再把 hash 值传递给 b.html，最后 b.html 将结果放到 a.html 的 hash 值中。
同样的，a.html 和 b.html 是同域的，都是 http://localhost:3000;而 c.html 是 http://localhost:4000

```js
 // a.html
  <iframe src="http://localhost:4000/c.html#iloveyou"></iframe>
  <script>
    window.onhashchange = function () { //检测hash的变化
      console.log(location.hash);
    }
  </script>

```

```js
// b.html
<script>
  window.parent.parent.location.hash = location.hash
  //b.html将结果放到a.html的hash值中，b.html可通过parent.parent访问a.html页面
</script>
```

```js
// c.html
console.log(location.hash);
let iframe = document.createElement("iframe");
iframe.src = "http://localhost:3000/b.html#idontloveyou";
document.body.appendChild(iframe);
```

## 9.document.domain + iframe

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。
只需要给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域。
实现原理：两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域。
我们看个例子：页面 a.zf1.cn:3000/a.html 获取页面 b.zf1.cn:3000/b.html 中 a 的值

```js
// a.html
<body>
 helloa
  <iframe src="http://b.zf1.cn:3000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
  <script>
    document.domain = 'zf1.cn'
    function load() {
      console.log(frame.contentWindow.a);
    }
  </script>
</body>

```

```js
// b.html
<body>
  hellob
  <script>document.domain = 'zf1.cn' var a = 100;</script>
</body>
```

## 总结

            CORS支持所有类型的HTTP请求，是跨域HTTP请求的根本解决方案
            JSONP只支持GET请求，JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。
            不管是Node中间件代理还是nginx反向代理，主要是通过同源策略对服务器不加限制。
            日常工作中，用得比较多的跨域方案是cors和nginx反向代理

# 28 输入 url 到展示页面的时候发生了什么

## 1、会进行 url 解析，根据 dns 系统进行 ip 查找。

先说为什么 url 要解析（也就是编码)
我回答大概内容是：因为网络标准规定了 URL 只能是字母和数字，还有一些其它特殊符号（-\_.~ ! \* ' ( ) ; : @ & = + $ , / ? # [ ]，常见的就是不包括百分号和双引号），而且如果不转义会出现歧义，比如 http:www.baidu.com?key=value,假如我的key本身就包括等于=符号，比如ke=y=value，就会出现歧义，你不知道=到底是连接key和value的符号，还是说本身key里面就有=。
url 编码的规则是 utf-8。和 html 本身的编码格式有关 可以用 encodeURIComponent
encodeURIComponent 比 encodeURI 有什么区别?
区别就是 encodeURIComponent 编码范围更广，适合给参数编码，encodeURI 适合给 URL 本身（locaion.origin）编码,当然项目里一般都是用 qs 库去处理

## 2、然后说说 dns 解析流程，并且 html 如何做 dns 优化

1、器中输入www.baidu.com 域名，操作系统会先查 hosts 件是否有记录，有的话就会把相对应映射的 IP 返回。
2、hosts 文件没有就去查本地 dns 解析器有没有缓存。（这个我没答上来）
3、然后就去找我们计算机上配置的 dns 服务器上有或者有缓存，就返回
4、还没有的话就去找根 DNS 服务器(全球 13 台，固定 ip 地址)，然后判断.com 域名是哪个服务器管理，如果无法解析，就查找.baidu.com 服务器是否能解析，直到查到www.baidu.com的IP地址
前端的 dns 优化，可以在 html 页面头部写入 dns 缓存地址，比如

```js
<meta http-equiv="x-dns-prefetch-control" content="on" />
<link rel="dns-prefetch" href="http://bdimg.share.baidu.com" />

```

## 查找到 IP 之后，就是 http 协议的三次握手（以及后面会涉及到四次分手）

第一次握手：主机 A 发送位码为 SYN ＝ 1 的 TCP 包给服务器，并且随机产生一个作为确认号（这是 tcp 包的一部分），主机 B 收到 SYN 码后直到 A 要求建立连接;

第二次握手：主机 B 收到请求后，向 A 发送确认号（主机 A 的 seq+1），syn=1，seq = 随机数 的 TCP 包；

主机 A 收到后检查确认号是否正确，即第一次 A 发送的确认号是否+1 了，以及位码 ack 是否为 1，若正确，主机 A 会再发送确认号(主机 B 的 seq+1)，ack=1，主机 B 收到后确认 seq 值与 ack=1 则连接建立成功。

### 为什么两次握手不行

，因为第二次握手，主机 B 还不能确认主机 A 已经收到确认请求，也是说 B 认为建立好连接，开始发数据了，结果发出去的包一直 A 都没收到，那攻击 B 就很容易了，我专门发包不接收，服务器很容易就挂了。

### 从网卡把数据包传输出去到服务器发生了什么，提示我 OSI 参考模型

先从局域网把数据发送到公司的交换机（如果交换机没有缓存本地 mac 地址和 IP 地址的映射，此时会通过 ARP 协议来获得），交换机的好处是可以隔离冲突域（因为以太网用的是 CSMA/CD 协议,这个协议规定网线上同一时刻只能有一台机器发送数据），这样就可以不仅仅同一时刻只有一台机器发送网络包了

然后交换机再将数据发送到路由器，路由器相当于公司网关（我们公司小），路由器具有转发和分组数据包的功能（路由器通过选定的路由协议会构造出路由表，同时不定期的跟相邻路由器交换路由信息），然后这算是经过了物理层，数据链路层（以太网）,开始到网络层进行数据转发了

然后路由器转发 IP 数据报，一般公司的 IP 地址都会经过 NAT 转换，让内网的 ip 也能够访问外网，我们公司我注意了一下是 192.168 打头的内网 ip 地址。通过路由器的分组传输，所有数据到达服务器。

然后服务器的上层协议传输层协议开始发挥作用，根据 tcp 包里的端口号，让服务器特定的服务来处理到来的数据包，并且 tcp 是面向字节流的(tcp 有四大特性，可靠传输、流量控制、拥塞控制、连接管理)，所以我们 node 的 request 对象，它的监听事件 data 事件为什么要用字符串一起拼接起来呢（buffer），就是因为 tcp 本身就是字节流，request 对象使用的 data（http 层面）是 tcp 传来的数据块。

最后数据由传输层转交给应用层，也就是 http 服务（或者 https），后端经过一系列逻辑处理，返回给前端数据。

## 建立完链接，就该请求 html 文件了，如果 html 文件在缓存里面浏览器直接返回，如果没有，就去后台拿

浏览器首次加载资源成功时，服务器返回 200，此时浏览器不仅将资源下载下来，而且把 response 的 header(里面的 date 属性非常重要，用来计算第二次相同资源时当前时间和 date 的时间差)一并缓存;

下一次加载资源时，首先要经过强缓存的处理，cache-control 的优先级最高，比如 cache-control：no-cache,就直接进入到协商缓存的步骤了，如果 cache-control：max-age=xxx,就会先比较当前时间和上一次返回 200 时的时间差，如果没有超过 max-age，命中强缓存，不发请求直接从本地缓存读取该文件（这里需要注意，如果没有 cache-control，会取 expires 的值，来对比是否过期），过期的话会进入下一个阶段，协商缓存

协商缓存阶段，则向服务器发送 header 带有 If-None-Match 和 If-Modified-Since 的请求，服务器会比较 Etag，如果相同，命中协商缓存，返回 304；如果不一致则有改动，直接返回新的资源文件带上新的 Etag 值并返回 200;

协商缓存第二个重要的字段是，If-Modified-Since，如果客户端发送的 If-Modified-Since 的值跟服务器端获取的文件最近改动的时间，一致则命中协商缓存，返回 304；不一致则返回新的 last-modified 和文件并返回 200;

### 什么是 from disk cache 和 from memory cache 吗，什么时候会触发？

      1、先查找内存，如果内存中存在，从内存中加载；
      2、如果内存中未查找到，选择硬盘获取，如果硬盘中有，从硬盘中加载；
      3、如果硬盘中未查找到，那就进行网络请求；
      4、加载到的资源缓存到硬盘和内存；

### 启发式缓存:

如果响应中未显示 Expires，Cache-Control：max-age 或 Cache-Control：s-maxage，并且响应中不包含其他有关缓存的限制，缓存可以使用启发式方法计算新鲜度寿命。通常会根据响应头中的 2 个时间字段 Date 减去 Last-Modified 值的 10% 作为缓存时间。

```js
// Date 减去 Last-Modified 值的 10% 作为缓存时间。
// Date：创建报文的日期时间, Last-Modified 服务器声明文档最后被修改时间
response_is_fresh = max(0,（Date - Last-Modified)) % 10
```

## 接着回答，我说返回 html 之后，会解析 html,这部分知识我提前准备过，但是答的不是很详细，大概意思就是 cssom + domTree = html,然后布局和绘制

构建 DOM 树(DOM tree)：从上到下解析 HTML 文档生成 DOM 节点树（DOM tree），也叫内容树（content tree）；

构建 CSSOM(CSS Object Model)树：加载解析样式生成 CSSOM 树；

执行 JavaScript：加载并执行 JavaScript 代码（包括内联代码或外联 JavaScript 文件）；

构建渲染树(render tree)：根据 DOM 树和 CSSOM 树,生成渲染树(render tree)；

渲染树：按顺序展示在屏幕上的一系列矩形，这些矩形带有字体，颜色和尺寸等视觉属性。

布局（layout）：根据渲染树将节点树的每一个节点布局在屏幕上的正确位置；

绘制（painting）：遍历渲染树绘制所有节点，为每一个节点适用对应的样式，这一过程是通过 UI 后端模块完成；

## 页面渲染优化

HTML 文档结构层次尽量少，最好不深于六层；
脚本尽量后放，放在前即可；
少量首屏样式内联放在标签内；
样式结构层次尽量简单；
在脚本中尽量减少 DOM 操作，尽量缓存访问 DOM 的样式信息，避免过度触发回流；
减少通过 JavaScript 代码修改元素样式，尽量使用修改 class 名方式操作样式或动画；
动画尽量使用在绝对定位或固定定位的元素上；
隐藏在屏幕外，或在页面滚动时，尽量停止动画；
尽量缓存 DOM 查找，查找器尽量简洁；
涉及多域名的网站，可以开启域名预解析

# 28.什么是 XSS 攻击？如何防范 XSS 攻击？什么是 CSP？

XSS 简单点来说，就是攻击者想尽一切办法将可以执行的代码注入到网页中。
XSS 可以分为多种类型，但是总体上我认为分为两类：持久型和非持久型。
持久型也就是攻击的代码被服务端写入进数据库中，这种攻击危害性很大，因为如果网站访问量很大的话，就会导致大量正常访问页面的用户都受到攻击。
这种情况如果前后端没有做好防御的话，这段评论就会被存储到数据库中，这样每个打开该页面的用户都会被攻击到。
非持久型相比于前者危害就小的多了，一般通过修改 URL 参数的方式加入攻击代码，诱导用户访问链接从而进行攻击。
对于 XSS 攻击来说，通常有两种方式可以用来防御。
转义字符
首先，对于用户的输入应该是永远不信任的。最普遍的做法就是转义输入输出的内容，对于引号、尖括号、斜杠进行转义
function escape(str) {
str = str.replace(/&/g, '&amp;')
str = str.replace(/</g, '&lt;')
str = str.replace(/>/g, '&gt;')
str = str.replace(/"/g, '&quto;')
str = str.replace(/'/g, '&#39;')
str = str.replace(/`/g, '&#96;')
str = str.replace(/\//g, '&#x2F;')
return str
}

CSP
CSP 本质上就是建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击。
通常可以通过两种方式来开启 CSP：
设置 HTTP Header 中的 Content-Security-Policy
设置 meta 标签的方式 <meta http-equiv="Content-Security-Policy">

## 反射型

反射型 XSS 只是简单地把用户输入的数据 “反射” 给浏览器，这种攻击方式往往需要攻击者诱使用户点击一个恶意链接（攻击者可以将恶意链接直接发送给受信任用户，发送的方式有很多种，比如 email, 网站的私信、评论等，攻击者可以购买存在漏洞网站的广告，将恶意链接插入在广告的链接中），或者提交一个表单，或者进入一个恶意网站时，注入脚本进入被攻击者的网站。最简单的示例是访问一个链接，服务端返回一个可执行脚本：

```js
const http = require("http");
function handleReequest(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
  res.write('<script>alert("反射型 XSS 攻击")</script>');
  res.end();
}

const server = new http.Server();
server.listen(8001, "127.0.0.1");
server.on("request", handleReequest);
```

## 存储型

存储型 XSS 会把用户输入的数据 "存储" 在服务器端，当浏览器请求数据时，脚本从服务器上传回并执行。这种 XSS 攻击具有很强的稳定性。比较常见的一个场景是攻击者在社区或论坛上写下一篇包含恶意 JavaScript 代码的文章或评论，文章或评论发表后，所有访问该文章或评论的用户，都会在他们的浏览器中执行这段恶意的 JavaScript 代码：

```js
// 例如在评论中输入以下留言
// 如果请求这段留言的时候服务端不做转义处理，请求之后页面会执行这段恶意代码
<script>alert('xss 攻击')</script>
```

## 基于 DOM

基于 DOM 的 XSS 攻击是指通过恶意脚本修改页面的 DOM 结构，是纯粹发生在客户端的攻击

```js
<h2>XSS: </h2>
<input type="text" id="input">
<button id="btn">Submit</button>
<div id="div"></div>
<script>
    const input = document.getElementById('input');
    const btn = document.getElementById('btn');
    const div = document.getElementById('div');

    let val;

    input.addEventListener('change', (e) => {
        val = e.target.value;
    }, false);

    btn.addEventListener('click', () => {
        div.innerHTML = `<a href=${val}>testLink</a>`
    }, false);
</script>

```

点击 Submit 按钮后，会在当前页面插入一个链接，其地址为用户的输入内容。如果用户在输入时构造了如下内容：

```js
'' onclick=alert(/xss/)
```

复制代码用户提交之后，页面代码就变成了：

```js
<a href onlick="alert(/xss/)">
  testLink
</a>
```

复制代码此时，用户点击生成的链接，就会执行对应的脚本。

# 29.什么是 CSRF 攻击？如何防范 CSRF 攻击？

CSRF，即 Cross Site Request Forgery，中译是跨站请求伪造，是一种劫持受信任用户向服务器发送非预期请求的攻击方式。通常情况下，CSRF 攻击是攻击者借助受害者的 Cookie 骗取服务器的信任，可以在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击服务器，从而在并未授权的情况下执行在权限保护之下的操作。

使登录用户访问攻击者的网站，发起一个请求，由于 Cookie 中包含了用户的认证信息，当用户访问攻击者准备的攻击环境时，攻击者就可以对服务器发起 CSRF 攻击。
在这个攻击过程中，攻击者借助受害者的 Cookie 骗取服务器的信任，但并不能拿到 Cookie，也看不到 Cookie 的内容。而对于服务器返回的结果，由于浏览器同源策略的限制，攻击者也无法进行解析。（攻击者的网站虽然是跨域的，但是他构造的链接是源网站的，跟源网站是同源的，所以能够携带 cookie 发起访问）。
但是攻击者无法从返回的结果中得到任何东西，他所能做的就是给服务器发送请求，以执行请求中所描述的命令，在服务器端直接改变数据的值，而非窃取服务器中的数据。例如删除数据、修改数据，新增数据等，无法获取数据。

CSRF 中文名为跨站请求伪造。原理就是攻击者构造出一个后端请求地址，诱导用户点击或者通过某些途径自动发起请求。如果用户是在登录状态下的话，后端就以为是用户在操作，从而进行相应的逻辑。
如何防御
防范 CSRF 攻击可以遵循以下几种规则：
Get 请求不对数据进行修改
不让第三方网站访问到用户 Cookie
阻止第三方网站请求接口
请求时附带验证信息，比如验证码或者 Token
验证 Referer
对于需要防范 CSRF 的请求，我们可以通过验证 Referer 来判断该请求是否为第三方网站发起的。
Token
服务器下发一个随机 Token，每次发起请求时将 Token 携带上，服务器验证 Token 是否有效。

# 30、什么是中间人攻击？如何防范中间人攻击？

中间人攻击是攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的，但是实际上整个通信过程都被攻击者控制了。攻击者不仅能获得双方的通信信息，还能修改通信信息。
通常来说不建议使用公共的 Wi-Fi，因为很可能就会发生中间人攻击的情况。如果你在通信的过程中涉及到了某些敏感信息，就完全暴露给攻击方了。
当然防御中间人攻击其实并不难，只需要增加一个安全通道来传输信息。HTTPS 就可以用来防御中间人攻击，但是并不是说使用了 HTTPS 就可以高枕无忧了，因为如果你没有完全关闭 HTTP 访问的话，攻击方可以通过某些方式将 HTTPS 降级为 HTTP 从而实现中间人攻击。

# 31、HTTP/2

HTTP/2 相比于 HTTP/1，可以说是大幅度提高了网页的性能。
在 HTTP/1 中，为了性能考虑，我们会引入雪碧图、将小图内联、使用多个域名等等的方式。这一切都是因为浏览器限制了同一个域名下的请求数量（Chrome 下一般是限制六个连接），当页面中需要请求很多资源的时候，队头阻塞（Head of line blocking）会导致在达到最大请求数量时，剩余的资源需要等待其他资源请求完成后才能发起请求。
在 HTTP/2 中引入了多路复用的技术，这个技术可以只通过一个 TCP 连接就可以传输所有的请求数据。多路复用很好的解决了浏览器限制同一个域名下的请求数量的问题，同时也间接更容易实现全速传输，毕竟新开一个 TCP 连接都需要慢慢提升传输速度。

多路复用
在 HTTP/2 中，有两个非常重要的概念，分别是帧（frame）和流（stream）。
帧代表着最小的数据单位，每个帧会标识出该帧属于哪个流，流也就是多个帧组成的数据流。
多路复用，就是在一个 TCP 连接中可以存在多条流。换句话说，也就是可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。通过这个技术，可以避免 HTTP 旧版本中的队头阻塞问题，极大的提高传输性能。

# 32 有几种方式可以实现存储功能，分别有什么优缺点？什么是 Service Worker？

特性 cookie localStorage sessionStorage indexDB
数据生命周期 一般由服务器生成，可以设置过期时间 除非被清理，否则一直存在 页面关闭就清理 除非被清理，否则一直存在
数据存储大小 4K 5M 5M 无限
与服务端通信 每次都会携带在 header 中，对于请求性能影响 不参与 不参与 不参与

。对于不怎么改变的数据尽量使用 localStorage 存储，否则可以用 sessionStorage 存储。

localStorage 满了咋办
一种容易想到的方案是，当 localStorage 存满后降级到 sessionStorage 里。看上去没啥问题，但实际业务中 app 内 h5 页面跳转常常采用新打开 webview 的方式，这么做的好处是关闭一个 webview 可以直接回到上一个页面，而不用重新加载页面，对于订单填写这类带有状态的页面就很需要这么做。新打开 webview 等于新打开一个会话，而 sessionStorage 只能存在于同一个会话中，因此 sessionStorage 无法跨页面共享。

# 33 Service Worker（外星人

Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker 的话，传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。
首先需要先注册 Service Worker，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据

# 34 浏览器的缓存

从缓存位置上来说分为四种，并且各自有优先级，当依次查找缓存且都没有命中的时候，才会去请求网络

Service Worker
Memory Cache
Disk Cache
Push Cache
网络请求
