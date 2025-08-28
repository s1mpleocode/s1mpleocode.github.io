import { type Metadata } from "next";
import { allBlogs } from "content-collections";
import { config } from "@/lib/config";
import { BlogSearch } from "@/components/search/blog-search";

export const metadata: Metadata = {
  title: `Blogs | ${config.site.title}`,
  description: `Blogs of ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">所有文章</h1>
        <p className="mt-2 text-muted-foreground">共 {allBlogs.length} 篇文章</p>
      </div>
      
      <BlogSearch autoFocus />
    </div>
  );
}


