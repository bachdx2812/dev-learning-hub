---
title: "Database Engineering"
description: "A 16-chapter deep dive into how large-scale systems design their data layer — PostgreSQL internals, indexing, transactions, sharding, replication, and real-world case studies from Instagram, Discord, and Uber."
---

# Database Engineering

> "The database is never just a detail. It is the center of gravity of every production system."

## What You'll Master

This guide covers the full spectrum of database engineering — from choosing the right data model to tuning queries under production load. You will understand *why* PostgreSQL uses MVCC, *how* sharding decisions break apart at the seams, and *what* Instagram actually changed to serve 1 billion photos a day.

Companion reading for [System Design Ch09 — Databases: SQL](/system-design/part-2-building-blocks/ch09-databases-sql) and [Ch10 — Databases: NoSQL](/system-design/part-2-building-blocks/ch10-databases-nosql), which cover the selection layer. This guide goes deeper: internals, operations, and architecture.

## The Learning Path

Work through the parts sequentially — each builds on concepts from the previous.

---

### [Part 1 — Foundations](/database/part-1-foundations/)

Storage engines, data models, indexes, and transactions. The non-negotiable bedrock every database engineer must own.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 01 | [The Database Landscape](/database/part-1-foundations/ch01-database-landscape) | Beginner | 30 min |
| 02 | [Data Modeling for Scale](/database/part-1-foundations/ch02-data-modeling-for-scale) | Intermediate | 40 min |
| 03 | [Indexing Strategies](/database/part-1-foundations/ch03-indexing-strategies) | Intermediate | 45 min |
| 04 | [Transactions & Concurrency Control](/database/part-1-foundations/ch04-transactions-concurrency-control) | Advanced | 50 min |

---

### [Part 2 — Engine Deep Dives](/database/part-2-engines/)

Under the hood of PostgreSQL, MySQL, the major NoSQL families, and specialized engines for time-series, search, and vectors.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 05 | [PostgreSQL in Production](/database/part-2-engines/ch05-postgresql-in-production) | Intermediate | 45 min |
| 06 | [MySQL & Distributed SQL](/database/part-2-engines/ch06-mysql-distributed-sql) | Intermediate | 40 min |
| 07 | [NoSQL at Scale](/database/part-2-engines/ch07-nosql-at-scale) | Intermediate | 40 min |
| 08 | [Specialized Databases](/database/part-2-engines/ch08-specialized-databases) | Intermediate | 35 min |

---

### [Part 3 — Scaling & Operations](/database/part-3-operations/)

How to keep databases alive, fast, and consistent when they grow beyond a single machine.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 09 | [Replication & High Availability](/database/part-3-operations/ch09-replication-high-availability) | Advanced | 45 min |
| 10 | [Sharding & Partitioning](/database/part-3-operations/ch10-sharding-partitioning) | Advanced | 50 min |
| 11 | [Query Optimization & Performance](/database/part-3-operations/ch11-query-optimization-performance) | Advanced | 45 min |
| 12 | [Backup, Migration & Disaster Recovery](/database/part-3-operations/ch12-backup-migration-disaster-recovery) | Intermediate | 35 min |

---

### [Part 4 — Real-World Design](/database/part-4-real-world/)

Full case studies from companies that solved hard database problems at scale. Specific numbers, specific decisions, specific regrets.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 13 | [Instagram: PostgreSQL at Scale](/database/part-4-real-world/ch13-instagram-postgresql-at-scale) | Advanced | 45 min |
| 14 | [Discord: Data Layer Evolution](/database/part-4-real-world/ch14-discord-data-layer-evolution) | Advanced | 40 min |
| 15 | [Uber: Geospatial Database Design](/database/part-4-real-world/ch15-uber-geospatial-database-design) | Advanced | 40 min |
| 16 | [Database Selection Framework](/database/part-4-real-world/ch16-database-selection-framework) | Intermediate | 30 min |

---

## Prerequisites

Before starting Part 1, you should be comfortable with:
- [ ] Basic SQL (SELECT, JOIN, GROUP BY)
- [ ] What a primary key and foreign key are
- [ ] General understanding of how a web application uses a database

You do **not** need to be a DBA. This guide teaches database internals from first principles.

If you want the big-picture view of database selection first, read [System Design Ch09](/system-design/part-2-building-blocks/ch09-databases-sql) and [Ch10](/system-design/part-2-building-blocks/ch10-databases-nosql) before starting here.

---

## How to Use This Guide

1. **Read Part 1 completely** — indexes and transactions are referenced in every subsequent chapter
2. **Run the SQL examples** — theory without execution is incomplete; use a local PostgreSQL instance
3. **Draw the diagrams** — B-tree traversal, MVCC tuple chains, and replication topologies are learned by sketching
4. **Attempt the practice questions** — each chapter has three difficulty tiers
5. **Return to case studies** — Part 4 is most valuable after completing Parts 1–3

**Total estimated time: ~10 hours across 16 chapters**

```
$ cat handbook --sections
  database/
    part-1-foundations/    4 chapters  (~2.8 hrs)
    part-2-engines/        4 chapters  (~2.7 hrs)
    part-3-operations/     4 chapters  (~2.9 hrs)
    part-4-real-world/     4 chapters  (~2.6 hrs)
```
