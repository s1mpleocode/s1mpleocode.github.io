export const config = {
  site: {
    title: "s1mple's blog",
    name: "s1mplecode",
    description: "s1mple code",
    keywords: ["s1mple", "AI", "Full Stack Developer"],
    url: "https://s1mplecode.com",
    baseUrl: "https://s1mplecode.com",
    image: "https://s1mplecode.com/og-image.png",
    favicon: {
      ico: "/favicon.ico",
      png: "/favicon.png",
      svg: "/favicon.svg",
      appleTouchIcon: "/favicon.png",
    },
    manifest: "/site.webmanifest",
    rss: {
      title: "s1mplecode",
      description: "Thoughts on Full-stack development, AI",
      feedLinks: {
        rss2: "/rss.xml",
        json: "/feed.json",
        atom: "/atom.xml",
      },
    },
  },
  author: {
    name: "Jago",
    email: "s1mplecode@yeah.net",
    bio: "简单代码",
  },
  social: {
    github: "https://github.com/s1mpleocode",
    // x: "https://x.com/xxx",
    // xiaohongshu: "https://www.xiaohongshu.com/user/profile/xxx",
    // wechat: "https://storage.xxx.com/images/wechat-official-account.png",
    // buyMeACoffee: "https://www.buymeacoffee.com/xxx",
  },
  giscus: {
    repo: "s1mpleocode/s1mpleocode.github.io",
    repoId: "R_kgDOPlhHlg",
    categoryId: "DIC_kwDOPlhHls4Cury0",
  },
  umami: {
    websiteId: "bbecf4df-2cfc-445c-886d-f436e80f0bef",
    src: "https://umami-fork-m4fxsl5ix-jagos-projects-b6c410b7.vercel.app/nextjs-blog",
    dashboardUrl: "https://umami-fork-m4fxsl5ix-jagos-projects-b6c410b7.vercel.app/share/ASkJPLgNaSVLUZhx/www.s1mpleo.com",
  },
  navigation: {
    main: [
      { 
        title: "文章", 
        href: "/blog",
      },
      {
        title: "归档",
        href: "/archives",
      },
      {
        title: "标签",
        href: "/tags",
      },
      {
        title: "留言板",
        href: "/guestbook",
      },
      {
        title: "统计",
        href: "https://umami-fork-m4fxsl5ix-jagos-projects-b6c410b7.vercel.app/share/ASkJPLgNaSVLUZhx/www.s1mpleo.com",
      },
    ],
  },
  seo: {
    metadataBase: new URL("https://s1mpleo.com"),
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: "website" as const,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image" as const,
      creator: "@xxx",
    },
  },
};
