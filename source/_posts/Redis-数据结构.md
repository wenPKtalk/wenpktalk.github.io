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



##### 优点：

时间复杂度为O(1)查找。

##### 缺点：

往Redis写入大量数据后，哈希表的冲突问题和rehash可能带来的阻塞。

#### 如何解决hash冲突 --- 链式hash

Redis解决hash冲突的方式，就是链式hash（跟Java中的HashMap一样）。**同一个哈希桶中的多个元素用一个链表保存，它们之间依使用指针连接**

<img src="https://static001.geekbang.org/resource/image/8a/28/8ac4cc6cf94968a502161f85d072e428.jpg" alt="img" style="zoom: 33%;" />

##### 缺点：

针对链表上的查找只能采用O(n)时间复杂度的依次查找。

#### 如何解决hash桶上链表只能依次查找慢的问题 --- rehash操作

Redis会对哈希会对哈希表做Rehash操作，rehash也就是**增加Hash桶数量**，让逐渐增多的entry元素能够在更多的桶之间分散保存。Redis默认使用了两个全局hash表：

1. 哈希表I  和哈希表II

2. 一开始插入数据默认使用哈希表I 此时的哈希表II并没有分配空间。

3. 随着数据的逐步增加Redis开始执行Rehash，分为以下三步：

   1. 给哈希表II 分配更大的空间，例如是哈希表I的二倍。
   2. 把哈希表I 中的数据重新映射并拷贝到哈希表II 中
   3. 释放哈希表I 的空间。

   ##### 缺点：

   第二步涉及大量的数据拷贝，如果一次性把哈希表 1 中的数据都迁移完，会造成 Redis 线程阻塞，

   

#### 如何避免Rehash过程中拷贝带来的线程阻塞 --- 渐进式 rehash

Redis 仍然正常处理客户端请求，每处理一个请求时，从哈希表 1 中的第一个索引位置开始，顺带着将这个索引位置上的所有 entries 拷贝到哈希表 2 中；等处理下一个请求时，再顺带拷贝哈希表 1 中的下一个索引位置的 entries。如下图所示：

<img src="https://static001.geekbang.org/resource/image/73/0c/73fb212d0b0928d96a0d7d6ayy76da0c.jpg" alt="img" style="zoom:33%;" />
