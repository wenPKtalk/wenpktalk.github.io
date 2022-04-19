---
title: 2.Netty中是如何优化内存的
date: 2021-05-16 22:11:11
tags: Netty
categories: Netty
---

Netty减少内存使用技巧：

1. 能使用基本类型就不使用包装类型

2. 减少对象本身大小 -> 应该定义成类变量的不要定义为实例变量

3. Zero-copy

4. Netty内存池使用

   * 内存池/非内存池的默认选择及切换方式

     io.netty.channel.defaultChannelConfig#allocator

   * 内存池实现 io.netty.buffer.pooledDirectByteBuf

   * 对外内存/堆内内存的默认选择及切换方式

   * 对外内存的分配本质
