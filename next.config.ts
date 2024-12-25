import createMDX from '@next/mdx';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

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
  ],
  attributes: {
    ...defaultSchema.attributes,
    // KaTeX 相关属性
    '*': ['className', 'style'],  // KaTeX 需要这些属性
    span: ['class', 'style'],
    math: ['xmlns', 'display'],
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  sassOptions: {
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [rehypeSanitize, extendedSchema],
    ],
  },
});

export default withMDX(nextConfig);
