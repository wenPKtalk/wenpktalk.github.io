---
title: 1.Netty 中的粘包和半包
date: 2021-05-12 22:00:44
tags: Netty
categories: Netty
---

### 粘包原因

* 发送方每次写入数据 < 套接字缓冲区大小
* 接受方读取套接字缓冲区数据不够及时

### 半包原因

* 发送方每次写入数据 > 套接字缓冲区大小
* 发送方的数据大于协议的MTU（Maximum Transmission Unit 最大传输单元）必须拆包

### 根本原因

**TCP是流式协议，消息无边际**

udp像邮寄包裹，虽然是一次运输多个，但是每个包裹都有“界限”，一个一个签收，所以无粘包，拆包问题。

### 解决方式

1. 改成短链接：一次链接发送一个数据包
2. 封装成数据帧（fram）
   1. 固定长度---空间浪费
   2. 分割符---内容里出现分隔符时需要转义
   3. 固定长度字段存储内容长度信息---长度理论上有限制，需提前预知可能的最大长度，从而定义长度占用字节数  **推荐**
   4. 其它 如json里的{}

### netty解码方式

假设我们把解决粘包/半包的问题的常用三种解码器叫一次解码

* 固定长度  FixedLengthFrameDecoder  
* 分割符   DelimiterBasedFrameDecoder 
* 固定长度字段存内容长度信心 LengthFieldBasedFrameDecoder    LengthFieldPrepender

二次解码：将字节转换成为实际使用的对象
