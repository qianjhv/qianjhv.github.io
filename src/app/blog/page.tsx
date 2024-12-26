import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

interface PostMetadata {
  title: string
  date: string
  slug: string
  tags?: string[]
  description?: string
}

function getMDXFiles(dir: string): PostMetadata[] {
  const files = fs.readdirSync(dir, { recursive: true })
  const posts: PostMetadata[] = []
  
  files.forEach((file) => {
    if (typeof file === 'string' && (file.endsWith('.mdx') || file.endsWith('.md'))) {
      const filePath = path.join(dir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(content)
      const slug = file.replace(/\.(mdx|md)$/, '')
      
      posts.push({
        title: data.title || slug,
        date: data.date || '',
        slug: slug,
        tags: data.tags || [],
        description: data.description || ''
      })
    }
  })
  
  // 按日期排序，最新的在前
  return posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export default function MDXList() {
  const posts = getMDXFiles(path.join(process.cwd(), 'src/contents'))

  return (
    <div className="">
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link 
              href={`/blog/${post.slug}`}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {post.title}
              </h2>
              
              {post.date && (
                <time className="text-sm text-gray-500 mt-2 block">
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              
              {post.description && (
                <p className="mt-3 text-gray-600 line-clamp-2">
                  {post.description}
                </p>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}