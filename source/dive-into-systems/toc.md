---
title: "Dive Into Systems 中英对照 · 全书索引"
disableNunjucks: true
---

# Dive Into Systems 中英对照 · 全书索引

返回 [README](index.html)。链接按 Obsidian 的标题锚点格式生成，在 Obsidian 里点击会跳到对应小节；在其他 Markdown 阅读器里只会打开对应文件。本文件由 `_build/toc.py` 生成，请勿手改。

## 统计

「其中勘误」是按关键词（应为、笔误、说反、不一致、并不准确……）从译注里自动筛出来的，属于粗略统计：措辞不含这些词的更正会漏掉，个别只是顺带提到「原文说」的译注也可能被算进来。

| 章 | 页 | 插图 | 译注 | 其中勘误 | 现代更新 |
|---|---|---|---|---|---|
| 00-Front | 4 | 3 | 4 | 0 | 2 |
| C1-C_intro | 9 | 7 | 13 | 0 | 3 |
| C2-C_depth | 19 | 15 | 36 | 3 | 3 |
| C3-C_debug | 8 | 0 | 10 | 1 | 1 |
| C4-Binary | 14 | 15 | 21 | 3 | 4 |
| C5-Arch | 15 | 46 | 5 | 1 | 5 |
| C6-asm_intro | 1 | 0 | 3 | 0 | 1 |
| C7-x86_64 | 15 | 18 | 29 | 9 | 4 |
| C8-IA32 | 15 | 17 | 28 | 8 | 1 |
| C9-ARM64 | 15 | 17 | 33 | 6 | 2 |
| C10-asm_takeaways | 1 | 0 | 1 | 1 | 1 |
| C11-MemHierarchy | 9 | 32 | 7 | 0 | 2 |
| C12-CodeOpt | 5 | 0 | 12 | 2 | 2 |
| C13-OS | 10 | 28 | 14 | 2 | 3 |
| C14-SharedMemory | 15 | 9 | 18 | 3 | 1 |
| C15-Parallel | 4 | 7 | 56 | 3 | 19 |
| Appendix1 | 9 | 7 | 1 | 0 | 2 |
| Appendix2 | 17 | 3 | 18 | 9 | 2 |
| **合计** | 185 | 224 | 309 | 51 | 58 |

## 章节目录

### 前置部分

- [版权](00-Front/copyright.html)
- [许可协议：CC BY-NC-ND 4.0](00-Front/copyright.html)
- [免责声明](00-Front/copyright.html)
- [致谢](00-Front/acknowledgements.html)
- [正式审稿人](00-Front/acknowledgements.html)
- [其他反馈](00-Front/acknowledgements.html)
- [早期采用者](00-Front/acknowledgements.html)
  - [2019–2020 学年的早期采用者](00-Front/acknowledgements.html)
- [前言](00-Front/preface.html)
- [本书讲什么](00-Front/preface.html)
- [本书的使用方式](00-Front/preface.html)
  - [各章主题概览](00-Front/preface.html)
  - [本书的使用示例](00-Front/preface.html)
  - [在线版本](00-Front/preface.html)
- [0. 引言](00-Front/0.0-introduction.html)
- [什么是计算机系统？](00-Front/0.0-introduction.html)
- [现代计算机系统是什么样的？](00-Front/0.0-introduction.html)
- [你将在本书中学到什么](00-Front/0.0-introduction.html)
- [开始阅读本书](00-Front/0.0-introduction.html)
  - [Linux、C 与 GNU 编译器](00-Front/0.0-introduction.html)
  - [其他记号与提示框](00-Front/0.0-introduction.html)
- [参考文献](00-Front/0.0-introduction.html)

### 1. 在 C 边，在 C 边，在美丽的 C 边

- [1. 在 C 边，在 C 边，在美丽的 C 边](C1-C_intro/1.0-index.html)
- [1.1. C 语言编程入门](C1-C_intro/1.1-getting_started.html)
  - [1.1.1. 编译和运行 C 程序](C1-C_intro/1.1-getting_started.html)
  - [1.1.2. 变量与 C 的数值类型](C1-C_intro/1.1-getting_started.html)
  - [1.1.3. C 的类型](C1-C_intro/1.1-getting_started.html)
- [1.2. 输入/输出（printf 与 scanf）](C1-C_intro/1.2-input_output.html)
  - [1.2.1. printf](C1-C_intro/1.2-input_output.html)
  - [1.2.2. scanf](C1-C_intro/1.2-input_output.html)
- [1.3. 条件语句与循环](C1-C_intro/1.3-conditionals.html)
  - [1.3.1. C 中的布尔值](C1-C_intro/1.3-conditionals.html)
  - [1.3.2. C 中的循环](C1-C_intro/1.3-conditionals.html)
- [1.4. 函数](C1-C_intro/1.4-functions.html)
  - [1.4.1. 栈](C1-C_intro/1.4-functions.html)
- [1.5. 数组与字符串](C1-C_intro/1.5-arrays_strings.html)
  - [1.5.1. 数组简介](C1-C_intro/1.5-arrays_strings.html)
  - [1.5.2. 访问数组的方法](C1-C_intro/1.5-arrays_strings.html)
  - [1.5.3. 数组与函数](C1-C_intro/1.5-arrays_strings.html)
  - [1.5.4. 字符串与 C 字符串库简介](C1-C_intro/1.5-arrays_strings.html)
- [1.6. 结构体](C1-C_intro/1.6-structs.html)
  - [1.6.1. 定义结构体类型](C1-C_intro/1.6-structs.html)
  - [1.6.2. 声明结构体类型的变量](C1-C_intro/1.6-structs.html)
  - [1.6.3. 访问字段值](C1-C_intro/1.6-structs.html)
  - [1.6.4. 把结构体传给函数](C1-C_intro/1.6-structs.html)
- [1.7. 小结](C1-C_intro/1.7-summary.html)
- [1.8. 练习](C1-C_intro/1.8-exercises.html)

### 2. 深入 C 语言编程

- [2. 深入 C 语言编程](C2-C_depth/2.0-index.html)
- [2.1. 程序内存的组成与作用域](C2-C_depth/2.1-scope_memory.html)
- [2.2. C 的指针变量](C2-C_depth/2.2-pointers.html)
  - [2.2.1. 指针变量](C2-C_depth/2.2-pointers.html)
- [2.3. 指针与函数](C2-C_depth/2.3-pointers_functions.html)
- [2.4. 动态内存分配](C2-C_depth/2.4-dynamic_memory.html)
  - [2.4.1. 堆内存](C2-C_depth/2.4-dynamic_memory.html)
  - [2.4.2. malloc 与 free](C2-C_depth/2.4-dynamic_memory.html)
  - [2.4.3. 动态分配的数组与字符串](C2-C_depth/2.4-dynamic_memory.html)
  - [2.4.4. 指向堆内存的指针与函数](C2-C_depth/2.4-dynamic_memory.html)
- [2.5. C 中的数组](C2-C_depth/2.5-arrays.html)
  - [2.5.1. 一维数组](C2-C_depth/2.5-arrays.html)
  - [2.5.2. 二维数组](C2-C_depth/2.5-arrays.html)
- [2.6. 字符串与字符串库](C2-C_depth/2.6-strings.html)
  - [2.6.1. C 对静态分配字符串（char 数组）的支持](C2-C_depth/2.6-strings.html)
  - [2.6.2. 动态分配字符串](C2-C_depth/2.6-strings.html)
  - [2.6.3. 操作 C 字符串和字符的库](C2-C_depth/2.6-strings.html)
- [2.7. C 结构体](C2-C_depth/2.7-structs.html)
  - [2.7.1. C 结构体类型回顾](C2-C_depth/2.7-structs.html)
  - [2.7.2. 指针与结构体](C2-C_depth/2.7-structs.html)
  - [2.7.3. 结构体中的指针字段](C2-C_depth/2.7-structs.html)
  - [2.7.4. 结构体数组](C2-C_depth/2.7-structs.html)
  - [2.7.5. 自引用结构体](C2-C_depth/2.7-structs.html)
- [2.8. C 中的 I/O（标准 I/O 与文件 I/O）](C2-C_depth/2.8-IO.html)
  - [2.8.1. 标准输入/输出](C2-C_depth/2.8-IO.html)
  - [2.8.2. 文件输入/输出](C2-C_depth/2.8-IO.html)
  - [2.8.3. 在 C 中使用文本文件](C2-C_depth/2.8-IO.html)
  - [2.8.4. `stdio.h` 中的标准 I/O 与文件 I/O 函数](C2-C_depth/2.8-IO.html)
- [2.9. C 的一些高级特性](C2-C_depth/2.9-advanced.html)
  - [2.9.1. 常量、switch、enum 与 typedef](C2-C_depth/2.9.1-advanced_switch.html)
  - [2.9.2. 命令行参数](C2-C_depth/2.9.2-advanced_cmd_line_args.html)
  - [2.9.3. `void *` 类型与类型强制转换](C2-C_depth/2.9.3-advanced_voidstar.html)
  - [2.9.4. 指针运算](C2-C_depth/2.9.4-advanced_pointer_arithmetic.html)
  - [2.9.5. C 库：使用、编译与链接](C2-C_depth/2.9.5-advanced_libraries.html)
  - [2.9.6. 编写和使用自己的 C 库](C2-C_depth/2.9.6-advanced_writing_libraries.html)
  - [2.9.7. 把 C 编译为汇编，以及编译和链接汇编与 C 代码](C2-C_depth/2.9.7-advanced_assembly.html)
- [2.10. 小结](C2-C_depth/2.10-summary.html)
- [2.11. 练习](C2-C_depth/2.11-exercises.html)

### 3. C 调试工具

- [3. C 调试工具](C3-C_debug/3.0-index.html)
- [3.1. 用 GDB 调试](C3-C_debug/3.1-gdb.html)
  - [3.1.1. GDB 入门](C3-C_debug/3.1-gdb.html)
  - [3.1.2. GDB 会话示例](C3-C_debug/3.1-gdb.html)
- [3.2. GDB 命令详解](C3-C_debug/3.2-gdb_commands.html)
  - [3.2.1. GDB 中的键盘快捷方式](C3-C_debug/3.2-gdb_commands.html)
  - [3.2.2. 常用 GDB 命令](C3-C_debug/3.2-gdb_commands.html)
- [3.3. 用 Valgrind 调试内存](C3-C_debug/3.3-valgrind.html)
  - [3.3.1. 一个含有堆内存访问错误的示例程序](C3-C_debug/3.3-valgrind.html)
  - [3.3.2. 如何使用 Memcheck](C3-C_debug/3.3-valgrind.html)
- [3.4. GDB 的高级功能](C3-C_debug/3.4-gdb_advanced.html)
  - [3.4.1. GDB 与 make](C3-C_debug/3.4-gdb_advanced.html)
  - [3.4.2. 把 GDB 附加到正在运行的进程](C3-C_debug/3.4-gdb_advanced.html)
  - [3.4.3. 在 fork 时跟随进程](C3-C_debug/3.4-gdb_advanced.html)
  - [3.4.4. 信号控制](C3-C_debug/3.4-gdb_advanced.html)
  - [3.4.5. DDD 的设置与问题修复](C3-C_debug/3.4-gdb_advanced.html)
- [3.5. 调试汇编代码](C3-C_debug/3.5-gdb_assembly.html)
  - [3.5.1. 用 GDB 检查二进制代码](C3-C_debug/3.5-gdb_assembly.html)
  - [3.5.2. 用 DDD 在汇编层面调试](C3-C_debug/3.5-gdb_assembly.html)
  - [3.5.3. GDB 汇编代码调试命令与示例](C3-C_debug/3.5-gdb_assembly.html)
  - [3.5.4. 汇编调试常用命令速查](C3-C_debug/3.5-gdb_assembly.html)
- [3.6. 用 GDB 调试多线程程序](C3-C_debug/3.6-gdb_pthreads.html)
  - [3.6.1. GDB 与 Pthreads](C3-C_debug/3.6-gdb_pthreads.html)
  - [3.6.2. GDB 中与线程相关的命令：](C3-C_debug/3.6-gdb_pthreads.html)
  - [3.6.3. 示例：](C3-C_debug/3.6-gdb_pthreads.html)
- [3.7. 小结](C3-C_debug/3.7-summary.html)

### 4. 二进制与数据表示

- [4. 二进制与数据表示](C4-Binary/4.0-index.html)
- [4.1. 数的进制与无符号整数](C4-Binary/4.1-bases.html)
  - [4.1.1. 十进制数](C4-Binary/4.1-bases.html)
  - [4.1.2. 无符号二进制数](C4-Binary/4.1-bases.html)
  - [4.1.3. 十六进制](C4-Binary/4.1-bases.html)
  - [4.1.4. 存储的限制](C4-Binary/4.1-bases.html)
- [4.2. 进制之间的转换](C4-Binary/4.2-conversion.html)
  - [4.2.1. 二进制与十六进制之间的转换](C4-Binary/4.2-conversion.html)
  - [4.2.2. 转换为十进制](C4-Binary/4.2-conversion.html)
  - [4.2.3. 从十进制转换](C4-Binary/4.2-conversion.html)
- [4.3. 有符号二进制整数](C4-Binary/4.3-signed.html)
  - [4.3.1. 原码](C4-Binary/4.3-signed.html)
  - [4.3.2. 补码](C4-Binary/4.3-signed.html)
- [4.4. 二进制整数运算](C4-Binary/4.4-arithmetic.html)
  - [4.4.1. 加法](C4-Binary/4.4.1-arithmetic_addition.html)
  - [4.4.2. 减法](C4-Binary/4.4.2-arithmetic_subtraction.html)
  - [4.4.3. 乘法与除法](C4-Binary/4.4.3-arithmetic_mult_div.html)
- [4.5. 整数溢出](C4-Binary/4.5-overflow.html)
  - [4.5.1. 里程表的类比](C4-Binary/4.5-overflow.html)
  - [4.5.2. 二进制整数溢出](C4-Binary/4.5-overflow.html)
  - [4.5.3. 溢出小结](C4-Binary/4.5-overflow.html)
  - [4.5.4. 溢出的后果](C4-Binary/4.5-overflow.html)
- [4.6. 位运算符](C4-Binary/4.6-bitwise.html)
  - [4.6.1. 按位与](C4-Binary/4.6-bitwise.html)
  - [4.6.2. 按位或](C4-Binary/4.6-bitwise.html)
  - [4.6.3. 按位异或（XOR）](C4-Binary/4.6-bitwise.html)
  - [4.6.4. 按位取反](C4-Binary/4.6-bitwise.html)
  - [4.6.5. 移位](C4-Binary/4.6-bitwise.html)
- [4.7. 整数的字节序](C4-Binary/4.7-byte_order.html)
  - [4.7.1. 参考文献](C4-Binary/4.7-byte_order.html)
- [4.8. 实数的二进制表示](C4-Binary/4.8-floating_point.html)
  - [4.8.1. 定点表示](C4-Binary/4.8-floating_point.html)
  - [4.8.2. 浮点表示](C4-Binary/4.8-floating_point.html)
  - [4.8.3. 舍入的后果](C4-Binary/4.8-floating_point.html)
- [4.9. 小结](C4-Binary/4.9-summary.html)
- [4.10. 练习](C4-Binary/4.10-exercises.html)
  - [附加练习](C4-Binary/4.10-exercises.html)
  - [答案](C4-Binary/4.10-exercises.html)

### 5. 冯·诺依曼早已知道的事：计算机体系结构

- [5. 冯·诺依曼早已知道的事：计算机体系结构](C5-Arch/5.0-index.html)
  - [参考文献](C5-Arch/5.0-index.html)
- [5.1. 现代计算机体系结构的起源](C5-Arch/5.1-hist.html)
  - [5.1.1. 图灵机](C5-Arch/5.1-hist.html)
  - [5.1.2. 早期的电子计算机](C5-Arch/5.1-hist.html)
  - [5.1.3. 那么，冯·诺依曼知道些什么？](C5-Arch/5.1-hist.html)
  - [5.1.4. 参考文献](C5-Arch/5.1-hist.html)
- [5.2. 冯·诺依曼体系结构](C5-Arch/5.2-von.html)
  - [5.2.1. CPU](C5-Arch/5.2-von.html)
  - [5.2.2. 处理单元](C5-Arch/5.2-von.html)
  - [5.2.3. 控制单元](C5-Arch/5.2-von.html)
  - [5.2.4. 存储单元](C5-Arch/5.2-von.html)
  - [5.2.5. 输入和输出（I/O）单元](C5-Arch/5.2-von.html)
  - [5.2.6. 冯·诺依曼机器的运转：执行一个程序](C5-Arch/5.2-von.html)
- [5.3. 逻辑门](C5-Arch/5.3-gates.html)
  - [5.3.1. 基本逻辑门](C5-Arch/5.3-gates.html)
  - [5.3.2. 其他逻辑门](C5-Arch/5.3-gates.html)
- [5.4. 电路](C5-Arch/5.4-circuits.html)
  - [5.4.1. 算术与逻辑电路](C5-Arch/5.4.1-arithlogiccircs.html)
  - [5.4.2. 控制电路](C5-Arch/5.4.2-controlcircs.html)
  - [5.4.3. 存储电路](C5-Arch/5.4.3-storagecircs.html)
- [5.5. 构建处理器：把一切组合起来](C5-Arch/5.5-cpu.html)
  - [5.5.1. ALU](C5-Arch/5.5-cpu.html)
  - [5.5.2. 寄存器文件](C5-Arch/5.5-cpu.html)
  - [5.5.3. CPU](C5-Arch/5.5-cpu.html)
- [5.6. 处理器对程序指令的执行](C5-Arch/5.6-instrexec.html)
  - [5.6.1. 时钟驱动的执行](C5-Arch/5.6-instrexec.html)
  - [5.6.2. 把一切组合起来：完整计算机中的 CPU](C5-Arch/5.6-instrexec.html)
  - [5.6.3. 脚注](C5-Arch/5.6-instrexec.html)
- [5.7. 流水线：让 CPU 更快](C5-Arch/5.7-pipelining.html)
- [5.8. 流水线指令的进阶问题](C5-Arch/5.8-pipelining_advanced.html)
  - [5.8.1. 流水线问题：数据冒险](C5-Arch/5.8-pipelining_advanced.html)
  - [5.8.2. 流水线冒险：控制冒险](C5-Arch/5.8-pipelining_advanced.html)
  - [参考文献](C5-Arch/5.8-pipelining_advanced.html)
- [5.9. 展望：今天的 CPU](C5-Arch/5.9-modern.html)
  - [5.9.1. 指令级并行](C5-Arch/5.9-modern.html)
  - [5.9.2. 多核与硬件多线程](C5-Arch/5.9-modern.html)
  - [5.9.3. 几个处理器实例](C5-Arch/5.9-modern.html)
  - [脚注与参考文献](C5-Arch/5.9-modern.html)
- [5.10. 小结](C5-Arch/5.10-summary.html)
  - [脚注](C5-Arch/5.10-summary.html)
- [5.11. 练习](C5-Arch/5.11-exercises.html)
  - [附加练习](C5-Arch/5.11-exercises.html)

### 6. 在 C 之下：潜入汇编

- [6. 在 C 之下：潜入汇编](C6-asm_intro/6.0-index.html)
  - [学习汇编的好处](C6-asm_intro/6.0-index.html)
  - [接下来几章你将学到什么](C6-asm_intro/6.0-index.html)

### 7. 64 位 x86 汇编（x86-64）

- [7. 64 位 x86 汇编（x86-64）](C7-x86_64/7.0-index.html)
- [7.1. 潜入汇编：基础知识](C7-x86_64/7.1-basics.html)
  - [7.1.1. 寄存器](C7-x86_64/7.1-basics.html)
  - [7.1.2. 寄存器的进阶记法](C7-x86_64/7.1-basics.html)
  - [7.1.3. 指令的结构](C7-x86_64/7.1-basics.html)
  - [7.1.4. 一个关于操作数的例子](C7-x86_64/7.1-basics.html)
  - [7.1.5. 指令后缀](C7-x86_64/7.1-basics.html)
- [7.2. 常用指令](C7-x86_64/7.2-common.html)
  - [7.2.1. 把一切组合起来：一个更具体的例子](C7-x86_64/7.2-common.html)
- [7.3. 算术指令](C7-x86_64/7.3-arithmetic.html)
  - [7.3.1. 移位指令](C7-x86_64/7.3-arithmetic.html)
  - [7.3.2. 位运算指令](C7-x86_64/7.3-arithmetic.html)
  - [7.3.3. 加载有效地址指令](C7-x86_64/7.3-arithmetic.html)
- [7.4. 条件控制与循环](C7-x86_64/7.4-conditional_control_loops.html)
  - [7.4.1. 预备知识](C7-x86_64/7.4.1-preliminaries.html)
  - [条件比较指令](C7-x86_64/7.4.1-preliminaries.html)
  - [跳转指令](C7-x86_64/7.4.1-preliminaries.html)
  - [`goto` 语句](C7-x86_64/7.4.1-preliminaries.html)
  - [参考文献](C7-x86_64/7.4.1-preliminaries.html)
  - [7.4.2. 汇编中的 if 语句](C7-x86_64/7.4.2-if_statements.html)
  - [7.4.3. 汇编中的循环](C7-x86_64/7.4.3-loops.html)
- [7.5. 汇编中的函数](C7-x86_64/7.5-functions.html)
  - [7.5.1. 函数参数](C7-x86_64/7.5-functions.html)
  - [7.5.2. 跟踪一个例子](C7-x86_64/7.5-functions.html)
  - [7.5.3. 跟踪 main](C7-x86_64/7.5-functions.html)
- [7.6. 递归](C7-x86_64/7.6-recursion.html)
  - [7.6.1. 动画：观察调用栈如何变化](C7-x86_64/7.6-recursion.html)
- [7.7. 数组](C7-x86_64/7.7-arrays.html)
- [7.8. 矩阵](C7-x86_64/7.8-matrices.html)
  - [7.8.1. 连续的二维数组](C7-x86_64/7.8-matrices.html)
  - [7.8.2. 不连续的矩阵](C7-x86_64/7.8-matrices.html)
- [7.9. 汇编中的结构体](C7-x86_64/7.9-structs.html)
  - [7.9.1. 数据对齐与结构体](C7-x86_64/7.9-structs.html)
- [7.10. 现实世界：缓冲区溢出](C7-x86_64/7.10-buffer_overflow.html)
  - [7.10.1. 著名的缓冲区溢出案例](C7-x86_64/7.10-buffer_overflow.html)
  - [7.10.2. 初探：猜谜游戏](C7-x86_64/7.10-buffer_overflow.html)
  - [7.10.3. 仔细看看（C 之下）](C7-x86_64/7.10-buffer_overflow.html)
  - [7.10.4. 缓冲区溢出：第一次尝试](C7-x86_64/7.10-buffer_overflow.html)
  - [7.10.5. 更聪明的缓冲区溢出：第二次尝试](C7-x86_64/7.10-buffer_overflow.html)
  - [7.10.6. 防御缓冲区溢出](C7-x86_64/7.10-buffer_overflow.html)
  - [参考文献](C7-x86_64/7.10-buffer_overflow.html)
- [7.11. 练习](C7-x86_64/7.11-exercises.html)

### 8. 32 位 x86 汇编（IA32）

- [8. 32 位 x86 汇编（IA32）](C8-IA32/8.0-index.html)
- [8.1. 潜入汇编：基础知识](C8-IA32/8.1-basics.html)
  - [8.1.1. 寄存器](C8-IA32/8.1-basics.html)
  - [8.1.2. 寄存器的进阶记法](C8-IA32/8.1-basics.html)
  - [8.1.3. 指令的结构](C8-IA32/8.1-basics.html)
  - [8.1.4. 一个关于操作数的例子](C8-IA32/8.1-basics.html)
  - [8.1.5. 指令后缀](C8-IA32/8.1-basics.html)
- [8.2. 常用指令](C8-IA32/8.2-common.html)
  - [8.2.1. 综合运用：一个更具体的例子](C8-IA32/8.2-common.html)
- [8.3. 算术指令](C8-IA32/8.3-arithmetic.html)
  - [8.3.1. 移位指令](C8-IA32/8.3-arithmetic.html)
  - [8.3.2. 位运算指令](C8-IA32/8.3-arithmetic.html)
  - [8.3.3. 加载有效地址指令](C8-IA32/8.3-arithmetic.html)
- [8.4. 条件控制与循环](C8-IA32/8.4-conditional_control_loops.html)
  - [8.4.1. 预备知识](C8-IA32/8.4.1-preliminaries.html)
  - [条件比较指令](C8-IA32/8.4.1-preliminaries.html)
  - [跳转指令](C8-IA32/8.4.1-preliminaries.html)
  - [`goto` 语句](C8-IA32/8.4.1-preliminaries.html)
  - [参考文献](C8-IA32/8.4.1-preliminaries.html)
  - [8.4.2. 汇编中的 if 语句](C8-IA32/8.4.2-if_statements.html)
  - [8.4.3. 汇编中的循环](C8-IA32/8.4.3-loops.html)
- [8.5. 汇编中的函数](C8-IA32/8.5-functions.html)
  - [8.5.1. 跟踪一个例子](C8-IA32/8.5-functions.html)
  - [8.5.2. 跟踪 main](C8-IA32/8.5-functions.html)
- [8.6. 递归](C8-IA32/8.6-recursion.html)
  - [8.6.1. 动画：观察调用栈如何变化](C8-IA32/8.6-recursion.html)
- [8.7. 数组](C8-IA32/8.7-arrays.html)
- [8.8. 矩阵](C8-IA32/8.8-matrices.html)
  - [8.8.1. 连续的二维数组](C8-IA32/8.8-matrices.html)
  - [8.8.2. 不连续的矩阵](C8-IA32/8.8-matrices.html)
- [8.9. 汇编中的结构体](C8-IA32/8.9-structs.html)
  - [8.9.1. 数据对齐与结构体](C8-IA32/8.9-structs.html)
- [8.10. 现实世界：缓冲区溢出](C8-IA32/8.10-buffer_overflow.html)
  - [8.10.1. 著名的缓冲区溢出案例](C8-IA32/8.10-buffer_overflow.html)
  - [8.10.2. 初探：猜谜游戏](C8-IA32/8.10-buffer_overflow.html)
  - [8.10.3. 仔细看看（C 之下）](C8-IA32/8.10-buffer_overflow.html)
  - [8.10.4. 缓冲区溢出：第一次尝试](C8-IA32/8.10-buffer_overflow.html)
  - [8.10.5. 更聪明的缓冲区溢出：第二次尝试](C8-IA32/8.10-buffer_overflow.html)
  - [8.10.6. 防御缓冲区溢出](C8-IA32/8.10-buffer_overflow.html)
  - [参考文献](C8-IA32/8.10-buffer_overflow.html)
- [8.11. 练习](C8-IA32/8.11-exercises.html)

### 9. ARM 汇编

- [9. ARM 汇编](C9-ARM64/9.0-index.html)
- [9.1. 潜入汇编：基础知识](C9-ARM64/9.1-basics.html)
  - [9.1.1. 寄存器](C9-ARM64/9.1-basics.html)
  - [9.1.2. 寄存器的进阶记法](C9-ARM64/9.1-basics.html)
  - [9.1.3. 指令的结构](C9-ARM64/9.1-basics.html)
  - [9.1.4. 一个关于操作数的例子](C9-ARM64/9.1-basics.html)
- [9.2. 常用指令](C9-ARM64/9.2-common.html)
  - [9.2.1. 综合运用：一个更具体的例子](C9-ARM64/9.2-common.html)
- [9.3. 算术指令](C9-ARM64/9.3-arithmetic.html)
  - [9.3.1. 常用算术指令](C9-ARM64/9.3-arithmetic.html)
  - [9.3.2. 移位指令](C9-ARM64/9.3-arithmetic.html)
  - [9.3.3. 位运算指令](C9-ARM64/9.3-arithmetic.html)
- [9.4. 条件控制与循环](C9-ARM64/9.4-conditional_control_loops.html)
  - [9.4.1. 预备知识](C9-ARM64/9.4.1-preliminaries.html)
  - [条件比较指令](C9-ARM64/9.4.1-preliminaries.html)
  - [分支指令](C9-ARM64/9.4.1-preliminaries.html)
  - [`goto` 语句](C9-ARM64/9.4.1-preliminaries.html)
  - [参考文献](C9-ARM64/9.4.1-preliminaries.html)
  - [9.4.2. 汇编中的 if 语句](C9-ARM64/9.4.2-if_statements.html)
  - [9.4.3. 汇编中的循环](C9-ARM64/9.4.3-loops.html)
- [9.5. 汇编中的函数](C9-ARM64/9.5-functions.html)
  - [9.5.1. 函数参数](C9-ARM64/9.5-functions.html)
  - [9.5.2. 跟踪一个例子](C9-ARM64/9.5-functions.html)
  - [9.5.3. 跟踪 main](C9-ARM64/9.5-functions.html)
- [9.6. 递归](C9-ARM64/9.6-recursion.html)
  - [9.6.1. 动画：观察调用栈如何变化](C9-ARM64/9.6-recursion.html)
- [9.7. 数组](C9-ARM64/9.7-arrays.html)
- [9.8. 矩阵](C9-ARM64/9.8-matrices.html)
  - [9.8.1. 连续的二维数组](C9-ARM64/9.8-matrices.html)
  - [9.8.2. 不连续的矩阵](C9-ARM64/9.8-matrices.html)
- [9.9. 汇编中的结构体](C9-ARM64/9.9-structs.html)
  - [9.9.1. 数据对齐与结构体](C9-ARM64/9.9-structs.html)
- [9.10. 现实世界：缓冲区溢出](C9-ARM64/9.10-buffer_overflow.html)
  - [9.10.1. 著名的缓冲区溢出案例](C9-ARM64/9.10-buffer_overflow.html)
  - [9.10.2. 初探：猜谜游戏](C9-ARM64/9.10-buffer_overflow.html)
  - [9.10.3. 仔细看看（C 之下）](C9-ARM64/9.10-buffer_overflow.html)
  - [9.10.4. 缓冲区溢出：第一次尝试](C9-ARM64/9.10-buffer_overflow.html)
  - [9.10.5. 更聪明的缓冲区溢出：第二次尝试](C9-ARM64/9.10-buffer_overflow.html)
  - [9.10.6. 防御缓冲区溢出](C9-ARM64/9.10-buffer_overflow.html)
  - [参考文献](C9-ARM64/9.10-buffer_overflow.html)
- [9.11. 练习](C9-ARM64/9.11-exercises.html)

### 10. 汇编要点总结

- [10. 汇编要点总结](C10-asm_takeaways/10.0-index.html)
  - [共同特征](C10-asm_takeaways/10.0-index.html)
  - [延伸阅读](C10-asm_takeaways/10.0-index.html)

### 11. 存储与存储器层次结构

- [11. 存储与存储器层次结构](C11-MemHierarchy/11.0-index.html)
- [11.1. 存储器层次结构](C11-MemHierarchy/11.1-mem_hierarchy.html)
- [11.2. 存储设备](C11-MemHierarchy/11.2-devices.html)
  - [11.2.1. 主存储](C11-MemHierarchy/11.2-devices.html)
  - [11.2.2. 辅助存储](C11-MemHierarchy/11.2-devices.html)
- [11.3. 局部性](C11-MemHierarchy/11.3-locality.html)
  - [11.3.1. 代码中的局部性示例](C11-MemHierarchy/11.3-locality.html)
  - [11.3.2. 从局部性到缓存](C11-MemHierarchy/11.3-locality.html)
  - [11.3.3. 时间局部性](C11-MemHierarchy/11.3-locality.html)
  - [11.3.4. 空间局部性](C11-MemHierarchy/11.3-locality.html)
- [11.4. CPU 缓存](C11-MemHierarchy/11.4-caching.html)
  - [11.4.1. 直接映射缓存](C11-MemHierarchy/11.4-caching.html)
  - [11.4.2. 缓存未命中与相联设计](C11-MemHierarchy/11.4-caching.html)
  - [11.4.3. 组相联缓存](C11-MemHierarchy/11.4-caching.html)
- [11.5. 缓存分析与 Valgrind](C11-MemHierarchy/11.5-cachegrind.html)
  - [11.5.1. 初步分析：理论分析与基准测试](C11-MemHierarchy/11.5-cachegrind.html)
  - [11.5.2. 现实中的缓存分析：Cachegrind](C11-MemHierarchy/11.5-cachegrind.html)
- [11.6. 展望：多核处理器上的缓存](C11-MemHierarchy/11.6-coherency.html)
  - [11.6.1. 缓存一致性](C11-MemHierarchy/11.6-coherency.html)
  - [11.6.2. MSI 协议](C11-MemHierarchy/11.6-coherency.html)
  - [11.6.3. 缓存一致性协议的实现](C11-MemHierarchy/11.6-coherency.html)
  - [11.6.4. 关于多核缓存的更多内容](C11-MemHierarchy/11.6-coherency.html)
  - [脚注](C11-MemHierarchy/11.6-coherency.html)
- [11.7. 小结](C11-MemHierarchy/11.7-summary.html)
- [11.8. 练习](C11-MemHierarchy/11.8-exercises.html)

### 12. 代码优化

- [12. 代码优化](C12-CodeOpt/12.0-index.html)
  - [编译器已经在做的事](C12-CodeOpt/12.0-index.html)
  - [编译器并不总能做到的事：学习代码优化的好处](C12-CodeOpt/12.0-index.html)
  - [与编译器合作：一个示例程序](C12-CodeOpt/12.0-index.html)
  - [参考文献](C12-CodeOpt/12.0-index.html)
- [12.1. 代码优化的第一步：代码剖析](C12-CodeOpt/12.1-basic.html)
  - [12.1.1. 用 Callgrind 进行剖析](C12-CodeOpt/12.1-basic.html)
  - [12.1.2. 循环不变量外提](C12-CodeOpt/12.1-basic.html)
- [12.2. 其他编译器优化：循环展开与函数内联](C12-CodeOpt/12.2-loops_functions.html)
  - [12.2.1. 函数内联](C12-CodeOpt/12.2-loops_functions.html)
  - [12.2.2. 循环展开](C12-CodeOpt/12.2-loops_functions.html)
- [12.3. 内存方面的考虑](C12-CodeOpt/12.3-memory_considerations.html)
  - [12.3.1. 循环交换](C12-CodeOpt/12.3-memory_considerations.html)
  - [其他几种改善局部性的编译器优化：循环分裂与循环融合](C12-CodeOpt/12.3-memory_considerations.html)
  - [12.3.3. 用 Massif 进行内存剖析](C12-CodeOpt/12.3-memory_considerations.html)
- [12.4. 要点与小结](C12-CodeOpt/12.4-summary.html)

### 13. 操作系统

- [13. 操作系统](C13-OS/13.0-index.html)
  - [内核](C13-OS/13.0-index.html)
- [13.1. 操作系统如何工作、如何运行](C13-OS/13.1-impl.html)
  - [13.1.1. 操作系统的引导](C13-OS/13.1-impl.html)
  - [13.1.2. 让操作系统做事：中断与陷阱](C13-OS/13.1-impl.html)
  - [13.1.3. 参考文献](C13-OS/13.1-impl.html)
- [13.2. 进程](C13-OS/13.2-processes.html)
  - [13.2.1. 多道程序设计与上下文切换](C13-OS/13.2-processes.html)
  - [13.2.2. 进程状态](C13-OS/13.2-processes.html)
  - [13.2.3. 进程的创建（与销毁）](C13-OS/13.2-processes.html)
  - [13.2.4. exec](C13-OS/13.2-processes.html)
  - [13.2.5. exit 与 wait](C13-OS/13.2-processes.html)
- [13.3. 虚拟内存](C13-OS/13.3-vm.html)
  - [13.3.1. 内存地址](C13-OS/13.3-vm.html)
  - [13.3.2. 虚拟地址到物理地址的转换](C13-OS/13.3-vm.html)
  - [13.3.3. 分页](C13-OS/13.3-vm.html)
  - [13.3.4. 内存效率](C13-OS/13.3-vm.html)
- [13.4. 进程间通信](C13-OS/13.4-ipc.html)
  - [13.4.1. 信号](C13-OS/13.4.1-ipc_signals.html)
  - [13.4.2. 消息传递](C13-OS/13.4.2-ipc_msging.html)
  - [13.4.3. 共享内存](C13-OS/13.4.3-ipc_shm.html)
- [13.5. 小结与操作系统的其他功能](C13-OS/13.5-advanced.html)
  - [13.5.1. 参考文献](C13-OS/13.5-advanced.html)
- [13.6. 练习](C13-OS/13.6-exercises.html)
  - [附加练习](C13-OS/13.6-exercises.html)

### 14. 多核时代的共享内存利用

- [14. 多核时代的共享内存利用](C14-SharedMemory/14.0-index.html)
  - [仔细看看：有多少个核心？](C14-SharedMemory/14.0-index.html)
- [14.1. 多核系统编程](C14-SharedMemory/14.1-multicore.html)
  - [14.1.1. 多核系统对进程执行的影响](C14-SharedMemory/14.1-multicore.html)
  - [14.1.2. 用线程加快进程执行](C14-SharedMemory/14.1-multicore.html)
- [14.2. 你好，线程！编写你的第一个多线程程序](C14-SharedMemory/14.2-posix.html)
  - [14.2.1. 创建与合并线程](C14-SharedMemory/14.2-posix.html)
  - [14.2.2. 线程函数](C14-SharedMemory/14.2-posix.html)
  - [14.2.3. 运行代码](C14-SharedMemory/14.2-posix.html)
  - [14.2.4. 再看标量乘法](C14-SharedMemory/14.2-posix.html)
  - [14.2.5. 改进标量乘法：多个参数](C14-SharedMemory/14.2-posix.html)
- [14.3. 线程同步](C14-SharedMemory/14.3-synchronization.html)
  - [计数排序（CountSort）](C14-SharedMemory/14.3-synchronization.html)
  - [并行化 countElems：初次尝试](C14-SharedMemory/14.3-synchronization.html)
  - [数据竞争](C14-SharedMemory/14.3-synchronization.html)
  - [14.3.1. 互斥](C14-SharedMemory/14.3.1-mutex.html)
  - [14.3.2. 信号量](C14-SharedMemory/14.3.2-semaphores.html)
  - [14.3.3. 其他同步结构](C14-SharedMemory/14.3.3-other_syncs.html)
- [14.4. 测量并行程序的性能](C14-SharedMemory/14.4-performance.html)
  - [14.4.1. 并行性能基础](C14-SharedMemory/14.4.1-performance_basics.html)
  - [14.4.2. 进阶话题](C14-SharedMemory/14.4.2-performance_advanced.html)
- [14.5. 缓存一致性与伪共享](C14-SharedMemory/14.5-cache_coherence.html)
  - [14.5.1. 多核系统上的缓存](C14-SharedMemory/14.5-cache_coherence.html)
  - [14.5.2. 伪共享](C14-SharedMemory/14.5-cache_coherence.html)
  - [14.5.3. 修正伪共享](C14-SharedMemory/14.5-cache_coherence.html)
- [14.6. 线程安全](C14-SharedMemory/14.6-thread_safety.html)
  - [14.6.1. 修正线程安全问题](C14-SharedMemory/14.6-thread_safety.html)
- [14.7. 用 OpenMP 实现隐式多线程](C14-SharedMemory/14.7-openmp.html)
  - [14.7.1. 常用的编译指示](C14-SharedMemory/14.7-openmp.html)
  - [14.7.2. 你好，线程：OpenMP 风味](C14-SharedMemory/14.7-openmp.html)
  - [14.7.3. 一个更复杂的例子：OpenMP 版计数排序](C14-SharedMemory/14.7-openmp.html)
  - [14.7.4. 进一步学习 OpenMP](C14-SharedMemory/14.7-openmp.html)
  - [参考文献](C14-SharedMemory/14.7-openmp.html)
- [14.8. 小结](C14-SharedMemory/14.8-summary.html)
  - [要点](C14-SharedMemory/14.8-summary.html)
  - [延伸阅读](C14-SharedMemory/14.8-summary.html)
- [14.9. 练习](C14-SharedMemory/14.9-exercises.html)
  - [附加练习](C14-SharedMemory/14.9-exercises.html)

### 15. 展望：其他并行系统与并行编程模型

- [15. 展望：其他并行系统与并行编程模型](C15-Parallel/15.0-index.html)
  - [全新的世界：弗林体系结构分类法](C15-Parallel/15.0-index.html)
- [15.1. 异构计算：硬件加速器、GPGPU 计算与 CUDA](C15-Parallel/15.1-gpu.html)
  - [15.1.1. 硬件加速器](C15-Parallel/15.1-gpu.html)
  - [15.1.2. GPU 体系结构概览](C15-Parallel/15.1-gpu.html)
  - [15.1.3. GPGPU 计算](C15-Parallel/15.1-gpu.html)
  - [15.1.4. CUDA](C15-Parallel/15.1-gpu.html)
  - [15.1.5. 其他 GPGPU 编程语言](C15-Parallel/15.1-gpu.html)
  - [15.1.6. 参考文献](C15-Parallel/15.1-gpu.html)
- [15.2. 分布式内存系统、消息传递与 MPI](C15-Parallel/15.2-distrmem.html)
  - [15.2.1. 并行与分布式处理模型](C15-Parallel/15.2-distrmem.html)
  - [15.2.2. 通信协议](C15-Parallel/15.2-distrmem.html)
  - [15.2.3. 消息传递接口（MPI）](C15-Parallel/15.2-distrmem.html)
  - [15.2.4. MPI Hello World](C15-Parallel/15.2-distrmem.html)
  - [15.2.5. MPI 标量乘法](C15-Parallel/15.2-distrmem.html)
  - [15.2.6. 分布式系统面临的挑战](C15-Parallel/15.2-distrmem.html)
  - [MPI 学习资源](C15-Parallel/15.2-distrmem.html)
- [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](C15-Parallel/15.3-cloud.html)
  - [15.3.1. 云计算](C15-Parallel/15.3-cloud.html)
  - [15.3.2. MapReduce](C15-Parallel/15.3-cloud.html)
  - [15.3.3. 展望未来：机遇与挑战](C15-Parallel/15.3-cloud.html)
  - [参考文献](C15-Parallel/15.3-cloud.html)

### 16. 附录 1：面向 Java 程序员的第 1 章

- [16. 附录 1：面向 Java 程序员的第 1 章](Appendix1/16.0-index.html)
- [16.1. C 语言编程入门](Appendix1/16.1-getting_started.html)
  - [16.1.1. 编译与运行 C 程序](Appendix1/16.1-getting_started.html)
  - [16.1.2. 变量与 C 的数值类型](Appendix1/16.1-getting_started.html)
  - [16.1.3. C 的类型](Appendix1/16.1-getting_started.html)
- [16.2. 输入/输出（printf 与 scanf）](Appendix1/16.2-input_output.html)
  - [16.2.1. printf](Appendix1/16.2-input_output.html)
  - [16.2.2. scanf](Appendix1/16.2-input_output.html)
- [16.3. 条件语句与循环](Appendix1/16.3-conditionals.html)
  - [16.3.1. C 中的布尔值](Appendix1/16.3-conditionals.html)
  - [16.3.2. C 中的循环](Appendix1/16.3-conditionals.html)
- [16.4. 函数](Appendix1/16.4-functions.html)
  - [16.4.1. 栈](Appendix1/16.4-functions.html)
- [16.5. 数组与字符串](Appendix1/16.5-arrays_strings.html)
  - [16.5.1. 数组入门](Appendix1/16.5-arrays_strings.html)
  - [16.5.2. 数组的访问方法](Appendix1/16.5-arrays_strings.html)
  - [16.5.3. 数组与函数](Appendix1/16.5-arrays_strings.html)
  - [16.5.4. 字符串与 C 字符串库入门](Appendix1/16.5-arrays_strings.html)
- [16.6. 结构体](Appendix1/16.6-structs.html)
  - [16.6.1. 定义结构体类型](Appendix1/16.6-structs.html)
  - [16.6.2. 声明结构体类型的变量](Appendix1/16.6-structs.html)
  - [16.6.3. 访问字段的值](Appendix1/16.6-structs.html)
  - [16.6.4. 把结构体传给函数](Appendix1/16.6-structs.html)
- [16.7. 小结](Appendix1/16.7-summary.html)
  - [练习](Appendix1/exercises.html)

### 17. 附录 2：使用 Unix

- [17. 附录 2：使用 Unix](Appendix2/17.0-index.html)
- [17.1. Unix 命令行与 Unix 文件系统](Appendix2/17.1-cmdln_basics.html)
  - [17.1.1. Unix 文件系统](Appendix2/17.1-cmdln_basics.html)
  - [17.1.2. 文件系统命令](Appendix2/17.1-cmdln_basics.html)
  - [17.1.3. 基本命令小结](Appendix2/17.1-cmdln_basics.html)
  - [17.1.4. 参考资料](Appendix2/17.1-cmdln_basics.html)
- [17.2. man 与 Unix 手册](Appendix2/17.2-man.html)
  - [17.2.1. 阅读手册页](Appendix2/17.2-man.html)
  - [17.2.2. apropos](Appendix2/17.2-man.html)
  - [17.2.3. 参考资料](Appendix2/17.2-man.html)
- [17.3. 远程访问](Appendix2/17.3-ssh_scp.html)
  - [17.3.1. 远程登录](Appendix2/17.3-ssh_scp.html)
  - [17.3.2. 远程文件复制](Appendix2/17.3-ssh_scp.html)
  - [17.3.3. 参考资料](Appendix2/17.3-ssh_scp.html)
- [17.4. Unix 编辑器](Appendix2/17.4-editors.html)
  - [17.4.1. Vim 编辑器](Appendix2/17.4-editors.html)
  - [17.4.2. Emacs 编辑器](Appendix2/17.4-editors.html)
  - [17.4.3. Nano 编辑器](Appendix2/17.4-editors.html)
  - [17.4.4. 设置默认编辑器](Appendix2/17.4-editors.html)
  - [17.4.5. 参考资料](Appendix2/17.4-editors.html)
- [17.5. make 与 Makefile](Appendix2/17.5-makefiles.html)
  - [17.5.1. 关于 make](Appendix2/17.5-makefiles.html)
  - [17.5.2. 使用 make](Appendix2/17.5-makefiles.html)
  - [17.5.3. 创建 Makefile](Appendix2/17.5-makefiles.html)
  - [17.5.4. 一个简单的 Makefile](Appendix2/17.5-makefiles.html)
  - [17.5.5. 用于多个源文件的 Makefile](Appendix2/17.5-makefiles.html)
  - [17.5.6. make 错误](Appendix2/17.5-makefiles.html)
  - [17.5.7. 并行 make](Appendix2/17.5-makefiles.html)
  - [17.5.8. 进阶：一个通用的简单 Makefile](Appendix2/17.5-makefiles.html)
  - [17.5.9. 进阶：一个用于多个文件的通用 Makefile](Appendix2/17.5-makefiles.html)
  - [17.5.10. 进阶：一个通用的、功能齐全的 Makefile](Appendix2/17.5-makefiles.html)
  - [17.5.11. 进阶：Makefile 生成器](Appendix2/17.5-makefiles.html)
  - [17.5.12. 参考资料](Appendix2/17.5-makefiles.html)
- [17.6. 搜索：grep 与 find](Appendix2/17.6-grep.html)
  - [17.6.1. find 命令](Appendix2/17.6-grep.html)
  - [17.6.2. grep 命令](Appendix2/17.6-grep.html)
  - [17.6.3. 参考资料](Appendix2/17.6-grep.html)
- [17.7. 查看与修改文件权限](Appendix2/17.7-chmod.html)
  - [17.7.1. chmod](Appendix2/17.7-chmod.html)
  - [17.7.2. chgrp](Appendix2/17.7-chmod.html)
  - [17.7.3. 参考资料](Appendix2/17.7-chmod.html)
- [17.8. 归档与压缩文件](Appendix2/17.8-tar.html)
  - [17.8.1. 文件压缩](Appendix2/17.8-tar.html)
  - [17.8.2. 综合运用](Appendix2/17.8-tar.html)
  - [17.8.3. 参考资料](Appendix2/17.8-tar.html)
- [17.9. 进程控制](Appendix2/17.9-pskill.html)
  - [17.9.1. 在前台和后台运行](Appendix2/17.9-pskill.html)
  - [17.9.2. 终止正在运行的进程](Appendix2/17.9-pskill.html)
  - [17.9.3. 参考资料](Appendix2/17.9-pskill.html)
- [17.10. 计时](Appendix2/17.10-timing.html)
  - [17.10.1. 参考资料](Appendix2/17.10-timing.html)
- [17.11. 命令历史](Appendix2/17.11-history.html)
  - [17.11.1. 参考资料](Appendix2/17.11-history.html)
- [17.12. I/O 重定向](Appendix2/17.12-ioredirect.html)
  - [17.12.1. 参考资料](Appendix2/17.12-ioredirect.html)
- [17.13. 管道](Appendix2/17.13-pipe.html)
  - [17.13.1. 参考资料](Appendix2/17.13-pipe.html)
- [17.14. 点文件与 .bashrc](Appendix2/17.14-dotfiles.html)
  - [17.14.1. .bashrc 文件](Appendix2/17.14-dotfiles.html)
  - [17.14.2. 参考资料](Appendix2/17.14-dotfiles.html)
- [17.15. Shell 编程](Appendix2/17.15-shellprog.html)
  - [17.15.1. 参考资料](Appendix2/17.15-shellprog.html)
- [17.16. 获取系统信息](Appendix2/17.16-sysinfo.html)
  - [17.16.1. top 与 htop](Appendix2/17.16-sysinfo.html)
  - [17.16.2. /proc 与 /sys](Appendix2/17.16-sysinfo.html)
  - [17.16.3. 参考资料](Appendix2/17.16-sysinfo.html)

## 现代更新索引（58 条）

| 章 | 主题 | 所在小节 |
|---|---|---|
| 00-Front | 树莓派 5 | [现代计算机系统是什么样的？](00-Front/0.0-introduction.html) |
| 00-Front | 超算上的 Linux | [Linux、C 与 GNU 编译器](00-Front/0.0-introduction.html) |
| C1-C_intro | C 语言标准的新版本 | [1. 在 C 边，在 C 边，在美丽的 C 边](C1-C_intro/1.0-index.html) |
| C1-C_intro | 用 python3 而不是 python | [1.1.1. 编译和运行 C 程序](C1-C_intro/1.1-getting_started.html) |
| C1-C_intro | C 早已有布尔类型 | [1.3.1. C 中的布尔值](C1-C_intro/1.3-conditionals.html) |
| C2-C_depth | 新进入标准的字符串函数 | [2.6.3. 操作 C 字符串和字符的库](C2-C_depth/2.6-strings.html) |
| C2-C_depth | 不再需要 -lpthread | [2.9.5. C 库：使用、编译与链接](C2-C_depth/2.9.5-advanced_libraries.html) |
| C2-C_depth | 隐式函数声明现在是错误 | [2.9.5. C 库：使用、编译与链接](C2-C_depth/2.9.5-advanced_libraries.html) |
| C3-C_debug | 在 Apple Silicon Mac 上用什么 | [3. C 调试工具](C3-C_debug/3.0-index.html) |
| C4-Binary | 今天的文本几乎都是 UTF-8 | [4. 二进制与数据表示](C4-Binary/4.0-index.html) |
| C4-Binary | 补码已写进 C 标准 | [4.3.1. 原码](C4-Binary/4.3-signed.html) |
| C4-Binary | 在 C 里安全地检测溢出 | [4.5.3. 溢出小结](C4-Binary/4.5-overflow.html) |
| C4-Binary | 新标准版本与 AI 的低精度浮点 | [4.8.2. 浮点表示](C4-Binary/4.8-floating_point.html) |
| C5-Arch | RISC 进入个人电脑 | [5. 冯·诺依曼早已知道的事：计算机体系结构](C5-Arch/5.0-index.html) |
| C5-Arch | 一块芯片上有多少晶体管 | [5.3. 逻辑门](C5-Arch/5.3-gates.html) |
| C5-Arch | Spectre 是怎么回事 | [5.8.2. 流水线冒险：控制冒险](C5-Arch/5.8-pipelining_advanced.html) |
| C5-Arch | 大小核与上百核的服务器 | [5.9.3. 几个处理器实例](C5-Arch/5.9-modern.html) |
| C5-Arch | 今天最快的超算 | [5.9.3. 几个处理器实例](C5-Arch/5.9-modern.html) |
| C6-asm_intro | 在浏览器里看 C 被编译成什么汇编 | [接下来几章你将学到什么](C6-asm_intro/6.0-index.html) |
| C7-x86_64 | x86 的寄存器要翻倍了 | [7.1.1. 寄存器](C7-x86_64/7.1-basics.html) |
| C7-x86_64 | 帧指针回来了 | [7.1.1. 寄存器](C7-x86_64/7.1-basics.html) |
| C7-x86_64 | 硬件影子栈 | [7.10.6. 防御缓冲区溢出](C7-x86_64/7.10-buffer_overflow.html) |
| C7-x86_64 | gets 已被移出标准 | [7.10.6. 防御缓冲区溢出](C7-x86_64/7.10-buffer_overflow.html) |
| C8-IA32 | 32 位 x86 正在退场 | [8. 32 位 x86 汇编（IA32）](C8-IA32/8.0-index.html) |
| C9-ARM64 | 树莓派系统已有 64 位正式版 | [9. ARM 汇编](C9-ARM64/9.0-index.html) |
| C9-ARM64 | ARM 在超算和个人电脑上的进展 | [9. ARM 汇编](C9-ARM64/9.0-index.html) |
| C10-asm_takeaways | 延伸阅读的新地址，以及第四种值得了解的 ISA | [延伸阅读](C10-asm_takeaways/10.0-index.html) |
| C11-MemHierarchy | 表 2 的数字已经过时 | [11.2.2. 辅助存储](C11-MemHierarchy/11.2-devices.html) |
| C11-MemHierarchy | Cachegrind 默认不再模拟缓存 | [11.5.2. 现实中的缓存分析：Cachegrind](C11-MemHierarchy/11.5-cachegrind.html) |
| C12-CodeOpt | 现在的 GCC 优化级别 | [12. 代码优化](C12-CodeOpt/12.0-index.html) |
| C12-CodeOpt | GCC 的循环交换 | [12.3.1. 循环交换](C12-CodeOpt/12.3-memory_considerations.html) |
| C13-OS | Linux 的页表隔离（PTI） | [13.1.2. 让操作系统做事：中断与陷阱](C13-OS/13.1-impl.html) |
| C13-OS | Linux 换了新的进程调度器 | [13.2.1. 多道程序设计与上下文切换](C13-OS/13.2-processes.html) |
| C13-OS | 从 4 级页表到 5 级页表 | [13.3.4. 内存效率](C13-OS/13.3-vm.html) |
| C14-SharedMemory | OpenMP 6.0 | [14.7.4. 进一步学习 OpenMP](C14-SharedMemory/14.7-openmp.html) |
| C15-Parallel | SIMD、加速器与矩阵单元 | [全新的世界：弗林体系结构分类法](C15-Parallel/15.0-index.html) |
| C15-Parallel | FPGA 厂商格局 | [15.1.1. 硬件加速器](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | 真实 GPU 的规模 | [15.1.2. GPU 体系结构概览](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | 统一内存走向硬件 | [15.1.3. GPGPU 计算](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | warp 不再保证锁步 | [15.1.4. CUDA](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | 超出线程块的同步 | [15.1.4. CUDA](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | 今天常见的选择 | [15.1.5. 其他 GPGPU 编程语言](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | 核数早已不止 64 | [15.2. 分布式内存系统、消息传递与 MPI](C15-Parallel/15.2-distrmem.html) |
| C15-Parallel | 互连网络 | [15.2. 分布式内存系统、消息传递与 MPI](C15-Parallel/15.2-distrmem.html) |
| C15-Parallel | MPI 标准版本 | [15.2.3. 消息传递接口（MPI）](C15-Parallel/15.2-distrmem.html) |
| C15-Parallel | 集合通信与 AI | [15.2.3. 消息传递接口（MPI）](C15-Parallel/15.2-distrmem.html) |
| C15-Parallel | E 级已经实现 | [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](C15-Parallel/15.3-cloud.html) |
| C15-Parallel | Facebook 更名与旧数据统计 | [15.3. 迈向百亿亿次及更远：云计算、大数据与计算的未来](C15-Parallel/15.3-cloud.html) |
| C15-Parallel | SaaS 产品更名 | [15.3.1. 云计算](C15-Parallel/15.3-cloud.html) |
| C15-Parallel | GPU 也能"切片出租" | [15.3.1. 云计算](C15-Parallel/15.3-cloud.html) |
| C15-Parallel | Spark 4.x 与 Spark Connect | [15.3.2. MapReduce](C15-Parallel/15.3-cloud.html) |
| C15-Parallel | 功耗 | [15.3.3. 展望未来：机遇与挑战](C15-Parallel/15.3-cloud.html) |
| C15-Parallel | 融合已经发生 | [15.3.3. 展望未来：机遇与挑战](C15-Parallel/15.3-cloud.html) |
| C15-Parallel | DSA 与安全 | [15.3.3. 展望未来：机遇与挑战](C15-Parallel/15.3-cloud.html) |
| Appendix1 | C 语言标准的新版本 | [16. 附录 1：面向 Java 程序员的第 1 章](Appendix1/16.0-index.html) |
| Appendix1 | C 早已有布尔类型 | [16.3.1. C 中的布尔值](Appendix1/16.3-conditionals.html) |
| Appendix2 | Mac 的默认 shell 是 zsh | [17.1. Unix 命令行与 Unix 文件系统](Appendix2/17.1-cmdln_basics.html) |
| Appendix2 | SSH 密钥的新默认值 | [17.3.2. 远程文件复制](Appendix2/17.3-ssh_scp.html) |

## 勘误索引（51 条）

下表是指出原书错误或前后不一致的译注，「摘要」是译注中点出问题的那一句。

| 章 | 摘要 | 所在小节 |
|---|---|---|
| C2-C_depth | 原文给出的原型 char strlcpy(...) 有误：strlcpy 实际返回 size_t，即它试图创建的字符串的总长度（也就是 src 的长度）。 | [2.6.3. 操作 C 字符串和字符的库](C2-C_depth/2.6-strings.html) |
| C2-C_depth | 下面代码中的 classroom2[3].year = 2013; 无法通过编译：struct studentT 中没有 year 字段，应为 grad_yr。 | [2.7.4. 结构体数组](C2-C_depth/2.7-structs.html) |
| C2-C_depth | 原文的「第 10 章」应为第 14 章（共享内存并行），链接本身指向的也是第 14 章。 | [2.9.5. C 库：使用、编译与链接](C2-C_depth/2.9.5-advanced_libraries.html) |
| C3-C_debug | 下面代码中的 SIGALARM 是笔误，闹钟信号的正确名称是 SIGALRM（下文的代码里写对了）。 | [3.4.4. 信号控制](C3-C_debug/3.4-gdb_advanced.html) |
| C4-Binary | 下面代码注释中的「Digits 2, 3, and 6」应为「2、3 和 5」：结果 101100 中为 1 的是第 5、3、2 位（从右往左、从 0 开始数）… | [4.6.3. 按位异或（XOR）](C4-Binary/4.6-bitwise.html) |
| C4-Binary | GCC 和 Clang 都实现为算术右移，所以原书说的「几乎所有编译器」是准确的。 | [4.6.5. 移位](C4-Binary/4.6-bitwise.html) |
| C4-Binary | 原答案有两处笔误：开头的「把 389 转换为十进制」应为「转换为二进制」； | [答案](C4-Binary/4.10-exercises.html) |
| C5-Arch | 原文说处理器「无法一直保持最大 CPI」，按意思应理解为无法一直保持最好的 CPI（即最小值）； | [5.6.1. 时钟驱动的执行](C5-Arch/5.6-instrexec.html) |
| C7-x86_64 | 这里有一处笔误：按上面的表 4，jg 的同义指令是 jnle（jump not less or equal，不小于等于则跳转）； | [跳转指令](C7-x86_64/7.4.1-preliminaries.html) |
| C7-x86_64 | 对照上面的 objdump 输出，callq &lt;assign&gt; 位于 0x40054a，它的下一条指令（callq &lt;adder&gt;）位于 0x40054f，所以… | [7.5.3. 跟踪 main](C7-x86_64/7.5-functions.html) |
| C7-x86_64 | 这里的 &lt;sumArray+22&gt; 和 &lt;sumArray+39&gt; 应为前文所说的 &lt;sumArray+32&gt; 和 &lt;sumArray+49&gt;，原文笔误。 | [7.7. 数组](C7-x86_64/7.7-arrays.html) |
| C7-x86_64 | 对照上面的汇编（mov %rdi,-0x18(%rbp)），参数 m 存放在 %rbp-0x18 而不是 %rbp-0x8（后者是 j），原文笔误。 | [7.8.1. 连续的二维数组](C7-x86_64/7.8-matrices.html) |
| C7-x86_64 | 原文把这几个地址写成了 0xf7ffffffdd00～0xf7ffffffdd05，应为 0x7fffffffdd00～0x7fffffffdd05（对照上面的… | [7.10.3. 仔细看看（C 之下）](C7-x86_64/7.10-buffer_overflow.html) |
| C7-x86_64 | 原文说这是该 8 字节单元中「第三高位」（third most significant）的字节。 | [7.10.3. 仔细看看（C 之下）](C7-x86_64/7.10-buffer_overflow.html) |
| C7-x86_64 | 原文的 0xf7ff00333231 应为 0x7fff00333231：返回地址所在的 0x7fffffffdd18 处的 8 个字节是 31 32 33 0… | [7.10.4. 缓冲区溢出：第一次尝试](C7-x86_64/7.10-buffer_overflow.html) |
| C7-x86_64 | 译者用 clang -target x86_64-linux-gnu -O1 -fstack-protector-strong -S 编译一个带局部数组的函数，… | [7.10.6. 防御缓冲区溢出](C7-x86_64/7.10-buffer_overflow.html) |
| C7-x86_64 | scanf("%12s", buf) 应为 %11s：%s 的宽度只限制读入的字符数，scanf 还要在后面再写一个 '\0'，所以 %12s 最多写 13 字… | [7.10.6. 防御缓冲区溢出](C7-x86_64/7.10-buffer_overflow.html) |
| C8-IA32 | 与第 7 章相同的笔误：按上面的表 4，jg 的同义指令是 jnle（jump not less or equal，不小于等于则跳转）； | [跳转指令](C8-IA32/8.4.1-preliminaries.html) |
| C8-IA32 | 仔细对照会发现 main 部分的机器码与助记符对不上：字节 83 ec 20 编码的是 sub $0x20,%esp，而不是右边写的 sub $0x14,%es… | [8.5.1. 跟踪一个例子](C8-IA32/8.5-functions.html) |
| C8-IA32 | 指令中多了一个 $，按清单应为 mov -0x4(%ebp),%eax：这里是从栈上地址 %ebp-4 读取内存，而不是立即数。 | [8.5.2. 跟踪 main](C8-IA32/8.5-functions.html) |
| C8-IA32 | 实际数一下，从 &lt;sumArray+22&gt; 到 &lt;sumArray+39&gt;（含两端）共有六条指令（mov、lea、mov、add、mov、add），原文说「五条… | [8.7. 数组](C8-IA32/8.7-arrays.html) |
| C8-IA32 | 所以原文说的「八字节类型位于八字节对齐的地址上」对 x86-64 成立，对 IA32 Linux 的结构体布局并不成立。 | [8.9.1. 数据对齐与结构体](C8-IA32/8.9-structs.html) |
| C8-IA32 | 原文这几个地址多写了一个 f（0xfffffd3f0 是 9 位十六进制数），应为 0xffffd3f0～0xffffd3f4，对照上面的 GDB 输出即可。 | [8.10.3. 仔细看看（C 之下）](C8-IA32/8.10-buffer_overflow.html) |
| C8-IA32 | 译者用 clang -target i386-linux-gnu -O1 -fstack-protector-strong -S 编译一个带局部数组的函数，可以… | [8.10.6. 防御缓冲区溢出](C8-IA32/8.10-buffer_overflow.html) |
| C8-IA32 | scanf("%12s", buf) 应为 %11s：%s 的宽度只限制读入的字符数，scanf 还要在后面再写一个 '\0'，所以 %12s 最多写 13 字… | [8.10.6. 防御缓冲区溢出](C8-IA32/8.10-buffer_overflow.html) |
| C9-ARM64 | 这一段讲的是 ldr，「不受 str 操作的影响」应为「不受 ldr 操作的影响」，属原文笔误。 | [9.2.1. 综合运用：一个更具体的例子](C9-ARM64/9.2-common.html) |
| C9-ARM64 | 表中括号和下一段的说法有误：udiv 与 sdiv 的区别在于无符号与有符号，而不是 32 位与 64 位——两条指令都既可以用 w 寄存器做 32 位除法，也… | [9.3.1. 常用算术指令](C9-ARM64/9.3-arithmetic.html) |
| C9-ARM64 | 「超过七个」应为「超过八个」：x0–x7 恰好能放八个参数，第九个起才放到栈上。 | [9.5.1. 函数参数](C9-ARM64/9.5-functions.html) |
| C9-ARM64 | 上面完整清单第一行的注释「store x29, x30 at sp, sp+4」应为 sp 和 sp+8：x29、x30 都是 8 字节寄存器（最后一条 ldp… | [9.9. 汇编中的结构体](C9-ARM64/9.9-structs.html) |
| C9-ARM64 | 所以 buf 溢出时，向高地址写，根本碰不到 playGame 自己的返回地址，而是越过 playGame 的栈帧，覆盖调用者 main 的帧记录：保存的 x2… | [9.10.4. 缓冲区溢出：第一次尝试](C9-ARM64/9.10-buffer_overflow.html) |
| C9-ARM64 | scanf("%12s", buf) 应为 %11s：%s 的宽度只限制读入的字符数，scanf 还要在后面再写一个 '\0'，所以 %12s 最多写 13 字… | [9.10.6. 防御缓冲区溢出](C9-ARM64/9.10-buffer_overflow.html) |
| C10-asm_takeaways | scanf("%12s", buf) 应为 %11s：%s 的宽度只限制读入的字符数，scanf 还要在后面再写一个 '\0'，所以 %12s 最多写 13 字… | [共同特征](C10-asm_takeaways/10.0-index.html) |
| C12-CodeOpt | 第三位作者的名字应为 Ullman（Jeffrey D. Ullman）。 | [12. 代码优化](C12-CodeOpt/12.0-index.html) |
| C12-CodeOpt | 说两者「不兼容」并不准确。GCC 手册明确写道：「GCC 允许你把 -g 和 -O 一起使用」，只是优化后的代码可能出人意料：有些声明的变量可能根本不存在，控制… | [编译器并不总能做到的事：学习代码优化的好处](C12-CodeOpt/12.0-index.html) |
| C13-OS | 0b0000100 的十进制值是 4，不是 8，原文笔误。 | [13.3.3. 分页](C13-OS/13.3-vm.html) |
| C13-OS | 代码中的 print("C\n"); 应为 printf("C\n");，否则无法编译。 | [附加练习](C13-OS/13.6-exercises.html) |
| C14-SharedMemory | 原文说 macOS 上也有 lscpu，但译者的 Mac 上并没有这个命令（which lscpu 找不到）。 | [仔细看看：有多少个核心？](C14-SharedMemory/14.0-index.html) |
| C14-SharedMemory | 说「没有标准」并不准确：按 [sem_init(3)](https://man7.org/linux/man-pages/man3/sem_init.3.htm… | [14.3.2. 信号量](C14-SharedMemory/14.3.2-semaphores.html) |
| C14-SharedMemory | pthread_barrier_init 实际上有三个参数：屏障的地址、属性（通常为 NULL）以及必须到达屏障的线程数，例如 pthread_barrier_… | [14.3.3. 其他同步结构](C14-SharedMemory/14.3.3-other_syncs.html) |
| C15-Parallel | 原网页这里显示成斜体的 global / device，实际应为带双下划线的限定符 __global__ 和 __device__（AsciiDoc 把成对的下… | [15.1.4. CUDA](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | 原文这里的 threadId.x 是笔误，正确的内置变量名是 threadIdx.x（与 blockIdx 对称，下面代码里写的是对的）。 | [15.1.4. CUDA](C15-Parallel/15.1-gpu.html) |
| C15-Parallel | 注释大意：这里假设线程数足够多，可以让每个 array[i] 元素各对应一个线程（"signal thread" 是 "single thread" 的笔误）； | [15.1.4. CUDA](C15-Parallel/15.1-gpu.html) |
| Appendix2 | 第二个例子的说明是进入 /home/sam，但代码写的是 cd /home/，应为 cd /home/sam。 | [17.1.3. 基本命令小结](Appendix2/17.1-cmdln_basics.html) |
| Appendix2 | 上面对加密过程的描述并不准确。 | [17.3.2. 远程文件复制](Appendix2/17.3-ssh_scp.html) |
| Appendix2 | 上一行代码中的 $(SRCS:%.c=%d) 应为 $(SRCS:%.c=%.d)。 | [17.5.10. 进阶：一个通用的、功能齐全的 Makefile](Appendix2/17.5-makefiles.html) |
| Appendix2 | 这一说法有误。按 [signal(7)](https://man7.org/linux/man-pages/man7/signal.7.html) 手册中的信号… | [17.9.2. 终止正在运行的进程](Appendix2/17.9-pskill.html) |
| Appendix2 | 「37!」是笔误，应为上文所说的 !37。 | [17.11. 命令历史](Appendix2/17.11-history.html) |
| Appendix2 | 第一句中的「stdin 和 stdout」应为「stdout 和 stderr」，后一句的等价写法以及下文的例子都表明了这一点。 | [17.12. I/O 重定向](Appendix2/17.12-ioredirect.html) |
| Appendix2 | 示例中最后查看的是 grep_err，与重定向时写的文件名 grep_error 不一致，应为 cat grep_error； | [17.12. I/O 重定向](Appendix2/17.12-ioredirect.html) |
| Appendix2 | 示例中的 $env 应为 $ env（$ 是提示符，后面应有空格），否则 shell 会把 $env 当作对变量 env 的引用。 | [17.14.1. .bashrc 文件](Appendix2/17.14-dotfiles.html) |
| Appendix2 | 链接文字「runsh.sh」与实际文件名不一致，链接指向的、下文一直使用的都是 run.sh。 | [17.15. Shell 编程](Appendix2/17.15-shellprog.html) |
