---
title: 认识Junit 5
date: 2022-04-11 18:51:36
tags: Unit Test
categories: Unit Test
---

### JUnit 核心组件

Junit框架主要有三个核心组件：

#### JUnit Platform

> 提供在Jvm上启动测试框架的核心基础，是JUnit和客户端（包含构建工具Maven 或者Gradle或者Eclipse和IntelliJ）之间的接口。它采用了一种可以让外部工具发现，过滤和执行测试的称为“Launcher”的概念。

它还提供了用于开发在JUnit平台上运行测试框架的TestEngine API。使用TestEngine API，Spock,Cucumber和FitNesse第三方测试库可以直接植入和提供他们自定义的TestEngine。

#### JUnit Jupiter

它为在 Junit 5 中编写测试和扩展提供了新的编程模型和扩展模型。它有一个全新的注解，用于在 Junit 5 中编写测试用例。其中一些注解是`@BeforeEach`、`@AfterEach`、`@AfterAll`、`@BeforeAll` 等。它实现了 Junit Platform 提供的 TestEngine API，以便可以运行 Junit 5 测试。

#### JUnit Vintage

“Vintage”一词的基本意思是**经典**。因此，该子项目为在 JUnit 4 和 JUnit 3 中编写测试用例提供了广泛的支持。因此，该项目提供了向后兼容性。

![image-20220411204229226](https://cdn.jsdelivr.net/gh/wenPKtalk/pictures@master/blog/20220411/20_42/image-20220411204229226.png)
