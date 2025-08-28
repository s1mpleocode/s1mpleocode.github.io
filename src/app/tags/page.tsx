import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import Link from "next/link";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `标签 | ${config.site.title}`,
  description: `所有文章标签 | ${config.site.title}`,
  keywords: `${config.site.title}, 标签, tags, ${config.site.title} 标签`,
};

interface TagCount {
  name: string;
  count: number;
  posts: typeof allBlogs;
}

export default function TagsPage() {
  // 收集所有标签并计算数量
  const tagMap = new Map<string, { count: number; posts: typeof allBlogs }>();
  
  allBlogs.forEach((blog) => {
    if (blog.keywords && blog.keywords.length > 0) {
      blog.keywords.forEach((keyword) => {
        const current = tagMap.get(keyword) || { count: 0, posts: [] };
        current.count += 1;
        current.posts.push(blog);
        tagMap.set(keyword, current);
      });
    }
  });

  // 转换为数组并按文章数量排序
  const tags: TagCount[] = Array.from(tagMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    posts: data.posts
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">标签</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          共 {tags.length} 个标签，{allBlogs.length} 篇文章
        </p>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">暂无标签</p>
        </div>
      ) : (
        <>
          {/* 标签云 */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">标签云</h2>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => {
                // 根据文章数量计算字体大小
                const fontSize = Math.min(Math.max(tag.count / Math.max(...tags.map(t => t.count)), 0.5), 1);
                const sizeClass = fontSize > 0.8 ? 'text-2xl' : fontSize > 0.6 ? 'text-xl' : fontSize > 0.4 ? 'text-lg' : 'text-base';
                
                return (
                  <Link
                    key={tag.name}
                    href={`/tags/${encodeURIComponent(tag.name)}`}
                    className={`${sizeClass} font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
                    style={{ opacity: 0.6 + fontSize * 0.4 }}
                  >
                    #{tag.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 标签列表 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">所有标签</h2>
            <div className="space-y-3">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium">#{tag.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tag.count} 篇文章
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
