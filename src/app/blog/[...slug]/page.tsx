import fs from 'fs';
import path from 'path';

import { MDXRemote, compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeMinifyAttributeWhitespace from 'rehype-minify-attribute-whitespace';
import rehypeMinifyCssStyle from 'rehype-minify-css-style';

import { getNestedMDXPaths } from '@/lib/slugs';

import ArticleTypography from '@/ui/ArticleTypography'; 

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

type ArticleData = {
  title: string;
  description?: string;
  tags?: string[];
  date?: string;
  showToc?: boolean;
  lastUpdated?: string;
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

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content: mdxContent } = matter(fileContent);

   // 使用 compileMDX 而不是 unified
   const { content: compiledContent } = await compileMDX({
    source: mdxContent,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          [rehypePrettyCode, {
            keepBackground: false,
            theme: {
              dark: "material-theme-darker",
              light: "material-theme-lighter"
            },
          }],
          rehypeKatex,
          [rehypeSanitize, extendedSchema],
          rehypeMinifyWhitespace,
          rehypeMinifyCssStyle,
          rehypeMinifyAttributeWhitespace,
        ],
      },
    },
  });

  const articleData: ArticleData = {
    title: data.title,
    description: data.description || "Default description",
    tags: data.tags || [],
    date: data.date || null,
    showToc: data.showToc || false,
    lastUpdated: data.lastUpdated || null,
  };

  return (
    <ArticleTypography data={articleData}>
      {compiledContent}
    </ArticleTypography>
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

  const stats = fs.statSync(filePath);
  const lastModified = stats.mtime.toISOString(); // 文件的最后修改时间

  const additionalMetadata = {
    date: data.date,
    lastUpdated: lastModified,
  };

  return {
    title: data.title || slugArray.at(-1) || slugArray || 'Blog post', // 默认标题
    description: data.description || slugArray.at(-1) || slugArray || 'Blog post', // 默认描述
    ...additionalMetadata
  };
}
