import type { MDXComponents } from 'mdx/types';
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h2: ({ children }) => (
    //   <h2 style={{ color: 'red', fontSize: '48px' }}>{children}</h2>
    // ),
    ...components,
  };
}