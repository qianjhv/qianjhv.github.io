import fs from 'fs';
import path from 'path';

import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';

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

  const mdxContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(mdxContent);
  
  const stats = fs.statSync(filePath);
  const lastModified = stats.mtime.toISOString();
  // console.log(lastModified);

  return (
    <MDXRemote source={content} />
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
