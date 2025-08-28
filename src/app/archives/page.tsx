import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import Link from "next/link";
import { config } from "@/lib/config";
import { 
  formatDate, 
  getReadingTime, 
  getWordCount, 
  groupPostsByYearAndMonth,
  formatMonthOnly
} from "@/lib/utils";

export const metadata: Metadata = {
  title: `Archive | ${config.site.title}`,
  description: `All articles from ${config.site.title} organized by month and year`,
  keywords: `${config.site.title}, archive, articles, blog posts, timeline`,
};

export default function ArchivePage() {
  const blogs = allBlogs.sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const groupedPosts = groupPostsByYearAndMonth(blogs);
  const totalPosts = blogs.length;
  const totalYears = Object.keys(groupedPosts).length;
  const totalMonths = Object.values(groupedPosts).reduce(
    (acc, yearData) => acc + Object.keys(yearData).length, 0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">文章归档</h1>
      </div>

      {/* Archive by Year and Month */}
      <div className="space-y-12">
        {Object.entries(groupedPosts).map(([year, monthsData]) => {
          const yearPostCount = Object.values(monthsData).reduce(
            (acc, posts) => acc + posts.length, 0
          );
          
          return (
            <div key={year} className="space-y-6">
              {/* Year Header */}
              <div className="flex items-center space-x-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{year}</h2>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full font-medium">
                  {yearPostCount} 篇文章
                </span>
              </div>

              {/* Months in this year */}
              <div className="space-y-8 ml-6">
                {Object.entries(monthsData).map(([yearMonth, posts]) => (
                  <div key={yearMonth} className="space-y-4">
                    {/* Month Header */}
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{formatMonthOnly(yearMonth)}</h3>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {posts.length} 篇
                      </span>
                    </div>

                    {/* Posts in this month */}
                    <div className="space-y-3">
                      {posts.map((blog: any) => (
                        <article 
                          key={blog.slug} 
                          className="group border-l-4 border-transparent hover:border-gray-400 dark:hover:border-gray-500 pl-4 py-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-lg"
                        >
                  <Link href={`/blog/${blog.slug}`} className="block">
                    <div className="space-y-2">
                      {/* Title and Featured Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-2">
                          {blog.title}
                          {blog.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                              精选
                            </span>
                          )}
                        </h3>
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <time dateTime={blog.date} className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(blog.date)}
                        </time>

                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {getWordCount(blog.content)} 字
                        </span>

                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getReadingTime(blog.content)}
                        </span>

                        {blog.updated && blog.updated !== blog.date && (
                          <span className="flex items-center text-orange-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Updated
                          </span>
                        )}
                      </div>


                    </div>
                  </Link>
                                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>

      {/* Stats Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">{totalPosts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-200">总文章数</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {blogs.reduce((acc, blog) => acc + getWordCount(blog.content), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-200">总字数</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {totalYears}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-200">创作年份</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-lg">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              {totalMonths}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-200">创作月份</div>
          </div>
        </div>
      </div>
    </div>
  );
}
