import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import count from 'word-count'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatDate(date: string) {
  const [year, month, day] = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).split('/');
  return `${year}年${month}月${day}日`;
}

export function formatDateArchive(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getReadingTime(content: string): string {
  const wordCount = count(content);
  // 中文阅读速度约 300-400 字/分钟，英文约 200-300 词/分钟
  // 这里用一个平均值处理中英文混合内容
  const wordsPerMinute = 350;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTimeMinutes} 分钟`;
}

export function getWordCount(content: string): number {
  return count(content);
}

export function getYearMonth(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  });
}

export function getYear(date: string): number {
  return new Date(date).getFullYear();
}

// 按年份分组文章
export function groupPostsByYear(posts: any[]) {
  const grouped = posts.reduce((acc, post) => {
    const year = getYear(post.date);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<number, any[]>);

  // 按年份排序（最新的在前）
  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .reduce((acc, year) => {
      acc[Number(year)] = grouped[Number(year)];
      return acc;
    }, {} as Record<number, any[]>);
}

// 按年月分组文章
export function groupPostsByMonth(posts: any[]) {
  const grouped = posts.reduce((acc, post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(post);
    return acc;
  }, {} as Record<string, any[]>);

  // 按年月排序（最新的在前）
  return Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .reduce((acc, yearMonth) => {
      acc[yearMonth] = grouped[yearMonth].sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return acc;
    }, {} as Record<string, any[]>);
}

// 按年份和月份层次化分组文章
export function groupPostsByYearAndMonth(posts: any[]) {
  const grouped = posts.reduce((acc, post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][yearMonth]) {
      acc[year][yearMonth] = [];
    }
    acc[year][yearMonth].push(post);
    return acc;
  }, {} as Record<number, Record<string, any[]>>);

  // 按年份排序（最新的在前）
  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return sortedYears.reduce((acc, year) => {
    // 按月份排序（最新的在前）
    const sortedMonths = Object.keys(grouped[year])
      .sort((a, b) => b.localeCompare(a))
      .reduce((monthAcc, yearMonth) => {
        monthAcc[yearMonth] = grouped[year][yearMonth].sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return monthAcc;
      }, {} as Record<string, any[]>);

    acc[year] = sortedMonths;
    return acc;
  }, {} as Record<number, Record<string, any[]>>);
}

// 格式化年月显示
export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  });
}

// 格式化年月显示（英文）
export function formatYearMonthEn(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}

// 只格式化月份显示
export function formatMonthOnly(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('zh-CN', {
    month: 'long'
  });
}
