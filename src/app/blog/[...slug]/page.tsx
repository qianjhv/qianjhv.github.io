import fs from 'fs';
import path from 'path';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote/rsc';
// import { serialize } from 'next-mdx-remote/serialize';

// 如果想要在 MDX 文件中，使用其它组件，需要在此处导入，并将其传递给 MDXRemote 
// MDXRemote source={mdxContent} components={mdxComponents} />;

// 强制所有动态路由参数在构建时被静态生成（SSG）
export const dynamicParams = false;

// 
export default async function BlogPost({ params }: { params: { slug: string | string[] } }) {
  const param = await params;
  const slugArray = Array.isArray(param.slug) ? param.slug : [param.slug]; // 处理 slug 为数组或字符串的情况
  const filePath = path.join(process.cwd(), 'src/contents', ...slugArray) + '.mdx';
  const mdxContent = fs.readFileSync(filePath, 'utf-8');
  // const source: MDXRemoteSerializeResult = await serialize(mdxContent);

  // console.log(mdxContent);
  // console.log(source);

  return (
    <MDXRemote source={mdxContent} />
  );
}

export async function generateStaticParams() {
  const directory = path.join(process.cwd(), 'src/contents');
  const nestedSlugs = getNestedMDXPaths(directory);
  
  // 将 slug 转换为数组（路径拆分）
  return nestedSlugs.map(({ slug }) => ({
    slug: slug.split('/'), // 将 'a/b/b' 转为 ['a', 'b', 'b']
  }));
}

// 获取嵌套目录中的 MDX 文件路径
function getNestedMDXPaths(dir: string): { slug: string }[] {
  const fileNames = fs.readdirSync(dir);
  let paths: { slug: string }[] = [];

  fileNames.forEach((fileName) => {
    const filePath = path.join(dir, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      paths = [...paths, ...getNestedMDXPaths(filePath)];
    } else if (filePath.endsWith('.mdx')) {
      const slug = filePath
        .replace(process.cwd(), '')
        .replace(/\.mdx$/, '')
        .replace(/^\/src\/contents\//, '');

      paths.push({ slug });
    }
  });

  return paths;
}

