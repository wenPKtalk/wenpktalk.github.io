---
title: "译名表与翻译约定"
disableNunjucks: true
---

# 译名表与翻译约定（全书统一）

## 约定
- 中文在前、英文原文由 book.py 自动以引用块附在后面；只写中文译文。
- 中英文/数字之间留半角空格；术语首次出现写「中文（English）」；行内代码、链接 URL 原样保留，链接文字译成中文。
- 标题只译文字，保留编号（如 `4.1. 数的进制与无符号整数`）。
- 图注/表注只写说明文字，不写「图 N.」「Table N.」前缀（脚本自动加）；没有图注的图，译它的 alt 文字（显示为「图示：…」）。
- 列表/注释框里夹的代码块不要手抄，写 `{{code1}}`、`{{code2}}`…（按出现顺序，缩进与所在位置一致），脚本会原样填回；列表里夹的图写 `{{img1}} 中文图注`（无图注的写 alt 译文），中文部分不要写 `![..](..)`。
- 参考文献条目可写 `=`（保留原文）；其他正文不允许 `=`。
- admon 块：第一行写标题译文（无标题时直接写正文），其后是正文译文。
- table 块：给出中文表格（只译文字单元格），纯数字/代码表格写 `=`。
- 译注用 `---note---` 后跟 `> [!NOTE] 译注 · 小标题`；勘误写明「原文…，应为…」并尽量给出依据。
- 现代更新写在 `updates/<章目录>.md`，格式 `@@ <block-id>` + `> [!TIP] 现代更新（截至 2026-11）· 主题`，每条附来源链接。
- 对标中文经典译本《深入理解计算机系统》（CS:APP）的常见译法。

## 术语
| English | 中文 |
|---|---|
| computer system | 计算机系统 |
| pointer / dereference | 指针 / 解引用 |
| stack / heap / stack frame | 栈 / 堆 / 栈帧 |
| global / local variable | 全局变量 / 局部变量 |
| scope | 作用域 |
| dynamic memory allocation | 动态内存分配 |
| memory leak / dangling pointer | 内存泄漏 / 悬空指针 |
| segmentation fault | 段错误 |
| struct / field | 结构体 / 字段 |
| string / null terminator | 字符串 / 空字符（`'\0'`） |
| library / header file | 库 / 头文件 |
| compile / link / linker / loader | 编译 / 链接 / 链接器 / 加载器 |
| executable | 可执行文件 |
| debugger / breakpoint | 调试器 / 断点 |
| unsigned / signed integer | 无符号整数 / 有符号整数 |
| two's complement | 补码（二进制补码） |
| signed magnitude | 原码（符号-数值表示） |
| overflow / carry | 溢出 / 进位 |
| bitwise operator / bit shift | 位运算符 / 移位 |
| byte order / endianness / big-endian / little-endian | 字节序 / 端序 / 大端 / 小端 |
| floating point / fixed point | 浮点 / 定点 |
| significand / mantissa / exponent | 有效数 / 尾数 / 指数 |
| logic gate / circuit | 逻辑门 / 电路 |
| multiplexer / demultiplexer / decoder | 多路复用器 / 多路分配器 / 译码器 |
| adder / ALU | 加法器 / 算术逻辑单元（ALU） |
| latch / flip-flop / register file | 锁存器 / 触发器 / 寄存器文件 |
| von Neumann architecture | 冯·诺依曼体系结构 |
| control unit / processing unit | 控制单元 / 处理单元 |
| instruction / program counter (PC) | 指令 / 程序计数器（PC） |
| fetch / decode / execute / write back | 取指 / 译码 / 执行 / 写回 |
| pipelining / pipeline hazard / stall | 流水线 / 流水线冒险 / 停顿 |
| clock / cycle / clock rate | 时钟 / 周期 / 时钟频率 |
| assembly / disassemble | 汇编 / 反汇编 |
| register / condition code / flag | 寄存器 / 条件码 / 标志 |
| instruction set architecture (ISA) | 指令集架构（ISA） |
| calling convention / caller / callee | 调用约定 / 调用者 / 被调用者 |
| return address / frame pointer / stack pointer | 返回地址 / 帧指针 / 栈指针 |
| buffer overflow | 缓冲区溢出 |
| memory hierarchy | 存储器层次结构 |
| cache / cache line / block / tag / index / offset | 缓存 / 缓存行 / 块 / 标记 / 索引 / 偏移 |
| hit / miss / hit rate / eviction | 命中 / 未命中 / 命中率 / 驱逐 |
| direct-mapped / set associative / fully associative | 直接映射 / 组相联 / 全相联 |
| write-through / write-back | 写直达 / 写回 |
| temporal / spatial locality | 时间局部性 / 空间局部性 |
| primary / secondary storage | 主存储 / 辅助存储 |
| code optimization | 代码优化 |
| loop unrolling / inlining / loop-invariant code motion | 循环展开 / 内联 / 循环不变量外提 |
| operating system / kernel / kernel mode / user mode | 操作系统 / 内核 / 内核态 / 用户态 |
| system call / trap / interrupt / exception | 系统调用 / 陷阱 / 中断 / 异常 |
| process / thread / context switch | 进程 / 线程 / 上下文切换 |
| virtual memory / page / frame / page table / page fault | 虚拟内存 / 页 / 页框 / 页表 / 缺页 |
| address space / virtual / physical address | 地址空间 / 虚拟地址 / 物理地址 |
| TLB | 转换后备缓冲区（TLB，快表） |
| signal / signal handler | 信号 / 信号处理程序 |
| inter-process communication (IPC) | 进程间通信（IPC） |
| pipe / message passing / shared memory | 管道 / 消息传递 / 共享内存 |
| multicore / shared memory | 多核 / 共享内存 |
| synchronization / race condition / critical section | 同步 / 竞态条件 / 临界区 |
| mutex / semaphore / condition variable / barrier | 互斥锁 / 信号量 / 条件变量 / 屏障 |
| deadlock / thread safety / reentrant | 死锁 / 线程安全 / 可重入 |
| cache coherence / false sharing | 缓存一致性 / 伪共享 |
| speedup / efficiency / scalability | 加速比 / 效率 / 可扩展性 |
| Amdahl's law / Gustafson–Barsis law | 阿姆达尔定律 / 古斯塔夫森定律 |
| embarrassingly parallel | 易并行 |
| warp / SIMT | 线程束（warp） / 单指令多线程（SIMT） |
