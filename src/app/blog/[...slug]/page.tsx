import fs from 'fs';
import path from 'path';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote/rsc';
// import { serialize } from 'next-mdx-remote/serialize';

import matter from "gray-matter";

//
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

import { getNestedMDXPaths } from '@/lib/slugs';


// 如果想要在 MDX 文件中，使用其它组件，需要在此处导入，并将其传递给 MDXRemote 
// MDXRemote source={mdxContent} components={mdxComponents} />;

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

  console.log('content', content);

  const html = await unified()
  .use(remarkParse) // Step 1: Parse Markdown to AST
    .use(remarkRehype) // Step 2: Convert Markdown AST to HTML AST
    .use(rehypeSanitize) // Step 3: Sanitize the HTML
    .use(rehypeStringify) // Step 4: Convert HTML AST to HTML string
    .process(content); // Input Markdown content

  console.log(html);

  const stats = fs.statSync(filePath);
  const lastModified = stats.mtime.toISOString(); // 文件的最后修改时间

  // console.log(lastModified);

  return (
    <MDXRemote source={html} />
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

  return {
    title: data.title || slugArray.at(-1) || slugArray || 'Blog post', // 默认标题
    description: data.description || slugArray.at(-1) || slugArray || 'Blog post', // 默认描述
  };
}
