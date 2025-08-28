---
title: 问题记录
date: 2025-08-27T06:30:55.910Z
updated: 2025-08-27T06:30:55.910Z
featured: false
summary: "日常问题记录"
keywords: ["issue", "exception"]
---

## 一、使用Slf4j并配置了logback.xml，控制台仍然不打印日志
idea环境变量(Environment Variables), 添加：`LOG_CONSOLE_ENABLED=true`
## 二、Ignite执行Insert into语句报错：Failed to prepare update plan
表中没有primary key，或者ignite.xml没有配置keyFieldName，导致primary key不是表中的字段，是_key: `<property name="keyFieldName" value="batchId"/>`
