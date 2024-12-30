import "@/styles/globals.scss";
import "katex/dist/katex.min.css";

import { ThemesProviders } from "@/lib/ThemeProviders";

export const metadata = {
  title: 'qianjh.me',
  description: 'personal nextjs blog',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemesProviders>
          {children}
        </ThemesProviders>
      </body>
    </html>
  );
}