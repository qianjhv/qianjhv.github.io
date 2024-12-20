import createMDX from '@next/mdx';
// import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  // options: {
  //   remarkPlugins: [remarkGfm],
  //   rehypePlugins: [rehypeHighlight],
  // },
});

export default withMDX(nextConfig);