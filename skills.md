---
layout: doc
title: AI Skills
description: "6 AI-powered skills for Claude Code and Cursor — get real-time system design guidance, architecture reviews, and design pattern recommendations from 31 chapters."
---

# AI Skills

<div style="font-family: 'JetBrains Mono', monospace; font-size: 0.85em; color: #6272a4; margin-bottom: 2em;">

```
┌─────────────────────────────────────────────────────────┐
│  SYSTEM DESIGN ADVISOR v1.0.0                           │
│                                                         │
│  > 6 skills    > 24 reference files   > 31 chapters     │
│  > Claude Code + Cursor support                         │
│                                                         │
│  $ claude /system-design-advisor                        │
└─────────────────────────────────────────────────────────┘
```

</div>

31 chapters of system design and design patterns knowledge — distilled into AI coding assistant skills. Get real-time architectural guidance, generate design plans, review your codebase, and visualize architectures with **Mermaid diagrams**.

All skills **ask clarifying questions** before responding — ensuring answers are tailored to your specific scale, constraints, and context.

## Which Skill When?

<div style="font-family: 'JetBrains Mono', monospace; font-size: 0.85em; background: #282a36; color: #f8f8f2; padding: 1.5em; border-radius: 8px; margin-bottom: 2em;">

**📚 Learning / Studying**
<br>&nbsp;&nbsp;→ `/system-design-advisor` — *"Explain CAP theorem"*
<br>&nbsp;&nbsp;→ `/design-patterns-advisor` — *"When to use Factory vs Builder?"*

**🏗️ Building a New System**
<br>&nbsp;&nbsp;→ `/design-plan-generator` — *"Design a chat system for 10M DAU"*
<br>&nbsp;&nbsp;→ `/pattern-implementation-guide` — *"Implement CQRS for my order service"*

**🔍 Reviewing Existing Code**
<br>&nbsp;&nbsp;→ `/architecture-reviewer` — *"Is my system scalable?"*
<br>&nbsp;&nbsp;→ `/code-pattern-reviewer` — *"Review my code for anti-patterns"*

**❓ Making a Decision**
<br>&nbsp;&nbsp;→ `/system-design-advisor` — *"SQL or NoSQL for my use case?"*
<br>&nbsp;&nbsp;→ `/design-patterns-advisor` — *"Strategy vs State pattern?"*

</div>

## Available Skills

### `/system-design-advisor`

**Answer system design questions.** Ask about scalability, databases, caching, CAP theorem, load balancing, microservices, or any distributed systems concept. Get structured answers with trade-off tables, recommendations, key numbers, and **Mermaid architecture diagrams**.

Asks about your scale, access pattern, and constraints when context is missing. Skips for conceptual questions.

**Example prompts:**
- *"Should I use SQL or NoSQL for my use case?"*
- *"Explain the trade-offs between push and pull fan-out"*
- *"When should I add a message queue?"*

---

### `/design-plan-generator`

**Generate complete system design plans.** Uses the 4-step framework (Requirements → Estimation → High-Level Design → Deep Dive) to produce structured plans with **Mermaid architecture diagrams**, data models, and scaling strategies.

Always asks 2-5 scoping questions first — target DAU, read/write ratio, consistency model, tech constraints — then generates a tailored plan.

**Example prompts:**
- *"Design a URL shortener"*
- *"Architect a real-time chat messaging system"*
- *"Plan a video streaming platform"*

---

### `/architecture-reviewer`

**Auto-scan and review your project architecture.** Reads your project configuration, identifies components, and evaluates against scalability, reliability, security, and observability checklists. Outputs a findings table with severity and recommendations.

Gathers context about your scale targets, top concerns, and SLA before scanning. Say "just scan it" to skip.

**Example prompts:**
- *"Review my architecture"*
- *"Is my system scalable?"*
- *"What are the bottlenecks in this project?"*

---

### `/design-patterns-advisor`

**Answer design pattern questions.** Covers GoF (creational, structural, behavioral), modern application patterns, distributed system patterns, and anti-patterns. Includes **Mermaid class diagrams** showing pattern structure and relationships.

**Example prompts:**
- *"When should I use Factory vs Builder?"*
- *"Explain the Observer pattern with a diagram"*
- *"What pattern fixes my giant switch statement?"*

---

### `/pattern-implementation-guide`

**Generate pattern implementation plans.** Analyzes your problem, selects the right pattern(s), and produces step-by-step implementation with code examples and **Mermaid class/component diagrams**.

**Example prompts:**
- *"Implement Strategy pattern for payment processing"*
- *"Add CQRS to my order service"*
- *"Refactor this God Object using patterns"*

---

### `/code-pattern-reviewer`

**Auto-scan code for pattern opportunities.** Identifies anti-patterns (God Object, Spaghetti Code), suggests pattern improvements, and checks for design principle violations.

**Example prompts:**
- *"Review my code for design patterns"*
- *"Is this a good use of Singleton?"*
- *"What patterns could improve this codebase?"*

## Installation

### Claude Code Plugin (recommended)

```bash
# Add marketplace & install
claude plugin marketplace add bachdx2812/system-design-advisor
claude plugin install system-design-advisor
```

After installing, invoke with `/system-design-advisor:system-design-advisor`, `/system-design-advisor:design-plan-generator`, etc.

### Claude Code (global skills)

```bash
# One-line install (or update)
bash <(curl -s https://raw.githubusercontent.com/bachdx2812/system-design-advisor/main/install.sh)
```

Or manually:

```bash
git clone https://github.com/bachdx2812/system-design-advisor.git
cd system-design-advisor && bash install.sh
```

After installing, invoke with `/system-design-advisor`, `/design-plan-generator`, `/architecture-reviewer`, `/design-patterns-advisor`, `/pattern-implementation-guide`, or `/code-pattern-reviewer`.

### Quick Install (Cursor)

```bash
git clone https://github.com/bachdx2812/system-design-advisor.git
cd system-design-advisor && bash install-cursor.sh
```

### Update Existing Installation

```bash
cd system-design-advisor && git pull && bash install.sh
```

Rules auto-activate based on your prompts — no manual invocation needed.

## Knowledge Base

The skills are powered by distilled knowledge from all 31 chapters of this handbook:

### System Design (25 chapters)

| Reference File | Chapters | Topics |
|---------------|----------|--------|
| [fundamentals-and-estimation](/system-design/part-1-fundamentals/) | Ch 01–04 | Scalability, CAP, estimation formulas, latency numbers |
| [dns-and-load-balancing](/system-design/part-2-building-blocks/ch05-dns) | Ch 05–06 | DNS routing, L4 vs L7, LB algorithms |
| [caching-and-cdn](/system-design/part-2-building-blocks/ch07-caching) | Ch 07–08 | Cache strategies, invalidation, CDN push/pull |
| [databases](/system-design/part-2-building-blocks/ch09-databases-sql) | Ch 09–10 | SQL vs NoSQL, indexing, sharding, replication |
| [queues-and-protocols](/system-design/part-2-building-blocks/ch11-message-queues) | Ch 11–12 | Kafka/RabbitMQ/SQS, REST/GraphQL/gRPC |
| [architecture-patterns](/system-design/part-3-architecture-patterns/) | Ch 13–17 | Microservices, event-driven, security, monitoring |
| [case-studies](/system-design/part-4-case-studies/) | Ch 18–22 | URL shortener, social feed, chat, video, ride-sharing, crawler, file sync |
| [modern-and-interview](/system-design/part-5-modern-mastery/) | Ch 23–25 | Cloud-native, ML systems, interview framework |
| [search-and-indexing](https://github.com/bachdx2812/system-design-advisor/blob/main/references/search-and-indexing.md) | Extended | Inverted index, trie, BM25, Elasticsearch, autocomplete, web crawler |
| [real-time-and-streaming](https://github.com/bachdx2812/system-design-advisor/blob/main/references/real-time-and-streaming.md) | Extended | WebRTC, SFU/MCU, Flink, time-series DBs, stream processing |
| [storage-and-infrastructure](https://github.com/bachdx2812/system-design-advisor/blob/main/references/storage-and-infrastructure.md) | Extended | Object storage, HDFS, file sync, config mgmt, LSM-tree, OLAP, ELK |
| [specialized-systems](https://github.com/bachdx2812/system-design-advisor/blob/main/references/specialized-systems.md) | Extended | Unique IDs, distributed locks, payments, stock exchange, game networking |
| [recommendation-and-ml-systems](https://github.com/bachdx2812/system-design-advisor/blob/main/references/recommendation-and-ml-systems.md) | Extended | Collaborative/content-based filtering, two-tower model, feature store, fraud, ads |
| [data-processing-and-analytics](https://github.com/bachdx2812/system-design-advisor/blob/main/references/data-processing-and-analytics.md) | Extended | MapReduce, Spark, Flink, windowing, ETL, data warehouse, lambda/kappa |
| [authentication-and-security-deep-dive](https://github.com/bachdx2812/system-design-advisor/blob/main/references/authentication-and-security-deep-dive.md) | Extended | JWT, OAuth 2.0, SSO, SAML/OIDC, mTLS, RBAC/ABAC, rate limiting |
| [low-level-design-patterns](https://github.com/bachdx2812/system-design-advisor/blob/main/references/low-level-design-patterns.md) | Extended | SOLID, parking lot, vending machine, elevator, leaderboard, LRU cache |
| [collaborative-and-multi-tenant](https://github.com/bachdx2812/system-design-advisor/blob/main/references/collaborative-and-multi-tenant.md) | Extended | CRDTs vs OT, Yjs/Automerge, tenant isolation, usage metering, subscription billing |
| [operational-troubleshooting](https://github.com/bachdx2812/system-design-advisor/blob/main/references/operational-troubleshooting.md) | Extended | Redis debugging/cluster, Kafka consumer lag, Postgres, ES health, S3 multipart, migrations |

### Design Patterns (6 chapters)

| Reference File | Chapters | Topics |
|---------------|----------|--------|
| [foundations-creational](/design-patterns/ch01-foundations-creational) | Ch 01 | Factory, Abstract Factory, Builder, Singleton, Prototype |
| [structural-patterns](/design-patterns/ch02-structural-patterns) | Ch 02 | Adapter, Decorator, Facade, Proxy, Composite, Bridge |
| [behavioral-patterns](/design-patterns/ch03-behavioral-patterns) | Ch 03 | Observer, Strategy, Command, Chain of Responsibility, State |
| [modern-application](/design-patterns/ch04-modern-application-patterns) | Ch 04 | Repository, DI, Middleware, Circuit Breaker, Retry |
| [distributed-systems](/design-patterns/ch05-distributed-system-patterns) | Ch 05 | CQRS, Event Sourcing, Saga, Strangler Fig, Sidecar |
| [anti-patterns-guide](/design-patterns/ch06-anti-patterns-selection-guide) | Ch 06 | Anti-patterns, decision matrix, 27-pattern cheat sheet |

## Quality Validation

Tested across **4 rounds** with 3 test methods: reference coverage (100 problems), live response generation (20 problems), and end-to-end workflow simulation (4 scenarios). Each round identified gaps, fixed them, and retested.

### Test Methodology

<details>
<summary><strong>How we tested</strong></summary>

**1. Reference Coverage Tests (Rounds 1-3)**
Each of 100 system design problems evaluated against the reference files:
- Does the reference cover this topic? (Yes / Partial / No)
- Accuracy (1-5): Is the information correct?
- Actionability (1-5): Can you build a design from this alone?

**2. Live Response Generation (Round 4)**
The skill reads its SKILL.md + relevant references, then generates a **full response** as if answering a real user. The response is scored on:
- Accuracy, Completeness, Actionability (1-5 each)
- Diagram Quality (1-5): Is the Mermaid diagram useful?
- Practical Value (1-5): Would a senior engineer agree?

**3. Workflow E2E Tests (Round 4)**
Simulates chaining multiple skills in sequence (e.g., reviewer → advisor → implementation guide) and evaluates cross-skill coherence, redundancy, and handoff quality.

</details>

### Improvement Across 5 Rounds

| Metric | R1 (8 refs) | R2 (12 refs) | R3 (16 refs) | R4 (23 refs) | R5 (24 refs) |
|--------|------------|-------------|-------------|-------------|-------------|
| Sys Design Avg | 3.08/5 | 4.18/5 | 4.41/5 | 4.88/5 | **4.7/5** |
| Pattern Avg | — | — | — | 4.88/5 | **4.1/5** |
| Full Coverage | 31% | 61% | 80% | 95% | **100%** |
| Zero-Coverage | 25% | 5% | 2% | 0% | **0%** |
| Reference Files | 8 | 12 | 16 | 23 | **24** |

**R5 new test problems:** collaborative editing, multi-tenant billing, distributed scheduler, Redis split-brain, ES cluster health, S3 multipart uploads, event ordering, inheritance flattening, resilience composition, plugin architecture — all previously uncovered, now scored 4.0+ after fixes.

### Round 4 Live Test Results

Skills generated **full responses** to 10 system design + 10 design pattern problems. Each response included trade-off tables, recommendations, Mermaid diagrams, and key numbers.

#### System Design — Sample Problems & Scores

| Problem | Type | Accuracy | Completeness | Practical |
|---------|------|----------|-------------|-----------|
| Kafka vs RabbitMQ for 10K orders/day | Interview | 5 | 5 | 5 |
| Social Feed data model + caching (50M DAU) | Interview | 5 | 5 | 5 |
| URL Shortener 100M URLs/day, <50ms p99 | Interview | 5 | 5 | 5 |
| Postgres at 90% CPU, 50M rows — scale without downtime | Real-world | 5 | 5 | 5 |
| Idempotent payment webhook (Stripe duplicates) | Real-world | 5 | 5 | 5 |
| 3 microservices deadlocking on shared Postgres | Real-world | 5 | 5 | 5 |
| API p99 spike 50ms→2s after adding 3 external calls | Real-world | 5 | 5 | 5 |
| WebSocket vs SSE for chat (1:1 + groups) | Interview | 5 | 5 | 5 |
| Push vs pull fan-out for notifications | Interview | 5 | 5 | 5 |
| Distributed rate limiting across 20 servers | Interview | 5 | 5 | 5 |

**Overall: 4.88/5** — Interview questions: 4.76, Real-world scenarios: 5.0

<details>
<summary><strong>Example response: "Postgres at 90% CPU, 50M rows, 5K QPS reads"</strong></summary>

> **Phase 1: Quick Wins (hours, no downtime)**
> 1. Add indexes: `CREATE INDEX CONCURRENTLY idx_user_id ON table(user_id);`
> 2. Covering indexes: `INCLUDE (col1, col2)` for zero heap lookup
> 3. Connection pooling: PgBouncer in transaction mode
>
> **Phase 2: Add Caching (days)**
> - Redis cache-aside: hot 20% users serve 80% reads
> - DB drops from 5K QPS to ~500 QPS (90%+ cache hit)
>
> **Phase 3: Read Replicas**
> - Streaming replication, route reads to replicas
> - Replication lag typically <100ms
>
> **Decision flowchart (Mermaid):** 90% CPU → indexes optimized? → connection pooling? → read-heavy? → cache → still hot? → replicas
>
> **Key insight:** 50M rows is well within single Postgres capacity — don't shard yet.

*Scored 5/5 on all criteria. Phased approach matches exactly what a senior DBA would recommend.*

</details>

#### Design Patterns — Sample Problems & Scores

| Problem | Type | Accuracy | Completeness | Practical |
|---------|------|----------|-------------|-----------|
| Factory Method vs Abstract Factory | Interview | 5 | 5 | 5 |
| Observer + pub/sub with diagram | Interview | 5 | 5 | 5 |
| Strategy for payment processing | Interview | 5 | 5 | 5 |
| Saga orchestration for checkout (TypeScript) | Real-world | 5 | 5 | 5 |
| God Object → Facade + Strategy refactoring | Real-world | 5 | 4 | 5 |
| Circuit Breaker for flaky external API | Real-world | 5 | 5 | 5 |
| CQRS for read-heavy analytics dashboard | Real-world | 5 | 5 | 5 |

**Overall: 4.88/5** — Every response included Mermaid diagrams (class, sequence, or flowchart).

### Workflow E2E Tests

Tested 4 scenarios simulating real user workflows across multiple skills:

| Scenario | Skills Chained | Coherence | Redundancy | Score |
|----------|---------------|-----------|------------|-------|
| Interview Prep | advisor → plan-generator → advisor | 5 | 4 | 4.3 |
| E-Commerce Checkout | plan-generator → patterns-advisor → implementation-guide | 5 | 3 | 4.5 |
| Legacy Code Improvement | code-reviewer → patterns-advisor → implementation-guide → arch-reviewer | 5 | 3 | 4.5 |
| Rapid Decision-Making | 4 quick A-vs-B questions | 4 | 5 | 3.5 |

**Overall: 4.2/5** — Main issue: pattern re-explained across skill chain. Fixed with context-awareness instructions in R4.

### Coverage by Domain

| Domain | Strength | Example Problems |
|--------|----------|-----------------|
| Social/Feed/Chat | Strong | News Feed, Twitter, Chat, Instagram |
| Caching/CDN/LB | Strong | Distributed Cache, CDN, Load Balancer |
| Databases/Storage | Strong | SQL vs NoSQL, Sharding, Replication |
| Video Streaming | Strong | YouTube, Netflix, Video Platform |
| Operational Debugging | Strong | Redis SLOWLOG, Kafka lag, Postgres locks |
| Geospatial | Good | Ride Sharing, Nearby Friends, Maps |
| Search/Indexing | Good | Autocomplete, Elasticsearch, Web Crawler |
| Real-Time Media | Good | WebRTC, Video Conferencing, Voice Chat |
| Financial Systems | Good | Payments, Digital Wallet, Stock Exchange |
| Design Patterns | Strong | GoF, Modern, Distributed (Go + TypeScript examples) |

### All 100 System Design Problems Tested

<details>
<summary>View complete problem list</summary>

**Beginner (1-20):** Rate Limiter, URL Shortener, Pastebin, Key-Value Store, Web Crawler, Unique ID Generator, Notification System, Authentication, Todo App, Vending Machine, Parking Lot, Leaderboard, CDN, Distributed Cache, Load Balancer, Message Queue, Search Typeahead, Hotel Booking, Distributed Lock, Simple Chat

**Intermediate (21-60):** News Feed, Chat System, Search Autocomplete, Video Streaming, Ride Sharing, Recommendation Engine, File Sharing, Social Network, E-commerce, Metrics Monitoring, Ad Click Aggregation, Logging System, Distributed Message Queue, Payment System, Digital Wallet, Stock Exchange, Gaming Leaderboard, Email Service, Proximity Service, Nearby Friends, Search Engine, Meeting Room Booking, Instagram Feed, Facebook Timeline, Pinterest, Slack Clone, Discord, Spotify, Dropbox, Airbnb, Uber Eats, Amazon Fresh, Snapchat, TikTok, Zoom, GitLab/GitHub, Stack Overflow, Quora, Medium, YouTube

**Advanced (61-80):** Google Maps, Distributed File System, NoSQL Database, Distributed Transaction, Event Sourcing, CQRS, Search System, Data Warehouse, Real-time Analytics, ML Pipeline, Advanced Recommendation, Stock Ticker, Multiplayer Game, Live Commenting, Online Judge, Cloud Storage, Blockchain, API Gateway, Service Mesh, Config Management

**Expert (81-100):** Distributed Tracing, APM Monitoring, Fraud Detection, Content Moderation, Distributed Rate Limiter, Circuit Breaker, Batch Processing, Stream Processing, Distributed Web Crawler, Search Index, YouTube Recommendation, Google Search, Twitter at Scale, Facebook Ads, Netflix Recommendation, Distributed Database, Real-time Data Warehouse, Autonomous Vehicle Platform, FinTech Trading, Global Mesh Network

</details>

### Design Pattern Problems Tested

<details>
<summary>View pattern problems (40 total)</summary>

**GoF Basics (20):** Factory Method, Singleton vs static class, Observer + diagram, Strategy for payments, Adapter vs Facade, Builder vs telescoping constructor, Decorator for logging, Command + undo, Proxy types, Template Method for pipelines, Switch → Factory, Event decoupling, Open/Closed with Decorator, 15 constructor params, Tree traversal with Composite, Undo/redo with Command, Validation chain, Abstract Factory for DB adapters, Lazy caching, Interface adaptation

**Real-World Patterns (20):** Saga for distributed checkout, Circuit Breaker implementation, CQRS for read-heavy service, God Object decomposition, Event Sourcing for audit trail, Outbox pattern for reliable events, DI container setup, Middleware pipeline, Plugin architecture, Functional composition, Repository pattern, Options pattern in Go/TS, Anti-corruption layer, Bulkhead isolation, Feature flags, State machine for orders, Mediator for UI components, Flyweight for game objects, Memento for editor state, Iterator for paginated API

</details>

### What Each Round Fixed

| Round | Refs | Key Improvements |
|-------|------|-----------------|
| R1 | 8 | Initial coverage — fundamentals, building blocks, architecture, case studies |
| R2 | 12 | Added search/indexing, real-time/streaming, storage, specialized systems |
| R3 | 16 | Added auth/security, low-level design, recommendations/ML, data processing |
| R4 | 23 | Added 6 design pattern refs + operational troubleshooting, TypeScript examples, context-aware workflows |

## Source Code

<a href="https://github.com/bachdx2812/system-design-advisor" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5em; padding: 0.6em 1.2em; background: #44475a; border-radius: 6px; color: #f8f8f2; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 0.9em;">
  View on GitHub →
</a>
