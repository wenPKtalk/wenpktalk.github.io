---
title: 深入理解JVM-Java虚拟机内存结构
date: 2020-05-11 09:09:01
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

  <img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220520/08_54/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3OTI0OTA1,size_16,color_FFFFFF,t_70.png" alt="Insert picture description here" style="zoom:50%;" />

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

* 
  线程创建入栈，线程结束出栈。

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
    * 字符串常量池存储的是string对象的直接引用，而不是直接存放的对象，是一张string table
  * 静态变量
    * 静态变量是有static修饰的变量，jdk7时从方法区迁移至堆中
  * 线程分配缓冲区（Thread Local Allocation Buffer）
    * 线程私有，但是不影响java堆的共性
    * 增加线程分配缓冲区是为了提升对象分配时的效率

### 方法区（Method Area）

方法区是所有线程共享的内存，在java8以前是放在JVM内存中的，由永久代实现，受JVM内存大小参数的限制，在java8中移除了永久代的内容，方法区由元空间(Meta Space)实现，并直接放到了本地内存中，不受JVM参数的限制（当然，如果物理内存被占满了，方法区也会报OOM），并且将原来放在方法区的字符串常量池和静态变量都转移到了Java堆中，方法区与其他区域不同的地方在于，方法区在编译期间和类加载完成后的内容有少许不同，不过总的来说分为这两部分：

* #### 类元信息

  * 类元信息在类编译期间放入方法区，里面放置了类的基本信息，包括类的版本、字段、方法、接口以及常量池表（Constant Pool Table）
  * 常量池表（Constant Pool Table）存储了类在编译期间生成的字面量、符号引用(什么是字面量？什么是符号引用？)，这些信息在类加载完后会被解析到运行时常量池中

* #### 运行时常量池（Runtime Constant Pool）

  * 运行时常量池主要存放在类加载后被解析的字面量与符号引用，但不止这些
  * 运行时常量池具备动态性，可以添加数据，比较多的使用就是String类的intern()方法

### 直接内存

在jdk1.4中加入了NIO（New Input/Putput）类，引入了一种基于通道（channel）与缓冲区（buffer）的新IO方式，它可以使用native函数直接分配堆外内存，然后通过存储在java堆中的DirectByteBuffer对象作为这块内存的引用进行操作，这样可以在一些场景下大大提高IO性能，避免了在java堆和native堆来回复制数据。

### FAQ

#### 类常量池、运行时常量池、字符串常量池有什么关系？有什么区别？

类常量池与运行时常量池都存储在方法区，而字符串常量池在jdk7时就已经从方法区迁移到了java堆中。

在类编译过程中，会把类元信息放到方法区，类元信息的其中一部分便是类常量池，主要存放字面量和符号引用，而字面量的一部分便是文本字符，在类加载时将字面量和符号引用解析为直接引用存储在运行时常量池；对于文本字符来说，它们会在解析时查找字符串常量池，查出这个文本字符对应的字符串对象的直接引用，将直接引用存储在运行时常量池；字符串常量池存储的是字符串对象的引用，而不是字符串本身。

