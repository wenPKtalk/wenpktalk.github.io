---
title: "第 15 章 索引"
disableNunjucks: true
---

# 第 15 章 索引

返回 [README](index.html)。链接按 Obsidian 的标题锚点格式生成，在 Obsidian 里点击会跳到对应小节；在其他 Markdown 阅读器里只会打开对应文件。

## 章节目录

- [15. 展望：其他并行系统与并行编程模型](15.0-index.html) · *15. Looking Ahead: Other Parallel Systems and Parallel Programming Models*
  - [全新的世界：弗林体系结构分类法](15.0-index.html) · *A Whole New World: Flynn’s Taxonomy of Architecture*

- [15.1. 异构计算：硬件加速器、GPGPU 计算与 CUDA](15.1-gpu.html) · *15.1. Heterogeneous Computing: Hardware Accelerators, GPGPU Computing, and CUDA*
  - [15.1.1. 硬件加速器](15.1-gpu.html) · *15.1.1. Hardware Accelerators*
    - [FPGA](15.1-gpu.html) · *FPGAs*
    - [GPU 与 Cell 处理器](15.1-gpu.html) · *GPUs and Cell Processors*
  - [15.1.2. GPU 体系结构概览](15.1-gpu.html) · *15.1.2. GPU architecture overview*
  - [15.1.3. GPGPU 计算](15.1-gpu.html) · *15.1.3. GPGPU Computing*
  - [15.1.4. CUDA](15.1-gpu.html) · *15.1.4. CUDA*
    - [CUDA 程序示例：标量乘法](15.1-gpu.html) · *Example CUDA Program: Scalar Multiply*
    - [CUDA 线程调度与同步](15.1-gpu.html) · *CUDA Thread Scheduling and Synchronization*
  - [15.1.5. 其他 GPGPU 编程语言](15.1-gpu.html) · *15.1.5. Other Languages for GPGPU Programming*
  - [15.1.6. 参考文献](15.1-gpu.html) · *15.1.6. References*

- [15.2. 分布式内存系统、消息传递与 MPI](15.2-distrmem.html) · *15.2. Distributed Memory Systems, Message Passing, and MPI*
  - [15.2.1. 并行与分布式处理模型](15.2-distrmem.html) · *15.2.1. Parallel and Distributed Processing Models*
    - [客户端/服务器](15.2-distrmem.html) · *Client/Server*
    - [流水线](15.2-distrmem.html) · *Pipeline*
    - [主管/工人（Boss/Worker）](15.2-distrmem.html) · *Boss/Worker*
    - [对等（Peer-to-Peer）](15.2-distrmem.html) · *Peer-to-Peer*
  - [15.2.2. 通信协议](15.2-distrmem.html) · *15.2.2. Communication Protocols*
  - [15.2.3. 消息传递接口（MPI）](15.2-distrmem.html) · *15.2.3. Message Passing Interface (MPI)*
  - [15.2.4. MPI Hello World](15.2-distrmem.html) · *15.2.4. MPI Hello World*
  - [15.2.5. MPI 标量乘法](15.2-distrmem.html) · *15.2.5. MPI Scalar Multiplication*
    - [MPI 通信](15.2-distrmem.html) · *MPI Communication*
    - [广播重要的值](15.2-distrmem.html) · *Broadcasting Important Values*
    - [分发数组](15.2-distrmem.html) · *Distributing the Array*
    - [并行执行](15.2-distrmem.html) · *Parallel Execution*
    - [汇总结果](15.2-distrmem.html) · *Aggregating Results*
    - [分发/收集（Scatter/Gather）](15.2-distrmem.html) · *Scatter/Gather*
    - [MPI 标量乘法的完整代码](15.2-distrmem.html) · *Full Code for MPI Scalar Multiply*
  - [15.2.6. 分布式系统面临的挑战](15.2-distrmem.html) · *15.2.6. Distributed Systems Challenges*
  - [MPI 学习资源](15.2-distrmem.html) · *MPI Resources*

- [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](15.3-cloud.html) · *15.3. To Exascale and Beyond: Cloud Computing, Big Data, and the Future of Computing*
  - [15.3.1. 云计算](15.3-cloud.html) · *15.3.1. Cloud Computing*
    - [软件即服务（SaaS）](15.3-cloud.html) · *Software as a Service*
    - [基础设施即服务（IaaS）](15.3-cloud.html) · *Infrastructure as a Service*
    - [平台即服务（PaaS）](15.3-cloud.html) · *Platform as a Service*
  - [15.3.2. MapReduce](15.3-cloud.html) · *15.3.2. MapReduce*
    - [理解 Map 与 Reduce 操作](15.3-cloud.html) · *Understanding Map and Reduce Operations*
    - [MapReduce 编程模型](15.3-cloud.html) · *The MapReduce Programming Model*
    - [容错](15.3-cloud.html) · *Fault Tolerance*
    - [Hadoop 与 Apache Spark](15.3-cloud.html) · *Hadoop and Apache Spark*
  - [15.3.3. 展望未来：机遇与挑战](15.3-cloud.html) · *15.3.3. Looking Toward the Future: Opportunities and Challenges*
  - [参考文献](15.3-cloud.html) · *References:*

## 插图索引（7 张）

| 编号 | 图注（节选） | 所在小节 |
|---|---|---|
| 15.0 图 1 | 弗林分类法根据处理器执行指令的方式对其进行分类。 | [全新的世界：弗林体系结构分类法](15.0-index.html) |
| 15.1 图 1 | 一个简化的 GPU 体系结构示例，共有 2,048 个核心。 | [15.1.2. GPU 体系结构概览](15.1-gpu.html) |
| 15.1 图 2 | CUDA 线程模型。 | [15.1.4. CUDA](15.1-gpu.html) |
| 15.2 图 1 | 由两个计算节点构成的无共享分布式内存体系结构的主要组成部分 | [15.2. 分布式内存系统、消息传递与 MPI](15.2-distrmem.html) |
| 15.2 图 2 | 一个 40 元素的数组在 8 个 MPI 进程（rank 0–7）之间的分配 | [分发数组](15.2-distrmem.html) |
| 15.3 图 1 | HDA 与 HPC 框架的比较。 | [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](15.3-cloud.html) |
| 15.3 图 2 | 用 MapReduce 框架并行处理歌曲《Code Monkey》的开头几句 | [MapReduce 编程模型](15.3-cloud.html) |

## 现代更新索引（19 条）

| 主题 | 所在小节 |
|---|---|
| SIMD、加速器与矩阵单元 | [全新的世界：弗林体系结构分类法](15.0-index.html) |
| FPGA 厂商格局 | [FPGA](15.1-gpu.html) |
| 真实 GPU 的规模 | [15.1.2. GPU 体系结构概览](15.1-gpu.html) |
| 统一内存走向硬件 | [15.1.3. GPGPU 计算](15.1-gpu.html) |
| warp 不再保证锁步 | [CUDA 线程调度与同步](15.1-gpu.html) |
| 超出线程块的同步 | [CUDA 线程调度与同步](15.1-gpu.html) |
| 今天常见的选择 | [15.1.5. 其他 GPGPU 编程语言](15.1-gpu.html) |
| 核数早已不止 64 | [15.2. 分布式内存系统、消息传递与 MPI](15.2-distrmem.html) |
| 互连网络 | [15.2. 分布式内存系统、消息传递与 MPI](15.2-distrmem.html) |
| MPI 标准版本 | [15.2.3. 消息传递接口（MPI）](15.2-distrmem.html) |
| 集合通信与 AI | [15.2.3. 消息传递接口（MPI）](15.2-distrmem.html) |
| E 级已经实现 | [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](15.3-cloud.html) |
| Facebook 更名与旧数据统计 | [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](15.3-cloud.html) |
| SaaS 产品更名 | [软件即服务（SaaS）](15.3-cloud.html) |
| GPU 也能"切片出租" | [基础设施即服务（IaaS）](15.3-cloud.html) |
| Spark 4.x 与 Spark Connect | [Hadoop 与 Apache Spark](15.3-cloud.html) |
| 功耗 | [15.3.3. 展望未来：机遇与挑战](15.3-cloud.html) |
| 融合已经发生 | [15.3.3. 展望未来：机遇与挑战](15.3-cloud.html) |
| DSA 与安全 | [15.3.3. 展望未来：机遇与挑战](15.3-cloud.html) |

## 译注与原书注索引（21 条有标题）

另有 38 条无标题的译注（多为术语或背景补充），散布在各节正文中，未列入下表。

| 类型 | 标题 | 所在小节 |
|---|---|---|
| 译注 | 图中标签 | [全新的世界：弗林体系结构分类法](15.0-index.html) |
| 译注 | SIMT 与 SIMD 的区别 | [15.1.2. GPU 体系结构概览](15.1-gpu.html) |
| 译注 | 图中标签 | [15.1.2. GPU 体系结构概览](15.1-gpu.html) |
| 译注 | 判断"值不值得上 GPU"的粗略算法 | [15.1.3. GPGPU 计算](15.1-gpu.html) |
| 译注 | 原文排版问题 | [15.1.4. CUDA](15.1-gpu.html) |
| 译注 | 用图做一道练习 | [15.1.4. CUDA](15.1-gpu.html) |
| 译注 | 读代码要点 | [CUDA 程序示例：标量乘法](15.1-gpu.html) |
| 译注 | 更稳妥的写法 | [CUDA 程序示例：标量乘法](15.1-gpu.html) |
| 原书注 | 关于时间顺序的说明（A Note on Chronology） | [15.2. 分布式内存系统、消息传递与 MPI](15.2-distrmem.html) |
| 译注 | 集合通信（collective communication） | [15.2.3. 消息传递接口（MPI）](15.2-distrmem.html) |
| 原书注 | 运行 MPI 代码（Running MPI Code） | [15.2.4. MPI Hello World](15.2-distrmem.html) |
| 译注 | 在自己电脑上试一试 | [15.2.4. MPI Hello World](15.2-distrmem.html) |
| 译注 | 原文表述不够准确 | [15.2.4. MPI Hello World](15.2-distrmem.html) |
| 原书注 | MPI_Bcast 的行为（MPI_Bcast Behavior） | [广播重要的值](15.2-distrmem.html) |
| 译注 | `MPI_Send` 会不会阻塞？ | [分发数组](15.2-distrmem.html) |
| 译注 | 代码注释要点 | [MPI 标量乘法的完整代码](15.2-distrmem.html) |
| 译注 | 延伸阅读的关键词 | [15.2.6. 分布式系统面临的挑战](15.2-distrmem.html) |
| 译注 | 图中标签对照（自下而上） | [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](15.3-cloud.html) |
| 译注 | 三种模式的速记 | [平台即服务（PaaS）](15.3-cloud.html) |
| 译注 | 与原论文的术语差异（重要） | [MapReduce 编程模型](15.3-cloud.html) |
| 译注 | 图中标签 | [MapReduce 编程模型](15.3-cloud.html) |
