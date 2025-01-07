'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function Giscus() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || containerRef.current.hasChildNodes()) return;

    const script = document.createElement('script');
    const config = {
      src: 'https://giscus.app/client.js',
      'data-repo': process.env.NEXT_PUBLIC_GISCUS_REPO!,
      'data-repo-id': process.env.NEXT_PUBLIC_GISCUS_REPO_ID!,
      'data-category': process.env.NEXT_PUBLIC_GISCUS_CATEGORY!,
      'data-category-id': process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!,
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': resolvedTheme === 'dark' ? 'catppuccin_macchiato' : 'light',
      'data-lang': 'en',
      crossorigin: 'anonymous',
      async: 'true'
    };
    
    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // change giscus themes
  useEffect(() => {
    const updateTheme = () => {
      const iframe = document.querySelector<HTMLIFrameElement>('.giscus-frame');
      if (!iframe) return;

      iframe.contentWindow?.postMessage({
          giscus: {
            setConfig: {
              theme: resolvedTheme === 'dark' ? 'catppuccin_macchiato' : 'light',
            },
          },
        },
        'https://giscus.app'
      )};

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.classList.contains('giscus-frame')) {
            updateTheme();
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    updateTheme();

    return () => {
      observer.disconnect();
    };
  }, [resolvedTheme]);

  return <div ref={containerRef} />;
}