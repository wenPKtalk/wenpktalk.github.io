---
title: Spring 事务注解失效之一
date: 2019-11-26 14:59:01
tags: [Spring]
categories: Spring
---

> ​	Spring针对事务的管理是通过动态代理实现的，**那么事务要进行传播首先必须要是被代理的方法之间**，这是Spring事务传播的前提。比如：如果在同一个service里两个方法：方法A，方法B上都加了Transactional()
>
> 并且用方法A直接调用了方法B此时方法B上的注解Transactional并不生效（具体原因会新增文章说明跟动态代理的机制有关）。

```java
//示例1
public class ClassA{
    //方法A
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    a(){
        ...
        b();//此时b方法上添加的事务注解并不生效
    }
     //方法B
    @Transactional(propagation = Propagation.REQUIRES_NEW,rollbackFor = Exception.class)
    b(){
        ...
    }
}
```

#### 事务传播生效示例

```java
//示例2
public class ClassA{
    @Autowired
    private ClassB classB;
    //方法A
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    a(){
        ...
        classB.c();//此时c方法上添加的事务注解会生效
    }
     //方法B
    @Transactional(propagation = Propagation.REQUIRES_NEW,rollbackFor = Exception.class)
    b(){
        ...
    }
}
public class ClassB{
    @Transactional(propagation = Propagation.REQUIRES_NEW,rollbackFor = Exception.class)
    c(){
        ...
       c();
    }
}

```

Spring 事务传播属性对比

| 属性                      | 说明                                                         | 对比                                                         |
| :------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| PROPAGATION_REQUIRED      | 如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。这是最常见的选择，默认选择。 | 常用的                                                       |
| PROPAGATION_SUPPORTS      | 支持当前事务，如果当前没有事务，就以非事务方式执行。         |                                                              |
| PROPAGATION_MANDATORY     | 使用当前的事务，如果当前没有事务，就抛出异常。               | 当业务方法被设置为PROPAGATION_MANDATORY时，它就不能被非事务的业务方法调用。如将ClassB.c() 设置为PROPAGATION_MANDATORY，如果展现层的Action直接调用c()方法，将引发一个异常。正确的情况是： <br/>c()方法必须被另一个带事务的业务方法调用比如示例2。  PROPAGATION_MANDATORY的方法一般都是被其它业务方法间接调用的。 |
| PROPAGATION_REQUIRES_NEW  | 新建事务，如果当前存在事务，把当前事务挂起。                 |                                                              |
| PROPAGATION_NOT_SUPPORTED | 以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。   | 当方法被设置为PROPAGATION_NOT_SUPPORTED时，外层业务方法的事务会被挂起，当内部方法运行完成后，外层方法的事务重新运行。如果外层方法没有事务，直接运行，不需要做任何其它的事。 |
| PROPAGATION_NEVER         | 以非事务方式执行，如果当前存在事务，则抛出异常。             | 当业务方法被设置为PROPAGATION_NEVER时，它将不能被拥有事务的其它业务方法调用。假设ClassB.c() <br/>()设置为PROPAGATION_NEVER，当Class.a()拥有一个事务时，c()方法将抛出异常。所以PROPAGATION_NEVER方法一般是被直接调用的如示例1。 |
| PROPAGATION_NESTED        | 如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与PROPAGATION_REQUIRED类似的操作。 | PROPAGATION_NESTED和PROPAGATION_REQUIRES_NEW的区别在于：PROPAGATION_REQUIRES_NEW 启动一个新的、和外层事务无关的“内部”事务。该事务拥有自己的独立隔离级别和锁，不依赖于外部事务，独立地提交和回滚。当内部事务开始执行时，外部事务 将被挂起，内务事务结束时，外部事务才继续执行。将创建一个全新的事务，它和外层事务没有任何关系.而 PROPAGATION_NESTED 将创建一个依赖于外层事务的子事务，当外层事务提交或回滚时，子事务也会连带提交和回滚。 |
