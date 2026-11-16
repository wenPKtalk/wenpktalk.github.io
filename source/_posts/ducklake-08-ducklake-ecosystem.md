---
title: "DuckLake 专栏（八）：DuckLake 生态逐项目架构"
date: 2026-11-16 15:08:00
tags: [DuckDB, DuckLake]
categories: DuckLake
book: ducklake
chapter: ecosystem
order: 8
---
{% post_link ducklake-01-versions-and-maturity '第 1 篇' %}给了生态的成熟度总表，这一篇逐个项目画核心架构图，并写下每个项目值得借鉴的地方。DuckLake 本体的架构见{% post_link ducklake-02-how-ducklake-stores-data '第 2 篇' %}，全部来源汇总在{% post_link ducklake-09-duckdb-embedding '第 9 篇' %}末尾。

**架构图怎么读**
- 图只画到 README 或文档里明确写了的组件。没写的不臆造，在"未核实"里说明。
- 节点颜色：
  - 🟦 写路径
  - 🟩 读路径
  - 🟪 维护
  - 🟧 元数据 / catalog
  - 🟨 DuckDB 引擎
  - 🟥 限制或坑
  - ⬜ 外部系统或存储


## 2.1 MotherDuck（托管 DuckLake + Duckling）

> **成熟度：** MotherDuck 平台 🟢 **GA**（2024-06）。托管 DuckLake 🟡 **Preview**：4 月发布时写的是 public preview，之后的 release notes 都没有 GA 公告。文档列出的限制包括"每个库只允许一个账号写"。

**定位：** 云数仓，每个用户一个 DuckDB 实例（称为 hypertenancy）。客户端和云端可以分工执行一个查询（Dual Execution）。

```mermaid
flowchart LR
  subgraph CLIENT["客户端"]
    LOCAL["本地 DuckDB<br/>+ motherduck 扩展<br/>或浏览器 duckdb-wasm"]
  end
  PLAN{"Dual Execution 规划器<br/>算子跑在本地还是云端"}
  subgraph CLOUD["MotherDuck 云"]
    D1["Duckling：用户 A<br/>尺寸 Pulse 到 Giga<br/>空闲自动关停"]
    D2["Duckling：用户 B"]
    RS["读扩展副本<br/>（最终一致，分钟级）"]
  end
  subgraph LAKE["托管 DuckLake"]
    MCAT["MotherDuck 托管 catalog"]
    MOBJ[("MotherDuck 托管存储<br/>或用户自己的 bucket")]
  end
  LOCAL --> PLAN
  PLAN -->|"把数据拉到本地算"| LOCAL
  PLAN -->|"把计算推到云端"| D1
  BI["共用一个连接的 BI 工具"] --> RS
  D1 --> MCAT
  D1 --> MOBJ
  D2 --> MCAT
  RS --> MOBJ
  ACL["表级权限 / secure view<br/>（2026-10，仅限托管的 lake）"] -.-> MCAT
  classDef duck fill:#FEF9C3,stroke:#CA8A04,color:#1f2937
  classDef meta fill:#FFEDD5,stroke:#EA580C,color:#1f2937
  classDef read fill:#DCFCE7,stroke:#15803D,color:#1f2937
  class LOCAL,D1,D2 duck
  class MCAT,ACL meta
  class RS read
```

**可借鉴**
- **按用户或租户隔离计算实例。** 吵闹邻居只影响它自己。
- **读扩展副本接受最终一致。** 适合 BI 这类"一个连接、很多用户"的场景。
- **未核实：** 存储内部机制、冷启动时间、副本数上限。

来源：[扩展博客](https://motherduck.com/blog/scaling-duckdb-with-ducklings/)、[release notes](https://motherduck.com/docs/about-motherduck/release-notes/)

---

## 2.2 datafusion-ducklake（Hotdata）

> **成熟度：** 🟠 **0.x**：crates.io 最新 0.9.0（2026-10-07），没有 GitHub release。多 catalog 布局为 🟡 experimental。

**定位：** 用 Rust 原生读写 DuckLake，**完全不依赖 DuckDB**。

```mermaid
flowchart LR
  APP["Rust 应用<br/>DataFusion SessionContext"] --> CATP["DuckLakeCatalog<br/>（catalog.schema.table）"]
  CATP --> MP{"MetadataProvider<br/>由 feature flag 选择"}
  MP -->|"默认"| SQLITE["SQLite catalog"]
  MP -->|"metadata-postgres<br/>（sqlx + tokio）"| PGC["PG catalog"]
  MP -->|"duckdb-bundled"| DDC["DuckDB catalog"]
  CATP --> OS[("object_store<br/>本地 / S3 / MinIO")]
  W["写入：write-postgres<br/>write-duckdb 需显式开启"] -.-> MP
  classDef meta fill:#FFEDD5,stroke:#EA580C,color:#1f2937
  classDef write fill:#DBEAFE,stroke:#2563EB,color:#1f2937
  class SQLITE,PGC,DDC,MP meta
  class W write
```

**可借鉴**
- **证明 DuckLake 元数据可以完全脱离 DuckDB 来读。** 只要遵守规范，元数据协议是开放的。
- **读写能力按 feature flag 拆开。** 默认只读，写入要显式开启，这是降低误写风险的好做法。

来源：[GitHub](https://github.com/datafusion-contrib/datafusion-ducklake)

---

## 2.3 ducklake-spark（MotherDuck）

> **成熟度：** 🟠 **0.x**：v0.4.0（2026-10-12），只能写。

**定位：** 基于 Spark DataSource V2 的**只写**连接器，只支持追加。

```mermaid
flowchart LR
  DF["Spark DataFrame<br/>df.writeTo(...).append()"] --> DRV["Spark Driver"]
  DRV --> EX1["Executor 1"]
  DRV --> EX2["Executor N"]
  EX1 -->|"Hadoop FS 写 Parquet"| OBJ[("S3 / 对象存储")]
  EX2 -->|"Hadoop FS 写 Parquet"| OBJ
  DRV -->|"通过 DuckDB ducklake 扩展<br/>与 catalog 交互<br/>（具体怎么登记文件，README 没写）"| CAT["DuckLake catalog<br/>（本地 DuckDB / PG / MotherDuck）"]
  LIM["限制：不能读 / 只能追加<br/>表必须事先建好 / 不支持 UUID / 不支持 Spark 4"]
  classDef write fill:#DBEAFE,stroke:#2563EB,color:#1f2937
  classDef meta fill:#FFEDD5,stroke:#EA580C,color:#1f2937
  classDef warn fill:#FEE2E2,stroke:#B91C1C,color:#1f2937
  class EX1,EX2 write
  class CAT meta
  class LIM warn
```

**可借鉴**
- **"数据面"和"元数据提交"分开。** 大量 worker 并行写文件，最后由一个点统一登记和提交。
- **反面教材：** 连接器只能写不能读，说明多引擎生态的成熟度远不如 Iceberg。

来源：[GitHub README](https://github.com/motherduckdb/ducklake-spark)

> **Trino 和 pandas 客户端（不画图，只读了 README 的状态部分）**
> - **`brikk/trino-ducklake`** 🟠 v0.5.4：通过 JDBC 访问 catalog。能读写 DuckLake 1.0 格式，**不能写 1.1 格式**，读 1.1 格式是实验功能，正常构建里没有开启。
> - **`awitten1/trino-ducklake`** 🟠：没有 release。
> - **pandas 版 `ducklake-dataframe`** 🟡：概念验证。README 写明"100% written by Claude Code"，不建议在生产环境使用。

---

## 2.4 pg_ducklake + pg_duckpipe（relytcloud）

> **成熟度：** pg_ducklake 🟢 **v1.0.3**（2026-10-19），升级到 DuckDB 2.0 / DuckLake 1.1 还在 issue 里跟踪。pg_duckpipe 🟠 **没有 GitHub release**，各组件的 Cargo 版本是 0.1.0 和 1.0.0，README 没有声明成熟度。

**定位：** 在 Postgres 里原生建 DuckLake 表；pg_duckpipe 从 WAL 做 CDC，把行存表增量同步成 DuckLake 表。

```mermaid
flowchart TB
  subgraph PG["PostgreSQL 实例"]
    HEAP["行存表（必须有主键）"]
    WAL["WAL<br/>wal_level=logical"]
    subgraph DP["pg_duckpipe"]
      G1["同步组 1：独立 bgworker 进程<br/>+ 独立复制槽"]
      G2["同步组 2：独立 bgworker 进程<br/>+ 独立复制槽"]
      Q["按表划分的变更队列"]
      T1["表 t1 的刷写线程"]
      T2["表 t2 的刷写线程"]
      BP["背压：队列超过阈值<br/>就暂停消费 WAL"]
    end
    subgraph PDL["pg_ducklake（基于 pg_duckdb 构建）"]
      AM["CREATE TABLE ... USING ducklake"]
      DDB["进程内的 DuckDB 执行"]
      MW["后台 worker：<br/>刷写内联数据 / 合并小文件"]
    end
    CATS["ducklake.* 元数据 schema<br/>（catalog 就在这个 PG 里）"]
  end
  OBJ[("本地盘 / S3<br/>Parquet")]
  HEAP --> WAL --> G1 & G2
  G1 --> Q
  G2 --> Q
  Q --> T1 & T2
  T1 -->|"批量写入"| DDB
  T2 -->|"批量写入"| DDB
  BP -.-> G1
  AM --> DDB
  DDB --> CATS
  DDB --> OBJ
  MW -.-> CATS
  classDef write fill:#DBEAFE,stroke:#2563EB,color:#1f2937
  classDef meta fill:#FFEDD5,stroke:#EA580C,color:#1f2937
  classDef maint fill:#F3E8FF,stroke:#7E22CE,color:#1f2937
  classDef duck fill:#FEF9C3,stroke:#CA8A04,color:#1f2937
  classDef warn fill:#FEE2E2,stroke:#B91C1C,color:#1f2937
  class G1,G2,T1,T2,Q write
  class CATS meta
  class MW maint
  class DDB duck
  class BP warn
```

**可借鉴**
- **同步组隔离：** 每个组有自己的进程和复制槽，"一张慢表拖不住别的组"。
- **按表的刷写线程：** 不同表之间并行写入。
- **背压：** 积压超过阈值就暂停消费，内存有上界。
- **缓冲后批量写，加上 inlining 吸收小写入：** 是解决小文件问题的标准做法。

来源：[pg_ducklake](https://github.com/relytcloud/pg_ducklake)、[pg_duckpipe](https://github.com/relytcloud/pg_duckpipe)

---

## 2.5 dlt（dltHub）DuckLake 目的端

> **成熟度：** dlt 🟢 **1.32.0**（PyPI 标为 "Production/Stable"）。DuckLake 目的端的文档没有标阶段：PG catalog 是唯一的生产级选项；SQLite 和 DuckDB catalog 只能串行加载；MotherDuck catalog 为 🟡 experimental；MySQL 未测试。

**定位：** Python 写的 EL 库，原生支持 `destination="ducklake"`。

```mermaid
flowchart LR
  SRC["数据源<br/>API / DB / 文件"] --> EXT["extract"] --> NORM["normalize<br/>推断 schema / 展平嵌套"] --> LOAD["load"]
  LOAD --> DDB["DuckDB + ducklake 扩展"]
  DDB --> CAT["catalog：SQLite（自动建）<br/>/ Postgres / MotherDuck"]
  DDB --> OBJ[("文件系统 / S3")]
  classDef duck fill:#FEF9C3,stroke:#CA8A04,color:#1f2937
  classDef meta fill:#FFEDD5,stroke:#EA580C,color:#1f2937
  class DDB duck
  class CAT meta
```

**可借鉴**
- **本地 SQLite catalog 和生产 PG catalog 用同一套代码切换。**
- 来源：[dlt 文档](https://dlthub.com/docs/dlt-ecosystem/destinations/ducklake)（据检索摘要；写入策略的细节没有核实）

---

## 2.6 Quack on Demand（starlake-ai）

> **成熟度：** 🟠 **0.x**：v0.12.2（2026-11-09），依赖的 Quack 还是 🟡 beta。

**定位：** 面向 DuckDB 和 DuckLake 的多租户"服务层"，相当于自托管、只管查询服务的 MotherDuck。

```mermaid
flowchart LR
  subgraph CLI["客户端"]
    JDBC["JDBC / ODBC / ADBC<br/>Power BI / Tableau"]
    QK["任意 DuckDB<br/>ATTACH 'quack:...'"]
  end
  subgraph MGR["Manager（控制面，单个二进制）"]
    EDGE["Flight SQL 入口 :31338<br/>Quack 监听 :9494"]
    AUTH["认证：Keycloak / AzureAD<br/>Google / Cognito / JWT"]
    RBAC["RBAC 图：用户 / 角色 / 组<br/>→ 每个会话一份 EffectiveSet"]
    ROUTE["按 tenant + pool 路由<br/>选负载最低的节点"]
    CP[("控制面 Postgres")]
  end
  subgraph POOLS["节点池（按需拉起：子进程 / K8s Pod / 服务器集群）"]
    N1["节点：pool=bi<br/>DuckDB"]
    N2["节点：pool=etl<br/>DuckDB"]
  end
  ACL["每条语句的 ACL：<br/>按 DuckDB 绑定后的对象判定<br/>读 / 写 / DDL，结果签名后缓存"]
  TCAT["每个租户一个<br/>DuckLake catalog 库"]
  OBJ[("对象存储 Parquet")]
  JDBC --> EDGE
  QK --> EDGE
  EDGE --> AUTH --> RBAC --> ROUTE
  RBAC --- CP
  ROUTE --> N1 & N2
  N1 -.-> ACL
  N1 --> TCAT
  N2 --> TCAT
  N1 --> OBJ
  classDef duck fill:#FEF9C3,stroke:#CA8A04,color:#1f2937
  classDef meta fill:#FFEDD5,stroke:#EA580C,color:#1f2937
  classDef warn fill:#FEE2E2,stroke:#B91C1C,color:#1f2937
  class N1,N2 duck
  class TCAT,CP meta
  class ACL warn
```

**可借鉴**
- **按 bound plan 而不是 SQL 文本做鉴权：** 判断的是 DuckDB 实际解析出的对象，绕不过去。
- **按工作负载分池（bi / etl）：** 交互查询和批量任务分开。
- **README 里的自我定位很明确：** 每条语句只路由到一个节点，不跨节点做 shuffle。需要分布式就去用 Trino 或 StarRocks。

来源：[GitHub README](https://github.com/starlake-ai/quack-on-demand)

---

## 2.7 PostHog Hoglake（DuckLake 的硬分叉）

> **成熟度：** 🟢 **v1.4.9**（2026-11-10），PostHog 自己在生产环境使用（dev、prod-us、prod-eu）。和 DuckLake 不兼容。

**定位：** 把 catalog 做成一个服务，只用 Postgres 做后端，**由服务端提交**。和 DuckLake 不兼容；已经以 "Gigahog" 的名字部署在 dev、prod-us、prod-eu。

```mermaid
flowchart LR
  subgraph WR["客户端"]
    PY["Python 客户端"]
    TR["Trino 连接器"]
    DX["DuckDB 扩展"]
  end
  subgraph SRV["Hoglake 服务（Kotlin / JDK 25）"]
    REST["REST 接口"]
    COMMIT["服务端提交<br/>只看本次写集<br/>准入控制"]
    REG["Footer 登记：<br/>客户端上传 Parquet 后只发 footer 统计<br/>服务端在提交路径上不打开数据文件"]
    BG["后台任务（advisory lock）：<br/>合并 / 过期快照 / 物理清理 / 不变量扫描"]
    CF["变更流 + 消费者 offset<br/>过期时尊重 offset"]
  end
  PGM[("Postgres 18<br/>外键 / CASCADE / 部分索引")]
  OBJ[("对象存储 Parquet<br/>每个文件一个删除向量")]
  PY -->|"① 上传 Parquet"| OBJ
  PY -->|"② 发 footer"| REST
  TR --> REST
  DX --> REST
  REST --> COMMIT --> PGM
  REST --> REG --> PGM
  BG --> PGM
  BG --> OBJ
  CF --> PGM
  classDef write fill:#DBEAFE,stroke:#2563EB,color:#1f2937
  classDef meta fill:#FFEDD5,stroke:#EA580C,color:#1f2937
  classDef maint fill:#F3E8FF,stroke:#7E22CE,color:#1f2937
  class COMMIT,REG write
  class PGM meta
  class BG maint
```

**可借鉴**
- **缺陷清单本身就是最好的借鉴材料。** `docs/ducklake-defect-ledger.md` 记了 6 个他们在 PG catalog 上踩到的 DuckLake 问题：
  - 内联表的回收永远触发不了（一个 catalog 积累了 112,947 张）；
  - 提交时加载全 catalog 统计；
  - schema 缓存不按列计内存，导致无限增长；
  - 等等。
- **维护任务由一个地方统一执行并加锁，而不是各个客户端抢着跑。**
- **提交开销只跟本次写集有关，不随 catalog 规模增长。** 这是 DuckLake 上游还没做到的地方。

来源：[PostHog/hoglake](https://github.com/PostHog/hoglake)

---

## 2.8 其他 DuckLake 社区项目

**boilstream**：Rust 写的多租户 DuckDB 服务，原生集成 DuckLake。 🟠 **0.x**：GitHub release 0.10.7（2026-04），tag 到 v0.10.29。

```mermaid
flowchart LR
  BI["BI 工具 / psql<br/>PG 协议 :5432"] --> BS["boilstream（Rust）<br/>多租户 DuckDB<br/>secret / 文件系统隔离"]
  ING["流式写入"] --> BS
  BS -->|"热层：约 1 秒一次提交"| DL["DuckLake<br/>内嵌 PG catalog"]
  DL --> S3[("S3 Parquet<br/>冷层回灌 >1GB/s")]
  BS --> FTS["Tantivy 全文索引"]
  BS --> SSE["SSE 推送 Arrow IPC"]
  BS --> VEND["凭证下发：<br/>DuckDB / WASM 客户端直接读湖"]
  classDef duck fill:#FEF9C3,stroke:#CA8A04,color:#1f2937
  class BS duck
```

- **可借鉴：** "凭证下发"。服务端只负责鉴权和发放临时凭证，客户端自己的 DuckDB（包括浏览器里的 WASM）直接读 Parquet，计算下放到客户端。

**SwanLake**：Arrow Flight SQL 服务端，后面是 DuckDB 和 DuckLake（PG catalog 加 S3）。 🟠 **0.x**：v0.1.0（2025-11），之后没有新版本。

```mermaid
flowchart LR
  C["Flight SQL 客户端（gRPC）"] --> S["SwanLake<br/>Flight SQL 服务"] --> D["DuckDB + ducklake"] --> P["PG catalog"]
  D --> O[("S3")]
```

**featherman**：DuckLake 的 Kubernetes Operator。 🟡 **Alpha**：v0.3.0 标为 prerelease，README 写"early development"，CRD 是 `v1alpha1`。

```mermaid
flowchart LR
  CRD["CRD：DuckLakeCatalog<br/>含备份策略"] --> OP["Operator 控制循环"] --> POOL["预热的 DuckDB Pod 池<br/>低延迟查询"]
  OP --> BK["备份"]
```

- **可借鉴：** 预热 Pod 池。冷启动开销（加载扩展、ATTACH、读元数据缓存）放在请求之前付掉。

**ducklake-guard**：给 DuckLake 加按表的访问控制（实验性）。 🟡 **Experimental**：v0.1.0，README 标注 Experimental。

```mermaid
flowchart LR
  CLI["ducklake-guard CLI"] --> G[("guard 库<br/>（权限的唯一事实来源）")]
  CLI -->|"推送 RLS 和角色"| PC["catalog PG<br/>行级安全策略"]
  CLI -->|"推送 bucket 策略"| S3[("S3 bucket policy")]
  CLI --> AUD["审计日志"]
```

- **可借鉴：** 权限同时落在两层，用 PG 行级安全控制 catalog 里能看到哪些行，用 bucket 策略控制能读哪些文件。一处漏了，另一处兜底。

**cloudflare-ducklake**：DuckDB 跑在 Cloudflare Containers 上，用 Hono.js 包成 HTTP API。 🟡 **演示项目**：没有 release，README 提示需要 Cloudflare Containers beta 权限。

```mermaid
flowchart LR
  U["HTTP 客户端<br/>API_TOKEN"] --> W["Cloudflare Worker"] --> CT["Container：Hono API<br/>@duckdb/node-api"] --> R2[("R2")]
```

- **可借鉴：** 把扩展预先打进镜像，容器启动时不用联网下载。
