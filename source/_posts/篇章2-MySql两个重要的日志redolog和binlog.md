---
title: 篇章2-MySql两个重要的日志redolog和binlog
date: 2018-11-26 16:46:43
tags: [Database, Mysql]
categories: [Mysql]
---

### 概述

> 一句update的语句：Update T set C=c+1 where id = 2;

和查询语句一样会走一遍如下的流程：

![img](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220412/17_00/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlbnBlbmcxMg==,size_16,color_FFFFFF,t_70.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

**与查询语句不一样的是，更新语句设计上有两个重要的模块：redo log 和 binlog**

### 一、重要日志模块: redo log InnoDB引擎特有的日志

Write-Ahead Logging（WAL技术）它的关键点就是先写日志，再写磁盘，也就是先写粉板，等不忙的时候再写账本。

1. 当有一条记录需要更新的时候，InnoDB引擎就会先把记录写入到redo log（粉板）理。

2. 进行内存的更新。

   以上两步操作后更新就算完成了。

3. 同时InnoDB引擎会在适当的时候将这个操作记录更新到磁盘里面。而这个更新往往是系统比较空闲的时候。类比掌柜下班后将粉板上的赊账记录誊写到账本上，

但是：如果今天赊账的不多，掌柜可以等打烊后再整理。但如果某天赊账的特别多，粉板写满了，又怎么办呢？这个时候掌柜只好放下手中的活儿，把粉板中的一部分赊账记录更新到账本中，然后把这些记录从粉板上擦掉，为记新账腾出空间。

与此类似，InnoDB 的 redo log 是固定大小的，比如可以配置为一组 4 个文件，每个文件的大小是 1GB，那么这块“粉板”总共就可以记录 4GB 的操作。从头开始写，写到末尾就又回到开头循环写，如下面这个图所示。

![img](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220412/17_05/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlbnBlbmcxMg==,size_16,color_FFFFFF,t_70-20220412170519468.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

1. write pos 是当前记录的位置，一边写一边后移，写到第 3 号文件末尾后就回到 0 号文件开头。checkpoint 是当前要擦除的位置，也是往后推移并且循环的，擦除记录前要把记录更新到数据文件。

2. write pos 和 checkpoint 之间的是“粉板”上还空着的部分，可以用来记录新的操作。如果 write pos 追上 checkpoint，表示“粉板”满了，这时候不能再执行新的更新，得停下来先擦掉一些记录，把 checkpoint 推进一下。

3. crash-safe：有了 redo log，InnoDB 就可以保证即使数据库发生异常重启，之前提交的记录都不会丢失。

### 二、重要日志模块: binlog server层归档日志

因为最开始 MySQL 里并没有 InnoDB 引擎。MySQL 自带的引擎是 MyISAM，但是 MyISAM 没有 crash-safe 的能力，binlog 日志只能用于归档。而 InnoDB 是另一个公司以插件形式引入 MySQL 的，既然只依靠 binlog 是没有 crash-safe 能力的，所以 InnoDB 使用另外一套日志系统——也就是 redo log 来实现 crash-safe 能力。

### 三、redo log 和 binlog的差异：

1. redo log 是 InnoDB 引擎特有的；binlog 是 MySQL 的 Server 层实现的，所有引擎都可以使用。
2. redo log 是物理日志，记录的是“在某个数据页上做了什么修改”；binlog 是逻辑日志，记录的是这个语句的原始逻辑，比如“给 ID=2 这一行的 c 字段加 1 ”。
3. redo log 是循环写的，空间固定会用完；binlog 是可以追加写入的。“追加写”是指 binlog 文件写到一定大小后会切换到下一个，并不会覆盖以前的日志。

### 四、update语句执行流程：

1. 执行器先找引擎取 ID=2 这一行。ID 是主键，引擎直接用树搜索找到这一行。如果 ID=2 这一行所在的数据页本来就在内存中，就直接返回给执行器；否则，需要先从磁盘读入内存，然后再返回。

2. 执行器拿到引擎给的行数据，把这个值加上 1，比如原来是 N，现在就是 N+1，得到新的一行数据，再调用引擎接口写入这行新数据。

3. 引擎将这行新数据更新到内存中，同时将这个更新操作记录到 redo log 里面，此时 redo log 处于 prepare 状态。然后告知执行器执行完成了，随时可以提交事务。

4. 执行器生成这个操作的 binlog，并把 binlog 写入磁盘。

5. 执行器调用引擎的提交事务接口，引擎把刚刚写入的 redo log 改成提交（commit）状态，更新完成。

![img](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220412/17_04/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlbnBlbmcxMg==,size_16,color_FFFFFF,t_70-20220412170428798.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)

将 redo log 的写入拆成了两个步骤：prepare 和 commit，这就是"两阶段提交".

### 五、两阶段提交：

怎样让数据库恢复到半个月内任意一秒的状态？

1. 首先，找到最近的一次全量备份，如果你运气好，可能就是昨天晚上的一个备份，从这个备份恢复到临时库；

2. 然后，从备份的时间点开始，将备份的 binlog 依次取出来，重放到中午误删表之前的那个时刻。

   简单说，redo log 和 binlog 都可以用于表示事务的提交状态，而两阶段提交就是让这两个状态保持逻辑上的一致。

\>阅读《MySQL实战45讲》
