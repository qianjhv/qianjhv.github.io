---
title: "使用 writing-mode 实现不同方向的文本"
date: "2025-1-10"
describtion: 在 web 中使用 writing-mode 处理不同方向的文本遇到的问题
tags:
  - web
  - css
---

<div className="text-sky-300 tracking-[2em]" style={{writingMode: "vertical-lr", lineHeight: 4}}>
  <p>风吹柳花满店香，</p>
  <p>吴姬压酒唤客尝。</p>
  <p>金陵子弟来相见，</p>
  <p>无车无马亦轻狂。</p>
</div>

> 记录一下在使用 `writing-mode` 属性时，遇到的一些问题。

在网页中，我们可能遇到需要为竖排文本（如中文、日语、韩语和蒙古语）赋予样式的情况。CSS 提供了`writing-mode` 属性，它定义了文本水平或垂直排布以及在块级元素中文本的行进方向。

它指定块流动方向，即块级容器堆叠的方向，以及行内内容在块级容器中的流动方向。因此，它也确定块级内容的顺序。

```css
/* 关键字值 */
writing-mode: horizontal-tb;
writing-mode: vertical-rl;
writing-mode: vertical-lr;

/* 全局值 */
writing-mode: inherit;
writing-mode: initial;
writing-mode: revert;
writing-mode: revert-layer;
writing-mode: unset;
```

- 三个关键值：
  1. `horizontal-tb`：（默认值）水平书写，从左到右，下一水平行位于上一行下方。
  2. `vertical-rl`：竖直书写，从右到左，下一垂直行位于上一行右侧。
  3. `vertical-lr`：竖直书写，从左到右，下一垂直行位于上一行左侧。

<hr />

<div style={{writingMode: "vertical-rl"}}>
  <p style={{writingMode: "vertical-rl", letterSpacing: '0.4em'}}>竖直书写从右到左下一行垂直位于上一行右侧。</p>
  <p style={{letterSpacing: '1.2em'}}>竖直书写从右到左下一行垂直位于上一行右侧。</p>
  <p>HELLO</p>
</div>

在上面你可能发现一堆奇怪的东西和一个垂直排列的 HELLO，那堆奇怪的东西是挤在了一起的汉字（由于浏览器渲染引擎和字体的默认处理在不同设备上的差异，在手机端很可能显示正常。为了演示手动调整一堆挤在一起的汉字）。它们的 html 代码在下面：

```html
<div style={{writingMode: "vertical-rl"}}>
  <p style={{writingMode: "vertical-rl", letterSpacing: '0.4em'}}>竖直书写从右到左下一行垂直位于上一行右侧。</p>
  <p style={{letterSpacing: '1.2em'}}>竖直书写从右到左下一行垂直位于上一行右侧。</p>
  <p>HELLO</p>
</div>
```

为什么汉字使用了这个属性之后会挤在一起，而英文却正常显示？通常字体设计本身不会显式设置 `letter-spacing`，而是依赖于字体设计师在字形设计阶段对字符之间的自然间距进行优化。对于汉字来说每个汉字都是方块字，默认占用相同的空间。在垂直排版时，汉字之间默认没有字距，因此看起来会挤在一起。对于英文字母来说天然具有不同的高度和形状（比如'p'和'b'的上下延伸部分），当它们垂直排列时，这种字形特点自然形成了视觉上的间隔。

总的来说，受字距和行距的影响，竖排文本可能出现挤在一块的现象，尤其是汉字。我们可以使用 `letter-spacing` 和 `line-height` 来调整。如下：

```html
<p style={{writingMode: "vertical-rl", letterSpacing: '2em'}}>竖直书写</p>
<p style={{writingMode: "vertical-rl", textOrientation: 'upright'}}>HELLO</p>
```

<p style={{writingMode: "vertical-rl", letterSpacing: '2em'}}>竖直书写</p>
<p style={{writingMode: "vertical-rl", textOrientation: 'upright'}}>HELLO</p>

你应该发现一点不同了，HELLO 英文字符不再是一个一个横着往下排列了，而是以更符合英文字符阅读习惯的方式，一个一个竖着往下排列。这是使用了 `text-orientation` 属性，它设定行中**字符**的方向。但它仅影响纵向模式（`writing-mode` 的值不是 `horizontal-tb`）下的文本。此属性在控制使用竖排文字的语言的显示上很有作用，也可以用来构建垂直的表格头。

```css
/* Keyword values */
text-orientation: mixed;  /* 默认值 */ 
text-orientation: upright; /* 将水平书写的字符自然布局（直排） */
```

<br />
<br />
<hr />
> 参考：<br />
> [MDN - writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)<br />
> [MDN - text-orientation](https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation)