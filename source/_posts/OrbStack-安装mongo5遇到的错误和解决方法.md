---
title: OrbStack 安装mongo5遇到的错误和解决方法
date: 2024-09-12 18:04:17
tags: [docker, orbstack]
categories: devOps
---

### Macos m2上使用OrbStack docker 安装mongo5.0+

### 背景

macOS(m2) 从 desktop-docker 切换到OrbStack，使用mongo6.0镜像利用如下docker-compose.yml启动的时候会报错

```yaml
version: '3'
services:
  mongo:
    image: mongo:6.0
    container_name: mongo
    ports:
      - "27017:27017" 
    volumes:
      - ~/orbDocker/mongo/configdb:/data/configdb
      - ~/orbDocker/mongo/db:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root

```

`docker-compose up`

```shell
[+] Running 0/0
 ⠋ Network mongo_default  Creating                                                                                                                       0.1s
[+] Running 2/2d orphan containers ([mongo-mongo-express-1]) for this project. If you removed or renamed this service in your compose file, you can run this c ✔ Network mongo_default  Created                                                                                                                        0.1s
 ✔ Container mongo        Created                                                                                                                        0.1s
Attaching to mongo
mongo  |
mongo  | WARNING: MongoDB 5.0+ requires a CPU with AVX support, and your current system does not appear to have that!
mongo  |   see https://jira.mongodb.org/browse/SERVER-54407
mongo  |   see also https://www.mongodb.com/community/forums/t/mongodb-5-0-cpu-intel-g4650-compatibility/116610/2
mongo  |   see also https://github.com/docker-library/mongo/issues/485#issuecomment-891991814
mongo  |
mongo  | /usr/local/bin/docker-entrypoint.sh: line 416:    28 Illegal instruction     "${mongodHackedArgs[@]}" --fork
mongo exited with code 132
```



修复给docker-compose.yml配置`platform: linux/arm64`

```yaml
version: '3'
services:
  mongo:
    image: mongo:6.0
    platform: linux/arm64
    container_name: mongo
    ports:
      - "27017:27017" 
    volumes:
      - ~/orbDocker/mongo/configdb:/data/configdb
      - ~/orbDocker/mongo/db:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: root

```