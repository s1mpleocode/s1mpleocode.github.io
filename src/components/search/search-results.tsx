"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { formatDate, getWordCount, getReadingTime } from "@/lib/utils"
import { highlightMatches, getSearchExcerpt, type SearchResult } from "@/lib/search"
import { cn } from "@/lib/utils"

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isSearching: boolean
  className?: string
  onArticleClick?: () => void
}

export function SearchResults({ 
  results, 
  query, 
  isSearching,
  className,
  onArticleClick
}: SearchResultsProps) {
  const router = useRouter()

  const handleArticleClick = (slug: string) => {
    // First close the modal
    if (onArticleClick) {
      onArticleClick()
    }
    // Then navigate after a brief delay to ensure modal closes
    setTimeout(() => {
      router.push(`/blog/${slug}`)
    }, 100)
  }
  if (isSearching) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Loading skeleton - consistent height */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="space-y-3 pb-6 border-b border-border last:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-5 bg-muted rounded-full w-12 flex-shrink-0"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="h-6 bg-muted/50 rounded p-3">
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-5 bg-muted rounded-full w-16"></div>
                <div className="h-5 bg-muted rounded-full w-16"></div>
                <div className="h-5 bg-muted rounded-full w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (query && results.length === 0) {
    return (
      <div className={cn("text-center py-20", className)}>
        <div className="text-muted-foreground space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <div>
            <p className="text-lg mb-2">未找到相关文章</p>
            <p className="text-sm">尝试使用其他关键词搜索</p>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search results count */}
      {query && (
        <div className="text-sm text-muted-foreground">
          找到 <span className="font-medium text-foreground">{results.length}</span> 篇相关文章
        </div>
      )}

      {/* Search results */}
      <div className="space-y-6">
        {results.map((result, index) => {
          const blog = result.item
          const excerpt = getSearchExcerpt(blog.content, query, 200)
          
          return (
            <article 
              key={`${blog.slug}-${index}`} 
              className="group border-b border-border pb-6 last:border-b-0"
            >
              <button
                onClick={() => handleArticleClick(blog.slug)}
                className="w-full text-left cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Title with highlight */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 
                      className="text-xl font-semibold group-hover:text-foreground/80 transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatches(blog.title, query)
                      }}
                    />
                    {blog.featured && (
                      <span className="flex-shrink-0 inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                        精选
                      </span>
                    )}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatDate(blog.date)}</span>
                    <span>·</span>
                    <span>{getWordCount(blog.content)} 字</span>
                    <span>·</span>
                    <span>{getReadingTime(blog.content)}</span>
                    {result.score && (
                      <>
                        <span>·</span>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          匹配度: {Math.round((1 - result.score) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Summary or excerpt with highlights */}
                  <div className="space-y-2">
                    {blog.summary && (
                      <p 
                        className="text-muted-foreground line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(blog.summary, query)
                        }}
                      />
                    )}
                    
                    {/* Content excerpt for search results */}
                    {query && excerpt && (
                      <p 
                        className="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed bg-muted/30 p-3 rounded-md"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(excerpt, query)
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Keywords with highlights */}
                  {blog.keywords && blog.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.keywords.slice(0, 5).map((keyword: string) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                          dangerouslySetInnerHTML={{
                            __html: `#${highlightMatches(keyword, query)}`
                          }}
                        />
                      ))}
                      {blog.keywords.length > 5 && (
                        <span className="text-xs text-muted-foreground">
                          +{blog.keywords.length - 5} 个标签
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
