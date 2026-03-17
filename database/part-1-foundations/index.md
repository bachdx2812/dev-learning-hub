---
title: "Part 1: Foundations"
description: "The non-negotiable bedrock of database engineering — storage engines, data modeling, indexing strategies, and transaction isolation from first principles."
---

# Part 1: Foundations

> "You cannot optimize what you do not understand. You cannot understand what you have not built."

## Overview

Four chapters that cover everything a database engineer needs before touching production:

| # | Chapter | Core Concept | Difficulty |
|---|---------|-------------|-----------|
| 01 | [The Database Landscape](/database/part-1-foundations/ch01-database-landscape) | Categories, storage engines, WAL | Beginner |
| 02 | [Data Modeling for Scale](/database/part-1-foundations/ch02-data-modeling-for-scale) | Access-pattern-driven schema design | Intermediate |
| 03 | [Indexing Strategies](/database/part-1-foundations/ch03-indexing-strategies) | B-tree, composite, GIN, partial indexes | Intermediate |
| 04 | [Transactions & Concurrency Control](/database/part-1-foundations/ch04-transactions-concurrency-control) | ACID, MVCC, isolation levels, locking | Advanced |

## Key Themes

- **Storage before queries** — how data lands on disk before you can query it
- **Access patterns first** — design your schema around how you read, not how you think
- **Indexes are not free** — every index costs write amplification and storage
- **Isolation is a spectrum** — READ COMMITTED, REPEATABLE READ, and SERIALIZABLE trade correctness for throughput

## What You'll Be Able to Do

After completing Part 1 you will be able to:

- Explain why PostgreSQL uses a WAL and what happens during a crash recovery
- Design a schema for a social media application that avoids the most common N+1 query traps
- Choose between a B-tree, GIN, partial, and expression index for a given query
- Explain the difference between lost updates, phantom reads, and write skew — and which isolation level prevents each
- Implement optimistic concurrency control with a version column

## Continue to Part 2

After finishing these four chapters, continue to [Part 2 — Engine Deep Dives](/database/part-2-engines/) to go inside PostgreSQL and MySQL.
