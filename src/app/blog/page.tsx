import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';

import Image from 'next/image';
import { ToggleThemes } from '@/lib/ThemeProviders';

interface Post {
  slug: string;
  title?: string;
  date?: string;
  author?: string;
}

function getNestedBlogPosts(dir: string): { slug: string; }[] {
  const fileNames = fs.readdirSync(dir);
  let posts: Post[] = [];

  fileNames.forEach((fileName) => {
    const filePath = path.join(dir, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      posts = [...posts, ...getNestedBlogPosts(filePath)];
    } else if (fileName.endsWith('.mdx') || fileName .endsWith('.md')) {

      const slug = filePath
        .replace(process.cwd(), '')
        .replace(/\.(md|mdx)$/, '')
        .replace(/^\/src\/contents\//, '');

      const mdxContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(mdxContent);

      posts.push({
        slug,
        title: data.title || '',
        date: data.date || '',
        author: data.author || '',
      });

    }
  });

  return posts;
}

export default function Blog() {
  const blogLists = getNestedBlogPosts(path.join(process.cwd(), 'src/contents'));

  return (
    <main className="max-w-[720px] mx-auto px-8">
      <header className="my-10">
        <div className="flex justify-between mb-8 text-3xl font-bold">
          <Link href="/" className="text-black">qianjh.me</Link>
          <ToggleThemes />
        </div>
        <div className="flex">
          <Image src="/android-chrome-512x512.png" alt="avatar" width={56} height={56} className="rounded-full inline-block"/>
          <span className="max-w-[300px] ml-10">
            Halo! welcome to my blog, find me on github: <a href="https://github.com/qianjhv">qianjhv</a> / X: <a href="https://x.com/qianjhv">@qianjhv</a>
          </span>
        </div>
      </header>
      <ul>
        {blogLists.map((blog) => (
          <li key={blog.slug} className="text-3xl font-bold">
            <Link href={`/blog/${blog.slug}`}>
              {blog.title || blog.slug}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}