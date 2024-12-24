import fs from 'fs';
import path from 'path';

// 获取嵌套目录中的 MDX 文件路径
export function  getNestedMDXPaths(dir: string): { slug: string }[] {
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

// 递归获取嵌套目录中的 MDX 文件路径和前置数据
export function getNestedBlogPosts(dir: string): { slug: string; }[] {
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