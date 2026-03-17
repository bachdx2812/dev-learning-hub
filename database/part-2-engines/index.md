---
title: "Part 2: Engine Deep Dives"
description: "Under the hood of PostgreSQL, MySQL, NoSQL families, and specialized databases — WAL internals, connection pooling, distributed SQL, single-table design, and workload-optimized engines."
---

# Part 2: Engine Deep Dives

> "Every database hides a machine underneath. The engineers who win are the ones who know the machine."

## Overview

Four chapters that go inside the most important engines in production today:

| # | Chapter | Core Concept | Difficulty | Read Time |
|---|---------|-------------|-----------|-----------|
| 05 | [PostgreSQL in Production](/database/part-2-engines/ch05-postgresql-in-production) | WAL, VACUUM, connection pooling, extensions | Intermediate | 45 min |
| 06 | [MySQL & Distributed SQL](/database/part-2-engines/ch06-mysql-distributed-sql) | InnoDB, Vitess, NewSQL trade-offs | Intermediate | 40 min |
| 07 | [NoSQL at Scale](/database/part-2-engines/ch07-nosql-at-scale) | DynamoDB, Cassandra, MongoDB, Redis patterns | Advanced | 50 min |
| 08 | [Specialized Databases](/database/part-2-engines/ch08-specialized-databases) | Time-series, search, graph, vector engines | Advanced | 45 min |

## Key Themes

- **Internals matter for tuning** — you cannot size `shared_buffers` correctly without knowing how PostgreSQL uses it
- **Schema design is engine-specific** — a DynamoDB single-table design would be catastrophic in PostgreSQL, and vice versa
- **NewSQL is not a free upgrade** — distributed SQL adds 10–100ms of consensus latency you cannot optimize away
- **Specialization wins at the extremes** — beyond a certain scale, a general-purpose database is the wrong tool

## What You'll Be Able to Do

After completing Part 2 you will be able to:

- Tune a PostgreSQL configuration for a 64GB production server with annotated reasoning
- Explain why PgBouncer transaction mode breaks `LISTEN/NOTIFY` and `prepared statements`
- Design a DynamoDB single-table schema for an e-commerce access pattern
- Choose between ClickHouse, TimescaleDB, and InfluxDB for a given ingestion rate
- Explain when Neo4j traverses relationships faster than a SQL self-join

## Prerequisites

Complete [Part 1 — Foundations](/database/part-1-foundations/) before starting here. The WAL mechanics from Ch01, the indexing concepts from Ch03, and the MVCC model from Ch04 are all assumed knowledge.

## Continue to Part 3

After finishing these four chapters, continue to [Part 3 — Operations](/database/part-3-operations/) for replication, sharding, and distributed transactions.
