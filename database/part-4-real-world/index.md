---
title: "Part 4: Real-World Design"
description: "Four case studies from Instagram, Discord, and Uber — plus a practical database selection framework — synthesizing every lesson from Parts 1–3 into production-grade architecture decisions."
---

# Part 4: Real-World Design

> "Theory tells you what is possible. Production tells you what is necessary."

## Overview

Four chapters that show how real companies applied (and sometimes ignored) the lessons from Parts 1–3. Each chapter opens with the constraints they faced, walks through the decisions made, and closes with what the engineering team wishes they had known earlier.

| # | Chapter | Company / Topic | Difficulty | Time |
|---|---------|----------------|-----------|------|
| 13 | [Instagram: PostgreSQL at Scale](/database/part-4-real-world/ch13-instagram-postgresql-at-scale) | User-ID sharding, ID generation, feed design | Advanced | 45 min |
| 14 | [Discord: Data Layer Evolution](/database/part-4-real-world/ch14-discord-data-layer-evolution) | MongoDB → Cassandra → ScyllaDB migration | Advanced | 40 min |
| 15 | [Uber: Geospatial Database Design](/database/part-4-real-world/ch15-uber-geospatial-database-design) | H3 hexagonal indexing, Schemaless, real-time location | Advanced | 45 min |
| 16 | [Database Selection Framework](/database/part-4-real-world/ch16-database-selection-framework) | Decision flowchart, cost model, migration strategy | Intermediate | 35 min |

## Key Themes

- **Scale breaks assumptions** — every system that works at 10K users has hidden assumptions that fail at 100M
- **Schema decisions are load-bearing** — the Instagram sharding key and Discord bucketing strategy were set early and cannot change cheaply
- **Migrations are the hardest part** — Discord's MongoDB→Cassandra migration and Uber's Schemaless→Docstore are more instructive than the destination systems themselves
- **PostgreSQL is more durable than expected** — Instagram ran PostgreSQL longer, at higher scale, than anyone predicted

## Prerequisites

These chapters assume you have completed:
- [Part 1 — Foundations](/database/part-1-foundations/): Storage engines, data modeling, indexing, transactions
- [Part 2 — Engine Deep Dives](/database/part-2-engines/): PostgreSQL, MySQL, Cassandra internals
- [Part 3 — Scaling & Operations](/database/part-3-operations/): Replication, sharding, consistency models

## What You'll Be Able to Do

After completing Part 4 you will be able to:

- Design a sharding strategy for a social application with user-ID based partitioning
- Evaluate a MongoDB→Cassandra migration plan including dual-write strategy and validation
- Implement an H3-based geospatial driver-location lookup system
- Build a database selection scorecard for a new product from MVP to 10M users
- Identify when polyglot persistence is necessary versus when it adds operational complexity

## Continue

After finishing Part 4, explore the [System Design section](/system-design/) for architecture patterns that build on these database foundations.
