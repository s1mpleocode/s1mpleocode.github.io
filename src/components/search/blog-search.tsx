"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { searchPosts, getAllPosts } from "@/lib/search"
import { SearchInput } from "./search-input"
import { SearchResults } from "./search-results"
import { cn } from "@/lib/utils"

interface BlogSearchProps {
  className?: string
  placeholder?: string
  autoFocus?: boolean
  isModal?: boolean
  onArticleClick?: () => void
}

export function BlogSearch({ 
  className,
  placeholder = "搜索文章...",
  autoFocus = false,
  isModal = false,
  onArticleClick
}: BlogSearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 300) // 300ms debounce

  // Get search results or all posts
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return getAllPosts()
    }
    return searchPosts(debouncedQuery)
  }, [debouncedQuery])

  // Handle search loading state
  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true)
    } else {
      setIsSearching(false)
    }
  }, [query, debouncedQuery])

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  const handleClearSearch = useCallback(() => {
    setQuery("")
  }, [])

  if (isModal) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        {/* Search Input - Fixed at top */}
        <div className="flex-shrink-0 mb-4">
          <SearchInput
            value={query}
            onChange={handleQueryChange}
            onClear={handleClearSearch}
            placeholder={placeholder}
            autoFocus={autoFocus}
          />
          
          {/* Search stats */}
          {query && !isSearching && (
            <div className="mt-2 text-xs text-muted-foreground">
              搜索 &ldquo;{query}&rdquo; • 找到 {results.length} 个结果
            </div>
          )}
        </div>

        {/* Search Results - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <SearchResults
            results={results}
            query={debouncedQuery}
            isSearching={isSearching}
            className="pb-4 pr-2"
            onArticleClick={onArticleClick}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search Input */}
      <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-sm p-4 -mx-4 rounded-lg">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          onClear={handleClearSearch}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        
        {/* Search stats */}
        {query && !isSearching && (
          <div className="mt-2 text-xs text-muted-foreground">
            搜索 &ldquo;{query}&rdquo; • 找到 {results.length} 个结果
          </div>
        )}
      </div>

      {/* Search Results */}
      <SearchResults
        results={results}
        query={debouncedQuery}
        isSearching={isSearching}
        onArticleClick={onArticleClick}
      />
    </div>
  )
}
