import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 递归获取嵌套目录中的 MDX 文件路径和前置数据
function getNestedBlogPosts(dir: string): { slug: string; }[] {
  const fileNames = fs.readdirSync(dir);
  let posts: { slug: string; }[] = [];

  fileNames.forEach((fileName) => {
    const filePath = path.join(dir, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      posts = [...posts, ...getNestedBlogPosts(filePath)];
    } else if (fileName.endsWith('.mdx') || fileName .endsWith('.md')) {
      const fileContents = fs.readFileSync(filePath, 'utf-8');

      const slug = filePath
        .replace(process.cwd(), '') // 去掉根路径
        .replace(/\.(md|mdx)$/, '') // 去掉扩展名
        .replace(/^\/src\/contents\//, ''); // 去掉内容根目录

      posts.push({ slug });
    }
  });

  return posts;
}

export default function Blog() {
  const blogLists = getNestedBlogPosts(path.join(process.cwd(), 'src/contents'));

  return (
    <div>
      <h1>Blog Lists</h1>
      <ul>
        {blogLists.map((blog) => (
          <li key={blog.slug}>
            <Link href={`/blog/${blog.slug}`}>
              {blog.slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
