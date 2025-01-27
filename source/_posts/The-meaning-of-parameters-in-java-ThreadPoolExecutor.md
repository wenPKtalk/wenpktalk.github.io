---
title: The meaning of parameters in java ThreadPoolExecutor
date: 2024-12-17 14:45:54
tags: [Java, Concurrency]
categories: Java
---


corePoolSize: the number of threads to keep in the pool, even if they are idle, unless allowCoreThreadTimeOut is set 
maximumPoolSize: the maximum number of threads to allow in the pool keepAliveTime when the number of threads is greater than the core, this is the maximum time that excess idle threads will wait for new tasks before terminating. 
unit : the time unit for the keepAliveTime argument 
workQueue: the queue to use for holding tasks before they are executed. This queue will hold only the Runnable tasks submitted by the execute method. 
handler: the handler to use when execution is blocked because the thread bounds and queue capacities are reache

1. corePoolSize（核心线程数）

线程池中会始终保持的最小线程数
即使这些线程处于空闲状态，也不会被销毁（除非设置了allowCoreThreadTimeOut为true）
这些线程响应速度最快，因为不需要创建新线程


2. maximumPoolSize（最大线程数）

线程池允许创建的最大线程数
当工作队列满了，且当前线程数小于maximumPoolSize时，会创建新线程
超过这个数量的任务会触发拒绝策略


3. keepAliveTime（空闲线程存活时间）

非核心线程空闲超过这个时间后会被销毁
如果allowCoreThreadTimeOut为true，核心线程也会受这个参数影响
用于减少资源浪费


4. unit（时间单位）

keepAliveTime的时间单位
可以是SECONDS、MINUTES等TimeUnit枚举值


5. workQueue（工作队列）

用于存放待执行的任务
常用队列类型：

ArrayBlockingQueue：有界队列
LinkedBlockingQueue：无界队列
SynchronousQueue：无缓冲的等待队列
PriorityBlockingQueue：优先级队列




6. handler（拒绝策略）

当队列满且线程数达到maximumPoolSize时的处理策略
默认策略类型：

AbortPolicy：抛出异常（默认）
CallerRunsPolicy：在调用者线程执行
DiscardPolicy：直接丢弃
DiscardOldestPolicy：丢弃最早的任务

![image.png](https://github.com/wenPKtalk/wenpktalk.github.io/blob/9965ec5a6944d4a596b836cf234240e07698fa8d/source/_posts/image.png)


planUML描述如下：

```
@startuml
title ThreadPoolExecutor执行流程

skinparam backgroundColor #FFFFFF
skinparam handwritten false

start

:提交新任务;

if (当前线程数 < 核心线程数?) then (是)
  :创建新的核心线程;
  :执行任务;
else (否)
  if (工作队列未满?) then (是)
    :将任务放入工作队列;
    note right
      队列类型:
      - ArrayBlockingQueue (有界)
      - LinkedBlockingQueue (无界)
      - SynchronousQueue (同步)
      - PriorityBlockingQueue (优先级)
    end note
  else (否)
    if (当前线程数 < 最大线程数?) then (是)
      :创建新的临时线程;
      note right
        临时线程在空闲超过
        keepAliveTime后销毁
      end note
      :执行任务;
    else (否)
      :执行拒绝策略;
      note right
        拒绝策略:
        - AbortPolicy (默认)
        - CallerRunsPolicy
        - DiscardPolicy
        - DiscardOldestPolicy
      end note
    endif
  endif
endif

fork
  :核心线程池;
  note right: 保持运行
fork again
  :临时线程池;
  note right: 空闲超时销毁
fork again
  :等待队列;
  note right: 任务缓存
end fork

stop

legend right
  参数说明:
  ====
  corePoolSize: 核心线程数
  maximumPoolSize: 最大线程数
  keepAliveTime: 空闲线程存活时间
  workQueue: 工作队列
  handler: 拒绝策略
endlegend

@enduml
```