---
title: "Chapter 12: Backup, Migration & Disaster Recovery"
description: "pgBackRest, PITR, RPO/RTO tiers, zero-downtime migrations with expand-contract, CDC with Debezium, cross-database migrations, and the Discord Cassandra-to-ScyllaDB migration case study."
---

# Chapter 12: Backup, Migration & Disaster Recovery

> "An untested backup is not a backup. It is a false sense of security."

## Mind Map

```mermaid
mindmap
  root((Backup & DR))
    Backup Strategies
      pgBackRest
        Full + incremental
        WAL archiving
        Compression
      pg_basebackup
        Physical copy
        Streaming
      pg_dump
        Logical backup
        Schema + data
        Selective tables
    PITR
      Base backup
      WAL replay
      Recovery target
      Retention policy
    RPO/RTO Tiers
      Startup < 1hr RTO
      Growth < 30min
      Enterprise < 15min
    Zero-Downtime Migrations
      Expand-contract
      pg_repack
      gh-ost
    CDC
      Debezium
      Kafka pipeline
      Use cases
    Cross-DB Migrations
      PG to CockroachDB
      MySQL to PG
      MongoDB to PG
      Validation checklist
    Disaster Recovery
      DR drills
      Runbooks
      Chaos engineering
```

## Overview

Backup and disaster recovery are the unglamorous foundation of production database operations. Nobody talks about them until the moment they are needed, at which point the entire business is waiting. This chapter covers every layer of the DR stack: backup strategies with concrete RPO/RTO numbers, point-in-time recovery mechanics, zero-downtime migration patterns, and change data capture pipelines.

The most important principle: **recovery is a feature, not a process**. The backup exists to be restored. Until you have proven you can restore it in your target RTO, you do not have a backup.

---

## Backup Strategies

### Comparison: Tools and Trade-offs

| Tool | Type | RPO | RTO | Incremental | Use Case |
|------|------|-----|-----|-------------|---------|
| **pgBackRest** | Physical (file-level) | Near-zero (with WAL) | 15–60 min (depends on size) | Yes (block-level) | Production primary backup solution |
| **pg_basebackup** | Physical | Near-zero (with WAL) | 15–60 min | No | One-off base backups, initial standby setup |
| **pg_dump** | Logical | Point-in-time of dump | Minutes–hours (depends on size) | No (full each time) | Schema migrations, selective restores, cross-version |
| **pg_dumpall** | Logical (all databases) | Point-in-time of dump | Minutes–hours | No | Full cluster export including roles/tablespaces |
| **Continuous WAL archiving** | Physical (incremental) | RPO = WAL archive interval | PITR to any point | Yes | Component of pgBackRest/PITR strategy |

### pgBackRest: Production Backup Solution

pgBackRest is the recommended backup tool for PostgreSQL in production. It supports full, differential, and incremental backups, WAL archiving, encryption, parallel processing, and remote backup repositories (S3, GCS, Azure).

```ini
# /etc/pgbackrest/pgbackrest.conf

[global]
repo1-path=/var/lib/pgbackrest
repo1-retention-full=4          # keep 4 full backups
repo1-retention-archive=14      # keep 14 days of WAL archives
repo1-cipher-type=aes-256-cbc
repo1-cipher-pass=strongpassphrase

# For S3 backup storage
repo2-type=s3
repo2-path=/pg-backups
repo2-s3-bucket=my-company-pg-backups
repo2-s3-region=us-east-1
repo2-s3-key=AKIAXXXXXXXXXXXXXXXX
repo2-s3-key-secret=xxxxxxxxxxxxxxxxxxxx
repo2-retention-full=12         # keep 12 full backups in S3

[global:archive-push]
compress-level=3

[myapp]
pg1-path=/var/lib/postgresql/data
pg1-port=5432
```

```ini
# postgresql.conf — configure WAL archiving to pgBackRest
archive_mode = on
archive_command = 'pgbackrest --stanza=myapp archive-push %p'
archive_timeout = 60   # seconds — force WAL switch if no activity
```

```bash
# Initial stanza creation (one-time setup)
pgbackrest --stanza=myapp stanza-create

# Schedule in cron:
# Full backup: weekly on Sunday
# 0 2 * * 0  pgbackrest --stanza=myapp --type=full backup

# Incremental backup: daily
# 0 2 * * 1-6  pgbackrest --stanza=myapp --type=incr backup

# Check backup integrity
pgbackrest --stanza=myapp check

# List available backups
pgbackrest --stanza=myapp info
```

### pg_dump: Logical Backups

Logical backups capture a consistent snapshot of the data in SQL or binary format. They are essential for selective restores, cross-version migrations, and schema exports.

```bash
# Dump a single database in custom format (compressed, parallel-restorable)
pg_dump \
  --format=custom \
  --compress=9 \
  --jobs=4 \             # parallel dump using 4 workers
  --file=myapp_20240315.dump \
  myapp

# Dump only schema (no data) — for migration planning
pg_dump --schema-only --file=schema.sql myapp

# Dump specific tables
pg_dump --table=orders --table=order_items --file=orders_backup.dump myapp

# Restore from custom format
pg_restore \
  --dbname=myapp_restored \
  --jobs=8 \             # parallel restore
  --no-owner \
  myapp_20240315.dump
```

:::warning pg_dump Does Not Capture WAL
`pg_dump` creates a logical snapshot at the moment it runs. To restore to a different point in time, you need a physical backup with WAL archiving. Use pg_dump for selective table restores and cross-version migrations; use pgBackRest for disaster recovery.
:::

---

## Point-in-Time Recovery (PITR)

PITR allows you to restore a PostgreSQL database to any point in the past — not just to the most recent backup, but to a specific timestamp or transaction ID. This is essential for recovering from logical corruption (accidental `DELETE`, botched migration) where the data files are intact but the data is wrong.

### PITR Mechanics

```mermaid
flowchart LR
    subgraph Backup["Backup Repository"]
        Full["Full Backup\nSunday 02:00\n(base backup)"]
        WAL["WAL Archive\n(every 60 seconds)"]
    end

    subgraph Recovery["Recovery Process"]
        R1["1. Restore base backup\nto recovery server"]
        R2["2. PostgreSQL reads\nrecovery target from\npostgresql.conf"]
        R3["3. Replay WAL segments\nfrom archive until\ntarget reached"]
        R4["4. Database paused\nat target point"]
        R5["5. Verify data\nthen promote"]
    end

    Full --> R1
    WAL --> R3
    R1 --> R2 --> R3 --> R4 --> R5

    style Full fill:#6272a4,color:#f8f8f2
    style WAL fill:#bd93f9,color:#282a36
    style R4 fill:#ffb86c,color:#282a36
    style R5 fill:#50fa7b,color:#282a36
```

### PITR Configuration

```bash
# Step 1: Restore the base backup to recovery server
pgbackrest --stanza=myapp --delta restore

# Step 2: Configure recovery target in postgresql.conf
```

```ini
# postgresql.conf — recovery target configuration
restore_command = 'pgbackrest --stanza=myapp archive-get %f %p'

# Recover to specific timestamp (most common — "undo the 14:32 incident")
recovery_target_time = '2024-03-15 14:30:00'
recovery_target_action = 'promote'   # promote to primary after reaching target

# Or recover to specific transaction ID
# recovery_target_xid = '1234567'

# Or recover to named restore point (set with pg_create_restore_point)
# recovery_target_name = 'before_migration_20240315'
```

```bash
# Step 3: Create standby.signal to enter recovery mode
touch /var/lib/postgresql/data/standby.signal

# Step 4: Start PostgreSQL — it will replay WAL until recovery target
pg_ctl start -D /var/lib/postgresql/data
# Monitor logs: tail -f /var/log/postgresql/postgresql.log
# You will see: "recovery stopping before commit of transaction ..."
# Then: "database system is ready to accept read only connections"

# Step 5: Verify the data, then promote
pg_ctl promote -D /var/lib/postgresql/data
# Or: SELECT pg_promote();
```

### Setting Named Restore Points

```sql
-- Create a named restore point before a risky operation
SELECT pg_create_restore_point('before_migration_20240315_v2');
-- Returns the current WAL LSN as the restore point

-- The restore point can be used as recovery_target_name in PITR
```

### Recovery Drills

:::warning Never Skip Recovery Drills
A backup strategy is only as good as its tested recovery. Schedule quarterly recovery drills:
1. Spin up a fresh recovery server
2. Restore from backup
3. Verify data integrity (row counts, critical queries)
4. Measure actual RTO — compare against target
5. Document gaps and fix backup configuration

"We have backups" is not the same as "we can recover in 30 minutes." Only a drill proves the latter.
:::

### PITR Retention Planning

```ini
# pgbackrest.conf — retention configuration
repo1-retention-full = 4           # keep 4 full backups (4 weeks if weekly full)
repo1-retention-archive = 14       # keep 14 days of WAL archives
repo1-retention-archive-type = diff  # retain WAL to satisfy the last 14 days of diffs
```

For most applications, retaining 14 days of PITR capability is sufficient. Financial applications may require 30–90 days for regulatory compliance.

---

## RPO/RTO Tiers

Match your backup and HA architecture to your business's actual recovery requirements. The cost of achieving each tier is not linear — the last 5 minutes of RTO is exponentially more expensive than going from 4 hours to 1 hour.

| Tier | RPO | RTO | Architecture | Monthly Cost Multiplier |
|------|-----|-----|-------------|------------------------|
| **Startup** | < 1 hour | < 4 hours | Daily pg_dump to S3, manual restore | 1× |
| **Growth** | < 15 min | < 30 min | pgBackRest with hourly WAL archiving, warm standby, semi-automated failover | 2–3× |
| **Scale-up** | < 1 min | < 5 min | pgBackRest + streaming replication + Patroni automated failover | 4–6× |
| **Enterprise** | ~0 (synchronous) | < 1 min | Synchronous replication + Patroni + connection pooling + multi-AZ | 8–12× |

```mermaid
flowchart TD
    subgraph Tiers["Recovery Tier Architecture"]
        T1["Startup\npg_dump daily\nManual restore from S3\nRTO: hours"]

        T2["Growth\npgBackRest + WAL archiving\nWarm standby\nManual failover\nRTO: 30 min"]

        T3["Scale-up\nStreaming replication\nPatroni automated failover\nRTO: 5 min"]

        T4["Enterprise\nSync replication + Patroni\nMulti-AZ + PITR\nRTO: < 1 min"]
    end

    T1 -->|"add WAL archiving\n+ standby"| T2
    T2 -->|"add Patroni\n+ streaming replication"| T3
    T3 -->|"add sync replication\n+ multi-AZ"| T4

    style T1 fill:#6272a4,color:#f8f8f2
    style T2 fill:#ffb86c,color:#282a36
    style T3 fill:#bd93f9,color:#282a36
    style T4 fill:#50fa7b,color:#282a36
```

---

## Zero-Downtime Migrations

Schema changes on production databases are the leading cause of unplanned downtime. The expand-contract pattern eliminates downtime by decomposing a breaking change into backward-compatible phases.

### The Expand-Contract Pattern

```mermaid
flowchart LR
    subgraph Phase1["Phase 1: Expand\n(backward-compatible addition)"]
        E1["Add new column\nor table\n(nullable, no DEFAULT\nthat requires rewrite)"]
    end

    subgraph Phase2["Phase 2: Migrate\n(backfill data)"]
        E2["Background job\nbatch-backfills new column\nfor existing rows\n(no locking)"]
    end

    subgraph Phase3["Phase 3: Contract\n(cleanup)"]
        E3["Remove old column\nor add NOT NULL\nafter all rows migrated\nand old code retired"]
    end

    Phase1 --> Phase2 --> Phase3

    style Phase1 fill:#50fa7b,color:#282a36
    style Phase2 fill:#ffb86c,color:#282a36
    style Phase3 fill:#6272a4,color:#f8f8f2
```

### Rename a Column Without Downtime

```sql
-- WRONG: Direct rename requires table lock and breaks running queries
ALTER TABLE users RENAME COLUMN email TO email_address;

-- CORRECT: Expand-contract pattern

-- Phase 1: Add new column
ALTER TABLE users ADD COLUMN email_address TEXT;
-- Deploy code that reads both columns: COALESCE(email_address, email)
-- and writes to both columns

-- Phase 2: Backfill
UPDATE users
SET email_address = email
WHERE email_address IS NULL
  AND id BETWEEN $start AND $end;  -- batch by ID range to avoid long-running transaction

-- Phase 3: Contract (after old code is retired)
ALTER TABLE users ALTER COLUMN email_address SET NOT NULL;
ALTER TABLE users DROP COLUMN email;
```

### Add a NOT NULL Column

```sql
-- WRONG: Adds NOT NULL with DEFAULT rewrites the entire table (locks for minutes on large tables)
-- PostgreSQL < 11:
ALTER TABLE orders ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;

-- CORRECT for PostgreSQL 11+ (stored DEFAULT avoids rewrite):
-- PostgreSQL 11+ stores the DEFAULT in catalog and returns it for old rows without rewriting
ALTER TABLE orders ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;
-- In PG 11+, this is instant — the default is stored in pg_attrdef, not written to every row

-- For PostgreSQL < 11, use expand-contract:
ALTER TABLE orders ADD COLUMN is_archived BOOLEAN;
-- Backfill in batches:
UPDATE orders SET is_archived = FALSE WHERE is_archived IS NULL AND id BETWEEN $1 AND $2;
-- Then add NOT NULL constraint:
ALTER TABLE orders ALTER COLUMN is_archived SET NOT NULL;
ALTER TABLE orders ALTER COLUMN is_archived SET DEFAULT FALSE;
```

### pg_repack: Online Table Reorg

`pg_repack` reclaims table bloat and reorders data without taking an exclusive lock, unlike `VACUUM FULL` or `CLUSTER`.

```bash
# Install
apt-get install postgresql-14-repack

# Repack a bloated table (runs online, minimal locking)
pg_repack --table orders --dbname myapp

# Cluster a table by an index (physically reorder rows for index scan performance)
pg_repack --table orders --order-by created_at --dbname myapp

# Check table bloat before running
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
    n_dead_tup,
    n_live_tup,
    round(100 * n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 100000
ORDER BY n_dead_tup DESC;
```

---

## Change Data Capture (CDC) with Debezium

CDC captures every row-level change (INSERT, UPDATE, DELETE) from the database's transaction log and publishes them as events to a message bus. This enables:

- **Real-time data warehouse sync** — push changes to Snowflake/BigQuery as they happen
- **Event-driven microservices** — services subscribe to domain events without polling
- **Audit logging** — immutable history of all data changes
- **Cache invalidation** — invalidate Redis cache entries when source rows change
- **Cross-database replication** — sync PostgreSQL to Elasticsearch, MongoDB, etc.

### Debezium + Kafka Pipeline Architecture

```mermaid
flowchart LR
    subgraph Source["Source Database"]
        PG["PostgreSQL\n(wal_level=logical)"]
        WAL["WAL / Logical Decoding"]
    end

    subgraph CDC["CDC Layer"]
        Deb["Debezium\nPostgreSQL Connector\n(runs in Kafka Connect)"]
    end

    subgraph Streaming["Event Streaming"]
        Kafka["Apache Kafka\nTopics:\n- myapp.public.orders\n- myapp.public.users"]
    end

    subgraph Consumers["Downstream Consumers"]
        DW["Snowflake\n(data warehouse)"]
        ES["Elasticsearch\n(search index)"]
        Svc["Microservice\n(inventory update)"]
        Cache["Cache Invalidator\n(Redis)"]
    end

    PG --> WAL
    WAL -->|"logical replication slot"| Deb
    Deb --> Kafka
    Kafka --> DW
    Kafka --> ES
    Kafka --> Svc
    Kafka --> Cache

    style PG fill:#ff5555,color:#f8f8f2
    style Deb fill:#ffb86c,color:#282a36
    style Kafka fill:#bd93f9,color:#282a36
    style DW fill:#50fa7b,color:#282a36
    style ES fill:#6272a4,color:#f8f8f2
```

### Debezium PostgreSQL Connector Configuration

```json
{
  "name": "myapp-postgres-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",

    "database.hostname": "postgres-primary",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "debezium_password",
    "database.dbname": "myapp",
    "database.server.name": "myapp",

    "plugin.name": "pgoutput",
    "slot.name": "debezium_slot",
    "publication.name": "debezium_pub",

    "table.include.list": "public.orders,public.users,public.products",

    "transforms": "route",
    "transforms.route.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",

    "snapshot.mode": "initial",      // take initial snapshot of existing data
    "heartbeat.interval.ms": "10000", // prevent slot from growing on idle databases

    "decimal.handling.mode": "double",
    "time.precision.mode": "connect"
  }
}
```

```sql
-- PostgreSQL setup for Debezium
CREATE ROLE debezium WITH REPLICATION LOGIN PASSWORD 'debezium_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;
GRANT USAGE ON SCHEMA public TO debezium;

-- Create publication (Debezium can also create this automatically)
CREATE PUBLICATION debezium_pub FOR TABLE orders, users, products;
```

### Debezium Event Format

Each change event is a JSON message published to a Kafka topic:

```json
{
  "before": {
    "id": 1001,
    "status": "pending",
    "amount": 99.99
  },
  "after": {
    "id": 1001,
    "status": "shipped",
    "amount": 99.99
  },
  "op": "u",           // "c"=insert, "u"=update, "d"=delete, "r"=snapshot
  "ts_ms": 1710512400000,
  "source": {
    "table": "orders",
    "lsn": "0/5A2B100",
    "txId": 489201
  }
}
```

:::warning Monitor the Debezium Replication Slot
Debezium uses a PostgreSQL logical replication slot. If Debezium goes offline, the slot prevents WAL cleanup — identical to the risk described in Ch09. Monitor the slot lag and set `max_slot_wal_keep_size` to prevent disk exhaustion.
:::

---

## The Double-Write Migration Pattern

When migrating to a new schema or database, the double-write pattern allows you to run both systems in parallel and validate before cutting over:

```mermaid
flowchart TD
    App["Application\n(migration mode)"]

    App -->|"write"| OldDB["Old Database\n(PostgreSQL 14)"]
    App -->|"write"| NewDB["New Database\n(PostgreSQL 16 / CockroachDB)"]

    App -->|"read"| OldDB
    App -.->|"shadow read\n(validation only)"| NewDB

    Validator["Background Validator\nCompares read results:\nOld vs New"]
    OldDB --> Validator
    NewDB --> Validator

    Cutover{"Validation\npassed?"}
    Validator --> Cutover
    Cutover -->|"Yes"| Promote["Switch primary reads\nto New Database"]
    Cutover -->|"No"| Fix["Fix inconsistencies\nstay on Old DB"]

    style OldDB fill:#ff5555,color:#f8f8f2
    style NewDB fill:#50fa7b,color:#282a36
    style Validator fill:#ffb86c,color:#282a36
    style Promote fill:#bd93f9,color:#282a36
```

**When to use double-write vs CDC:**

| Scenario | Preferred Pattern |
|----------|-----------------|
| Migrating to same schema, different DB version | Logical replication (built-in, low overhead) |
| Migrating to different schema (data transformation needed) | CDC + transformation pipeline |
| Small database (< 100GB), controlled cutover window | pg_dump + restore + brief downtime |
| Zero-downtime with validation period | Double-write pattern |
| Complex transformations across many tables | CDC with stream processing (Flink, Spark) |

---

## Cross-Database Migration

### PostgreSQL → CockroachDB

CockroachDB is PostgreSQL-compatible but not identical. Common migration pitfalls:

```sql
-- CockroachDB does not support:
-- SERIAL primary keys (use UUID or sequences explicitly)
-- Certain PostgreSQL-specific types (MONEY, XML, some geometric types)
-- Some PostgreSQL functions and operators

-- Migration checklist:
-- 1. Export schema with pg_dump --schema-only
-- 2. Review unsupported features with CRDB's compatibility checker
-- 3. Import data via IMPORT INTO or COPY
-- 4. Validate row counts and key queries
-- 5. Run application in double-write mode pointing at both databases
-- 6. Cut over reads, then writes
```

### MySQL → PostgreSQL

```bash
# pgloader is the standard tool for MySQL → PostgreSQL migrations
pgloader mysql://user:pass@mysql-host/myapp \
         postgresql://user:pass@pg-host/myapp

# pgloader handles:
# - Schema conversion (AUTO_INCREMENT → SERIAL, TINYINT → SMALLINT, etc.)
# - Data type mapping
# - Index recreation
# - Constraint migration
```

```sql
-- Common MySQL → PostgreSQL schema differences to address:
-- MySQL: AUTO_INCREMENT           → PG: SERIAL or GENERATED ALWAYS AS IDENTITY
-- MySQL: TINYINT(1)               → PG: BOOLEAN
-- MySQL: DATETIME                 → PG: TIMESTAMPTZ (with timezone!)
-- MySQL: case-insensitive strings → PG: case-sensitive (use citext or lower() expressions)
-- MySQL: LIMIT x, y              → PG: LIMIT y OFFSET x
```

### MongoDB → PostgreSQL

```python
# mongoexport + psycopg2 for document-to-relational migration

import pymongo
import psycopg2
import json

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
pg_conn = psycopg2.connect("postgresql://user:pass@pg-host/myapp")

collection = mongo_client["myapp"]["orders"]
pg_cursor = pg_conn.cursor()

for doc in collection.find().batch_size(1000):
    pg_cursor.execute(
        """
        INSERT INTO orders (id, user_id, status, items, created_at)
        VALUES (%s, %s, %s, %s::jsonb, %s)
        ON CONFLICT (id) DO NOTHING
        """,
        (
            str(doc["_id"]),
            doc.get("userId"),
            doc.get("status"),
            json.dumps(doc.get("items", [])),
            doc.get("createdAt"),
        )
    )

pg_conn.commit()
```

### Migration Validation Checklist

Before cutting over from old database to new:

```sql
-- 1. Row count comparison (run on both old and new)
SELECT
    schemaname,
    tablename,
    n_live_tup AS estimated_rows
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- 2. Checksum comparison for critical tables
SELECT count(*), sum(hashtext(id::text || status || amount::text))
FROM orders;
-- Run the equivalent on both databases — hashes should match

-- 3. Critical query smoke test
-- Run your top-10 most important queries on the new database
-- Verify results match the old database
-- Measure latency and confirm it meets requirements

-- 4. Constraint validation
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'orders'::regclass;
-- Compare output between old and new databases
```

---

## Case Study: Discord's Cassandra to ScyllaDB Migration

Discord's message storage system is one of the largest in the world — handling over 4 billion messages per day across billions of conversation channels. In 2020, Discord migrated from Apache Cassandra to ScyllaDB, a C++ rewrite of Cassandra with better tail latency and throughput characteristics.

**The Problem:**
Discord stored messages in Cassandra with a data model where each channel is a partition key. Popular channels (Discord servers with millions of members) had partitions growing to hundreds of millions of rows. Cassandra's JVM-based garbage collector would pause for seconds during compaction on these large partitions, causing p99 latency spikes to 500ms+ during peak hours.

**Why ScyllaDB:**
- ScyllaDB is a drop-in Cassandra replacement (CQL-compatible) written in C++
- Shard-per-core architecture eliminates JVM GC pauses
- Better compaction scheduling reduces tail latency from 500ms to < 10ms p99
- 177 Cassandra nodes → 72 ScyllaDB nodes (60% infrastructure reduction)

**The Migration Strategy:**
Discord wrote a custom Rust-based dual-read/dual-write migration tool they called the "Cassandra-to-Scylla migrator":

```mermaid
flowchart TD
    subgraph Migration["Discord Migration Architecture"]
        Svc["Discord Message Service"]

        subgraph Write["Write Path (Phase 1-2)"]
            DW["Dual Write\nWrite to both Cassandra\nand ScyllaDB simultaneously"]
        end

        subgraph Read["Read Path (Phase 1-3)"]
            DR["Read from Cassandra\n(primary)\nBackground verify\nagainst ScyllaDB"]
        end

        Cass["Apache Cassandra\n(177 nodes)"]
        Scylla["ScyllaDB\n(72 nodes)"]

        Migrator["Rust Migrator\n3.2M msg/sec\nbackfill rate\nReads Cassandra\nWrites ScyllaDB"]
    end

    Svc --> DW
    Svc --> DR
    DW --> Cass
    DW --> Scylla
    DR --> Cass
    Migrator --> Cass
    Migrator --> Scylla

    style Cass fill:#ff5555,color:#f8f8f2
    style Scylla fill:#50fa7b,color:#282a36
    style Migrator fill:#ffb86c,color:#282a36
    style DW fill:#bd93f9,color:#282a36
```

**Migration phases:**
1. **Dual-write phase:** All new messages written to both Cassandra and ScyllaDB. No reads from ScyllaDB yet.
2. **Backfill phase:** Rust migrator reads historical messages from Cassandra at 3.2 million messages/second and writes to ScyllaDB. Total data: ~100TB, completed in ~72 hours.
3. **Validation phase:** Compare row counts and random sample queries between Cassandra and ScyllaDB. Fix discrepancies.
4. **Read migration:** Gradually shift read traffic to ScyllaDB, starting with low-traffic channels. Monitor p99 latency.
5. **Write cutover:** Once reads fully migrated, stop dual-write and retire Cassandra nodes.

**Results:**
- p99 latency: 500ms → < 10ms
- Infrastructure: 177 Cassandra nodes → 72 ScyllaDB nodes (saves ~$1M/year in cloud costs)
- CPU utilization: 40% lower due to C++ vs JVM efficiency
- GC pauses: eliminated entirely

**Key lessons:**
- The Rust migrator was custom-built because no off-the-shelf tool could sustain 3.2M writes/sec with the required validation logic
- Dual-write + gradual read migration is the safest pattern for storage layer migrations — it decouples "is the data there?" from "is the new system correct?"
- Validation must be quantitative: row counts alone are insufficient; sampling random records and comparing field values is required to catch subtle data transformation bugs

---

## Related Chapters

| Chapter | Relevance |
|---------|-----------|
| [Ch01 — Database Landscape](/database/part-1-foundations/ch01-database-landscape) | WAL mechanics that underpin PITR and streaming replication |
| [Ch09 — Replication & HA](/database/part-3-operations/ch09-replication-high-availability) | Replication slots shared by Debezium and streaming standbys |
| [Ch10 — Sharding & Partitioning](/database/part-3-operations/ch10-sharding-partitioning) | Sharding migrations require CDC or double-write patterns |
| [Ch11 — Query Optimization](/database/part-3-operations/ch11-query-optimization-performance) | pg_stat_statements to validate query performance post-migration |

---

## Practice Questions

### Beginner

1. **Backup Type Selection:** A startup has a 50GB PostgreSQL database and needs to meet these requirements: restore within 4 hours, recover data up to any point in the last 7 days, and keep operational cost low. Which backup strategy would you choose? Describe the specific tools and schedule.

   <details>
   <summary>Hint</summary>
   pgBackRest with WAL archiving to S3 is the right tool. Schedule: weekly full backup + daily incremental backups. Configure `repo1-retention-archive = 7` for 7 days of PITR capability. The full backup runs weekly (during lowest traffic, e.g., Sunday 2am). Incrementals run nightly. WAL archiving (`archive_command` pointing to pgBackRest) runs continuously, providing sub-minute RPO. RTO of 4 hours is achievable for a 50GB database — restoration takes 20-40 minutes plus WAL replay time.
   </details>

2. **PITR Scenario:** A developer accidentally runs `DELETE FROM orders WHERE status = 'pending'` without a WHERE clause at 14:32 on Tuesday, deleting 50,000 active orders. The database has daily pg_dump backups (last one at 02:00 Tuesday) and WAL archiving enabled. Describe the recovery steps and what data is recoverable.

   <details>
   <summary>Hint</summary>
   With WAL archiving: restore base backup from 02:00, configure `recovery_target_time = '2024-MM-DD 14:31:59'` (one minute before the deletion), replay WAL from archive until that timestamp, promote. The 50K orders are fully recovered — only the ~5 hours of new orders after 14:32 would be lost if you need to restore to a different server. If the original server is intact and you just need to recover the deleted rows, restore to a separate recovery server, extract the deleted rows, and reinsert them into the production server.
   </details>

### Intermediate

3. **Zero-Downtime Migration:** Your application has a `users` table with a `name TEXT` column. You need to split it into `first_name TEXT` and `last_name TEXT`. The table has 10 million rows and the application cannot have downtime. Describe each phase of the expand-contract migration, the SQL for each phase, and how the application code changes between phases.

   <details>
   <summary>Hint</summary>
   Phase 1 (Expand): `ALTER TABLE users ADD COLUMN first_name TEXT; ADD COLUMN last_name TEXT;` — deploy new code that writes to all three columns and reads COALESCE(first_name, split_part(name, ' ', 1)). Phase 2 (Backfill): batch UPDATE to parse name into first_name/last_name for all existing rows. Phase 3 (Contract): once all code reads first_name/last_name directly and backfill is complete, `ALTER TABLE users DROP COLUMN name;` — this is the final breaking change, requires all old code to be retired first. The total window where old code still works is the entire duration of phases 1 and 2.
   </details>

4. **CDC Pipeline Design:** An e-commerce company wants to sync their PostgreSQL orders table to both an Elasticsearch index (for customer order search) and a Snowflake data warehouse (for analytics). Both must stay within 5 seconds of the source. Design the full architecture using Debezium and Kafka. What PostgreSQL configuration is required?

   <details>
   <summary>Hint</summary>
   Architecture: PostgreSQL (wal_level=logical) → Debezium Kafka Connector → Kafka topic `ecommerce.public.orders` → (a) Kafka Connector for Elasticsearch using the Elasticsearch Sink Connector, (b) Kafka Connector for Snowflake using the Snowflake Kafka Connector. PostgreSQL config: wal_level=logical, create a replication role for Debezium, create a publication for the orders table. The 5-second latency requirement is achievable — Debezium's typical end-to-end latency from commit to Kafka is < 1 second. Monitor the Debezium replication slot lag to ensure it doesn't grow unbounded.
   </details>

### Advanced

5. **Large-Scale Database Migration:** You need to migrate a 10TB MySQL database to PostgreSQL with zero downtime. The migration must validate data integrity, and you can tolerate a maximum 30-second write pause during cutover. Design the migration architecture and timeline.

   <details>
   <summary>Hint</summary>
   Phase 1 (Setup, week 1): Set up empty PostgreSQL with migrated schema (using pgloader for schema conversion, manual fixes for unsupported features). Phase 2 (Initial load, week 2): Use pgloader to copy the 10TB — this takes ~48 hours for 10TB. During this time, MySQL continues serving all traffic. Phase 3 (CDC sync, week 3): Once initial load is complete, set up Debezium to capture all changes from MySQL's binlog since the pgloader snapshot LSN and apply them to PostgreSQL. Monitor lag daily. Phase 4 (Validation, week 4): Run validation queries comparing row counts and checksums. Fix discrepancies. Phase 5 (Double-write, week 5): Switch application to write to both MySQL and PostgreSQL. Verify PostgreSQL receives all writes. Phase 6 (Cutover, day 1 of week 6): Set maintenance mode (blocks writes), verify PostgreSQL is fully caught up (zero lag), update application config to read+write only PostgreSQL, disable maintenance mode. Total write pause: < 30 seconds. Stop MySQL after 48-hour validation period.
   </details>

---

## References & Further Reading

- [pgBackRest Documentation](https://pgbackrest.org/user-guide.html)
- [PostgreSQL Documentation — Backup and Restore](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL Documentation — Point-in-Time Recovery](https://www.postgresql.org/docs/current/continuous-archiving.html)
- [Debezium Documentation — PostgreSQL Connector](https://debezium.io/documentation/reference/stable/connectors/postgresql.html)
- [Discord Engineering Blog — How Discord Stores Billions of Messages](https://discord.com/blog/how-discord-stores-billions-of-messages)
- [Discord Engineering Blog — Migrating Cassandra to ScyllaDB](https://discord.com/blog/how-discord-migrated-trillions-of-messages-from-cassandra-to-scylladb)
- [pg_repack — Reorganize PostgreSQL Tables Online](https://github.com/reorg/pg_repack)
- [pgloader — Database Migration Tool](https://pgloader.io/)
- [gh-ost — GitHub's Online Schema Migrations for MySQL](https://github.com/github/gh-ost)
- ["Designing Data-Intensive Applications"](https://dataintensive.net/) — Kleppmann, Chapter 11 (Stream Processing / CDC)
