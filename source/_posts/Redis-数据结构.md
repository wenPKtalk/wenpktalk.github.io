---
title: 快速的Redis-数据结构
date: 2022-06-01 08:14:44
tags: Redis
categories: Redis 
---

> 众所周知redis作为内存数据库有个重要的特点 --- 快。除了因为是在内存中读写快之外，那就是它的查找很快，能够快速的定位到存储位置。能够快速找到的原因基于Redis的数据结构。

### 数据类型

以下是Redis中的基本类型，也就是数据的保存形式，而数据结构则是这些数据类型在底层的实现。

1. String：简单动态字符串
2. List：双向链表，压缩列表
3. Hash：压缩列表，哈希表
4. Set：哈希表，整数数组
5. Sorted Set：压缩列表，跳表

<img src="https://static001.geekbang.org/resource/image/82/01/8219f7yy651e566d47cc9f661b399f01.jpg" alt="img" style="zoom: 25%;" />

String类型的底层结构只有一个**简单动态字符串**，而List，Hash，Set，Sorted Set都有两种底层实现结构。通常情况把这四种类型称为集合类型，特点是：**一个键对应了一个集合的数据。**

### 键和值用什么数据结构？

#### 全局哈希表

为了实现快速访问Redis实现了一个**全局哈希表**保存所有键值对。一个哈希表就是一个数组，数组的每个元素称之为**哈希桶**。每个哈希桶中保存了键值对数据。**哈希桶中的值不保存值本身，而是指向具体的指针。也就是说不管是String还是集合类型，哈希桶中的元素都是指向它们的指针。**

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220602/14_10/1cc8eaed5d1ca4e3cdbaa5a3d48dfb5f-20220602141007055.jpg" alt="img" style="zoom: 33%;" />



