import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 获取所有博客文件的路径
function getBlogPosts() {
  const directory = path.join(process.cwd(), 'src/contents');
  const fileNames = fs.readdirSync(directory);

  const slugs = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''), // 移除 .mdx 扩展名
      title: fileName.replace(/\.mdx$/, ''), // 用文件名作为标题
    }));

  return slugs;
}

export default function Blog() {
  const blogPosts = getBlogPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
