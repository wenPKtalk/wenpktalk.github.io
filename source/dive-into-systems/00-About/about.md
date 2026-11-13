---
title: "Dive Into Systems · 全书中英对照（个人学习用）"
book: dive-into-systems
chapter: 00-About
order: 0
disableNunjucks: true
---

原书：<https://diveintosystems.org/book/index.html>，作者 Suzanne J. Matthews、Tia Newhall、Kevin C. Webb。
许可：CC BY-NC-ND 4.0（署名-非商业-禁止演绎）。本译文属于演绎作品，**仅供个人学习，请勿公开传播**。

- **[INDEX.md](/books/dive-into-systems/)：全书索引。** 包括各章统计、全书小节目录、58 条现代更新索引和勘误索引。
- [_build/glossary.md](glossary.html)：译名表与翻译约定。

## 目录

| 章 | 标题 | 页数 |
|---|---|---|
| [00-Front](../00-Front/preface.html) | 版权、致谢、前言、0. 引言 | 4 |
| [C1-C_intro](../C1-C_intro/1.0-index.html) | 1. 在 C 边，在 C 边，在美丽的 C 边 | 9 |
| [C2-C_depth](../C2-C_depth/2.0-index.html) | 2. 深入 C 语言编程 | 19 |
| [C3-C_debug](../C3-C_debug/3.0-index.html) | 3. C 调试工具 | 8 |
| [C4-Binary](../C4-Binary/4.0-index.html) | 4. 二进制与数据表示 | 14 |
| [C5-Arch](../C5-Arch/5.0-index.html) | 5. 冯·诺依曼早已知道的事：计算机体系结构 | 15 |
| [C6-asm_intro](../C6-asm_intro/6.0-index.html) | 6. 在 C 之下：潜入汇编 | 1 |
| [C7-x86_64](../C7-x86_64/7.0-index.html) | 7. 64 位 x86 汇编（x86-64） | 15 |
| [C8-IA32](../C8-IA32/8.0-index.html) | 8. 32 位 x86 汇编（IA32） | 15 |
| [C9-ARM64](../C9-ARM64/9.0-index.html) | 9. ARM 汇编 | 15 |
| [C10-asm_takeaways](../C10-asm_takeaways/10.0-index.html) | 10. 汇编要点总结 | 1 |
| [C11-MemHierarchy](../C11-MemHierarchy/11.0-index.html) | 11. 存储与存储器层次结构 | 9 |
| [C12-CodeOpt](../C12-CodeOpt/12.0-index.html) | 12. 代码优化 | 5 |
| [C13-OS](../C13-OS/13.0-index.html) | 13. 操作系统 | 10 |
| [C14-SharedMemory](../C14-SharedMemory/14.0-index.html) | 14. 多核时代的共享内存利用 | 15 |
| [C15-Parallel](../C15-Parallel/15.0-index.html) | 15. 展望：其他并行系统与并行编程模型 | 4 |
| [Appendix1](../Appendix1/16.0-index.html) | 16. 附录 1：面向 Java 程序员的第 1 章 | 9 |
| [Appendix2](../Appendix2/17.0-index.html) | 17. 附录 2：使用 Unix | 17 |
| **合计** | | **185** |

## 阅读约定

- 每段先给中文，后面用引用块附英文原文。代码块与原书逐字一致，没有改动。原书插图（224 幅带编号的图，另有若干无编号的示意图）都保存在各章的 `_images/` 目录里。
- `[!NOTE] 译注`：有 309 条，内容是概念解释、背景补充和原文勘误。
- `[!TIP] 现代更新`：有 58 条，记录截至 2026 年 11 月的新进展，每章至少一条。每条都附有来源链接；已逐一核对，每个链接都对应一篇实际抓取到研究库里的来源笔记。
- 书内交叉链接已改为指向本地译文文件。原书锚点与译文标题对不上，所以链接只跳到对应文件，不跳到具体小节。例题附件（`_attachments/`）的链接仍然指向原站。

## 勘误与核实方法

译注中指出的原书错误，都经过下面一种方式核实。无法核实的说法已删除，或改成了不下定论的表述：

- **本地编译、运行**：在 Apple M1 Pro 上用 Apple clang 编译验证。x86-64、i386 和 aarch64 Linux 的代码用 `-target` 交叉生成汇编来核对；ARM64 代码直接在本机运行。另外还用了 GNU Make 3.81、Vim 自带文档和 macOS 的 `man`。
- **权威来源**：man7.org 手册页、GCC 手册、内核文档、RFC、厂商发布说明等。

译注里凡是 macOS 和 Linux 行为不同的地方，都写明了是在哪个平台上验证的。

## 已知局限

- 勘误索引是按关键词自动筛出来的（见 INDEX.md 的说明），会漏掉一些，也会混进几条非勘误的译注。
- 部分来源无法抓取（gnu.org 部分页面、GitHub 文档、RFC 4252 等），依赖这些来源的补充已经删掉。
- 译文未经他人审校。

## 重新生成

```bash
cd _build
python3 -I book.py status            # 检查 185 页是否都已构建并通过校验
python3 -I book.py build C13-OS/vm   # 修改 zh/ 或 updates/ 之后重建某一页
python3 -I toc.py                    # 重新生成 ../INDEX.md
```

`zh/<章>/<页>.md` 是译文源文件，`updates/<章>.md` 是现代更新源文件。构建时会校验代码块、标题和图片都与原书 HTML 一致，并把书内链接改成本地链接。