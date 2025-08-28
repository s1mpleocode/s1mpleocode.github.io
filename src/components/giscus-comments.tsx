"use client"

import Giscus from '@giscus/react';
import { config } from '@/lib/config';
import { useMounted } from '@/hooks/use-mounted';
import { useTheme } from 'next-themes';

export default function GiscusComments() {
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();

  if (!mounted) {
    return <div className="h-8" />; // Placeholder to maintain layout
  }

  return (
    <Giscus
      id="comments"
      repo={config.giscus.repo as `${string}/${string}`}
      repoId={config.giscus.repoId}
      category="Announcements"
      categoryId={config.giscus.categoryId}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      lang="zh-CN"
      loading="lazy"
    />
  );
}
