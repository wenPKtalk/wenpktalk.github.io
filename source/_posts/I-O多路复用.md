---
title: I/O多路复用
date: 2022-06-16 08:31:38
tags: network
categories: network
---

> I/O多路复用是一种同步I/O模型，实现一个线程可以监视多个FD（文件句柄）；一旦某个文件句柄就绪，就能够通知应用程序进行相应的读写操作。没有文件句柄就绪时会阻塞应用程序，交出CPU。**多路指的是网络链接，复用指的是同一个线程（进程）**

[参考连接](https://zhuanlan.zhihu.com/p/150972878)

### I/O 模型

<img src="https://pic1.zhimg.com/v2-17f3abff4e49a2214f10f3815d91e15e_1440w.jpg?source=172ae18b" alt="彻底理解 IO多路复用" style="zoom: 67%;" />
