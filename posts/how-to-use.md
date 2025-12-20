---
title: "如何使用这个静态博客"
date: "2024-12-26"
tags: ["other", ]
---

## 基础 Markdown 语法测试

### 语法（如何使用 markdown）

- **标题**：使用不同数量的 `#` 来表示不同级别的标题。
- **段落**：直接输入文本，段落通过空行分隔。
- **列表**：无序列表用 `-`、`*` 或 `+`，有序列表用数字加点（`1.`、`2.`）。
- **文本强调**：加粗使用 `**` 或 `__`，斜体使用 `*` 或 `_`，删除线使用 `~~`。
- **链接和图片**：链接格式为 `[文本](URL)`，图片格式为 `![文本](图片URL)`。
- **代码**：行内代码使用反引号（`）。
- **引用**：使用 `>` 来表示引用块。

### 标题

Markdown 提供了六个级别的标题，使用 `#` 符号来表示标题的级别。（这里就不一一测试了）

### 段落

这是一个段落测试。Markdown 是一种轻量级的标记语言，旨在使文本格式更加易读。（两个段落之间需要有一个空行，否则会将其都解析进一个 `<p>` 标签当中）

我是第一行
我是第二行（我明明是第二行，却被强行挤进第一行了。。。PS：就当是特性吧！）

### 无序列表

- 项目一
- 项目二
  - 子项目一
  - 子项目二
- 项目三

### 有序列表

1. 第一项
2. 第二项
3. 第三项

### 强调文本

**加粗文本**

*斜体文本*

~~删除线文本~~

### 引用示例

> 这是一个引用块。

### 水平线

---

### 链接与图片

链接：[Google](https://www.google.com)

图片：![一张图片](https://cdn.pixabay.com/photo/2016/03/08/20/03/flag-1244649_1280.jpg)

### 行内代码

行内代码：在此使用 `console.log('Hello World!')` 来打印信息。（原始 Markdown 本身并不提供明确的多行代码块语法。）


## GitHub Flavored Markdown（markdown 语法扩展测试）

### GFM 语法要点：([查看更多](https://github.github.com/gfm/))

- **任务列表**：使用 `[ ]` 和 `[x]` 来表示未完成和已完成的任务。
- **表格**：使用 `|` 和 `-` 来表示表格的行和列。
- **自动链接**：URL 会自动被解析为超链接。
- **删除线**：使用 `~~` 来创建删除线。
- **代码块**：代码块用三个反引号（```）包裹，支持指定语言进行语法高亮。

### 任务列表

- [x] 完成任务 A
- [ ] 完成任务 B
- [ ] 完成任务 C

### 表格

| 姓名    | 年龄 | 职业      |
| ------- | ---- | --------- |
| 小明    | 28   | 开发者    |
| 小红    | 24   | 设计师    |
| 小华    | 26   | 数据分析  |

### 自动链接

访问 https://github.com 查看开源项目。

### 删除线

这是一个 ~~已删除~~ 的文本。

### 代码高亮（[Rehype Pretty Code](https://rehype-pretty.pages.dev/)）

```javascript {1,2,4}
function greet() {
  console.log('Hello, GFM!');
}
greet();
```

## 数学公式测试（katex）

### 使用

```katex
行内公式：$E = mc^2$

块级公式：
$$
\int_{a}^{b} x^2 \, dx = \frac{1}{3}x^3 \bigg|_{a}^{b}
$$

分数与根号：
$$
\sqrt{\frac{a}{b}}
$$

矩阵与括号：
$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
\cdot
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
1 \cdot x + 2 \cdot y \\
3 \cdot x + 4 \cdot y
\end{pmatrix}
$$

上标与下标：
$$
x_i^j = \sum_{k=1}^n x_k
$$

希腊字母与特殊符号：
$$
\alpha + \beta = \gamma, \quad \Delta x = \epsilon
$$

大括号与条件表达式：
$$
f(x) =
\begin{cases}
x^2 & \text{if } x \geq 0, \\
-x & \text{if } x < 0.
\end{cases}
$$

极限与集合：
$$
\lim_{x \to \infty} \frac{1}{x} = 0, \quad \mathbb{R} = \{ x \mid x \text{ is real} \}
$$
```

### 展示

行内公式：$E = mc^2$

块级公式：
$$
\int_{a}^{b} x^2 \, dx = \frac{1}{3}x^3 \bigg|_{a}^{b}
$$

分数与根号：
$$
\sqrt{\frac{a}{b}}
$$

矩阵与括号：
$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
\cdot
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
1 \cdot x + 2 \cdot y \\
3 \cdot x + 4 \cdot y
\end{pmatrix}
$$

上标与下标：
$$
x_i^j = \sum_{k=1}^n x_k
$$

希腊字母与特殊符号：
$$
\alpha + \beta = \gamma, \quad \Delta x = \epsilon
$$

大括号与条件表达式：
$$
f(x) =
\begin{cases}
x^2 & \text{if } x \geq 0, \\
-x & \text{if } x < 0.
\end{cases}
$$

极限与集合：
$$
\lim_{x \to \infty} \frac{1}{x} = 0, \quad \mathbb{R} = \{ x \mid x \text{ is real} \}
$$
