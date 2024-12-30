import "@/styles/globals.scss";
import "katex/dist/katex.min.css";

export const metadata = {
  title: 'qianjh.me',
  description: 'personal nextjs blog',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}