---
title: 理解RESTful
date: 2020-09-24 09:10:41
tags:
---

### 纠葛的问题：REST和RPC的对比？

思想上，概念上，使用范围 RPC和REST都完全不一样，本质上并不是同一类东西，只有部分功能重合。**REST和RPC在思想上存在差异的核心是：抽象目标不一样，也就是面向资源的编程思想和面向过程的编程思想之间的差异。**
REST：本质上不是一种协议，而是一种风格。

### 理解REST

REST 概念的提出来自于罗伊·菲尔丁（Roy Fielding）在 2000 年发表的博士论文：[《Architectural Styles and the Design of Network-based Sorftware Architectures》](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)。

REST全称为：**Representational State Transfer 即表征状态转移。**

### 为何常常使用HTTP搭配REST

**REST实际上是HTT(Hyper Text Transfer，超文本传输)的进一步抽象，就想是接口和实现类之间的关系。（即REST是接口，HTT是实现）**。

* Representation 表征 （对Resource的转换）：

  浏览器向客户端请求资源的HTML格式，那么返回的这个HTML我们就可以称之为：表征。也可以理解为MVC模式中的：表示层。

* State 状态：

  特定语境中产生的上下文信息称之为“状态”。注意Stateful 和 Stateless是针对的服务端没有记录上下文。浏览器每次携带上下文来请求服务端，比如：JWT技术

* Transfer 转移:

  服务端通过浏览器提供的信息，由当前的表示层转移到新的标识层，这就被成为：表征状态转移。

### 如何评价一个系统是否符合RESTful ？



### 参考链接

周志明的软件架构课：https://time.geekbang.org/column/article/317164

李锟谈 Fielding 博士 REST 论文中文版发布：https://www.infoq.cn/article/2007/07/dlee-fielding-rest/

Fielding论文：https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
