import "@/styles/globals.scss";
import "katex/dist/katex.min.css";

import { Providers } from "@/lib/ThemeProviders";

export const metadata = {
  title: 'qianjh.me',
  description: 'Personal website',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
