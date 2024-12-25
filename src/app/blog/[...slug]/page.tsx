import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

import matter from "gray-matter";



//
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from "remark-gfm";
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


import { getNestedMDXPaths } from '@/lib/slugs';


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
  ],
  attributes: {
    ...defaultSchema.attributes,
    // KaTeX 相关属性
    '*': ['className', 'style'],  // KaTeX 需要这些属性
    span: ['class', 'style'],
    math: ['xmlns', 'display'],
  },
};

// 强制所有动态路由参数在构建时被静态生成（SSG）
export const dynamicParams = false;

// 
export default async function BlogPost({ params }: { params: { slug: string | string[] } }) {

  // 支持 .md 和 .mdx 文件
  const possibleExtensions = ['.mdx', '.md'];
  let filePath = '';

  const param = await params;
  const slugArray = Array.isArray(param.slug) ? param.slug : [param.slug]; // 处理 slug 为数组或字符串的情况
  for (const ext of possibleExtensions) {
    const potentialPath = path.join(process.cwd(), 'src/contents', ...slugArray) + ext;
    if (fs.existsSync(potentialPath)) {
      filePath = potentialPath;
      break;
    }
  }

  if (!filePath) {
    return { notFound: true }; // 如果文件不存在
  }

  const mdxContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(mdxContent);



   // 使用 compileMDX 而不是 unified
   const { content: compiledContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeKatex,
          [rehypeSanitize, extendedSchema],
          rehypeMinifyWhitespace
        ],
      },
    },
  });

  // console.log(lastModified);

  return (
    <main>
      {compiledContent}
    </main>
  );
}

//
export async function generateStaticParams() {
  const directory = path.join(process.cwd(), 'src/contents');
  const nestedSlugs = getNestedMDXPaths(directory);
  
  // 将 slug 转换为数组（路径拆分）
  return nestedSlugs.map(({ slug }) => ({
    slug: slug.split('/'), // 将 'a/b/b' 转为 ['a', 'b', 'b']
  }));
}

//
export async function generateMetadata({ params }: { params: { slug: string | string[] } }) {
  const possibleExtensions = ['.mdx', '.md'];
  let filePath = '';

  const param = await params;
  const slugArray = param.slug;
  for (const ext of possibleExtensions) {
    const potentialPath = path.join(process.cwd(), 'src/contents', ...slugArray) + ext;
    if (fs.existsSync(potentialPath)) {
      filePath = potentialPath;
      break;
    }
  }

  if (!filePath) {
    return {
      title: 'Not Found',
      description: 'The requested blog post does not exist.',
    }
  };

  const mdxContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(mdxContent);


  // const stats = fs.statSync(filePath);
  // const lastModified = stats.mtime.toISOString(); // 文件的最后修改时间

  return {
    title: data.title || slugArray.at(-1) || slugArray || 'Blog post', // 默认标题
    description: data.description || slugArray.at(-1) || slugArray || 'Blog post', // 默认描述
  };
}
