import Link from "next/link";
import { ToggleThemes } from "@/lib/ThemeProviders";

export default function BlogLayout({ children }) {
  return (
    <div className="max-w-[768px] mx-auto px-2">
      <header className="flex justify-between text-3xl font-bold my-8">
        <Link href="/blog" className="text-black dark:text-white">Blog</Link>
        <ToggleThemes />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}