# 工具

# 两个数组的差异数组

```js
/**
 *
 * @param arr1  需要对比的数组
 * @param arr2  需要对比的数组
 * @return 两个数组的差异数组
 */
// 差异数组
function arrDiff(arr1: Array<any>, arr2: Array<any>) {
  let newArr = [];
  for (let i = arr1.length; i >= 0; i--) {
    for (let j = arr2.length; j >= 0; j--) {
      if (compare(arr1[i], arr2[j])) {
        arr2.splice(j, 1);
        arr1.splice(i, 1);
        break;
      }
    }
  }
  return arr1.concat(arr2);
}
//对比两个数组是否相等
function compare(origin: any, target: any) {
  if (typeof target !== "object") {
    //target不是对象/数组
    return origin === target; //直接返回全等的比较结果
  }
  if (typeof origin !== "object") {
    //origin不是对象/数组
    return false; //直接返回false
  }
  for (let key of Object.keys(target)) {
    //遍历target的所有自身属性的key
    if (!compare(origin[key], target[key])) {
      //递归比较key对应的value，
      // value不等，则两对象不等，结束循环，退出函数，返回false
      return false;
    }
  }
  //遍历结束，所有value都深度比较相等，则两对象相等
  return true;
}
export default arrDiff;
// eg
let a = [1, 2];
let b = [1, 2, [3, 4]];
let diff = arrDiff(a, b);
```

# 需要展平的数组

```js
/**
 *
 * @param arr  需要展平的数组
 * @return  展平后的数组
 */
// 数组展平
function arrFlatten(arr: Array<any>): Array<any> {
  if (!Array.isArray(arr)) {
    return arr;
  }
  return arr.reduce(
    (plane: Array<any>, toBeFlatten: Array<any>) =>
      plane.concat(
        Array.isArray(toBeFlatten) ? arrFlatten(toBeFlatten) : toBeFlatten
      ),
    []
  );
}
export default arrFlatten;
//eg
let arr = [1, 2, [2, [3, [4, 5]]]];
let arr1 = arrFlatten(arr);
```

# 格式化日期

```js
/**格式化日期
 * @param date 参数是date类型
 * @param fmt 参数可省 想转换成的日期格式
 */
function dateFormat(
  date: Date,
  fmt = "yyyy-MM-dd 星期w hh:mm:ss 第q季度"
): String {
  const week = ["日", "一", "二", "三", "四", "五", "六"];
  const o: any = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "w+": week[date.getDay()], //周
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    // S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    //console.log(date.getFullYear() + '');
    //console.log((date.getFullYear() + '').substr(4 - RegExp.$1.length));
    // RegExp.$1 是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let k: any;
  for (k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}
export default dateFormat;
```

# 防抖

```js
/**
 * @param fn 需要防抖的函数
 * @param delay 时延
 */
function debounce(fn: Function, delay: number) {
  // 维护一个Timer来记录当前函数执行状态
  let Timer = null as any;
  return function (this: any, ...args: any) {
    // 每次触发时清掉当前状态
    if (Timer) {
      // @ts-ignore
      clearTimeout(Timer);
    }
    // @ts-ignore
    Timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
export default debounce;
```

# 深拷贝

```js
/**
 *
 * @param initalObj  需要拷贝的数据，可以是任何类型
 * @param cache    不需要传此参数
 * @return  一个新的对象
 */

//递归深拷贝
function istype(obj: any, type: string) {
  //判断包装类型的原型
  return Object.prototype.toString.call(obj).indexOf(type) != -1;
}
function deepClone(initalObj: any, cache = new Map()): any {
  if (cache.get(initalObj)) {
    // 防止环状对象的爆栈问题;
    return cache.get(initalObj);
  }
  if (typeof initalObj !== "object") {
    //如果是基本类型直接返回值
    return initalObj;
  }
  if (
    istype(initalObj, "String") ||
    istype(initalObj, "Number") ||
    istype(initalObj, "Boolean")
  ) {
    return initalObj.valueOf();
  }
  if (istype(initalObj, "Date")) {
    //日期
    return new Date(initalObj.valueOf());
  }
  if (istype(initalObj, "RegExp")) {
    //正则
    return new RegExp(initalObj.source, initalObj.flags);
  }

  //使用循环解决爆栈
  const root: any = Array.isArray(initalObj) ? [] : {};
  // 栈
  const loopList: any = [
    {
      parent: root,
      key: undefined,
      data: initalObj,
    },
  ];
  while (loopList.length) {
    // 广度优先
    const node: any = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res: any = parent;
    if (typeof key !== "undefined") {
      res = parent[key] = Array.isArray(data) ? [] : {};
    }
    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === "object") {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else if (typeof data[k] === "function") {
          res[k] = data[k].bind(res);
        } else {
          res[k] = data[k];
        }
      }
    }
  }
  return root;
}
export default deepClone;
// eg：
let a: any = [{ a: 15, b: 15 }];
let b: any = deepClone(a);

// // 测试;
// const obj = {
//   aa: 1,
//   b: { b1: [], b2: [] },
//   c: { d: {}, g: () => {} },
//   e: () => {},
//   f: function () {}
// };
// const newObj:any = deepClone(obj);
// console.log(newObj);
// console.log(newObj.a === obj.a);
// console.log(newObj.b === obj.b);
// console.log(newObj.c === obj.c);
// console.log(newObj.c.d === obj.c.d);
// console.log(newObj.c.g === obj.c.g);
// console.log(newObj.e === obj.e);
// console.log(newObj.f === obj.f);
// const o2 = deepClone([0, obj, [1]]);
// console.log(o2);
// let str = new String('hello');
// console.log(Object.prototype.toString.call(str));
// console.log(deepClone(str));
// console.log(Object.prototype.toString.call(new Number()));
// console.log(deepClone(new Number(100)));
// console.log(Object.prototype.toString.call(new Date()));
// console.log(deepClone(new Date()));
// console.log(Object.prototype.toString.call(new RegExp('/111/')));
// console.log(deepClone(new RegExp('/111/')));
```

# 距离今天的天数

```js
/**
 *
 * @param days  距今天的天数
 * @param format  需要的时间的格式
 * @return    时间字符串
 */
import dateFormat from "./dateFormat";
// 获取距今天任意一天的时间
function getTimeFromToday(days: number, format: string = "yyyy-MM-dd") {
  let curTime = new Date().getTime();
  let startDate = new Date(curTime + days * 3600 * 24 * 1000);
  let newDay = dateFormat(startDate, format);
  return newDay;
}
export default getTimeFromToday;
let num = -3;
let result = getTimeFromToday(-3, "yyyy-MM-dd hh:mm");
```

# 获取类型

```js
const mapTypes = [
  "String",
  "Number",
  "Boolean",
  "Array",
  "Object",
  "Date",
  "Map",
  "Set",
  "RegExp",
];
const class2type: any = {};
mapTypes.forEach((name) => {
  class2type[`[object ${name}]`] = name.toLocaleLowerCase();
});
function getType(obj: unknown) {
  if (obj == null) {
    return `${obj}`;
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}
export default getType;
```

# 判断类型

```js
/**判断类型
 * @param data 参数可以是任意类型
 */
function getTypeName(data: any): String {
  let type: String = Object.prototype.toString.call(data);
  return type.substring(8, type.length - 1);
}
export default getTypeName;
```

# 判断对象是否为空

```ts
/**
 *
 * @param obj 需要判断的数据，可以是任何类型
 * @return  true或false 是否为空
 */
import getType from "./getType";
function isEmpty(obj: any): boolean {
  const tag = getType(obj);
  if (tag == "null" || tag == "undefined") {
    return true;
  }
  if (tag === "string" || tag === "array") {
    return !obj.length;
  }
  if (tag == "map" || tag == "set") {
    return !obj.size;
  }
  if (tag == "object") {
    return !obj.keys(obj).length;
  }
  return false;
}
export default isEmpty;
let a = "fjdfkjs";
let result = isEmpty(a);
```

# 使用循环的方式判断一个元素是否存在于一个数组中

```js
/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
import getType from "./getType";
function isExist(arr: Array<any>, item: any) {
  const tag = getType(item);
  if (tag !== "object") {
    if (arr.includes(item)) {
      return true;
    }
  } else {
    if (JSON.stringify(arr).includes(JSON.stringify(item))) {
      return true;
    }
  }
  return false;
}
export default isExist;
// eg
// let arr = ['a', 's', 'd', 'f'];
// console.info(isExist(arr, 'a'));
```

# 判断是否有意义（不是 null,undefined）

```ts
/**判断是否有意义（不是null,undefined）
 * @param val 参数可以是任意类型
 * @return  true或false
 */
function isMeaning(val: any): boolean {
  return val !== null && val !== undefined;
}
export default isMeaning;
```

# 返回指定月份的起始日期 截至日期

```ts
import dateFormat from "./dateFormat";
// 返回指定月份的起始日期 截至日期
// @date 可省 查询月份的日期 默认时间为当前时间
// @fmt 可省 可传入想要的日期格式 不填则使用默认日期格式
// @return 字符串开始时间+结束时间 可根据想要的样式自行更改日期的格式
function lastAndFirstDay(date = new Date(), fmt = "yyyy-MM-dd") {
  date = new Date(date);
  if (!date.getTime()) {
    return Error("日期格式不正确！");
  }
  let month = date.getMonth();
  let year = date.getFullYear();
  let firstDay = new Date(year, month, 1);
  let lastDay = new Date(
    new Date(year, month + 1, 1).getTime() - 1000 * 60 * 60 * 24
  );
  return [dateFormat(firstDay, fmt), dateFormat(lastDay, fmt)];
}
export default lastAndFirstDay;
// console.log(lastAndFirstDay(new Date())); //当前时间是 2021/01/05
// 开始时间: 2021-01-01
// 结束时间: 2021-01-31
```

# 合并两数组中相同的元素

```ts
import isMeaning from "./isMeaning";
/**合并两数组中相同的元素
 * @param arr2  为数组 arr1往arr2中合并（不改变原数组）
 * @param arr1 arr1为数组 被处理的数组（不改变原数组）
 * @param key2  传入的key值 arr2中的key
 * @param key1  传入的key值 arr1中的key
 * @return  合并后的数组
 */
function mergeArray(arr2: Array<any>, arr1: Array<any>, key2: any, key1: any) {
  const arrObj = arr1.reduce((acc, cur) => {
    if (!isMeaning(cur) || !isMeaning(cur[key1])) return acc;
    // 如果不存在这个键，则设置它赋值 [] 空数组
    if (!acc[cur[key1]]) {
      acc[cur[key1]] = [];
    } else {
      //cur[key1]重复取第一个 并且有提示
      console.log(`有重复的${key1}值`);
    }
    acc[cur[key1]].push(cur);
    return acc;
  }, {});
  let resultArr = arr2.map((item) => {
    if (isMeaning(item) && arrObj[item[key2]]) {
      item = { ...item, ...arrObj[item[key2]][0] };
    }
    return item;
  });
  return resultArr;
}
let arr1 = [
  {
    id: 0,
    type: "type1",
  },
  {
    id: 0,
    type: "type3",
  },
  {
    id: 1,
    type: "type2",
  },
  {
    id: null,
    type: "type4",
  },
];
let arr2 = [
  {
    serverType: 0,
    server: "qq",
  },
  {
    serverType: 100,
    server: "aa",
  },
  {
    serverType: 1,
    server: "xx",
  },
];

mergeArray(arr2, arr1, "serverType", "id");
export default mergeArray;
```

# 大数字转换，整数部分每三位逗号分隔，将大额数字转换为万、千万、亿等，兼容负值

```js
/**大数字转换，整数部分每三位逗号分隔，将大额数字转换为万、千万、亿等，兼容负值
 * @param value 参数number类型
 * @param 需要保留的小数位数 point
 * @param 特殊情况下的默认字符 defaultStr
 * @return string
 */
import isMeaning from "./isMeaning";

function numFormat(
  value: number | null | undefined,
  point?: number,
  defaultStr: string = "--"
) {
  let isMinus: boolean = false; // 负值flag
  if (value === null || value === undefined) {
    return defaultStr;
  } else if (Number(value) < 0) {
    isMinus = true;
    value = -value;
  }
  let param = {
    value: "",
    value_pre: "",
    value_aft: "",
    result: "",
    unit: "",
  };
  let k = 10000,
    sizes = ["", "万", "亿", "万亿", "京", "垓"],
    i;
  if (value >= k) {
    i = Math.floor(Math.log(value) / Math.log(k));
    value = value / Math.pow(k, i);
    param.unit = sizes[i];
  }
  param.value = value.toFixed(point).toString();
  [param.value_pre, param.value_aft] = param.value.split(".");
  param.result = getResult(param.value_pre, param.value_aft);

  if (isMinus) {
    return "-" + param.result + param.unit;
  }
  return param.result + param.unit;
}

function getResult(pre: any, aft: any) {
  let preVal = pre.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  if (isMeaning(aft)) {
    let resultAft = aft.replace(/0+$/, "");
    return resultAft.length > 0 ? preVal + "." + resultAft : preVal;
  }
  return preVal;
}

export default numFormat;

// console.log(numFormat(23423423));
```

# 需要转换为 query 的对象

```ts
/**
 *
 * @param obj  需要转换为query的对象
 * @param mark  是否加问号
 * @return 返回查询字符串
 */
function objToQuery(obj: any, mark: boolean) {
  let query = mark ? "?" : "";
  if (typeof obj === "object") {
    for (let key in obj) {
      query += key + "=" + obj[key] + "&";
    }
  }
  return query.slice(0, -1);
}
export default objToQuery;
// eg
let obj = { name: "cheng", sex: "woman" };
objToQuery(obj, true);
```

# 获取 query 字符串

```ts
/**
 *
 * @param query  query字符串
 * @return 返回其对应的对象
 */
interface INewObeject {
  [x: string]: any; //动态添加属性
}
function queryToObj(query: string) {
  query = query.replace("?", "");
  let parts = query.split(/[&=]/g);
  let result: INewObeject = {};
  for (let i = 0; i < parts.length; i++) {
    result[parts[i]] = parts[i + 1];
    i++;
  }
  return result;
}
export default queryToObj;
// eg
let str =
  "?id=1137913169189019649&cityCode=560&siteCode=3429&provinceCode=五点";
queryToObj(str);
```

# 返回最近一周某一天的日期 例如最近一周的周三

```ts
import dateFormat from "./dateFormat";
// 返回最近一周某一天的日期 例如最近一周的周三
// @num 必填 指定要返回的日期是周几 取值范围0~6 周末~周六
// @fmt 可省 指定返回日期的格式
// @return 字符串日期
function recentDay(num: number, fmt = "yyyy-MM-dd") {
  let day = new Date().getDay();
  let time = 0;
  if (day === 7) {
    day = 0;
  }
  if (day <= num) {
    time = new Date().getTime() - (7 - num + day) * 24 * 60 * 60 * 1000;
  } else {
    time = new Date().getTime() - (day - num) * 24 * 60 * 60 * 1000;
  }
  return dateFormat(new Date(time), fmt);
}
export default recentDay;
// console.log(recentDay(0)); // 周末
// console.log(recentDay(1)); // 周一
// console.log(recentDay(2)); // 周二
// console.log(recentDay(3)); // 周三
// console.log(recentDay(5)); // 周五
// console.log(recentDay(6)); // 周六
```

# 返回 n 位小数

```ts
/**返回n位小数
 * @param date 参数不接受非number类型
 * @param fmt 参数不接受非number类型 参数必须大于零
 */
function roundOff(num: number, n: number): String {
  let result = "";
  // 保留n位
  if (typeof num !== "number" || typeof n !== "number" || n <= 0) {
    // throw new Error('参数不为number或参数小于等于0！');
    return "参数不为number或参数小于等于0！";
  }
  if (n % 1 !== 0) {
    // throw new Error('第二个参数只能是整数！');
    return "第二个参数只能是整数！！";
  }
  // pow() 方法可返回 x 的 y 次幂的值
  // Math.round() 函数返回一个数字四舍五入后最接近的整数。
  num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
  let numStr: String = num.toString();

  let padFlag = false;
  // if (String.prototype.padEnd) {
  //   判断浏览器是否支持这个padEnd js可用 ts貌似不支持 padEnd
  //   padFlag = true;
  // }
  const zeroResult = function (n: number) {
    let zero = "";
    for (let i = 0; i < n; i++) {
      zero += "0";
    }
    return zero;
  };
  if (num % 1 === 0) {
    // 整数
    // ts不支持padEnd 暂时注掉
    // padFlag && (result = (numStr + '.').padEnd(n + numStr.length + 1, '0'));
    !padFlag && (result = numStr + "." + zeroResult(n));
  } else {
    // 小数
    const num1 = numStr.split(".");
    if (num1[1].length < n) {
      // ts不支持padEnd 暂时注掉
      // padFlag && (result = num1[0] + '.' + num1[1].padEnd(n, '0'));
      !padFlag &&
        (result = num1[0] + "." + num1[1] + zeroResult(n - num1[1].length));
    } else {
      result = num1[0] + "." + num1[1].substring(0, n);
    }
  }
  return result;
}
export default roundOff;
```

# 根据长度或字符个数截取字符串，并添加后缀

```ts
/**
 * @description:根据长度或字符个数截取字符串，并添加后缀
 * @date:'2021-02-04'
 * @param:str 原始字符串
 * @param:len 需要截取的长度
 * @param:isChar 是否根据字符长度截取（英文、数字占1字符，汉字占2字符），默认false：按字符串长度截取， true：按字符个数截取
 * @param:suffix 超出长度后默认添加的后缀，默认值:'...'
 * @return:
 */
function substr(str: string, len: number, isChar = false, suffix = "...") {
  if (!len) return str;
  if (isChar) {
    // 根据字符长度截取
    let tempLen = 0; // 临时存储字符长度
    for (let i = 0; i < str.length; i++) {
      const a = str.charAt(i);
      if (a.match(/[^\x00-\xff]/gi) != null) {
        tempLen += 2;
      } else {
        tempLen += 1;
      }
      if (tempLen === len) {
        len = i + 1;
        break;
      } else if (tempLen > len) {
        len = i;
        break;
      }
    }
  }
  if (str.length <= len) return str;
  const s = str.substr(0, len) + suffix;
  return s;
}
export default substr;
```

# 节流

```ts
/**
 * @param fn 需要节流的函数
 * @param delay 时延
 */
function throttle(fn: Function, delay: number) {
  // 维护一个Timer来记录当前函数执行状态
  let Timer = null as any;
  return function (this: any, ...args: any) {
    if (Timer) {
      return;
    }
    // @ts-ignore
    Timer = setTimeout(() => {
      fn.apply(this, args);
      Timer = null;
    }, delay);
  };
}
export default throttle;
```

# 数组去重

```ts
/**
 * 数组去重
 * @param {Object} arr 数组
 */

function uniq(arr: Array<any>) {
  return Array.from(new Set(arr));
}
export default uniq;
// eg
// let arr = ['a','s','d','f','f'];
// console.info(uniq(arr));
```
