---
title: "DuckLake 专栏（一）：2026 年的 DuckDB 与 DuckLake——版本与成熟度"
date: 2026-11-16 15:01:00
tags: [DuckDB, DuckLake]
categories: DuckLake
book: ducklake
chapter: overview
order: 1
---
这个专栏整理我研究 DuckDB 和 DuckLake 的笔记，由浅入深分四章：

1. **入门与全景**：版本和成熟度；DuckLake 怎么存数据。
2. **引擎原理**：多连接与线程分工、调度器、内存与并发准入、DuckLake 在线程上怎么跑。
3. **源码**：一条 SQL 在 DuckDB 和 DuckLake 源码里怎么走。
4. **生态**：DuckLake 周边项目；DuckDB 被嵌入别的系统的五种形态。

原理和源码两章按 DuckDB v2.0.0、DuckLake `v2.0-cyanoptera`（`c506b268`）的源码核对过。

这一篇是全景，信息截至 2026-11-11。

**调研方法**
- 约 35 次检索和抓取，用 `gh api` 读各仓库的 README 和活跃度，再对照本地 DuckLake 源码。
- 核实深度分两档：
  - **直接读过：** DuckLake 1.0 和 1.1 文章、ducklake.select 首页、DuckDB 2.0 公告、Quack 公告和 FAQ、MotherDuck release notes 和扩展博客、MotherDuck "15+ companies"、阿里云 RDS DuckDB 文档、PolarDB DuckDB 列存表文档、Omni 博客、Definite 博客、各 GitHub README、本地 ducklake 源码（`c506b268`）。
  - **据检索摘要：** Cube、dlt、Snowflake 和 Databricks 博客、Okta 演讲细节、Hugging Face。

## 0. 结论速览

1. **版本基线**
   - DuckDB 2.0.0 LTS 于 2026-10-21 发布。
   - DuckLake 规范 1.1 同日发布；1.0 于 2026-04-13 发布。
   - Quack 仍是 **beta**。
2. **DuckLake 生态仍以 DuckDB 为中心。**
   - Spark 连接器**只能写**。
   - DataFusion 客户端读写都支持，写入要用 feature flag 开启。
   - 官方首页列出 12 家生产用户，都是中小公司。PostHog 已经硬分叉出 Hoglake。
3. **DuckDB 被引入的形态有五种：**
   - **A** 嵌进别的数据库内核；
   - **B** 旁路进程；
   - **C** 独立服务；
   - **D** 嵌在应用里；
   - **E** 大量短命实例。
4. **共性难题是并发写、多用户服务化和小文件。** 各家解法可以归成四类：
   - 写入集中（server 持有实例，或由服务端提交）；
   - 读写分离；
   - 缓冲后批量提交（inlining、batching、buffer）；
   - 预聚合 / 缓存。
5. **成熟度**（见 1.5 节总表）：
   - 🟢 正式发布：DuckDB 2.0 LTS、DuckLake 1.0/1.1、pg_duckdb 1.1.x（**最新的 1.2.0 是 🟡 Experimental**）、pg_lake、pg_ducklake、GizmoSQL、阿里云 RDS DuckDB 分析只读实例、dlt、Cube。
   - 🟡 Beta 或 Preview：Quack、MotherDuck 托管 DuckLake、moonlink、DuckLake 删除向量、S3 Tables 支持。
   - 🟠 其余 DuckLake 生态项目基本都是 0.x：DataFusion、Spark、Trino 客户端、Quack on Demand、boilstream 等。

各项目的架构图和细节在{% post_link ducklake-08-ducklake-ecosystem '第 8 篇' %}和{% post_link ducklake-09-duckdb-embedding '第 9 篇' %}。

## 1. 版本基线（2026-11）

| 项 | 事实 | 来源 |
|---|---|---|
| DuckDB 2.0.0 LTS | 2026-10-21 发布，支持到至少 2027-10。**2.0 之前的版本读不了 2.0 写出的数据库文件**。关键业务建议等 11 月的补丁版。 | [DuckDB 2.0 公告](https://duckdb.org/2026/10/21/announcing-duckdb-200) |
| DuckDB 2.0.1 补丁版 | 发布日历上排在 2026-11-18，标注为暂定 | 据检索摘要 |
| DuckLake 1.0 | 2026-04-13 发布，MIT 许可 | [DuckLake 1.0](https://ducklake.select/2026/04/13/ducklake-10/) |
| DuckLake 1.1 | 2026-10-21 发布，迁移是可选的（`AUTOMATIC_MIGRATION true`）。PG catalog 上 attach 加列表（1 万张表）中位数约快 27 倍。 | [DuckLake 1.1](https://ducklake.select/2026/10/21/ducklake-11/) |
| DuckLake catalog 后端 | 本地源码里有四种：<br>① 普通 DuckDB 文件，走默认的 `DuckLakeMetadataManager`；<br>② `postgres`；<br>③ `sqlite`；<br>④ `quack`，即通过 Quack 访问的远程 DuckDB，用 `quack_query_by_name` 包装执行。 | 本地 `ducklake_metadata_manager.cpp:52-55`、`quack_metadata_manager.cpp` |
| Quack | 1.5.3 引入，2.0 带的是打磨过的版本。FAQ 原话："currently in a beta state"，"protocol is not yet stable"。 | [Quack FAQ](https://duckdb.org/quack/faq.html) |
| DuckDB 扩展支持级别 | `ducklake`、`iceberg`、`delta`、`postgres`、`mysql`、`quack` 在官方扩展列表里都是 **Secondary**（"supported on a best-effort basis"），没有一个是 Primary。 | [DuckDB 2.0 扩展列表](https://duckdb.org/docs/2.0/core_extensions/overview.html) |

## 1.5 成熟度总表：哪些正式发布，哪些还在 Beta

截至 2026-11-11。判定依据按优先级是：
1. 官方明确的标注，包括 README、文档、公告，以及**最新 release notes 正文**；
2. GitHub release 的 prerelease 标记；
3. 版本号。

所有 🟢 项目的最新 release notes 都检查过有没有 experimental、beta 这类字样。pg_duckdb v1.2.0 就是这样查出来的：它的 prerelease 没勾，但 release notes 正文里自己标了 "Experimental"。dlt 1.32.0 正文里有一处 preview，指的是和 DuckLake 无关的 "Background agents" 功能。

第 8、9 篇的每个项目卡片标题下也有同样的"成熟度"一行。

**图例**
- 🟢 **正式发布**：官方宣布 GA 或 production-ready，或者有 ≥1.0 的正式 release 且没有标 beta。
- 🟡 **Beta / Preview / 实验**：官方**明确标注**了 beta、preview、alpha、experimental 或概念验证。
- 🟠 **0.x / 未声明**：版本号低于 1.0，或者没有 release，官方也没写成熟度。按惯例视为 API 还不稳定。
- ⚫ **已停止**：已归档或长期没有更新。
- ⚪ **不适用 / 没写**：商用产品或公司内部方案（DuckDB 只是其中的组件），或者文档没有写阶段。

### 平台和规范

| 项目 | 状态 | 版本 / 依据 |
|---|---|---|
| DuckDB 2.0.0 | 🟢 | LTS，2026-10-21。2.0.1 补丁版暂定 11-18 |
| DuckLake 规范和 `ducklake` 扩展 | 🟢 | 1.0 "production-ready"，1.1 于 10-21 发布；扩展是 Secondary 级 |
| └ DuckLake 删除向量 | 🟡 | 1.0 文章和 MotherDuck 文档都标为 experimental |
| Quack 协议和扩展 | 🟡 | FAQ 写明 beta，协议还不稳定 |
| └ Quack ADBC 驱动（Columnar） | 🟡 | public preview（2026-05-21） |
| DuckDB `iceberg` 扩展 | 🟢 | 随 2.0 LTS 发布（Secondary） |
| └ S3 Tables 支持 | 🟡 | 文档写"currently experimental" |
| MotherDuck 平台 | 🟢 | GA（2024-06） |
| └ MotherDuck 托管 DuckLake | 🟡 | 发布时是 public preview，之后没有 GA 公告 |

### DuckLake 生态

| 项目 | 状态 | 版本 / 依据 |
|---|---|---|
| pg_ducklake | 🟢 | v1.0.3（2026-10-19） |
| PostHog Hoglake | 🟢 | v1.4.9，PostHog 自己在生产使用；和 DuckLake 不兼容 |
| dlt（DuckLake 目的端） | 🟢 | dlt 1.32.0 Production/Stable；PG catalog 是生产级，MotherDuck catalog 是 🟡 experimental |
| dbt-duckdb | 🟢 | 1.11.1 |
| datafusion-ducklake | 🟠 | 0.9.0（crates.io）；多 catalog 布局 🟡 |
| ducklake-spark | 🟠 | v0.4.0，只能写 |
| Trino：brikk/trino-ducklake | 🟠 | v0.5.4（2026-11-06）；能读写 1.0 格式，**不能写 1.1**，读 1.1 是实验功能 |
| Trino：awitten1/trino-ducklake | 🟠 | 没有 release |
| pg_duckpipe | 🟠 | 没有 release，组件版本 0.1.0 / 1.0.0 |
| Quack on Demand | 🟠 | v0.12.2 |
| boilstream | 🟠 | 0.10.x |
| SwanLake | 🟠 | v0.1.0（2025-11） |
| pandas ducklake-dataframe | 🟡 | 虽然打了 v1.0 标签，README 写明是"proof of concept"，100% 由 Claude Code 生成 |
| ducklake-sdk | 🟡 | README 标为 alpha（v0.0.22） |
| featherman | 🟡 | v0.3.0 prerelease，"early development"，CRD v1alpha1 |
| ducklake-guard | 🟡 | v0.1.0，README 标 Experimental |
| cloudflare-ducklake | 🟡 | 演示项目，没有 release |

### DuckDB 引擎嵌入

| 项目 | 状态 | 版本 / 依据 |
|---|---|---|
| pg_duckdb 1.1.x | 🟢 | v1.1.1（2025-12-18，DuckDB 1.4.3）；1.0 起官方称 production-ready |
| └ pg_duckdb v1.2.0 | 🟡 | 2026-11-03，DuckDB 2.0.0；release notes 自己标了 "Experimental, not ready for production" |
| pg_lake | 🟢 | v3.6.0（2026-11-04） |
| GizmoSQL | 🟢 | v1.42.3（基于 DuckDB 1.5.6）；DuckDB 2.0 的 edge 渠道是 🟡 |
| 阿里云 RDS MySQL DuckDB 分析只读实例 | 🟢 | 2025-08-06 "正式上线"，收费 |
| 阿里云 RDS DuckDB 分析主实例 | ⚪ | 公告没写阶段，可以试用 |
| 阿里云 PolarDB DuckDB 列存表 | ⚪ | 文档没写阶段 |
| Cube | 🟢 | v1.8.21；DuckDB 数据源没标阶段 |
| Metabase DuckDB 驱动 | 🟢 | 1.5.6.0；第三方插件，由 MotherDuck 维护 |
| Cloudflare R2 Data Catalog | 🟢 | GA（已改名 Basin Catalog） |
| Rill | 🟠 | v0.91.1（0.x 版本号，Rill Cloud 是商用服务） |
| Mosaic | 🟠 | v0.35.0（研究项目） |
| duckdb_engine（Superset） | 🟠 | v0.17.0（2025-03） |
| MyDuck Server | 🟠 | 没有 release，Docker 标签是 `v0.3.1-dev` |
| DuckDB-paimon（PolarDB 开源） | 🟠 | v0.1.3 |
| Evidence | 🟠 | 旧版（基于 DuckDB）最后发布在 2026-02；重写版 0.0.1 还没发布 |
| airport 扩展 | 🟠 | 社区扩展，仓库里没有 tag 或 release |
| smallpond | 🟠 → ⚫ | 0.15.0，2025-03 之后没有更新 |
| moonlink | 🟡 | README："in preview. Expect changes." |
| pg_mooncake | ⚫ | v0.1.2，默认分支 2025-10 后没有提交 |
| ParadeDB pg_analytics / BemiDB / Hydra columnar | ⚫ | 已归档 / 已转型 / 低活跃 |
| Omni、Hex、Mode、Count、Observable、Watershed、Definite、Okta | ⚪ | 商用产品或内部方案 |
