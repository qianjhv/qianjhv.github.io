import type { Metadata } from 'next';

import "@/styles/globals.scss";
import "katex/dist/katex.min.css";

import { ThemesProviders } from "@/lib/ThemeProviders";
import { PageMotion } from "@/lib/PageMotion";

export const metadata: Metadata = {
  title: 'qianjh.me',
  description: 'personal nextjs blog',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <meta name="theme-color" />
      </head>
      <body>
        <ThemesProviders>
          <PageMotion>
            {children}
          </PageMotion>
        </ThemesProviders>
      </body>
    </html>
  );
}