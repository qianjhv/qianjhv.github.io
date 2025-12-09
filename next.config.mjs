import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    mdxOptions: {
      remarkPlugins: ['remarkGfm', 'remarkMath'],
      rehypePlugins: ['rehypeKatex'],
    }
  },
});

export default withMDX(nextConfig);