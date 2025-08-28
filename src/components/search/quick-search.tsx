"use client"

import { useState, useCallback, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BlogSearch } from "./blog-search"

export function QuickSearch() {
  const [isOpen, setIsOpen] = useState(false)

  const openSearch = useCallback(() => {
    setIsOpen(true)
  }, [])



  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [openSearch])

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={openSearch}
        className="w-9 px-0 hover:bg-muted/50 transition-colors"
        title="搜索文章 (⌘K)"
      >
        <Search className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">搜索文章</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl h-[70vh] p-0 flex flex-col">
          <DialogHeader className="flex-shrink-0 p-6 pb-0">
            <DialogTitle>搜索文章</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex flex-col px-6 pb-6 min-h-0">
            <BlogSearch 
              autoFocus 
              placeholder="输入关键词搜索..." 
              isModal 
              onArticleClick={() => setIsOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
