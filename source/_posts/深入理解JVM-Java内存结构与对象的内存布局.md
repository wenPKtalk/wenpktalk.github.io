---
title: 深入理解JVM-Java内存结构与对象的内存布局
date: 2020-08-11 07:29:04
tags: JVM
categories: JVM
---

### Java执行流转图

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220511/07_38/0*aO7jvEaMLhADKTqa.png" alt="img"  />

### Java8内存布局

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220511/07_40/640.png" alt="Image" style="zoom: 67%;" />

### JVM内存与本地内存的区别

* #### JVM内存

  * 受JVM内存大小限制，当大小超过参数设置的大小就会报OOM

* #### 本地内存

  * 本地内存不受虚拟机内存参数限制，只受物理容量限制
  * 虽然不受参数限制，但是如果内存占用超过了物理内存大小，也会报OOM

### Java运行时数据区域

![Insert picture description here](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220511/09_02/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3OTI0OTA1,size_16,color_FFFFFF,t_70.png)

* #### 程序计数器(PC Registers)

  > JVM Program counter 当前线程所执行的字节码的行号指示器，通过改变计数器的值，来选取下一行需要执行的指令。每个线程都有自己的程序计数器。所以程序计数器的结构如下:

  <img src="https://img-blog.csdnimg.cn/20200918193834460.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3OTI0OTA1,size_16,color_FFFFFF,t_70#pic_center" alt="Insert picture description here" style="zoom:50%;" />

  - 程序计数器只占用很小的内存空间，所以可以被忽略。它也是存储最快的空间。
  - JVM规定每个线程都有自己的程序计数器，它的生命周期就是随着线程的执行周期。
  - 线程中任何时候都只有一个叫做当前方法。程序计数器里存储了当前线程正在执行的方法的指令地址。如果是本地方法正在执行则是undefined value。
  - 程序的分支，循环，跳转，异常处理都需要程序计数器控制。
  - 当字节码解释器工作时，它通过改变这个计数器的值来选择下一条要执行的字节码指令。
  - 程序计数器是对物理寄存器的抽象。
  - 它是 Java 虚拟机规范中唯一没有指定任何 outOtMemoryError 条件的区域。 （没有 GC，OOM）
  - [参考原文](https://www.codetd.com/en/article/11818366)

* #### 虚拟机栈(JVM Stacks)

  > 虚拟机栈是线程私有的，随线程毁灭，结构示意图：

  <img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220511/09_29/640-20220511092947711.png" alt="Image" style="zoom:50%;" />

>  每个方法被执行的时候，都会在虚拟机栈中同步创建一个栈帧（stack frame）

 每个栈帧的包含: 局部变量表中存储着方法里的java基本数据类型, 局部变量表, 操作数栈, 动态连接, 方法返回地址

* 线程创建入栈，线程结束出栈。

虚拟机栈可能会抛出两种异常：

	- 如果线程请求的栈深度大于虚拟机所规定的栈深度，则会抛出StackOverFlowError即栈溢出
	- 如果虚拟机的栈容量可以动态扩展，那么当虚拟机栈申请不到内存时会抛出OutOfMemoryError即OOM内存溢出

- #### 本地方法栈

  - 线程私有执行native方法

- #### Java堆

  * 对象实例
    * 类初始化生成的对象
    * 基本类型的数组也是对象实例
  * 字符串常量池
    * 字符串常量池原本存放于方法区，jdk7开始放置于堆中

