import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import Link from "next/link";
import { config } from "@/lib/config";
import { formatDate, getWordCount, getReadingTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Blogs | ${config.site.title}`,
  description: `Blogs of ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

export default function BlogPage() {
  const blogs = allBlogs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">所有文章</h1>
        <p className="mt-2">共 {blogs.length} 篇文章</p>
      </div>
      
      <div className="space-y-8">
        {blogs.map((blog: any) => (
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
                    {blog.keywords.slice(0, 3).map((keyword: string) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full"
                      >
                        #{keyword}
                      </span>
                    ))}
                    {blog.keywords.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{blog.keywords.length - 3} more
                      </span>
                    )}
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


