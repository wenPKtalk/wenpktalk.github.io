---
title: 快速的Redis-数据结构
date: 2022-06-01 08:14:44
tags: Redis
categories: Redis 
---

> 众所周知redis作为内存数据库有个重要的特点 --- 快。除了因为是在内存中读写快之外，那就是它的查找很快，能够快速的定位到存储位置。能够快速找到的原因基于Redis的数据结构。

### 数据类型

以下是Redis中的基本类型，也就是数据的保存形式，而数据结构则是这些数据类型在底层的实现。

1. String
2. List
3. Hash
4. Set
5. Sorted Set

底层数据结构一种有6种，分别是：

1. 动态字符串
2. 双向链表
3. 压缩列表
4. 哈希表
5. 跳表
6. 整数数组

它们和数据类型的对应如下图：

<img src="https://static001.geekbang.org/resource/image/82/01/8219f7yy651e566d47cc9f661b399f01.jpg" alt="img" style="zoom: 25%;" />





