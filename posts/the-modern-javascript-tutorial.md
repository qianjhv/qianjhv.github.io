---
title: "现代 JavaScript 教程笔记"
date: "2025-1-5"
describtion: 记录学习 The Modern JavaScript Tutorial 中的一些重点，难点。
tags:
  - web
  - javascript
---
## 浅拷贝和深拷贝

1. **浅拷贝（Shallow Copy）**：浅拷贝创建了一个新的对象，但它并不会递归地拷贝对象的内部结构。相反，新的对象会引用原对象中的内部对象或数组。因此，如果原始对象中的某个内嵌对象被修改，浅拷贝后的对象中的相应内嵌对象也会受到影响。

关于浅拷贝，可以使用 `Object.assign(target, ...sources)` 或者扩展运算符（Spread Operator）：

```js
// Object.assign()
let obj = { a: 1, b: { c: 2 } };
let copy = Object.assign({}, obj);


// Spread Operator
let obj = { a: 1, b: { c: 2 } };
let copy = { ...obj };

// 对于数组
let arr = [1, 2, 3];
let copy = arr.slice();
```

2. **深拷贝（Deep Copy）**：深拷贝会递归地复制对象中的每一层数据，包括嵌套的对象和数组。也就是说，深拷贝会生成一个与原始对象完全独立的新对象，即使是原始对象中的内嵌对象，也会被完全复制并且与原始对象没有任何引用关系。

对于深拷贝，可以使用第三方库 Lodash 的 `cloneDeep()`，或者对于没有函数或 `undefined` 的简单对象，可以使用`JSON.parse(JSON.stringify())` 。

```js
// 
let obj = { a: 1, b: { c: 2 } };
let deepCopy = JSON.parse(JSON.stringify(obj));

// Lodash 的 cloneDeep 方法
let obj = { a: 1, b: { c: 2 } };
let deepCopy = _.cloneDeep(obj);
```

3. **手动实现深拷贝**：根据具体的使用场景，考虑边界情况和特殊类型，添加或者删除相应的功能。如果遇到特殊情况，建议使用成熟的第三方库如 Lodash 的 `cloneDeep`。

```js
function deepClone(obj, hash = new WeakMap()) {
    // 处理基本类型和 null
    if (obj === null || typeof obj !== 'object') return obj;
    
    // 处理日期对象
    if (obj instanceof Date) return new Date(obj);
    
    // 处理正则对象
    if (obj instanceof RegExp) return new RegExp(obj);
    
    // 处理循环引用
    if (hash.has(obj)) return hash.get(obj);
    
    // 获取对象的构造函数
    const constructor = obj.constructor;
    
    // 创建新对象并存入 WeakMap
    const cloneObj = new constructor();
    hash.set(obj, cloneObj);
    
    // 处理 Map
    if (obj instanceof Map) {
        obj.forEach((value, key) => {
            cloneObj.set(key, deepClone(value, hash));
        });
        return cloneObj;
    }
    
    // 处理 Set
    if (obj instanceof Set) {
        obj.forEach(value => {
            cloneObj.add(deepClone(value, hash));
        });
        return cloneObj;
    }
    
    // 处理对象和数组
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], hash);
        }
    }
    
    return cloneObj;
}
```

## 数组的 sort 方法



## 数组元素随机排序



## 数组去重




## debounce and throttle

1. **防抖（Debouncing）** 是一种编程技术，旨在限制事件触发的频率。它的作用是延迟某个操作的执行，**直到事件停止触发一段时间后，才真正执行**。这通常用于输入框、滚动、窗口大小调整等高频触发的事件，目的是提高性能，避免不必要的重复操作。

- 应用场景：
	1. 输入框自动搜索：在输入框中用户输入时，防止每输入一个字符都发起一次 API 请求，可以使用防抖技术延迟请求的执行，直到用户停止输入。
	2. 窗口大小调整：在调整窗口大小时，不需要每次调整都重新计算布局，防抖可以减少计算的频率，直到用户停止调整窗口大小后再进行计算。
	3. 滚动事件：在滚动事件中，防抖可以避免频繁执行大量的 DOM 操作或网络请求，例如懒加载图片。

```js
function debounce(fn, ms) {
  let timeout;
  return function(...args) {    // 使用剩余参数语法收集多个传入的参数
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}

// 在事件触发的第一次立即执行，而后续的触发则是延迟执行
function debounce(func, wait, immediate) {
  let timeout;
  
  return function(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}
```

2. **节流（Throttle）** 是与 防抖（Debounce）类似的一种控制函数执行频率的技术，它的目的是**限制函数在单位时间内的执行次数**。与防抖不同的是，节流是限制函数的执行频率，而防抖是限制函数的执行时机。节流函数会强制一个函数在特定时间间隔内只能执行一次。也就是说，不管事件触发了多少次，节流函数只会在指定的时间间隔内执行一次。节流**通常应用于一些频繁触发的事件**，比如 滚动、窗口大小改变、鼠标移动 等。

```js
// 时间戳版本的节流
//如果距离上次执行函数的时间大于等于 wait，就执行目标函数。
function throttle(func, wait) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// 定时器版本的节流的简单实现
// 第一次和最后一次调用可能丢失
function throttle(func, wait) {
  let timeout;

  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null; 
        func.apply(this, args);
      }, wait);
    }
  };
}

// 
function throttle(fn, ms) {
  let isThrottled = false;  // 标记是否处于节流状态
  let savedArgs, savedThis; // 用于保存最后一次调用的参数和上下文

  function wrapper(...args) {
    if (isThrottled) {
      // 如果节流中，保存调用参数和上下文
      savedArgs = args;
      savedThis = this;
      return;
    }

    // 第一次调用，使用立即执行函数
    fn.apply(this, args);
    isThrottled = true;

    // 在 `ms` 时间后解除节流状态
    setTimeout(() => {
      isThrottled = false;

      // 执行最后一次调用（排除只有一次）
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }
  return wrapper;
}
```

## 