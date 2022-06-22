---
title: 理解I/O模型
date: 2022-06-16 08:31:38
tags: network
categories: network
---

> IO，英文全称是Input/Output，翻译过来就是**输入/输出**。平时我们听得挺多，就是什么磁盘IO，网络IO。那IO到底是什么呢？

### 从计算机结构定义I/O

冯诺依曼结构将计算机分为5个部分：运算器，控制器，存储器，输入设备，输出设备

<img src="https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpznQic9871SM0Xlk5W1Kv5iaz3qr3GNYZzLKICjicyib6Gw4fyK2K3jJFcNQbehsv3O8PbCpAaicJic4m8Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom:33%;" />

从计算机架构中看I/O就是：**涉及计算机核心与其他设备间数据迁移的过程，就是IO。就是从磁盘读取数据到内存，这算一次输入，对应的，将内存中的数据写入磁盘，就算输出。这就是IO的本质**。

### 从操作系统定义I/O

#### 分清用户空间和内核空间

内核空间是操作系统内核访问的区域，是受保护的空间，而用户空间是应用程序访问的内存区域

#### 真正执行IO的是在内核空间

我们应用程序是跑在用户空间的，它不存在实质的IO过程，真正的IO是在**操作系统**执行的。即应用程序的IO操作分为两种动作：**IO调用和IO执行**。IO调用是由进程（应用程序的运行态）发起，而IO执行是**操作系统内核**的工作。此时所说的IO是应用程序对操作系统IO功能的一次触发，即IO调用。

#### 操作系统的一次IO过程

1. IO调用：应用程序进程向操作系统**内核**发起调用。

2. IO执行：操作系统完成IO操作

   操作系统完成IO操作还包括两个步骤

   1. 准备数据阶段：内核等待I/O设备准备好数据

   2. 拷贝数据阶段：将数据从内核缓冲区拷贝到用户进程缓冲区

      <img src="https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpznQic9871SM0Xlk5W1Kv5iazT9kWYbt1L2xibUrVOW05JFOsoDYrzNxB7eziasmxzsMBbbQakMLJOvKw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom:33%;" />

其实IO就是把进程的内部数据转移到外部设备，或者把外部设备的数据迁移到进程内部。外部设备一般指硬盘、socket通讯的网卡。一个完整的**IO过程**包括以下几个步骤：

- 应用程序进程向操作系统发起**IO调用请求**
- 操作系统**准备数据**，把IO外部设备的数据，加载到**内核缓冲区**
- 操作系统拷贝数据，即将内核缓冲区的数据，拷贝到用户进程缓冲区

### 阻塞I/O

> 应用程序的进程发起**IO调用**，但是如果**内核的数据还没准备好**的话，那应用程序进程就一直在**阻塞等待**，一直等到内核数据准备好了，从内核拷贝到用户空间，才返回成功提示，此次IO操作，称之为**阻塞IO**。

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220622/09_30/640-20220622093037469.png" alt="Image" style="zoom:33%;" />

* 阻塞I/O典型：阻塞socket，java BIO
* 缺点：如果内核数据一直没准备好，那用户进程将一直阻塞，**浪费性能**，可以使用**非阻塞IO**优化。

I/O多路复用是一种同步I/O模型，实现一个线程可以监视多个FD（文件句柄）；一旦某个文件句柄就绪，就能够通知应用程序进行相应的读写操作。没有文件句柄就绪时会阻塞应用程序，交出CPU。**多路指的是网络链接，复用指的是同一个线程（进程）**

[参考连接](https://zhuanlan.zhihu.com/p/150972878)

### I/O 模型

<img src="https://pic1.zhimg.com/v2-17f3abff4e49a2214f10f3815d91e15e_1440w.jpg?source=172ae18b" alt="彻底理解 IO多路复用" style="zoom: 67%;" />

