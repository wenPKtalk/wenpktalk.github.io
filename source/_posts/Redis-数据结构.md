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

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230516/10_36/8219f7yy651e566d47cc9f661b399f01.jpg" alt="img" style="zoom: 25%;" />

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

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230516/10_40/8ac4cc6cf94968a502161f85d072e428.jpg" alt="img" style="zoom: 33%;" />

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

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230516/10_37/73fb212d0b0928d96a0d7d6ayy76da0c.jpg" alt="img" style="zoom:33%;" />

### 压缩列表

压缩列表类似于一个数组，数组中的每一个元素都对应保存着一个数据，和数组不同的是，压缩列表在表头有三个字段zlbytes(列表长度), zltail(列表尾偏移量) 和 zllen(列表entry个数)，zlend(列表结束)

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230516/10_37/9587e483f6ea82f560ff10484aaca4a0.jpg" alt="img" style="zoom:50%;" />

如果我们要查找定位第一个元素和最后一个元素，可以通过表头三个字段的长度直接定位，复杂度是 O(1)。

而查找其他元素时，就没有这么高效了，只能逐个查找，此时的复杂度就是 O(N) 了。

### 跳表

有序链表只能逐一查找元素，导致操作起来非常缓慢，于是就出现了跳表。具体来说，跳表在链表的基础上，**增加了多级索引，通过索引位置的几个跳转，实现数据的快速定位**。

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230516/10_37/1eca7135d38de2yy16681c2bbc4f3fb4.jpg" alt="img" style="zoom:33%;" />

1. 从第一个元素开始，每两个元素选一个出来作为索引。

2. 这些索引再通过指针指向原始的链表。例如，从前两个元素中抽取元素 1 作为一级索引，从第三、四个元素中抽取元素 11 作为一级索引。

3. 此时，我们只需要 4 次查找就能定位到元素 33 了。

   可以看到，这个查找过程就是在多级索引上跳来跳去，最后定位到元素。这也正好符合“跳”表的叫法。当数据量很大时，跳表的查找复杂度就是 O(logN)。

### 数据结构时间复杂度

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230516/10_37/fb7e3612ddee8a0ea49b7c40673a0cf0.jpg" alt="img" style="zoom:33%;" />

#### 操作复杂度

##### 1. 单元素操作

HGET、HSET 和 HDEL 是对哈希表做操作，所以它们的复杂度都是 O(1)；

Set 类型用哈希表作为底层数据结构时，它的 SADD、SREM、SRANDMEMBER 复杂度也是 O(1)。

集合类型支持同时对多个元素进行增删改查，例如 Hash 类型的 HMGET 和 HMSET，Set 类型的 SADD 也支持同时增加多个元素。此时，这些操作的复杂度，就是由单个元素操作复杂度和元素个数决定的。例如，HMSET 增加 M 个元素时，复杂度就从 O(1) 变成 O(M) 了。

##### 2. 范围操作

是指集合类型中的遍历操作，可以返回集合中的所有数据

Hash 类型的 HGETALL 和 Set 类型的 SMEMBERS，或者返回一个范围内的部分数据，List 类型的 LRANGE 和 ZSet 类型的 ZRANGE。这类操作的复杂度一般是 O(N)，比较耗时，我们应该尽量避免。

Redis 从 2.8 版本开始提供了 SCAN 系列操作（包括 HSCAN，SSCAN 和 ZSCAN），这类操作实现了渐进式遍历，每次只返回有限数量的数据。这样一来，相比于 HGETALL、SMEMBERS 这类操作来说，就避免了一次性返回所有元素而导致的 Redis 阻塞。

##### 3. 统计操作

集合类型对集合中所有元素个数的记录

LLEN 和 SCARD。这类操作复杂度只有 O(1)，这是因为当集合类型采用压缩列表、双向链表、整数数组这些数据结构时，这些结构中专门记录了元素的个数统计，因此可以高效地完成相关操作。

##### 4.例外

是指某些数据结构的特殊记录，例如压缩列表和双向链表都会记录表头和表尾的偏移量。

对于 List 类型的 LPOP、RPOP、LPUSH、RPUSH 这四个操作来说，它们是在列表的头尾增删元素，这就可以通过偏移量直接定位，所以它们的复杂度也只有 O(1)，可以实现快速操作。

### 总结

Redis 的底层数据结构，这既包括了 Redis 中用来保存每个键和值的全局哈希表结构，也包括了支持集合类型实现的双向链表、压缩列表、整数数组、哈希表和跳表这五大底层结构。

Redis 之所以能快速操作键值对，一方面是因为 O(1) 复杂度的哈希表被广泛使用，包括 String、Hash 和 Set，它们的操作复杂度基本由哈希表决定，另一方面，Sorted Set 也采用了 O(logN) 复杂度的跳表。

不过，集合类型的范围操作，因为要遍历底层数据结构，复杂度通常是 O(N)。这里，我的建议是：用其他命令来替代，例如可以用 SCAN 来代替，避免在 Redis 内部产生费时的全集合遍历操作。

当然，我们不能忘了复杂度较高的 List 类型，它的两种底层实现结构：双向链表和压缩列表的操作复杂度都是 O(N)。因此，我的建议是：因地制宜地使用 List 类型。例如，既然它的 POP/PUSH 效率很高，那么就将它主要用于 FIFO 队列场景，而不是作为一个可以随机读写的集合。

### 实际开发中Redis各个数据结构的应用场景

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20230115/16_39/image-20230115163957142.png" alt="image-20230115163957142" style="zoom: 25%;" />



### 引用

[《Redis核心技术与实战》](https://time.geekbang.org/column/article/268253)
