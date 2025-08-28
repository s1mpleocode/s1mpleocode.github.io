import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import Link from "next/link";
import { config } from "@/lib/config";
import { formatDate, getWordCount, getReadingTime } from "@/lib/utils";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  
  return {
    title: `标签: ${tag} | ${config.site.title}`,
    description: `查看标签 "${tag}" 下的所有文章 | ${config.site.title}`,
    keywords: `${config.site.title}, 标签, ${tag}, ${config.site.title} ${tag}`,
  };
}

export async function generateStaticParams() {
  const tags = new Set<string>();
  
  allBlogs.forEach((blog) => {
    if (blog.keywords && blog.keywords.length > 0) {
      blog.keywords.forEach((keyword) => {
        tags.add(keyword);
      });
    }
  });

  return Array.from(tags).map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export default function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  
  // 找到包含该标签的所有文章
  const taggedBlogs = allBlogs
    .filter((blog) => blog.keywords && blog.keywords.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (taggedBlogs.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/tags"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <span>←</span>
          <span>返回标签列表</span>
        </Link>
        
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="text-gray-400">#</span>
          {tag}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          共 {taggedBlogs.length} 篇文章
        </p>
      </div>

      <div className="space-y-8">
        {taggedBlogs.map((blog) => (
          <article 
            key={blog.slug} 
            className="group border-b border-gray-100 dark:border-gray-800 pb-8 last:border-b-0"
          >
            <Link href={`/blog/${blog.slug}`}>
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-2">
                    {blog.title}
                    {blog.featured && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                        精选
                      </span>
                    )}
                  </h2>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span>{formatDate(blog.date)}</span>
                  <span>·</span>
                  <span>{getWordCount(blog.content)} 字</span>
                  <span>·</span>
                  <span>{getReadingTime(blog.content)}</span>
                </div>
                
                {blog.summary && (
                  <p className="line-clamp-2 leading-relaxed">
                    {blog.summary}
                  </p>
                )}
                
                {blog.keywords && blog.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          keyword === tag
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
