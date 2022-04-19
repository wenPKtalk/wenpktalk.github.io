---
title: 从Reactor模式认识Netty
date: 2021-05-12 21:52:10
tags: Netty
categories: [Netty]
---

### IO定义

BIO：Thread-Per-Connection

NIO：Reactor

AIO:   Proactor

###  I/O多路复用（技术术语：Reactor）：

1. 当多条连接共用一个阻塞对象后，进程只需要在一个阻塞对象上等待，而无需再轮训所有连接，常见的实现方式有select，epoll，kqueue等。
2. 当某条连接有新的数据可以处理时，操作系统会通知进程，进程从阻塞状态返回，开始进行业务处理。

> Reactor是一种开发模式，Reactor中文翻译为：反应堆。不是物理上的核反应堆，这儿代表的是：“事件反应”，可以理解为：“来一个事件我（Reactor）就有相应的反应”。Reactor也可以叫Dispatcher模式：

* Reactor的数量可以变化：可以是一个Reactor，也可以是多个Reactor

* 资源池的数量可以变化：可以是单线程，也可以是多线程

### 模式核心流程：

注册感兴趣的事件 -> 扫描是否有兴趣的事件发生 -> 事件发生后做出相应的处理

Reactor三种模式：

*  单线程（单Reactor单线程）
* 多线程（单Reactor多线程） 
* 主从多线程（多Reactor多线程）

|                         |                                                              |
| ----------------------- | ------------------------------------------------------------ |
| Reactor单线程模式       | EventLoopGroup eventGroup = new NioEventLoopGroup(1)<br />ServerBootstrap serverBootstrap = new ServerBootstrap();<br />serverBootstrap.group(eventGroup); |
| 非主从Reactor多线程模式 | EventLoopGroup eventGroup = new NioEventLoopGroup()<br />ServerBootstrap serverBootstrap = new ServerBootstrap();<br />serverBootstrap.group(eventGroup); |
| 主从Reactor多线程模式   | EventLoopGroup bossGroup = new NioEventLoopGroup()<br />EventLoopGroup workerGroup = new NioEventLoopGroup()<br />ServerBootstrap serverBootstrap = new ServerBootstrap();<br />serverBootstrap.group(bossGroup, workerGroup); |
