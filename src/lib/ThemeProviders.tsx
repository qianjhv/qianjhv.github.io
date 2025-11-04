'use client';

import { useEffect, useState } from 'react';

import { ThemeProvider, useTheme } from 'next-themes';

// 定义亮模式、暗模式和系统模式的图标
const lightIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2" />
    <path d="M12 21v2" />
    <path d="M4.22 4.22l1.42 1.42" />
    <path d="M19.78 4.22l-1.42 1.42" />
    <path d="M1 12h2" />
    <path d="M21 12h2" />
    <path d="M4.22 19.78l1.42-1.42" />
    <path d="M19.78 19.78l-1.42-1.42" />
  </svg>
);

const systemIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path d="M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0z" />
  </svg>
);

const darkIcon = (
  <svg width="30" height="30" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M7.50009 12.0008C7.49604 10.6271 7.87712 9.2798 8.60009 8.11177C9.30106 6.97733 10.3262 6.07929 11.5431 5.53377C12.7306 5.00425 14.0552 4.86422 15.3271 5.13377L15.5091 5.17577C14.7053 5.71232 14.0258 6.41473 13.5161 7.23577C12.7931 8.4038 12.412 9.7511 12.4161 11.1248C12.4068 12.9579 13.0921 14.7265 14.3341 16.0748C15.1848 16.9942 16.285 17.6458 17.5001 17.9498C16.4784 18.6323 15.2778 18.9979 14.0491 19.0008C12.2877 18.9902 10.6101 18.2475 9.41809 16.9508C8.17612 15.6025 7.49083 13.8339 7.50009 12.0008Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
);

export function ThemesProviders({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <ThemeColorSync />
      {children}
    </ThemeProvider>
  );
}

function ThemeColorSync() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;

    const effectiveTheme = theme === 'system' ? systemTheme : theme;

    const colors: Record<string, string> = {
      light: '#f0f0f0',
      dark: '#303446',
    };

    meta.setAttribute('content', colors[effectiveTheme ?? 'light'] || '#fafafa');
  }, [theme, systemTheme]);

  return null;
}

export const ToggleThemes = () => {
  const { theme, setTheme } = useTheme();
  const nextTheme =
    theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
  const currentIcon =
    theme === 'dark' ? darkIcon : theme === 'light' ? lightIcon : systemIcon;

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      title={`${nextTheme}`}
    >
      {currentIcon}
    </button>
  );
};
