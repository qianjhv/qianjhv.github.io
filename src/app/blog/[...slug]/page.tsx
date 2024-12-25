import fs from 'fs';
import path from 'path';

import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import matter from 'gray-matter';

const extendedSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'section',
    'sup',
    'math',
    'semantics',
    'mrow',
    'mi',
    'mn',
    'mo',
    'msup',
    'annotation',
    'span',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': ['className', 'style'],
    span: ['class', 'style'],
    math: ['xmlns', 'display'],
  },
};

export const dynamicParams = false;

export default async function BlogPost({ params }: { params: { slug: string | string[] } }) {

  const possibleExtensions = ['.mdx', '.md'];
  let filePath = '';

  const param = await params;
  const slugArray = Array.isArray(param.slug) ? param.slug : [param.slug];
  for (const ext of possibleExtensions) {
    const potentialPath = path.join(process.cwd(), 'src/contents', ...slugArray) + ext;
    if (fs.existsSync(potentialPath)) {
      filePath = potentialPath;
      break;
    }
  }

  if (!filePath) {
    return { notFound: true };
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content: mdxContent } = matter(fileContent);
  const { content: compiledContent } = await compileMDX({
    source: mdxContent,
    options: {
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

  return (
    <main>
      {compiledContent}
    </main>
  );
}

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
    title: data.title || slugArray.at(-1) || slugArray || 'Blog post',
    description: data.description || slugArray.at(-1) || slugArray || 'Blog post',
  };
}

export async function generateStaticParams() {
  const directory = path.join(process.cwd(), 'src/contents');
  const nestedSlugs = getNestedMDXPaths(directory);
  
  return nestedSlugs.map(({ slug }) => ({
    slug: slug.split('/'),
  }));
}

function getNestedMDXPaths(dir: string): { slug: string }[] {
  const fileNames = fs.readdirSync(dir);
  let paths: { slug: string }[] = [];

  fileNames.forEach((fileName) => {
    const filePath = path.join(dir, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      paths = [...paths, ...getNestedMDXPaths(filePath)];
    } else if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
      const slug = filePath
        .replace(process.cwd(), '')
        .replace(/\.(md|mdx)$/, '')
        .replace(/^\/src\/contents\//, '');

      paths.push({ slug });
    }
  });

  return paths;
}
