import Fuse from 'fuse.js'
import { allBlogs } from 'content-collections'

export interface SearchResult {
  item: {
    title: string
    slug: string
    date: string
    summary?: string
    keywords?: string[]
    content: string
    featured?: boolean
  }
  score?: number
  refIndex: number
}

// Create search index for blog posts
const createSearchIndex = () => {
  // Prepare data for search index
  const searchData = allBlogs.map(blog => ({
    title: blog.title,
    slug: blog.slug,
    date: blog.date,
    summary: blog.summary || '',
    keywords: blog.keywords || [],
    content: blog.content,
    featured: blog.featured || false,
    // Create searchable text combining all fields
    searchableText: `${blog.title} ${blog.summary || ''} ${(blog.keywords || []).join(' ')} ${blog.content}`.toLowerCase()
  }))

  // Configure Fuse.js options for optimal search
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'summary', weight: 0.3 },
      { name: 'keywords', weight: 0.2 },
      { name: 'searchableText', weight: 0.1 }
    ],
    threshold: 0.3, // Lower = more strict matching
    ignoreLocation: true,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    shouldSort: true,
    sortFn: (a: any, b: any) => {
      // Sort by score first, then by date (newer first)
      if (a.score === b.score) {
        return new Date(b.item.date).getTime() - new Date(a.item.date).getTime()
      }
      return a.score - b.score
    }
  }

  return new Fuse(searchData, fuseOptions)
}

// Initialize the search index
let searchIndex: Fuse<any> | null = null

export const getSearchIndex = () => {
  if (!searchIndex) {
    searchIndex = createSearchIndex()
  }
  return searchIndex
}

// Search function
export const searchPosts = (query: string): SearchResult[] => {
  if (!query.trim()) {
    return []
  }

  const fuse = getSearchIndex()
  const results = fuse.search(query)
  
  return results as SearchResult[]
}

// Get all posts for fallback when no search query
export const getAllPosts = () => {
  return allBlogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(blog => ({
      item: {
        title: blog.title,
        slug: blog.slug,
        date: blog.date,
        summary: blog.summary,
        keywords: blog.keywords,
        content: blog.content,
        featured: blog.featured
      },
      refIndex: 0
    }))
}

// Highlight search matches in text
export const highlightMatches = (text: string, query: string): string => {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">$1</mark>')
}

// Get excerpt around search matches
export const getSearchExcerpt = (content: string, query: string, maxLength: number = 150): string => {
  if (!query.trim()) {
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '')
  }

  const queryLower = query.toLowerCase()
  const contentLower = content.toLowerCase()
  const queryIndex = contentLower.indexOf(queryLower)

  if (queryIndex === -1) {
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '')
  }

  // Calculate excerpt start and end positions
  const start = Math.max(0, queryIndex - Math.floor(maxLength / 3))
  const end = Math.min(content.length, start + maxLength)
  
  let excerpt = content.slice(start, end)
  
  // Add ellipsis if needed
  if (start > 0) excerpt = '...' + excerpt
  if (end < content.length) excerpt = excerpt + '...'
  
  return excerpt
}
