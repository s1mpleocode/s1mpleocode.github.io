#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    title: null,
    featured: false,
    summary: '',
    keywords: []
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--featured' || arg === '-f') {
      options.featured = true;
    } else if (arg === '--summary' || arg === '-s') {
      options.summary = args[++i] || '';
    } else if (arg === '--keywords' || arg === '-k') {
      const keywordsStr = args[++i] || '';
      options.keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k);
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    } else if (!options.title) {
      options.title = arg;
    }
  }

  return options;
}

function showHelp() {
  console.log('📝 Next.js 博客文章创建工具');
  console.log('');
  console.log('用法:');
  console.log('  npm run new-post "文章标题" [选项]');
  console.log('  node scripts/new-post.js "文章标题" [选项]');
  console.log('');
  console.log('选项:');
  console.log('  -f, --featured       将文章设置为精选文章');
  console.log('  -s, --summary TEXT   设置文章摘要');
  console.log('  -k, --keywords LIST  设置关键词（用逗号分隔）');
  console.log('  -h, --help           显示帮助信息');
  console.log('');
  console.log('示例:');
  console.log('  npm run new-post "我的第一篇文章"');
  console.log('  npm run new-post "重要文章" --featured --summary "这是一篇重要文章" --keywords "技术,编程,Next.js"');
}

const options = parseArgs();

if (!options.title) {
  console.error('❌ 请提供文章标题');
  showHelp();
  process.exit(1);
}

// 生成文件名（将标题转换为 URL 友好的格式）
function generateSlug(title) {
  // 中文字符转拼音的映射表（常用词汇）
  const chineseMap = {
    // 常用词汇
    '测试': 'test',
    '文章': 'article', 
    '博客': 'blog',
    '技术': 'tech',
    '开发': 'dev',
    '前端': 'frontend',
    '后端': 'backend',
    '全栈': 'fullstack',
    '教程': 'tutorial',
    '指南': 'guide',
    '介绍': 'intro',
    '入门': 'getting-started',
    '实战': 'practice',
    '项目': 'project',
    '工具': 'tool',
    '配置': 'config',
    '部署': 'deploy',
    '优化': 'optimization',
    '性能': 'performance',
    '安全': 'security',
    '数据': 'data',
    '接口': 'api',
    '组件': 'component',
    '框架': 'framework',
    '问题': 'issue',
    '记录': 'record',
    '日志': 'log',
    '笔记': 'note',
    '总结': 'summary',
    '思考': 'thinking',
    '分享': 'share',
    '学习': 'learning',
    '经验': 'experience',
    '实现': 'implementation',
    '方案': 'solution',
    '设计': 'design',
    '架构': 'architecture',
    '系统': 'system',
    '应用': 'application',
    '代码': 'code',
    '编程': 'programming',
    '算法': 'algorithm',
    '数据结构': 'data-structure',
    '网络': 'network',
    '服务器': 'server',
    '客户端': 'client',
    '移动端': 'mobile',
    '响应式': 'responsive',
    '用户体验': 'ux',
    '用户界面': 'ui',
    // 常用单字
    '的': '',
    '和': 'and',
    '与': 'and',
    '或': 'or',
    '在': 'in',
    '用': 'use',
    '学': 'learn',
    '做': 'do',
    '是': 'is',
    '有': 'have',
    '新': 'new',
    '好': 'good',
    '大': 'big',
    '小': 'small',
    '上': 'up',
    '下': 'down',
    '左': 'left',
    '右': 'right'
  };

  // 先替换整个词汇
  let slug = title;
  Object.entries(chineseMap).forEach(([chinese, english]) => {
    if (chinese && english) {
      slug = slug.replace(new RegExp(chinese, 'g'), english);
    } else if (chinese && !english) {
      slug = slug.replace(new RegExp(chinese, 'g'), '');
    }
  });

  // 处理剩余的中文字符 - 移除或转换
  slug = slug
    .toLowerCase()
    .trim()
    // 移除剩余的中文字符
    .replace(/[\u4e00-\u9fff]/g, '')
    // 移除特殊符号，保留字母、数字、连字符和下划线
    .replace(/[^\w\s-]/g, '')
    // 将空格替换为连字符
    .replace(/\s+/g, '-')
    // 合并多个连字符
    .replace(/-+/g, '-')
    // 移除首尾的连字符
    .replace(/^-+|-+$/g, '');

  // 如果处理后为空或太短，使用基于时间的名称
  if (!slug || slug.length < 2) {
    const date = new Date();
    const dateStr = date.getFullYear() + 
      String(date.getMonth() + 1).padStart(2, '0') + 
      String(date.getDate()).padStart(2, '0');
    slug = `post-${dateStr}-${Date.now()}`;
  }

  return slug;
}

// 格式化日期为 ISO 格式
function formatDate(date) {
  return date.toISOString();
}

// 创建文章模板
function createPostTemplate(options) {
  const now = new Date();
  const dateString = formatDate(now);
  
  const keywordsArray = options.keywords.length > 0 
    ? `[${options.keywords.map(k => `"${k}"`).join(', ')}]`
    : '[]';
  
  return `---
title: ${options.title}
date: ${dateString}
updated: ${dateString}
featured: ${options.featured}
summary: "${options.summary}"
keywords: ${keywordsArray}
---

${options.summary ? options.summary : '在这里写你的文章内容...'}

## 小标题

文章正文内容。

## 另一个小标题

更多内容...

---

> 💡 **提示**: 记得更新文章的摘要和关键词以获得更好的 SEO 效果！
`;
}

async function createNewPost(options) {
  try {
    const slug = generateSlug(options.title);
    const blogDir = join(process.cwd(), 'src/content/blog');
    const fileName = `${slug}.md`;
    const filePath = join(blogDir, fileName);
    
    // 检查目录是否存在，不存在则创建
    if (!existsSync(blogDir)) {
      await mkdir(blogDir, { recursive: true });
    }
    
    // 检查文件是否已存在
    if (existsSync(filePath)) {
      console.error(`❌ 文件已存在: ${fileName}`);
      process.exit(1);
    }
    
    // 创建文章内容
    const content = createPostTemplate(options);
    
    // 写入文件
    await writeFile(filePath, content, 'utf-8');
    
    console.log('🎉 新文章创建成功!');
    console.log(`📁 文件路径: src/content/blog/${fileName}`);
    console.log(`📝 文章标题: ${options.title}`);
    console.log(`🔗 URL slug: ${slug}`);
    
    if (options.featured) {
      console.log('⭐ 精选文章: 是');
    }
    
    if (options.summary) {
      console.log(`📄 摘要: ${options.summary}`);
    }
    
    if (options.keywords.length > 0) {
      console.log(`🏷️ 关键词: ${options.keywords.join(', ')}`);
    }
    
    console.log('');
    console.log('💡 下一步:');
    console.log('1. 编辑文件并添加你的内容');
    console.log('2. 运行 "npm run dev" 启动开发服务器预览');
    console.log('3. 运行 "npm run generate-rss" 更新 RSS 订阅');
    
  } catch (error) {
    console.error('❌ 创建文章时出错:', error.message);
    process.exit(1);
  }
}

// 执行创建文章
createNewPost(options);
