---
title: Java多版本管理工具SDKMAN
date: 2023-07-02 00:05:06
tags: Tools
---

> 作为一名Javaer领到电脑的第一件事就是需要配置Java环境，以及切换不同的JDK版本来进行日常开发，Node开发有nvm，python开发有pyenv, Java也提供了响应的工具sdkman（Linux, Unix, MacOS）。同时sdkman也可以管理Scala、Gradle、Maven等等软件不同的版本。

## 安装 SDKMan 要开始使用 SDKMan，

首先需要在你的系统上安装它。SDKMan 支持 Windows、macOS 和 Linux 等操作系统。 

### 在 macOS 和 Linux 上安装 

在终端中执行以下命令来安装 SDKMan： 

```bash
curl -s "https://get.sdkman.io" | bash 
# 或者 
curl -s "https://get.sdkman.io" | ZSH
```

执行

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
$ sdk version
# 如下，如果显示版本则代表成功
  sdkman 5.18.2
```

### 在 Windows 上安装

在 Windows 上，你可以使用 Git Bash 或 Cygwin 等工具来安装和使用 SDKMan。首先，下载并安装 Git Bash 或 Cygwin，并确保它们在系统的 PATH 环境变量中。然后，在 Git Bash 或 Cygwin 终端中执行以下命令来安装 SDKMan：

```bash
curl -s "https://get.sdkman.io" | bash
```

## 使用 SDKMan

一旦你安装好了 SDKMan，就可以开始使用它来管理你的开发工具了。

### 安装工具

使用 SDKMan 安装一个开发工具非常简单。比如，要安装最新版本的 Java，只需要在终端中执行以下命令：

```bash
sdk lis java #显示出java所有版本
sdk install java 17.0.3-oracle
```

### 切换版本

```bash
sdk use java 17.0.3-oracle
```

### 升级工具

SDKMan 也提供了升级已安装工具的功能。要升级某个已安装的工具，只需要执行以下命令：

```bash
sdk upgrade <tool>
```

其中 `<tool>` 是你想要升级的工具名称，比如 `java`、`scala`等。

### 列出可用版本

如果你想查看某个工具的所有可用版本，可以使用以下命令：

```bash
sdk list <tool>
```

这将列出该工具所有可用的版本号供你选择。

### 删除工具

如果你想删除某个已安装的工具，可以使用以下命令：

```bash
sdk uninstall <tool> <version>
```

其中 `<tool>` 是工具的名称，`<version>` 是要删除的版本号。

## 结语

SDKMan 是一个非常实用的开发工具管理工具，可以帮助开发人员轻松安装、升级和切换不同版本的开发工具。它简化了我们在不同项目中使用不同工具版本的过程，让开发变得更加便捷和高效。

如果你还没有尝试过 SDKMan，我强烈推荐你去官方网站（https://sdkman.io/）了解更多信息，并在你的开发环境中安装和使用它。相信它会成为你的好帮手！

ChatGpt真强大这篇文章是它写的。

