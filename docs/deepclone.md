工具库中的深拷贝函数实现方式，比如 loadash 中的 cloneDeep。虽然这种做法能解决第一种做法的局限，但是对于庞大的数据来说性能并不好，因为需要把整个对象都遍历一遍。
那么是否可以有一种实现的做法，只有当属性修改以后才对这部分数据做深拷贝，又能解决 JSON.parse(JSON.stringify(a)) 的局限呢。这种做法当然是存在的，唯一的点是我们如何知道用户修改了什么属性？
答案是 Proxy，通过拦截 set 和 get 就能达到我们想要的，当然 Object.defineProperty() 也可以。其实 Immer 这个库就是用了这种做法来生成不可变对象的，接下来就让我们来试着通过 Proxy 来实现高性能版的深拷贝。

先说下整体核心思路，其实就三点：

    1、拦截 set，所有赋值都在 copy （原数据浅拷贝的对象）中进行，这样就不会影响到原对象
    2、拦截 get，通过属性是否修改的逻辑分别从 copy 或者原数据中取值
    3、最后生成不可变对象的时候遍历原对象，判断属性是否被修改过，也就是判断是否存在 copy。如果没有修改过的话，就返回原属性，并且也不再需要对子属性对象遍历，提高了性能。如果修改过的话，就需要把 copy 赋值到新对象上，并且递归遍历

接下来是实现，我们既然要用 Proxy 实现，那么肯定得生成一个 Proxy 对象，因此我们首先来实现一个生成 Proxy 对象的函数。

```js
// 用于判断是否为 proxy 对象
const isProxy = (value) => !!value && !!value[MY_IMMER];
// 存放生成的 proxy 对象
const proxies = new Map();
const getProxy = (data) => {
  if (isProxy(data)) {
    return data;
  }
  if (isPlainObject(data) || Array.isArray(data)) {
    if (proxies.has(data)) {
      return proxies.get(data);
    }
    const proxy = new Proxy(data, objectTraps);
    proxies.set(data, proxy);
    return proxy;
  }
  return data;
};
```

    首先我们需要判断传入的属性是不是已经为一个 proxy 对象，已经是的话直接返回即可。这里判断的核心是通过 value[MY_IMMER]，因为只有当是 proxy 对象以后才会触发我们自定义的拦截 get 函数，在拦截函数中判断如果 key 是 MY_IMMER 的话就返回 target
    接下来我们需要判断参数是否是一个正常 Object 构造出来的对象或数组，isPlainObject 网上有很多实现，这里就不贴代码了，有兴趣的可以在文末阅读源码
    最后我们需要判断相应的 proxy 是否已经创建过，创建过的话直接从 Map 中拿即可，否则就新创建一个。注意这里用于存放 proxy 对象的容器是 Map 而不是一个普通对象，这是因为如果用普通对象存放的话，在取值的时候会出现爆栈

```js
// 注意这里还是用到了 Map，原理和上文说的一致
const copies = new Map();
const objectTraps = {
  get(target, key) {
    if (key === MY_IMMER) return target;
    const data = copies.get(target) || target;
    return getProxy(data[key]);
  },
  set(target, key, val) {
    const copy = getCopy(target);
    const newValue = getProxy(val);
    // 这里的判断用于拿 proxy 的 target
    // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
    copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue;
    return true;
  },
};
const getCopy = (data) => {
  if (copies.has(data)) {
    return copies.get(data);
  }
  const copy = Array.isArray(data) ? data.slice() : { ...data };
  copies.set(data, copy);
  return copy;
};
```

      拦截 get 的时候首先需要判断 key 是不是 MY_IMMER，是的话说明这时候被访问的对象是个 proxy，我们需要把正确的 target 返回出去。然后就是正常返回值了，如果存在 copy 就返回 copy，否则返回原数据
      拦截 set 的时候第一步肯定是生成一个 copy，因为赋值操作我们都需要在 copy 上进行，否则会影响原数据。然后在 copy 中赋值时不能把 proxy 对象赋值进去，否则最后生成的不可变对象内部会内存 proxy 对象，所以这里我们需要判断下是否为 proxy 对象
      创建 copy 的逻辑很简单，就是判断数据的类型然后进行浅拷贝操作

最后就是生成不可变对象的逻辑了

```js
const isChange = (data) => {
  if (proxies.has(data) || copies.has(data)) return true;
};

const finalize = (data) => {
  if (isPlainObject(data) || Array.isArray(data)) {
    if (!isChange(data)) {
      return data;
    }
    const copy = getCopy(data);
    Object.keys(copy).forEach((key) => {
      copy[key] = finalize(copy[key]);
    });
    return copy;
  }
  return data;
};
```

这里的逻辑上文其实已经说过了，就是判断传入的参数是否被修改过。没有修改过的话就直接返回原数据并且停止这个分支的遍历，如果修改过的话就从 copy 中取值，然后把整个 copy 中的属性都执行一遍 finalize 函数。

完整版

```js
const MY_IMMER = Symbol("my-immer1");

const isPlainObject = (value) => {
  if (
    !value ||
    typeof value !== "object" ||
    {}.toString.call(value) != "[object Object]"
  ) {
    return false;
  }
  var proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor == "function" &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) ===
      Function.prototype.toString.call(Object)
  );
};

const isProxy = (value) => !!value && !!value[MY_IMMER];

function produce(baseState, fn) {
  const proxies = new Map();
  const copies = new Map();

  const objectTraps = {
    get(target, key) {
      if (key === MY_IMMER) return target;
      const data = copies.get(target) || target;
      return getProxy(data[key]);
    },
    set(target, key, val) {
      const copy = getCopy(target);
      const newValue = getProxy(val);
      // 这里的判断用于拿 proxy 的 target
      // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
      copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue;
      return true;
    },
  };

  const getProxy = (data) => {
    if (isProxy(data)) {
      return data;
    }
    if (isPlainObject(data) || Array.isArray(data)) {
      if (proxies.has(data)) {
        return proxies.get(data);
      }
      const proxy = new Proxy(data, objectTraps);
      proxies.set(data, proxy);
      return proxy;
    }
    return data;
  };

  const getCopy = (data) => {
    if (copies.has(data)) {
      return copies.get(data);
    }
    const copy = Array.isArray(data) ? data.slice() : { ...data };
    copies.set(data, copy);
    return copy;
  };

  const isChange = (data) => {
    if (proxies.has(data) || copies.has(data)) return true;
  };

  const finalize = (data) => {
    if (isPlainObject(data) || Array.isArray(data)) {
      if (!isChange(data)) {
        return data;
      }
      const copy = getCopy(data);
      Object.keys(copy).forEach((key) => {
        copy[key] = finalize(copy[key]);
      });
      return copy;
    }
    return data;
  };

  const proxy = getProxy(baseState);
  fn(proxy);
  return finalize(baseState);
}

const state = {
  info: {
    name: "yck",
    career: {
      first: {
        name: "111",
      },
    },
  },
  data: [1],
};

const data = produce(state, (draftState) => {
  draftState.info.age = 26;
  draftState.info.career.first.name = "222";
});

console.log(data, state);
console.log(data.data === state.data);
```

从上述代码打印出的值我们可以看到 data 和 state 已经不是同一个引用，修改 data 不会引发原数据的变更，并且也实现了只浅拷贝修改过的属性。对象中的 data 属性因为没有被修改过，所有两个对象中的 data 还是同一个引用，实现了结构共享。
