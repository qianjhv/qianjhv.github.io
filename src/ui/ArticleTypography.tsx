type ArticleData = {
  title: string;
  date?: string;
  tags?: string[];
  showToc?: boolean;
  lastUpdated?: string;
};

export default function ArticleTypography(
	{data, children} : {data: ArticleData, children?: React.ReactNode;}
) {
	return (
		// <article className="prose dark:prose-invert max-w-[768px] mx-auto">
		<article className="mdx-typography-default dark:mdx-typography-dark max-w-[768px] mx-auto">
			<h1>{data.title}</h1>
			
			<div className="metadata">
				{data.date && (
					<time>
						{new Date(data.date).toLocaleDateString('zh-CN', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
				)}
				
				{data.tags && (
					<div className="flex gap-2">
						{data.tags.map((tag: string) => (
							<span 
								key={tag}
								className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full dark:text-blue-400 dark:bg-blue-900/30"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>

			{/* 目录区域（可选） */}
			{data.showToc && (
				<nav className="p-4 my-8 bg-gray-50 rounded-lg dark:bg-gray-800/50">
					<h2 className="text-lg font-semibold mb-2">目录</h2>
					{/* 目录内容 */}
				</nav>
			)}
			
			{/* 正文内容 */}
			{children}

			{/* 文章底部 */}
			<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
				<div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
					<span>最后更新: {data.lastUpdated || data.date}</span>
					<a href="#top" className="hover:text-gray-700 dark:hover:text-gray-300">
						返回顶部 ↑
					</a>
				</div>
			</div>
		</article>
	);
}