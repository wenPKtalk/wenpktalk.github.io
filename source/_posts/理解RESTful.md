---
title: 理解RESTful
date: 2020-09-24 09:10:41
tags: [Architecture]
categories: [Architecture]
---

### 纠葛的问题：REST和RPC的对比？

思想上，概念上，使用范围 RPC和REST都完全不一样，本质上并不是同一类东西，只有部分功能重合。**REST和RPC在思想上存在差异的核心是：抽象目标不一样，也就是面向资源的编程思想和面向过程的编程思想之间的差异。**
REST：本质上不是一种协议，而是一种风格。

### 理解REST

REST 概念的提出来自于罗伊·菲尔丁（Roy Fielding）在 2000 年发表的博士论文：[《Architectural Styles and the Design of Network-based Sorftware Architectures》](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)。

REST全称为：**Representational State Transfer 即表征状态转移。**

### 为何常常使用HTTP搭配REST

**REST实际上是HTT(Hyper Text Transfer，超文本传输)的进一步抽象，就想是接口和实现类之间的关系。（即REST是接口，HTT是实现）**。

* Representation 表征 （对Resource的转换）：

  浏览器向客户端请求资源的HTML格式，那么返回的这个HTML我们就可以称之为：表征。也可以理解为MVC模式中的：表示层。

* State 状态：

  特定语境中产生的上下文信息称之为“状态”。注意Stateful 和 Stateless是针对的服务端没有记录上下文。浏览器每次携带上下文来请求服务端，比如：JWT技术

* Transfer 转移:

  服务端通过浏览器提供的信息，由当前的表示层转移到新的标识层，这就被成为：表征状态转移。

### 如何评价一个系统是否符合RESTful ？

Fielding 认为，一套理想的、完全满足 REST 的系统应该满足以下六个特征。

1. 服务端与客户端分离（Client-Server）

2. 无状态（Stateless）

   REST希望服务器不能负责维护状态，每一次从客户端发送的请求中，应该包括所有必要的上下文信息，会话信息也由客户端保存维护。服务器端依据客户端传递的状态信息来进行业务处理，并且驱动整个应用的状态变迁。提升了系统的可见性、可靠性和可伸缩性（大多数系统达不到这个要求，越复杂，越大型的系统越是如此。）

3. 可缓存（Cacheability）

   REST希望客户端和中间的通讯传递者（代理）可以将部分服务端应答缓存起来。通过良好的缓存机制，减少客户端和服务端的交互。

4. 分层系统（Layered System）

   不是传统的MVC这样的分层。而是指客户端一般不需要知道是否直接链接到了最终的服务器，或者是链接到了路径上的中间服务器。中间服务器可以通过负载均衡和共享缓存机制，提高系统的可扩展性。这样也便于缓存，伸缩和安全策略的部署。

5. 统一接口（Uniform Interface）

   REST希望开发者面向资源编程，**希望软件系统设计重点放放在抽象系统有哪些资源上，而不是抽象系统该有哪些行为上。**

   举例：

   > 几乎每个系统都会有登录和注销功能，如果你登录对应的是login() 注销对应于loginout()。那么如果面向资源可以理解成为：登录是PUT session 注销是DELETE session，这样你只需要设计一种“session”资源即可。查询登录用户使用GET session。

   Felding给出三个建议：

   1. 系统要做到每次请求中都包含资源的ID，所有操作都通过ID完成。
   2. 每个资源都应该有自描述信息。
   3. 通过超文本来驱动应用状态的转移。

6. 按需代码（Code-On-Demand）

### RESTful带来的优点

1. 降低了服务接口的学习成本

   它把资源的标准操作都映射到了标准的HTTP方法上（GET，PUT，POST，DELETE）对每个资源的语义一致。无需额外定义。

2. 资源天然具有集合与层次结构

   ```
   GET /book/{bookId}/chapter/{chapterNumber}
   ```

   天热的集合与层次关系。

3. RESTful绑定于HTTP协议

   面向资源编程并不是必须构筑在 HTTP 之上。

   但是HTTP 协议已经有效运作了 30 年，与其相关的技术基础设施已是千锤百炼，无比成熟。而它的坏处自然就是，当你想去考虑那些 HTTP 不提供的特性时，就束手无策了。

### RESTful缺点

1. 面向资源只适合做CRUD，只有面向过程，面向对象编程才能处理真正复杂的业务逻辑。

2. REST与HTTP完全绑定，不适用于要求高性能传输场景当中。

   面向资源编程与协议无关，但是 REST（特指 Fielding 论文中所定义的 REST，而不是泛指面向资源的思想）的确依赖着 HTTP 协议的标准方法、状态码和协议头等各个方面。

3. REST 不利于事务支持。

4. REST 没有传输可靠性支持。

   应对传输可靠性最简单粗暴的做法，就是把消息再重发一遍。这种简单处理能够成立的前提，是服务具有幂等性（Idempotency），也就是说服务被重复执行多次的效果与执行一次是相等的。

5. REST 缺乏对资源进行“部分”和“批量”的处理能力。

   就是缺少对资源的“部分”操作的支持。要解决批量操作这类问题，目前一种从理论上看还比较优秀的解决方案是GraphQL（但实际使用人数并不多）。GraphQL 是由 Facebook 提出并开源的一种面向资源 API 的数据查询语言。它和 SQL 一样，挂了个“查询语言”的名字，但其实 CRUD 都能做。

### 参考链接

周志明的软件架构课：https://time.geekbang.org/column/article/317164

李锟谈 Fielding 博士 REST 论文中文版发布：https://www.infoq.cn/article/2007/07/dlee-fielding-rest/

Fielding论文：https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm

### REST和RPC对比结论：

无论是思想上，概念上，还是使用范围上，REST和RPC都不完全一样，本质上并不是同一个类型的东西。充其量是相似，在应用中会存在重合功能。

1. 思想上差异：抽象目标不一样，REST是面向资源的编程思想，RPC是面向过程。
2. 概念上：REST并不是一种远程服务调用协议，也可以说它就不是一种协议，只是一种风格。RPC是作为一种远程调用协议的存在。
3. 试用范围：REST和RPC作为主流的两种远程调用方式，在使用上确实有重合之处。
