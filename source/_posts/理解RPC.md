---
title: 理解RPC
date: 2020-05-23 09:10:41
tags: [Architecture]
categories: [Architecture]
---

### 什么是RPC(Remote procedure call)

> Remote procedure call is the synchronous language-level transfer of control between programs in address spaces whose primary communication is a narrow channel.—— Bruce Jay Nelson，Remote Procedure Call，Xerox PARC，1981

RPC是一种语言级别的通讯协议，它允许运行于一台计算机上的程序以某种管道作为通讯媒介（即某种网络传输协议），去调用另外一个地址空间（通常为网络上的另外一台计算机）。

### 所有RPC协议都需要解决哪些问题？

基于 TCP/IP 网络的、支持 C 语言的 RPC 协议，后来也被称为是ONC RPC（Open Network Computing RPC/Sun RPC）。这两个RPC鼻祖。

1. 如何表示数据
2. 如何传递数据
3. 如何标识方法

#### 如何表示数据

将交互双方涉及的数据，转换为某种事先约定好的中立数据流格式来传输，将数据流转换回不同语言中对应的数据类型来使用，**即序列化与反序列化**

#### 如何传递数据

这里“传递数据”通常指的是应用层协议，实际传输一般是基于标准的 TCP、UDP 等传输层协议来完成的。

#### 如何标识方法

标识调用方法入口，能够找到这个方法。

### 已经实现的RPC框架

RPC 框架有明显朝着更高层次（不仅仅负责调用远程服务，还管理远程服务）与插件化方向发展的趋势，不再选择自己去解决表示数据、传递数据和表示方法这三个问题，而是将全部或者一部分问题设计为扩展点，实现核心能力的可配置，再辅以外围功能，如负载均衡、服务注册、可观察性等方面的支持。这一类框架的代表，有 Facebook 的 Thrift 和阿里的 Dubbo（现在两者都是 Apache 的）。尤其是断更多年后重启的 Dubbo 表现得更为明显，它默认有自己的传输协议（Dubbo 协议），同时也支持其他协议，它默认采用 Hessian 2 作为序列化器，如果你有 JSON 的需求，可以替换为 Fastjson；如果你对性能有更高的需求，可以替换为Kryo、FST、Protocol Buffers 等；如果你不想依赖其他包，直接使用 JDK 自带的序列化器也可以。这种设计，就在一定程度上缓解了 RPC 框架必须取舍，难以完美的缺憾。

RMI（Sun/Oracle）、Thrift（Facebook/Apache）、Dubbo（阿里巴巴 /Apache）、gRPC（Google）、Motan2（新浪）、Finagle（Twitter）、brpc（百度）、.NET Remoting（微软）、Arvo（Hadoop）、JSON-RPC 2.0（公开规范，JSON-RPC 工作组）
