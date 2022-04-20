---
title: Java问题收集
date: 2018-05-24 23:41:04
tags: [Java, 面试]
categories: [Java]
---


1. 谈谈你对java体系的理解？“java是解释执行”，这句话是正确的吗？  

  > java底层有jvm（java虚拟机）来兼容不同的操作系统，java运行前会编译成jvm可以识别的字节码我们常说的class文件，然后由jvm来解释执行。

2. 请对比Exception和Error，运行时异常与一般异常有什么区别？  

  > Error ：表示由 JVM 所侦测到的无法预期的错误，由于这是属于 JVM 层次的严重错误 ，导致 JVM 无法继续执行，因此，这是不可捕捉到的，无法采取任何恢复的操作，顶多只能显示错误信息。（IOException,SqlException）  
  > Exception ：表示可恢复的例外，这是可捕捉到的。(NullPointerException)

  ![img](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220420/23_44/accba531a365e6ae39614ebfa3273900.png)

3. 谈谈final,finally,finalize有什么不同？  

  > final: 修饰变量表示为常量，修饰方法不能被子类重写，修饰类不能被继承。  
  > finally: 捕获异常后始终会执行 finally中的代码块。  
  > finalize: 释放需要被回收的对象

4. 强引用，软引用，弱引用有什么区别？具体使用场景是什么？  

  > 1. 强引用：（最常用）  
  >    String str = “abc”;   
  >    list.add(str);   
  >    当内存空 间不足，Java虚拟机宁愿抛出OutOfMemoryError错误    
  > 2. 软引用：   
  >    软引用可以和一个引用队列（ReferenceQueue）联合使用，如果软引用所引用的对象被垃圾回收，JAVA虚拟机就会把这个软引用加入到与之关联的引用队列中。   
  >    如果弱引用对象回收完之后，内存还是报警，继续回收软引用对象   
  > 3. 弱引用：   WeakReference  
  >    如果虚引用对象回收完之后，内存还是报警，继续回收弱引用对象 
  > 4. 虚引用：   
  >    虚拟机的内存不够使用，开始报警，这时候垃圾回收机制开始执行System.gc(); String s = “abc”;如果没有对象回收了， 就回收没虚引用的对象

  ![img](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220420/23_45/36d3c7b158eda9421ef32463cb4d4fb0.png)

5. 理解java字符串，String，StringBuffer，StringBuilder有什么区别？  

  > 1. 可变性
  >      String类中使用字符数组保存字符串，private final char value[]，所以string对象是不可变的。  
  >      StringBuilder与StringBuffer都继承自AbstractStringBuilder类，在AbstractStringBuilder中也是使用字符数组保存字符串，char[]value，这两种对象都是可变的。  
  > 2. 线程安全性
  >      StringBuffer对方法加了同步锁或者对调用的方法加了同步锁，所以是线程安全的。StringBuilder并没有对方法进行加同步锁，所以是非线程安全的。
  >    性能  
  >      每次对String 类型进行改变的时候，都会生成一个新的String对象，然后将指针指向新的String 对象。StringBuffer每次都会对StringBuffer对象本身进行操作，而不是生成新的对象并改变对象引用。相同情况下使用StirngBuilder 相比使用StringBuffer 仅能获得10%~15% 左右的性能提升，但却要冒多线程不安全的风险。  
  >    对于三者使用的总结：  
  >    如果要操作少量的数据用 = String  
  >    单线程操作字符串缓冲区 下操作大量数据 = StringBuilder  
  >    多线程操作字符串缓冲区 下操作大量数据 = StringBuffer  

6. 谈谈java反射机制，动态代理是基于什么原理？  

  > 代理模式是一种常用的设计模式，其目的就是为其他对象提供一个代理以控制对某个真实对象的访问。代理类负责为委托类预处理消息，过滤消息并转发消息，以及进行消息被委托类执行后的后续处理  
  > [动态代理详解链接](https://blog.csdn.net/scplove/article/details/52451899)

7. int和Integer有什么区别？Integer值的缓存范围是什么？  

  > （1）Integer是int的包装类；int是基本数据类型；   
  > （2）Integer变量必须实例化后才能使用；int变量不需要；   
  > （3）Integer实际是对象的引用，指向此new的Integer对象；int是直接存储数据值 ；   
  > （4）Integer的默认值是null；int的默认值是0。    
  > Integer值的缓存范围是：-128-127  
  > JVM会自动维护八种基本类型的常量池，int常量池中初始化-128~127的范围，所以当为Integer i=127时，在自动装箱过程中是取自常量池中的数值，而当Integer i=128时，128不在常量池范围内，所以在自动装箱过程中需new 128，所以地址不一样。    
  > a.当数值范围为-128~127时：如果两个new出来Integer对象，即使值相同，通过“==”比较结果为false，但两个对象直接赋值，则通过“==”比较结果为“true，这一点与String非常相似。  
  > b.当数值不在-128~127时，无论通过哪种方式，即使两个对象的值相等，通过“==”比较，其结果为false；  
  > c.当一个Integer对象直接与一个int基本数据类型通过“==”比较，其结果与第一点相同；  
  > d.Integer对象的hash值为数值本身；  

8. 对比Vector,ArrayList,LinkedList有何区别？  

  > vector线程同步。  
  > ArrayList 底层为线性表，线程非同步。获取数据很方便，插入删除，比较耗性能。  
  > LinkedList 底层为链表所以获取数据性能较差，删除，插入数据方便。
  > [集合面试指南](https://juejin.im/post/5a99544ef265da23a334ab6c)  

9. 对比Hashtable,HashMap,TreeMap,谈谈你对HashMap的掌握？  

  > 答案同上链接  

10. 如何保证集合是线程安全的？ConcurrentHashMap做了什么？  

  > 答案同上链接  

11. java NIO提供了哪些IO方式？看过NIO的源代码吗？如果让你来改进NIO，会做什么改进？

    > 后续 出文章讲

12. 面向对象中的抽象类，接口的区别是什么？    

   > 1.接口的方法默认是public，所有方法在接口中不能有实现，抽象类可以有非抽象的方法  
   > 2.接口中的实例变量默认是final类型的，而抽象类中则不一定  
   > 3.一个类可以实现多个接口，但最多只能实现一个抽象类  
   > 4.一个类实现接口的话要实现接口的所有方法，而抽象类不一定  
   > 5.接口不能用new实例化，但可以声明，但是必须引用一个实现该接口的对象  
   > 从设计层面来说，抽象是对类的抽象，是一种模板设计，接口是行为的抽象，是一种行为的规范。

13. 说说你知道的设计模式？请动手实现单例模式，Spring，Mybatis使用了哪些设计模式？  

   > [单例模式整合链接](https://mp.weixin.qq.com/s/f-sJIZHr7JUa31gKTllSFQ)

14. 理解java的锁实现，Synchronized和ReentrantLock有什么区别？有人说Synchronized最慢，这句话靠谱吗？  

   > 上网搜搜，能吹出来就行。

15. 一个线程连着调用start()两次会出现什么情况？谈谈线程的生命周期和状态转移。

16. 什么情况下java程序会产生死锁？如何排除？  
   比较基础，产生对临界资源的竞争。   

17. java并发包提供了哪些并发类？使用这些数据结构解决过什么并发问题？

18. AtomicInteger底层实现原理是什么？如何在自己的产品代码中应用CAS操作？

19. java并发类库提供的线程池有哪几种？如何选择？  

20. 什么是类加载过程，双亲委派模型？

21. 谈谈jvm内存区域划分，如何监控和诊断jvm堆内和堆外内存使用？COM常见排查思路有哪些？

22. GC收集器有哪些？常见的调优方法有哪些？

23. 谈谈java内存模型（JMM)，原子性，可见性，有序性是什么？volatile的理解。  
   记住jmm内存模型很容易理解
   [答案分析链接](http://note.youdao.com/noteshare?id=8832a0433d1908f9e08cc93f6f1bb5bf)

24. AOP是什么解决了什么问题？  

   > 切面编程可以将公共代码提取出来，减少业务代码侵入比如权限校验，日志处理等。
   > 几个比较重要的词汇：  
   > Joinpoint(连接点): 类里面可以被增强的方法，这些方法称为连接点

> Pointcut(切入点):所谓切入点是指我们要对哪些Joinpoint进行拦截的定义.

> Advice(通知/增强):所谓通知是指拦截到Joinpoint之后所要做的事情就是通知.通知分为前置通知,后置通知,异常通知,最终通知,环绕通知(切面要完成的功能)

> Aspect(切面): 是切入点和通知（引介）的结合

> Introduction(引介):引介是一种特殊的通知在不修改类代码的前提下, Introduction可以在运行期为类动态地添加一些方法或Field.  
> Target(目标对象):代理的目标对象(要增强的类)

> Weaving(织入):是把增强应用到目标的过程.把advice 应用到 target的过程

> Proxy（代理）:一个类被AOP织入增强后，就产生一个结果代理类

25. mybatis实现二级缓存  

   > Mybatis的二级缓存配置相当容易，要开启二级缓存，只需要在你的Mapper
   > 映射文件中添加一行：  
   > <cache />   
   > mybatis无法实现分布式缓存，需要和其它分布式缓存框架进行整合。这里我主要介绍整合EhCache  

[Mybatis实现二级缓存解析](https://blog.csdn.net/qq_19816777/article/details/61662761)    
26.大数据相关  
Hadoop,spak,Hbase,Hive这些东西各自是干嘛的了解，了解。
