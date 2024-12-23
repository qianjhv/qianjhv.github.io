import path from 'path';
import Link from 'next/link';

import { getNestedBlogPosts } from '@/lib/slugs';

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
