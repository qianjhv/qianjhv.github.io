import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from "rehype-pretty-code";
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeMinifyCssStyle from 'rehype-minify-css-style';

import { useMDXComponents } from 'mdx-components';
import Giscus from '@/lib/Giscus';

const MyComponents = () => {
  const components = useMDXComponents({});
  return components;
};

type PageProps = {
  params: Promise<{
    slug: string[]
  }>,
}

type MetadataProps = {
  params: Promise<{
    slug: string[]
  }>
}

export const dynamicParams = false;

export default async function BlogPost({ params }: PageProps) {

  const possibleExtensions = ['.mdx', '.md'];
  let filePath = '';
  const resolvedParams = await params;
  const slugArray = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug];
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
    components: MyComponents(),
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
        rehypeMinifyCssStyle,
        rehypeMinifyWhitespace, 
      ]},
    },
  });

  return (
    <div className='mdx-typography-default dark:mdx-typography-dark max-w-[768px] mx-auto px-2'>
      {compiledContent}
      <div className="my-16">
        <Giscus />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: MetadataProps) {
  const possibleExtensions = ['.mdx', '.md'];
  let filePath = '';
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
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
