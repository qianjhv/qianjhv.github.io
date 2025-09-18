'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';

import { ToggleThemes } from "@/lib/ThemeProviders";

export default function BlogLayout({ children }) {
  const pathname = usePathname();
  const href = pathname === '/blog' ? '/' : '/blog';
  const text = pathname === '/blog' ? 'Home' : 'Blog';

  return (
    <div className="max-w-[768px] mx-auto px-2">
      <header className="flex justify-between text-3xl font-bold my-8">
        <Link href={href} className="text-black dark:text-white">
          {text}  
        </Link>
        <ToggleThemes />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}