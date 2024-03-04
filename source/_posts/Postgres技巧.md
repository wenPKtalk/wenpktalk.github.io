---
title: Postgres技巧
date: 2024-03-04 15:09:27
tags:
---

## Lock

### 查找空闲且可能被锁定的进程。
> 这个查询查看pg_stat_activity视图，查找那些活跃但是等待事件或等待事件类型不为空的进程。

```sql
SELECT
		pid,
		datname,
		usename,
		application_name,
		client_addr,
		client_port,
		to_char (now (), 'YYYY-MM-DD HH24:MI:SS') as now,
		to_char (now () - xact_start, 'DD HH24:MI:SS MS') as xact_time,
		to_char (now () - query_start, 'DD HH24:MI:SS MS') as query_time,
		state,
		to_char (now () - state_change, 'DD HH24:MI:SS MS') as state_time,
		wait_event,
		wait_event_type,
		left (query, 40)
	  FROM
		pg_stat_activity
	  WHERE
		state != 'idle'
		and pid != pg_backend_pid ()
	  ORDER BY
		query_time desc;

```

### 找到具有等待事件的进程，向持有初始锁的PID汇总
> This query looks at at the pg_stat_activity and pg_locks view showing the pid, state, wait_event, and lock mode, as well as blocking pids.
> 这个查询查看了 pg_stat_activity 和 pg_locks 视图，显示了 pid、state、wait_event 和 lock mode，以及阻塞的 pid。

```sql
WITH sos AS (
			SELECT array_cat(array_agg(pid),
				   array_agg((pg_blocking_pids(pid))[array_length(pg_blocking_pids(pid),1)])) pids
			FROM pg_locks
			WHERE NOT granted
		)
		SELECT a.pid, a.usename, a.datname, a.state,
			   a.wait_event_type || ': ' || a.wait_event AS wait_event,
			   current_timestamp-a.state_change time_in_state,
			   current_timestamp-a.xact_start time_in_xact,
			   l.relation::regclass relname,
			   l.locktype, l.mode, l.page, l.tuple,
			   pg_blocking_pids(l.pid) blocking_pids,
			   (pg_blocking_pids(l.pid))[array_length(pg_blocking_pids(l.pid),1)] last_session,
			   coalesce((pg_blocking_pids(l.pid))[1]||'.'||coalesce(case when locktype='transactionid' then 1 else array_length(pg_blocking_pids(l.pid),1)+1 end,0),a.pid||'.0') lock_depth,
			   a.query
		FROM pg_stat_activity a
			 JOIN sos s on (a.pid = any(s.pids))
			 LEFT OUTER JOIN pg_locks l on (a.pid = l.pid and not l.granted)
		ORDER BY lock_depth;
```

### Set a lock timeout

> It can be a good idea to set a lock_timeout within a session so that it will cancel the transaction and relinquish any locks it was holding after a certain period of time.
> 在会话中设置一个锁定超时可能是个好主意，这样在一段时间后它会取消事务并释放任何它持有的锁。

```sql
ALTER SYSTEM SET lock_timeout = '10s';
```

## Logging

### 设置log_min_duration_statement来记录慢查询。

```sql
ALTER database postgres SET log_min_duration_statement = '250ms';
```

### 控制记录哪些类型的语句

```sql
ALTER DATABASE postgres SET log_statement = 'all';
```

### 等待锁时记录

```sql
ALTER DATABASE postgres SET log_lock_waits = 'on';
```

## PERFORMANCE

### 使用语句超时来控制运行超时的查询。

> Setting a statement timeout prevents queries from running longer than the specified time. You can set a statement timeout on the database, user, or session level. We recommend you set a global timeout on Postgres and then override that one specific users or sessions that need a longer allowed time to run.
> 设置语句超时时间可以防止查询运行时间超过指定的时间。您可以在数据库、用户或会话级别上设置语句超时时间。我们建议您在Postgres上设置一个全局超时时间，然后针对需要更长运行时间的特定用户或会话进行覆盖设置。

```sql
ALTER DATABASE mydatabase SET statement_timeout = '60s';
```

### 使用pg_stat_statements来查找使用最多资源的查询和进程。

```sql
SELECT
	total_exec_time,
	mean_exec_time as avg_ms,
	calls,
	query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 监视Postgres中的连接
> This query will provide the number of connection based on type.
> 此查询将根据类型提供连接数量。

```sql
SELECT count(*),
	   state
FROM pg_stat_activity
GROUP BY state;
```

### 查询特定表的大小

```sql
SELECT pg_relation_size('table_name');

-- For prettier formatting you can wrap with:

SELECT pg_size_pretty(pg_relation_size('table_name'));
```

### 查询所有表的大小

```sql
SELECT relname AS relation,
       pg_size_pretty (
         pg_total_relation_size (C .oid)
       ) AS total_size
FROM pg_class C
LEFT JOIN pg_namespace N ON (N.oid = C .relnamespace)
WHERE nspname NOT IN (
        'pg_catalog',
        'information_schema'
      )
  AND C .relkind <> 'i'
  AND nspname !~ '^pg_toast'
  ORDER BY pg_total_relation_size (C .oid) DESC
```

### 检查未使用的索引。

> Will return the unused indexes in descending order of size. Keep in mind you want to also check replicas before dropping indexes.

```sql
SELECT schemaname || '.' || relname AS table,
       indexrelname AS index,
       pg_size_pretty(pg_relation_size(i.indexrelid)) AS "index size",
       idx_scan as "index scans"
FROM pg_stat_user_indexes ui
JOIN pg_index i ON ui.indexrelid = i.indexrelid
WHERE NOT indisunique
  AND idx_scan < 50
  AND pg_relation_size(relid) > 5 * 8192
ORDER BY 
  pg_relation_size(i.indexrelid) / nullif(idx_scan, 0) DESC NULLS FIRST,
  pg_relation_size(i.indexrelid) DESC;
```

### 获取表格的近似计数
> Will return the approximate count for a table based on PostgreSQL internal statistics. Useful for large tables where performing a `SELECT count(*)` is costly on performance.
>

```sql
SELECT reltuples::numeric as count
FROM pg_class
WHERE relname='table_name';
```

### Non-blocking 创建索引
> Adding `CONCURRENTLY` during index creation, while not permitted in a transaction, will not hold a lock on the table while creating your index.
>

```sql
CREATE INDEX CONCURRENTLY foobar ON foo (bar);
```

## PSQL

### 在PSQL中自动记录查询时间
> 将自动打印出在psql中运行查询所花费的时间。*需要注意的是这是往返时间，而不仅仅是查询执行时间。*

```shell
\timing
```

### 在 psql 中自动格式化查询结果
> 将根据您的终端窗口自动重新组织查询输出，以便更易读。

```sql
\x auto
```

### 编辑您选择的编辑器中的psql查询
> 将自动在您的默认 `$EDITOR` 中打开您上次运行的查询。当您保存并关闭时，将执行该查询。

```sql
\e
```

