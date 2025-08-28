import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
  {
    "url": "/",
    lastModified: new Date("2025-08-28T14:40:24.975Z"),
    "changeFrequency": "daily",
    "priority": 1
  },
  {
    "url": "/blog",
    lastModified: new Date("2025-08-28T14:40:24.976Z"),
    "changeFrequency": "daily",
    "priority": 0.9
  },
  {
    "url": "/blog/blogdeploy",
    lastModified: new Date("2025-08-27T02:25:07.337Z"),
    "changeFrequency": "weekly",
    "priority": 0.8
  },
  {
    "url": "/blog/intro",
    lastModified: new Date("2025-04-05T13:10:00.000Z"),
    "changeFrequency": "weekly",
    "priority": 0.8
  },
  {
    "url": "/blog/issuerecord",
    lastModified: new Date("2025-08-27T06:30:55.910Z"),
    "changeFrequency": "weekly",
    "priority": 0.8
  },
  {
    "url": "/blog/s1mple",
    lastModified: new Date("2025-08-27T02:22:42.393Z"),
    "changeFrequency": "weekly",
    "priority": 0.8
  }
]
}
