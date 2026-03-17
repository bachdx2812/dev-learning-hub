---
title: "Part 3: Scaling & Operations"
description: "Replication topologies, sharding strategies, query optimization, backup/recovery, and disaster preparedness — the operational layer that keeps databases alive at scale."
---

# Part 3: Scaling & Operations

> "A database that performs well at 1,000 users is not the same database at 1,000,000 users. The code is the same. The operations are entirely different."

## Overview

Four chapters that cover the full operational lifecycle of a production database — from ensuring high availability through replication, to scaling writes with sharding, to squeezing every millisecond out of your query plans, to recovering from the worst-case scenario:

| # | Chapter | Core Concept | Difficulty | Time |
|---|---------|-------------|-----------|------|
| 09 | [Replication & High Availability](/database/part-3-operations/ch09-replication-high-availability) | Streaming replication, failover automation, multi-region | Intermediate | 45 min |
| 10 | [Sharding & Partitioning](/database/part-3-operations/ch10-sharding-partitioning) | Consistent hashing, shard keys, Vitess/Citus | Advanced | 50 min |
| 11 | [Query Optimization & Performance](/database/part-3-operations/ch11-query-optimization-performance) | EXPLAIN ANALYZE, join strategies, connection pooling | Intermediate | 55 min |
| 12 | [Backup, Migration & Disaster Recovery](/database/part-3-operations/ch12-backup-migration-disaster-recovery) | PITR, CDC, zero-downtime migrations, RPO/RTO | Advanced | 50 min |

## Key Themes

- **Availability is engineered, not assumed** — replication and failover must be tested before the outage, not during it
- **Sharding is a last resort** — partition tables first, shard only when vertical scaling and partitioning are exhausted
- **The query plan is the source of truth** — EXPLAIN ANALYZE tells you what the database actually does, not what you think it does
- **Recovery is a feature** — an untested backup is not a backup; disaster recovery drills are mandatory

## What You'll Be Able to Do

After completing Part 3 you will be able to:

- Set up PostgreSQL streaming replication with Patroni for automatic failover under 30 seconds
- Choose a shard key that avoids hotspots and enables efficient scatter-gather queries
- Read and interpret a full EXPLAIN ANALYZE output for a multi-table JOIN query
- Implement a zero-downtime schema migration using the expand-contract pattern
- Design a backup strategy that meets specific RPO/RTO SLAs
- Set up a Debezium CDC pipeline from PostgreSQL to Kafka

## Prerequisites

This part assumes you have completed:

- [Part 1 — Foundations](/database/part-1-foundations/): storage engines, WAL mechanics, transaction isolation
- [Part 2 — Engine Deep Dives](/database/part-2-engines/): PostgreSQL and MySQL internals

## Continue to Part 4

After finishing these four chapters, continue to [Part 4 — Real-World Design](/database/part-4-real-world/) to see how Instagram, Discord, and Uber applied these patterns at scale.
