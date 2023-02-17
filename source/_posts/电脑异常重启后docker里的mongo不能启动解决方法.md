---
title: 电脑异常重启后docker里的mongo不能启动解决方法
date: 2023-02-17 18:30:42
tags:
---

> 电脑强制重启后，docker里的mongo不能正常使用，如下解决方法。

https://gist.github.com/mtrunkat/203c33347cc96db51a754a45bb902669?permalink_comment_id=2693735

简历另外一个容器，volume挂载和上一个容器一样的位置：

```
docker run -it -d --name="mongofix" \
    -p 27017:27017 \
    -p 27018:27018 \
    -p 27019:27019 \
    -e TIMEZONE="Australia/Brisbane" \
    -e TZ="Australia/Brisbane" \
    -v /Users/james/docker/mongo/configdb:/data/configdb \
    -v /Users/james/docker/mongo/db:/data/db \
    mongo:latest /bin/bash
```

进入mongofix容器

```
docker exec -it mongo /bin/sh
# mongod --repair
```

