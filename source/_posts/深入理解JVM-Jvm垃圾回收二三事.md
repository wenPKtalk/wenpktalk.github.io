---
title: 深入理解JVM-Jvm垃圾回收二三事
date: 2020-09-01 08:20:45
tags: [JVM, GC]
categories: JVM
---

> 众所周知Java作为高级编程语言是不需要程序员去手动释放内存垃圾（**垃圾指的是死亡的对象所占据的堆空间**），JVM会替我们完成。那么JVM是如何识别出来哪些是需要被回收的对象？JVM是如何整理内存空间？JVM GC(Garbage Collection)过程和应用程序的线程有哪些相互影响？

### 如何识别垃圾对象-识别算法

> 程序员不需要手动编码精准释放不用的对象，那么JVM是如何做到自动识别的呢？

- #### 引用计数法（reference counting）

  做法是为每个对象添加一个引用计数器，用来统计指向该对象的引用个数。一旦一个对象的引用计数器为0，则说明该对象已经死亡，它所占用的堆空间可以被回收。

  **使用此类算法的有 Python、Objective-C、Per l等。**

  **优点：**

  ​	算法简单，容易实现：如果有一个引用，被赋值为某一对象，那么将该对象的引用计数器 +1。如果一个指向某一对象的引用，被赋值为其他值，那么将该对象的引用计数器 -1。也就是说，我们需要截获所有的引用更新操作，并且相应地增减目标对象的引用计数器。

  **缺点：**

   1. 需要额外的空间存储计数器，和繁琐的计数器更新。

   2. 无法解决循环引用造成内存泄漏。

      ![GC roots path](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220525/09_36/8546a9b3c6660a31ae24bef0ef0a35b9.png)

      > 对象 a 与 b 相互引用，除此之外没有其他引用指向 a 或者 b。在这种情况下，a 和 b 实际上已经死了，但由于它们的引用计数器皆不为 0，在引用计数法的心中，这两个对象还活着。因此，这些循环引用对象所占据的空间将不可回收，从而造成了内存泄露。

  - #### 可达性分析（JVM采用）

    将一系列GC Roots作为初始的存活对象合集（Live Set），然后从该集合出发，探索所有能被该集合引用到的对象，将其加入该集合中，这一过程也被称作标记（Mark）。最终未被探索到的对象便是死亡的，是可以回收的。

    **GC Roots可以理解为由堆外指向堆内的引用，一般包括但不仅限于以下：**
  
    1. Java方法栈中的布局变量。[Java内存布局]([https://wenpktalk.github.io/2020/05/11/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3JVM-Java%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%86%85%E5%AD%98%E7%BB%93%E6%9E%84/])
    2. 已加载类的静态变量。
    3. 本地方法栈中Native方法引用的对象
    4. 虚拟机栈（栈帧中本地变量表）中引用的对象
    5. 已经启动且未停职的线程。

### 回收算法-垃圾回收器的工作原理

由上一步的识别算法找到需要被回收的对象后，接下来就是需要将识别出来的垃圾对象所占用的内存空间进行回收，以便于进行再次利用。回收的算法主要包括：

基础算法：

1. [标记-清除算法](#sweep)
2. [标记-压缩算法](#compact)
3. [标记-复制算法](#copy)

改进算法（由上边的算法演进而来）：

4. [分代算法](#generation)
5. [增量算法](#increment)
6. [并发算法](#concurrent)

#### <span id="sweep"> 标记-清除（Sweep）</span>

把死亡对象所占据的内存标记为空闲内存，并记录在一个**空闲列表（Free List）**中。当需要新建对象时，内存管理便会从空闲列表中寻找空闲内存，并划分给新建对象。

<img src="https://static001.geekbang.org/resource/image/f2/03/f225126be24826658ca5a899fcff5003.png" alt="img" style="zoom: 33%;" />

##### 优点：

原理，实现比较简单

##### 缺点

1. 造成内存碎片，由于Java虚拟机的堆中对象必须是连续分布，因此可能出现空闲内存足够，但是无法分配的极端情况。
2. 分配效率极低，如果是连续的内存空间我们可以通过指针加法（Pointer bumping）来做分配。而对于空闲列表，java虚拟机则需要逐个访问列表中的项，来查找能够放入新建对象的空闲内存。

#### <span id="compact">标记-压缩（Compact）</span>

把存活的对象挪到内存的起始位置。

<img src="https://static001.geekbang.org/resource/image/41/39/415ee8e4aef12ff076b42e41660dad39.png" alt="img" style="zoom:33%;" />

##### 优点

这样做能够开辟出连续的空间，解决内存碎片化问题。

#### 缺点

压缩算法的性能开销比较大。

#### <span id="copy">标记-复制（Copy）</span>

把内存区域划分为两份，分别使用**from**和**to**来维护，并且只是用from指针指向的内存区域来分配内存。当发生垃圾回收时，便把存活对象复制到to指针指向的内存区域中，并且交换from指针和to指针指向的内容。

<img src="https://static001.geekbang.org/resource/image/47/61/4749cad235deb1542d4ca3b232ebf261.png" alt="img" style="zoom:33%;" />

##### 优点：

* 不会发生碎片化
* 优秀的吞吐率
* 可实现高速分配
* 良好的locality

##### 缺点：

由于to指针指向的区域始终是空闲的，所以空间利用率极低。

#### <span id="generation">分代算法（Generation）</span>

分代算法基于这样一种假说（Generational Hypothesis）：**绝大多数对象都是朝生夕死的。**分代算法把对象分为几代，新生成的对象称之为：新生代，负责对新生代进行垃圾回收的叫minor GC。到达一定年龄的对象则称之为老年代对象，面向老年代GC的叫major GC。新生代到老年代的过程称之为：晋升（Promotion）注：代数并不是划分的越多越好，虽然按照分代假说，如果分代数越多，最后抵达老年代的对象就越少，在老年代对象上消耗的垃圾回收的时间就越少，但分代数增多会带来其他的开销，综合来看，代数划分为 2 代或者 3 代是最好的。

分代算法由于其普适性，已经被大多数的垃圾回收器采用（ZGC 目前不支持，但也在规划中了）。

#### <span id="increment">增量算法（Increment）</span>

增量算法对基础算法的改进主要体现在该算法通过并发的方式，降低了 STW 的时间。下图是增量算法和基础的标记-清除算法在执行时间线上的对比，可以看到，增量算法的核心思想是：通过 GC 和应用程序交替执行的方式，来控制应用程序的最大暂停时间。

<img src="https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220531/09_44/41cebbc1c50e499db9926d45d4fca7d0-20220531094441790.png" alt="image.png" style="zoom:33%;" />

增量算法的「增量」部分，主要有「增量更新（Incremental Update）」和「增量拷贝（Incremental Copying）」两种，前者主要是做「标记」增量，后者是在做「复制」增量。

#### <span id="concurrent">并发算法（Concurrent）</span>

广义上的并发算法指的是在 GC 过程中存在并发阶段的算法，如 G1 中存在并发标记阶段，可将其整个算法视为并发算法。

狭义上的并发垃圾回收算法是以基础的标记-复制算法为基础，在各个阶段增加了并发操作实现的。与复制算法的3个阶段相对应，分为并发标记（mark）、并发转移（relocate）和并发重定位（remap）:

1）并发标记

从 GC Roots 出发，使用遍历算法对对象的成员变量进行标记。同样的，并发标记也需要解决标记过程中引用关系变化导致的漏标记问题，这一点通过写屏障实现；

（2）并发转移

根据并发标记后的结果生成转移集合，把活跃对象转移（复制）到新的内存上，原来的内存空间可以回收，转移过程中会涉及到应用线程访问待转移对象的情况，一般的解决思路是加上读屏障，在完成转移任务后，再访问对象；

（3）并发重定位

对象转移后其内存地址发生了变化，所有指向对象老地址的指针都要修正到新的地址上，这一步一般通过读屏障来实现。

### JVM堆空间划分

JVM首先采用分代算法将堆空间划分如下：

1. 新生代
   * 新生代又划分为一个eden区两个大小相同的survivor区
2. 老年代

默认情况下Java虚拟机采用的是动态分配策略，使用参数：XX:+UsePSAdaptiveSurvivorSizePolicy 据生成对象的速率，以及 Survivor 区的使用情况动态调整 Eden 区和 Survivor 区的比例。

也可以通过参数 -XX:SurvivorRatio 来固定这个比例。但是需要注意的是，其中一个 Survivor 区会一直为空，因此比例越低浪费的堆空间将越高。

<img src="https://static001.geekbang.org/resource/image/2c/e5/2cc29b8de676d3747416416a3523e4e5.png" alt="img" style="zoom:33%;" />

通常来讲（除过逃逸分析是在栈上分配）：new 一个对象需要在Eden区划分一片内存作为对象的存储空间。由于堆空间是线程共享的，因此直接在这里边划空间是需要进行**同步**的。否则，将有可能出现两个对象共用一段内存的事故。为了解决多个线程在同时创建时可能造成的占用内存冲突引入了**TLAB**（Thread Local Allocation Buffer）技术

具体来说，每个线程可以向 Java 虚拟机申请一段连续的内存，比如 2048 字节，作为线程私有的 TLAB。这个操作需要加锁，线程需要维护两个指针（实际上可能更多，但重要也就两个），一个指向 TLAB 中空余内存的起始位置，一个则指向 TLAB 末尾。

#### Minor GC

1. 当 Eden 区的空间耗尽了怎么办？这个时候 Java 虚拟机便会触发一次 Minor GC，来收集新生代的垃圾。

2. 存活下来的对象，则会被送到 Survivor 区。前面提到，新生代共有两个 Survivor 区，我们分别用 from 和 to 来指代。其中 to 指向的 Survivior 区是空的。当发生 Minor GC 时，Eden 区和 from 指向的 Survivor 区中的存活对象会被复制到 to 指向的 Survivor 区中，然后交换 from 和 to 指针，以保证下一次 Minor GC 时，to 指向的 Survivor 区还是空的。

3. Java 虚拟机会记录 Survivor 区中的对象一共被来回复制了几次。如果一个对象被复制的次数为 **15（对应虚拟机参数 -XX:+MaxTenuringThreshold）**，那么该对象将被晋升（promote）至老年代。

4.  如果单个 Survivor 区已经被占用了 50%（对应虚拟机参数 -XX:TargetSurvivorRatio），那么较高复制次数的对象也会被晋升至老年代。

5. 当发生 Minor GC 时，我们应用了标记 - 复制算法，将 Survivor 区中的老存活对象晋升到老年代，然后将剩下的存活对象和 Eden 区的存活对象复制到另一个 Survivor 区中。

   理想情况下，Eden 区中的对象基本都死亡了，那么需要复制的数据将非常少，因此采用这种标记 - 复制算法的效果极好。Minor GC 的另外一个好处是不用对整个堆进行垃圾回收。但是，它却有一个问题，那就是老年代的对象可能引用新生代的对象。也就是说，在标记存活对象的时候，我们需要扫描老年代中的对象。如果该对象拥有对新生代对象的引用，那么这个引用也会被作为 GC Roots。

   **这样一来，岂不是又做了一次全堆扫描呢？**

##### 卡表

HotSpot 给出的解决方案是一项叫做卡表（Card Table）的技术。

1. 该技术将整个堆划分为一个个大小为 512 字节的卡，并且维护一个卡表，用来存储每张卡的一个标识位。

2. 这个标识位代表对应的卡是否可能存有指向新生代对象的引用。如果可能存在，那么我们就认为这张卡是脏的。

3. 在进行 Minor GC 的时候，我们便可以不用扫描整个老年代，而是在卡表中寻找脏卡，并将脏卡中的对象加入到 Minor GC 的 GC Roots 里。当完成所有脏卡的扫描之后，Java 虚拟机便会将所有脏卡的标识位清零。

4. 由于 Minor GC 伴随着存活对象的复制，而复制需要更新指向该对象的引用。因此，在更新引用的同时，我们又会设置引用所在的卡的标识位。这个时候，我们可以确保脏卡中必定包含指向新生代对象的引用。

5. 在 Minor GC 之前，我们并不能确保脏卡中包含指向新生代对象的引用。其原因和如何设置卡的标识位有关。

6. 首先，如果想要保证每个可能有指向新生代对象引用的卡都被标记为脏卡，那么 Java 虚拟机需要截获每个引用型实例变量的写操作，并作出对应的写标识位操作。这个操作在解释执行器中比较容易实现。

7. 但是在即时编译器生成的机器码中，则需要插入额外的逻辑。这也就是所谓的写屏障（write barrier，注意不要和 volatile 字段的写屏障混淆）。

8. 写屏障需要尽可能地保持简洁。这是因为我们并不希望在每条引用型实例变量的写指令后跟着一大串注入的指令。因此，写屏障并不会判断更新后的引用是否指向新生代中的对象，而是宁可错杀，不可放过，一律当成可能指向新生代对象的引用。

9. 这么一来，写屏障便可精简为下面的伪代码[1]。这里右移 9 位相当于除以 512，Java 虚拟机便是通过这种方式来从地址映射到卡表中的索引的。最终，这段代码会被编译成一条移位指令和一条存储指令。

   ```c++
   CARD_TABLE [this address >> 9] = DIRTY;
   ```

   

10. 虽然写屏障不可避免地带来一些开销，但是它能够加大 Minor GC 的吞吐率（ 应用运行时间 /(应用运行时间 + 垃圾回收时间) ）。总的来说还是值得的。

11. 不过，在高并发环境下，写屏障又带来了虚共享（false sharing）问题[2]。在介绍对象内存布局中我曾提到虚共享问题，讲的是几个 volatile 字段出现在同一缓存行里造成的虚共享。这里的虚共享则是卡表中不同卡的标识位之间的虚共享问题。

12. 在 HotSpot 中，卡表是通过 byte 数组来实现的。对于一个 64 字节的缓存行来说，如果用它来加载部分卡表，那么它将对应 64 张卡，也就是 32KB 的内存。如果同时有两个 Java 线程，在这 32KB 内存中进行引用更新操作，那么也将造成存储卡表的同一部分的缓存行的写回、无效化或者同步操作，因而间接影响程序性能。为此，HotSpot 引入了一个新的参数 -XX:+UseCondCardMark，来尽量减少写卡表的操作。其伪代码如下所示：

    ```c++
    
    if (CARD_TABLE [this address >> 9] != DIRTY) 
      CARD_TABLE [this address >> 9] = DIRTY;
    ```

### 垃圾回收器

#### 1. Serial收集器

Serial收集器是最基础、历史最悠久的收集器，曾经（在JDK 1.3.1之前）是HotSpot虚拟机新生代收集器的唯一选择。这个收集器是一个单线程工作的收集器，但它的“单线 程”的意义并不仅仅是说明它只会使用一个处理器或一条收集线程去完成垃圾收集工作，更重要的是强调在它进行垃圾收集时，必须暂停其他所有工作线程，直到它收集结束。

Serial/Serial Old收 集器的运行过程如下：

<img src="https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWcUIaicKQYhj4gJuFZtKicDgkLay9aAFksP1VA4zXIPMOwU2FsmTNE8PeEcHbAMPl1k4YBib2fjapvhQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom: 67%;" />

#### 2. ParNew收集器

ParNew收集器实质上是Serial收集器的多线程并行版本，除了同时使用多条线程进行垃圾收集之外，其余的行为包括Serial收集器可用的所有控制参数（例如：-XX：SurvivorRatio、-XX：PretenureSizeThreshold、-XX：HandlePromotionFailure等）、收集算法、Stop The World、对象分配规则、回收策略等都与Serial收集器完全一致，在实现上这两种收集器也共用了相当多的代码。

ParNew收集器的工作过程如图所示：

<img src="https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWcUIaicKQYhj4gJuFZtKicDgkg5mqlDEQ6egDzOwlGXoT48DbFRdD6iaRRWwHJh6T9eoap4m1xcKGInA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom:67%;" />

#### 3. Parallel Scavenge收集器

Parallel Scavenge收集器也是一款新生代收集器，它同样是基于标记-复制算法实现的收集器，也是能够并行收集的多线程收集器

Parallel Scavenge收集器的目标则是达到一个可控制的吞吐量（Throughput）。由于与吞吐量关系密切，Parallel Scavenge收集器也经常被称作“吞吐量优先收集器”。

Parallel Scavenge收集器提供了两个参数用于精确控制吞吐量，分别是控制最大垃圾收集停顿时间的-XX：MaxGCPauseMillis参数以及直接设置吞吐量大小的-XX：GCTimeRatio参数。

#### 4. Serial Old收集器

Serial Old是Serial收集器的老年代版本，它同样是一个单线程收集器，使用标记-整理算法。这个收集器的主要意义也是供客户端模式下的HotSpot虚拟机使用。如果在服务端模式下，它也可能有两种用途：一种是在JDK 5以及之前的版本中与Parallel Scavenge收集器搭配使用，另外一种就是作为CMS 收集器发生失败时的后备预案，在并发收集发生Concurrent Mode Failure时使用。这两点都将在后面的内容中继续讲解。

Serial Old收集器的工作过程如图所示。

<img src="https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWcUIaicKQYhj4gJuFZtKicDgkulNd6x3IMnkHEbZBoJpblghWiaOX3nShRLU0hmiaalweiaCwmHKC2RprQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom:67%;" />

#### 5. Parallel Old收集器

Parallel Old是Parallel Scavenge收集器的老年代版本，支持多线程并发收集，基于标记-整理算法实现。这个收集器是直到JDK 6时才开始提供的。Parallel Old收集器的工作过程如图所示。

<img src="https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWcUIaicKQYhj4gJuFZtKicDgkSqlHr0B7MPLftF3KogFXooOn3FR3GZt3VcI9Tf6eic0lMBnE4FJDiblQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom:67%;" />

#### 6. CMS收集器

CMS（Concurrent Mark Sweep）收集器是一种以获取最短回收停顿时间为目标的收集器。目前很大一部分的Java应用集中在互联网网站或者基于浏览器的B/S系统的服务端上，这类应用通常都会较为关注服务的响应速度，希望系统停顿时间尽可能短，以给用户带来良好的交互体验。CMS收集器就非常符合这类应用的需求。

Concurrent Mark Sweep收集器运行过程如图：

<img src="https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWcUIaicKQYhj4gJuFZtKicDgk4mcVU2w3sNiaYibFA3wTRtl6r6tI5K2DAZJJy7lXpMicINAlicoS6k7eQg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom:67%;" />

#### 7. Garbage First（G1）收集器

G1是一款主要面向服务端应用的垃圾收集器，是目前垃圾回收器的前沿成果。HotSpot开发团队最初赋予它的期望是（在比较长期的）未来可以替换掉JDK 5中发布的CMS收集器。现在这个期望目标已经实现过半了，JDK 9发布之日，G1宣告取代Parallel Scavenge加Parallel Old组合，成为服务端模式下的默认垃圾收集器。

G1收集器运行过程如图：

<img src="https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWcUIaicKQYhj4gJuFZtKicDgkD7WRLalGInfJNJBAibS7tWAc691yj8Nj1k5wu1vHHIo2XbVU4rTZ2Og/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" alt="Image" style="zoom:67%;" />

#### 8. ZGC

# ZGC 特征

ZGC 收集器是一款基于 Region 内存布局的，(暂时) 不设分代的，使用了读屏障、染色指针和内存多重映射等技术来实现可并发的标记-整理算法的，以低延迟为首要目标的一款垃圾收集器。

## 内存布局

**ZGC 没有分代的概念**

ZGC 的内存布局说起。与 Shenandoah 和 G1一样，ZGC 也采用基于 Region 的堆内存布局，但与它们不同的是 ， ZGC 的 Region 具 有 动 态 性 (动态创建和销毁 ， 以及动态的区域容量大小)。在 x64硬件平台下 ， ZGC 的 Region 可以具有大、中、小三类容量(如下图所示):

- 小型 Region (Small Region )：容量固定为 2M， 存放小于 256K 的对象。
- 中型 Region (Medium Region)：容量固定为 32M，放置大于等于256K但小于4M的对象。
- 大型 Region (Large Region): 容量不固定，可以动态变化，但必须为2MB 的整数倍，用于放置 4MB或以上的大对象。

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1e23544f9184dd68e16e8a36e6e9fc3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp" alt="图片" style="zoom:50%;" />

参考链接：https://juejin.cn/post/7095643412082196511

### 参考链接

[垃圾回收算法是如何设计的？](https://developer.aliyun.com/article/777750?source=5176.11533457&userCode=e4nptrfl)

[JVM 从入门到放弃之 ZGC 垃圾收集器](https://juejin.cn/post/7095643412082196511)
