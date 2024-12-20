import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function getNestedBlogPosts(dir: string): { slug: string; }[] {
  const fileNames = fs.readdirSync(dir);
  let posts: { slug: string; }[] = [];

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

      posts.push({ slug });
    }
  });

  return posts;
}

export default function Blog() {
  const blogLists = getNestedBlogPosts(path.join(process.cwd(), 'src/contents'));

  return (
    <div>
			<Link href='/'>Home</Link>
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