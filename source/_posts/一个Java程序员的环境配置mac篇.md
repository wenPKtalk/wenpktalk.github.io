---
title: 一个程序员的职业素养
date: 2022-09-14 22:09:51
tags: Resource
categories: Resource
---

> 一个团队中的开发环境和开发习惯的统一是可以避免很多问题的。这儿是把之前郑大的在我们团队中提出的要求做一个备份。

基础开发环境

Mac 操作系统设置

- 把 F1、F2 当做标准的功能键（System Preferences -> Keyboard -> 勾选 Use F1, F2, etc. key as standard key function keys.）

安装输入法

- 推荐使用搜狗输入法，[点我安装](https://pinyin.sogou.com/mac/)。

安装 Iterm2

- 推荐使用 Iterm2 作为命令行终端，[点我安装](https://www.iterm2.com/)。
- Iterm2 的文档如下：

https://www.iterm2.com/documentation.html

安装Homebrew

- brew是MAC OS开源的包管理器，[点我安装](https://brew.sh/index_zh-cn)。

温馨提示:

1. 连接被拒绝问题解决请参考：[GitHub DNS解析被污染，手动进行域名映射](https://github.com/hawtim/blog/issues/10)
2. 官方源下载速度慢问题解决请参考：[将官方源切换成国内源](https://blog.csdn.net/claram/article/details/101577547)

安装 zsh & oh-my-zsh

- 推荐使用 ZSH 作为缺省的 Shell，请确认 ZSH 是否安装。

- 使用如下命令检查当前 Shell：

```
echo $SHELL
```

  使用如下命令检查是否 ZSH： 

```
which zsh
```

- 若未安装，使用如下命令进行安装：

```
 brew install zsh
```

  使用如下命令进行 Shell 切换：

`chsh -s `which zsh``

  切换后，重启终端即可。

- 使用 oh-my-zsh 配置 ZSH，使用如下命令进行安装：

```
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

- oh-my-zsh 的文档如下：

https://github.com/ohmyzsh/ohmyzsh/wiki

- 在 ~/.zshrc 中进行配置

```
export ZSH=/Users/dreamhead/.oh-my-zsh # oh-my-zsh 的安装路径
ZSH_THEME="robbyrussell" # 启用主题，请选用有 Git 分支提示的主题
plugins=(git) # 启用插件，请启用 Git 插件
source $ZSH/oh-my-zsh.sh # 启用 oh-my-zsh
```

- 推荐插件：Git

安装 Git & Git Flow

推荐使用 Git 作为版本控制工具，使用 Git Flow 作为基本的研发过程。

```
brew install git
brew install git-flow
```

安装 IntelliJ IDEA

对于 Java 程序员，推荐使用 IntelliJ IDEA Community Edition 作为开发环境，[点我安装](https://www.jetbrains.com/idea/download/)。

- 推荐Keymap：IntelliJ IDEA Classic （经典配置在各个操作系统上比较一致）
- 推荐插件：Lombok

开发习惯

需求开发

确认需求

- 与产品经理确认需求背景，确认需求有效性。
- 向产品经理复述对需求的理解，以确保二者理解的一致性。
- 将需求开发挪到开发中（In Dev）。

接口变更

- 确认该需求是否需要接口变更（增加接口、增加接口字段等）。

- 若需要接口变更

- - 发起接口变更的审核，审核通过，方可继续开发。
  - （后端）将变更后的接口更新在接口文档中。
  - （前端）按照变更后接口更新模拟接口。

数据库变更

- 确认该需求是否需要数据库变更（增加表、增加数据库字段等）。

- 若需要数据库变更

- - 发起数据库变更的审核，审核通过，方可继续开发。
  - （后端）将变更后的接口更新在数据库迁移中。

需求开发

- 先对要开发的任务进行任务分解。参考 **任务分解** 一节。
- 按照任务进行开发。在代码编写的过程中，要及时**格式化代码**，尽可能**消除 IDE 给出的警告**。
- 每完成一个任务，提交一次代码。参考 **代码提交** 一节。
- 除了要编写基本的功能代码之外，编写代码的过程还要开发相应的 **测试**。
- 在所有任务完成之后，对照需求的 **验收标准**，确认代码满足了需求。

需求验收

- 将开发完成的需求演示给产品经理。
- 产品经理认为该需求已经达成需求的要求，满足验收标准，需求开发结束，否则，重新调整，满足需求。
- 将需求卡片挪到待测试（Ready for Test）。

任务分解

- 推荐在每天工作伊始，先将要完成的工作进行任务分解。

- 任务的粒度要求

- - **足够小**，大约可以在半个小时之内完成。
  - **完整**，一个任务完成之后可以独立提交。

- 在开发过程中，如果遇到新的任务，可以附加在任务列表上。

- 任务列表工具

- - 贴纸（物理），将贴纸贴到电脑显示器上。
  - stickies（App），Mac 自带的 App。配置为悬浮，在菜单中选择 Window -> Float on Top。
  - 其它 App，比如，微软 ToDo。

- 下面是一个供参考的任务分解样例，完成了一个用户名密码登录的过程。

- 具体的分解过程请参考 [极客时间的《一起练习：手把手带你分解任务》](https://time.geekbang.org/column/article/78542)

![img](https://funstory.feishu.cn/space/api/box/stream/download/asynccode/?code=2eb606d6d4934a198c7585308580b268_8f118824ce50c961_boxcnzaVmRkva6OPSgL66H0k8kO_vAKUnzKkrlH0mLvnytWRaiJK6FQ7ERfh)

版本控制

Git 的基本使用

- 推荐使用 Git 作为版本控制工具
- 推荐使用 oh-my-zsh 的 Git 插件

基本配置

全局的 Git 建议配置（在 ~/.gitconfig 中）

```
[alias]
 co = checkout
 st = status
 ci = commit -a
[color]
 ui = auto
```

基本使用

从远程更新代码

```
gup # Git 插件命令 git pull --rebase
```

向远程推送代码

```
gp # Git 插件命令 git push
```

查看修改结果

```
git st # 使用 Git 全局配置别名
gst # Git 插件命令 git status
```

提交代码

```
git ci -m"This is commit message"
```

发布管理

- 推荐采用无特性分支的 Git Flow，也就是说，**不允许使用 feature 分支**。

分支介绍

| 分支    | 用途               | 提交/合并代码                                           | 远程分支 | 长期保持                                   |
| ------- | ------------------ | ------------------------------------------------------- | -------- | ------------------------------------------ |
| develop | 用于日常的迭代开发 | 允许提交代码，允许由 release、hotfix 分支合并代码       | 是       | 是                                         |
| master  | 保持与生产环境一致 | **不允许**提交代码，允许由 release、hotfix 分支合并代码 | 是       | 是                                         |
| release | 用于迭代发布       | 在迭代测试期间提交代码，**不允许**合并分支代码          | 可以     | 一般情况不长期保持；有特定版本，允许保留， |
| hotfix  | 用于修复线上问题   | 在修复问题期间提交代码，**不允许**合并分支代码          | 否       | 否                                         |

基本用法

- 初始化

```
git flow init
```

- 发布（Release）

- - 发布开始

```
git flow release start v20200901
```

- - 发布结束

```
git flow release finish v20200901
```

- 修复问题（Hotfix）

- - 修复问题

```
git flow hotfix start fix_production_bug
```

- - 发布结束

```
git flow hotfix finish fix_production_bug
```

代码提交

本地构建

提交代码之前，**必须**保证代码的本地构建是通过的。

确认提交

提交代码前，需要确认修改是自己要做的修改，防止误操作。

- 确认修改文件：确定修改文件是自己要修改的文件，运行如下命令。

```
gst
```

对于误修改的文件，运行如下命令恢复

```
git co 文件路径
```

- 确认修改内容：

- 确定修改的内容是自己要修改的内容，确保代码**正确地格式化**，运行如下命令：

```
gd
```

提交代码

- 加入新文件。将未加入版本管理的文件，加入版本管理

```
git add 文件路径
```

- 提交代码

```
git ci -m"This is your commit message"
```

注释

原则：注释有意义，准确描述出在做的事情。

- 注释使用英文，首字母大写，首单词为动词。

单一提交线

- 本地提交后的代码不允许出现提交线分叉，若出现分叉，请使用 rebase。

- 可能出现分叉的场景

- - 从远程拉代码，建议使用 gup 命令，保证在拉代码的同时，进行 rebase。
  - **从 release/hotfix 分支合并代码，允许保留分叉**。

获取远程代码

- 获取远程代码。采用如下命令，获取远程代码，该命令在获取远程代码之后，进行 rebase 操作。

```
gup
```

- 修复冲突。如果在获取远程代码之后，产生了冲突，请先解决冲突。冲突解决之后，采用如下命令：

```
git add 冲突文件路径
```

在所有冲突解决之后，采用如下命令，继续完成 rebase 操作：

```
git rebase --continue # Git 插件别名：grbc
```

- 本地构建。在合并了远端代码之后，再次运行本地构建，确保合并之后的代码，依然可以通过本地构建。如有问题，请及时修复。

推送代码

采用如下命令将代码推送至远程。

```
gp
```

监控持续集成

程序员需要等到持续集成通过之后，再进行后续开发。
