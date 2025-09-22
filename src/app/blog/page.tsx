import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';

import Image from 'next/image';

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
        .replace(/^\/posts\//, '');

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
  const blogLists: Post[] = getNestedBlogPosts(path.join(process.cwd(), 'posts/'));

  return (
    <>
      <aside className="flex items-center mb-20">
        <Image src="/android-chrome-512x512.png" alt="avatar" width={56} height={56} className="rounded-full inline-block h-14"/>
        <p className="ml-10 max-w-[300px]">
          Halo! welcome to my blog, find me on github: <a href="https://github.com/qianjhv">qianjhv</a>
          &nbsp;\ X: <a href="https://x.com/qianjhv">@qianjhv</a>
        </p>
      </aside>
      <ul>
        {blogLists.map((blog) => (
          <li key={blog.slug} className="text-3xl font-bold my-5">
            <Link href={`/blog/${blog.slug}`}>
              {blog.title || blog.slug}
            </Link>
            <p className="font-serif text-base text-gray-400 font-normal mt-2">
              <time>
                {
                  blog.date && new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              </time>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}