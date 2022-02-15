---
title: Remove if...else...by Enum
date: 2022-02-11 14:42:27
tags: 
---

# <center> 消除if-else之为Enum添加行为 </center>

## 场景描述

Java提供枚举类给了开发者更可读的代码实现，我们可以将很多字段作为枚举类型。并且赋予枚举类行为，可以省略掉根据枚举类判断而实现不同行为的众多if...else...

> 如下是根据参数而下载不同类型的文件的枚举代码，给每个枚举类型添加了响应的代码

```java
public enum DownloadFileType {
    CSV {
        @Override
        public void writeToLocal() {
            exportUtil.writeCsv();
        }
    },
    EXCEL {
        @Override
        public void writeToLocal() {
            exportUtil.writeExcel();
        }
    };

    public abstract void writeToLocal();

    public static DownloadFileType of(String fileType) {
        return Arrays.stream(DownloadFileType.values())
                .filter(type -> type.toString().equals(fileType.toUpperCase(Locale.ROOT)))
                .findFirst()
                .orElse(EXCEL);
    }
}
```

> 调用方可以免除掉if...else  只需要获取到下载的类型来执行不同的写入。

```java
//write to local tmp dir
//fileType: "excel" or "csv"
DownloadFileType.of(fileType).writeToLocal();
    
```

