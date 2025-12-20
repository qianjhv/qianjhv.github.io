---
title: "我是如何制作这个博客的"
date: "2025-1-1"
describtion: 这是一篇使用 Nextjs 制作一个静态博客的记录，以及过程当中遇到的一些问题和感想，当然还有一些使用规则。
tags:
  - web
---

> “我的作品完成了。任凭朱庇特的怒气，任凭刀、火，任凭时光的蚕蚀，都不能毁灭我的作品。时光只能消毁我的肉身，死期愿意来就请它来吧，来终结我这飘摇的寿命。但是我的精萃部分却是不朽的，它将与日月同寿，我的声名也将永不磨灭。罗马的势力征服到哪里，那里我的作品就会被人们诵读。如果诗人的预言不爽，我的声名必将千载流传。”  -- 奥维德

## 介绍

这是一篇使用 Nextjs 制作一个静态博客的记录，稍后会集成第三方工具实现评论功能，如果你感兴趣的话，非常欢迎探讨。

## 开发基础环境搭建

顺便说一下，使用 VSCode 进行编辑开发。

```shell
# 安装 Nextjs，react
pnpm install next@latest react@latest react-dom@latest

# 在 package.json 文件中，添加开发脚本
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}

# 项目目录结构和路由部分，阅读 Nextjs 文档
/src/app
```

设置 TypeScript，ESLint 以及 Absolute Imports and Module Path Aliases，具体的方法请阅读 [Nextjs 文档的安装部分](https://nextjs.org/docs/app/getting-started/installation)。

## 支持 MDX

- 工具包解释与安装：
  - @mdx-js/react -用于在运行时将 MDX 内容渲染为 React 组件。
  - @next/mdx - 专为 Next.js 提供 MDX 集成工具。简化了在 Next.js 中使用 MDX 的配置过程。内部依赖 @mdx-js/loadevr 来处理 Webpack 的加载。
  - @mdx-js/loader - MDX 的 Webpack 加载器，用于在**构建时**将 .mdx 文件转换为可供 JavaScript 使用的模块。
  - @types/mdx -  TypeScript 类型声明包，为 MDX 提供类型支持，主要作用是让开发者在使用 MDX 时获得更好的类型提示、错误检测和代码补全功能。（MDX 文件本质上会被编译为 React 组件）

```shell
pnpm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

- @next/mdx 配置 - 项目根目录下 `next.config.mjs`。（在没有使用 @next/mdx 的项目中，需要手动在 `webpack.config.js` 中配置 @mdx-js/loader）
- 完成这一步之后在 pages router 模式下，`.md` 和 `.mdx` 文件将被正确解析。在 app router 模式下还需要进一步配置。

```js
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 扩展页面文件类型
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // 其他 Next.js 配置
  reactStrictMode: true,
};

const withMDX = createMDX({
  // 定义需要处理的文件扩展名
  extension: /\.mdx?$/,
  options: {
    // 配置插件
    // remarkPlugins: [remarkGfm],
    // rehypePlugins: [rehypeHighlight],
  },
});

// 合并配置
export default withMDX(nextConfig);
```

3. app router 模式下，需要在根目录或者 `src`（如果使用 `src` 目录） 下创建 `mdx-components.tsx` 文件（注意文件名，名字由 nextjs 指定），它用来扩展或覆盖 MDX 组件映射。
- 完成后就可以正确渲染，如 `app/test/page.mdx` 可以在浏览器中通过 `根域名/test` 访问（这样显然有些麻烦，我们希望使用一个文件夹统一管理 markdown 文件）

```tsx
import type { MDXComponents } from 'mdx/types'
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

4. 前面的三个步骤是完全按照官方文档来的，现在对其进行扩展，比如希望在 `/src/contents/` 文件中管理所有的 MDX 文件（**由于 URL 中文需要额外处理，避免麻烦，contents 内的文件夹和文件禁止使用中文**），并且使用动态路由的方式，在浏览器中通过`跟域名/blog/*` 来访问。（就像 pages router 模式下一样可以嵌套，同时也可以使用动态路由，如 `/src/contents/test/test.mdx` 可以通过 `/blog/test/test` 访问）
- 使用  [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) 来实现，它是一个用于 Next.js 的库，专门用于在服务器端（Server Side）加载和渲染 MDX 文件。支持将 Markdown/MDX 内容通过服务端渲染传递到前端页面，同时允许在运行时动态渲染组件。
- [核心代码](https://github.com/qianjhv/qianjhv.github.io/blob/4923bd42f60b7db319858bb45d2da87e0d796e8b/src/app/blog/%5B...slug%5D/page.tsx)

```shell
# 安装 next-mdx-remote
pnpm install next-mdx-remote

# 创建动态路由 /src/app/blog/[...slug]/page.tsx，具体请看上面的提供的代码链接
```

## 使用 tailwindcss 和 sass

```shell
# 安装
pnpm install -D tailwindcss postcss autoprefixer
pnpm install --save-dev sass
```

安装并添加好配置文件后，在全局中引入，如在全局 `layout.tsx` 中引入 `/src/styles/global.scss`

```ts
/* tailwind.config.ts - 注意这里的 {js,ts,jsx,tsx,mdx,md} 不要添加空格 */
import type { Config } from 'tailwindcss'
 
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx,md}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

/* next.config.ts -- for saas */
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  sassOptions: {
  },
};

/* postcss.config.js */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

/* 在 /src/app/layout.tsx 中全局引入 */
import "@/styles/global.scss";
```

## 全局亮色主题和暗色主题

由于后续步骤需要 css 样式化，在这里我们先使用 [next-themes](https://github.com/pacocoursey/next-themes) 设置全局的亮色主题和暗色主题，以方便后续操作。[查看代码](https://github.com/qianjhv/qianjhv.github.io/tree/a5c73d99efa9f7917bb41d188c02c0a7ed465998/)

```shell
# 安装
pnpm install next-themes
```

```js
# 创建一个主题切换组件
# 为了配合 tailwindcss 的 `dark` 指令，将 `attribute` 设置为 `class`，
# 以及在 tailwind.config.ts 配置文件中设置 `darkMode: "class"`。
export function ThemesProviders({ children }) {

  const [mounted, setMounted] = useState(false);

  // 在组件挂载后才更新 mounted 状态，防止在服务端渲染时访问浏览器相关 API
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute(
      'class',
      isDark ? 'dark' : 'light'
    );
    setMounted(true)
  }, []);

  // 如果没有挂载（即还在服务端渲染），则不渲染任何内容
  if (!mounted) {
    return <>{children}</>  // 可以返回一个空的 fragment 或者加载中状态
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}

# 在全局 /src/app/layout.tsx 中使用
<body>
  <ThemesProviders>
    {children}
  </ThemesProviders>
</body>

# 全局样式设定
/* 默认情况下使用明亮模式 */
:root {
	--background-color: #fafafa;
	--text-color: #000000;
	--link-color: #1e90ff;
}

/* 暗黑模式的 CSS 变量 */
[class='dark'] {
	--background-color: #464545;
	--text-color: #e0e0e0;
	--link-color: #bb86fc;
}

/* 全局样式 */
body {
	background-color: var(--background-color);
	color: var(--text-color);
}

a {
  color: var(--link-color);
}
```

## markdown 排版

利用 tailwindcss 的 typography 插件，可以对 markdown 进行排版。但是要使用自定义样式，需要在 tailwindcss 的配置文件中写入一堆样式配置，而且感觉也不怎么灵活。所以可以利用 tailwindcss 的 `@layout` 对 markdown 进行排版，以及实现 `dark` 指令切换排版暗色模式，配合 sass，核心代码如下。

```css
// globals.scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .mdx-typography-default {
	font-size: 16px;
	
	h1 {
		font-size: 2em;
	}
  }
	
  .dark .mdx-typography-dark {
	  a:hover {
		background-color: #626161;
	  }
  }
}

// 使用
<div className='mdx-typography-default dark:mdx-typography-dark'>
</div>
```
## remark 和 rehype

使用 [remark](https://github.com/remarkjs/remark) 和 [rehype](https://github.com/rehypejs/rehype) 生态系统进行扩展，如 frontmatter，markdown 语法扩展（GFM），数学公式支持（Katex），代码语法高亮（rehype-pretty-code），清理并安全化 HTML（rehype-sanitize），代码压缩（rehype-minify）等等。

```shell
# 安装
pnpm install remark-gfm rehype-sanitize remark-math rehype-katex katex rehype-pretty-code shiki

# 使用 Katex 还须在全局引入 katex 数学公式样式，如在 /src/app/layout.tsx 中引入
import "katex/dist/katex.min.css";

# 压缩代码
# rehype-minify 是一系列的压缩工具集合，它提供了一个插件集合 rehype-preset-minify（使用有问题）
# 使用其中一些就行：(最重要的 rehype-minify-whitespace)
# rehype-pretty-code 生成的代码可以使用 `transformers` 选项进行代码压缩
pnpm install rehype-minify-whitespace rehype-minify-css-style

# 对于静态博客，可以不使用 rehype-sanitize，踩了一堆坑
```

```ts
# 最终核心代码展示

// 扩展 sanitize schema 以支持 KaTeX
const extendedSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'section',
    'sup',
    // KaTeX 相关标签
    'math',
    'semantics',
    'mrow',
    'mi',
    'mn',
    'mo',
    'msup',
    'annotation',
    'span',  // KaTeX 使用 span 渲染一些元素
    'svg',
    'path',
    'figure',
    'code'
  ],
  attributes: {
    ...defaultSchema.attributes,
    // KaTeX 相关属性
    '*': ['className', 'style', 'class', 'data-line'],  // KaTeX 需要这些属性
    span: ['class', 'style', 'data*'],
    math: ['xmlns', 'display'],
    svg: ['xmlns', 'viewBox', 'width', 'height', 'style', 'preserveAspectRatio'],
    path: ['d', 'fill', 'stroke', 'stroke-width'],
    figure: ['data*'],
    pre: ['className', 'class', 'data*', 'dir'],
    code: ['className', 'class', 'data-line-numbers', 'data-line-numbers-max-digits', 'data*'],
  },
};

const { content: compiledContent } = await compileMDX({
  source: mdxContent,
  options: {
    mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      [rehypePrettyCode, {
        keepBackground: false,
        defaultLang: {
          block: "plaintext",
        },
        theme: {
          dark: "github-dark",
          light: "github-light"
        },
        transformers: [{
          postprocess (html) {
            return html.replace(/\n/g, '').trim();
          },
        }],
      }],
      rehypeKatex,
      [rehypeSanitize, extendedSchema],
      rehypeMinifyCssStyle,
      rehypeMinifyWhitespace, 
    ]},
  },
});

return (
  <main className='mdx-typography-default dark:mdx-typography-dark max-w-[768px] mx-auto'>
    {compiledContent}
  </main>
);
```

```shell
# 安装
pnpm install --save gray-matter

// 使用方法，通常结合 Nextjs 的 generateMetadata 来一起使用
import matter from "gray-matter";

const mdxContent = fs.readFileSync(filePath, 'utf-8');
const { data, content } = matter(mdxContent);
```

## 集成第三方评论系统 - Giscus

1. 在 GitHub 仓库中启用 Discussions 功能。
2. 访问 [Giscus 官网](https://giscus.app/)，阅读它的配置选项。
3. 使用 `.env.local` 文件，在 `.gitignore` 中添加此文件，以免较敏感信息直接显示在源代码之中。

```js

// 创建一个评论组件 src/lib/Giscus.tsx
// 核心代码
'use client';
import React, { useEffect, useRef } from 'react';

export default function Giscus() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || containerRef.current.hasChildNodes()) return;

    const script = document.createElement('script');
    const config = {
      src: 'https://giscus.app/client.js',
      'data-repo': process.env.NEXT_PUBLIC_GISCUS_REPO!,
      'data-repo-id': process.env.NEXT_PUBLIC_GISCUS_REPO_ID!,
      'data-category': process.env.NEXT_PUBLIC_GISCUS_CATEGORY!,
      'data-category-id': process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!,
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': resolvedTheme === 'dark' ? 'catppuccin_macchiato' : 'light',
      'data-lang': 'en',
      crossorigin: 'anonymous',
      async: 'true'
    };

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <div ref={containerRef} className="mt-10" />;
}

// .env.local
NEXT_PUBLIC_GISCUS_REPO=YOUR_USERNAME/YOUR_REPO
NEXT_PUBLIC_GISCUS_REPO_ID=YOUR_REPO_ID
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=YOUR_CATEGORY_ID
```

## Stay tuned...