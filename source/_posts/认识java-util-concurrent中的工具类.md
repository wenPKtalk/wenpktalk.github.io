---
title: 认识java.util.concurrent中的工具类
date: 2019-03-13 21:00:17
tags: Concurrency
categories: Concurrency
---

### 一. 同步结构

提供了比synchronized更加高级的同步结构：countDownLatch、CyclicBarrier、Semaphore等，可以实现更加丰富的多线程操作。

1. Semaphore：作为资源控制器限制同时进行工作的线程数量，java版本的信号量实现。

   [通过Semaphore实现车站调度demo](https://github.com/wenPKtalk/mutithread/blob/master/src/main/java/current_demo/AbnormalSemaphoreSample.java)

2. CountDownLatch：允许一个或者多个线程等待某些操作完成。

3. CyclicBarrier：一种辅助性的同步结构，语序多个线程等待到达某个屏障。

   CountDownLatch和CyclicBarrier的区别：

   i. CountDownLatch是不可以重置，所以无法重用，而CyclicBarrier则没有这种限制，可以重用。

   ii. CountDownLatch的基本操作组合是countDown/await。调用await的线程阻塞等待countDown足够的次数，不管你是在一个线程还是多个线程里countDown,只要次数足够即可。CountDownLatch操作的是事件。

   iii. CyclicBarrier的基本操作组合，则就是await,当所有的伙伴（parties）都调用了await,才会继续进行任务，并自动进行重置。注意，正常情况下，CyclicBarrier的重置都是自动发生的，如果我们调用reset方法，单还有线程在等待，就会导致等待线程发生干扰，抛出BrokenBarrierException异常。CyclicBarrier侧重点是线程，而不是调用事件， **它的典型应用场景是用来等待并发线程结束。**

### 二. 线程安全容器

**java.util.concurrent 包提供的容器（Queue、List、Set）、Map，从命名上可以大概区分为 Concurrent*、CopyOnWrite和 Blocking**

**Map形式的：**

1. ConcurrentHashMap：jdk8以前使用分段锁，jdk8后采用CAS

2. ConcunrrentSkipListMap：
3. ConcurrentSkipListMap：是TreeMap的线程安全版本。

**List形式的：**

CopyOnWriteArrayList：通过快照实现，适用于读多写少的场景。在对其实例进行修改操作（add/remove等）会新建一个数据并修改，修改完毕之后，再将原来的引用指向新的数组。

**Set形式的：**

CopyOnWriteArraySet：同上CopyOnWriteArrayList

**Queue形式的：**

[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-41LmCCfJ-1649682249808)(https://github.com/wenPKtalk/wentalk/blob/master/java/Queue%E7%B1%BB%E5%9B%BE.jpg)]

ArrayBlockQueue: 有界队列，需要显示的指定队列大小

LinkedBlockQueue: 被认为无界，其实有

**我在介绍 ReentrantLock 的条件变量用法的时候分析过 ArrayBlockingQueue，不知道你有没有注意到，其条件变量与 LinkedBlockingQueue 版本的实现是有区别的。notEmpty、notFull 都是同一个再入锁的条件变量，而 LinkedBlockingQueue 则改进了锁操作的粒度，头、尾操作使用不同的锁，所以在通用场景下，它的吞吐量相对要更好一些。**  — 引用

PriorityBlockQueue: 无边界的优先级队列

### 三. 强大的Executor框架

1. newCachedThreadPool()，它是一种用来处理大量短时间工作任务的线程池，具有几个鲜明特点：它会试图缓存线程并重用，当无缓存线程可用时，就会创建新的工作线程；如果线程闲置的时间超过 60 秒，则被终止并移出缓存；长时间闲置时，这种线程池，不会消耗什么资源。其内部使用 SynchronousQueue 作为工作队列。
2. newSingleThreadExecutor()，它的特点在于工作线程数目被限制为 1，操作一个无界的工作队列，所以它保证了所有任务的都是被顺序执行，最多会有一个任务处于活动状态，并且不允许使用者改动线程池实例，因此可以避免其改变线程数目。
3. newSingleThreadScheduledExecutor() 和 newScheduledThreadPool(int corePoolSize)，创建的是个 ScheduledExecutorService，可以进行定时或周期性的工作调度，区别在于单一工作线程还是多个工作线程。
4. newWorkStealingPool(int parallelism)，这是一个经常被人忽略的线程池，Java 8 才加入这个创建方法，其内部会构建。

### 参考作品

《Java Core 卷一》

JUC常用4大并发工具类 https://mp.weixin.qq.com/s/Ixz8V0oMHyRvCzJ3EsZkFA

Java并发干货 https://mp.weixin.qq.com/s/Sxnf5teW1vehkhBfkV7E-g
