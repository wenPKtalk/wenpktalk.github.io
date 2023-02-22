---
title: docker里的mongo WiredTiger error 解决方法
date: 2023-02-17 18:30:42
tags: DevOps
categories: DevOps
---

## 背景

> 电脑强制重启后，docker里的mongo不能正常使用，索引不能位置被破坏，错误log是这样的： error: WT_ERROR: non-specific WiredTiger error"}

## 解决方法

1. 简历另外一个容器，volume挂载和上一个容器一样的位置：

```sh
docker run -it -d --name="mongofix" \
    -p 27017:27017 \
    -p 27018:27018 \
    -p 27019:27019 \
    -e TIMEZONE="Australia/Brisbane" \
    -e TZ="Australia/Brisbane" \
    -v {本地挂载目录}/configdb:/data/configdb \
    -v {本地挂载目录}/db:/data/db \
    mongo:latest /bin/bash
```

2. 删除几个lock文件

   ```shell
   $ rm -r journal
   $ rm -r mongod.lock
   $ rm -r WiredTiger.lock
   ```

3. 进入mongofix容器

```sh
docker exec -it mongo /bin/sh
# mongod --repair
```

## 总结

这也提供了一条思路，如果因为挂载文件损坏，容器不能正常启动，所以不能进入容器运行修复命令，可以先创建其它容器，进入容器后进行修复。然后restart老的容器。

## 引用

https://gist.github.com/mtrunkat/203c33347cc96db51a754a45bb902669?permalink_comment_id=2693735

