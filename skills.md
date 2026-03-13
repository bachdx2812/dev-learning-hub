---
layout: doc
title: AI Skills
---

# AI Skills

<div style="font-family: 'JetBrains Mono', monospace; font-size: 0.85em; color: #6272a4; margin-bottom: 2em;">

```
┌─────────────────────────────────────────────────────────┐
│  SYSTEM DESIGN ADVISOR v1.0.0                           │
│                                                         │
│  > 6 skills    > 23 reference files   > 31 chapters     │
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

### Quick Install (Claude Code — global)

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
| search-and-indexing | Extended | Inverted index, trie, BM25, Elasticsearch, autocomplete, web crawler |
| real-time-and-streaming | Extended | WebRTC, SFU/MCU, Flink, time-series DBs, stream processing |
| storage-and-infrastructure | Extended | Object storage, HDFS, file sync, config mgmt, LSM-tree, OLAP, ELK |
| specialized-systems | Extended | Unique IDs, distributed locks, payments, stock exchange, game networking |
| recommendation-and-ml-systems | Extended | Collaborative/content-based filtering, two-tower model, feature store, fraud, ads |
| data-processing-and-analytics | Extended | MapReduce, Spark, Flink, windowing, ETL, data warehouse, lambda/kappa |
| authentication-and-security-deep-dive | Extended | JWT, OAuth 2.0, SSO, SAML/OIDC, mTLS, RBAC/ABAC, rate limiting |
| low-level-design-patterns | Extended | SOLID, parking lot, vending machine, elevator, leaderboard, LRU cache |
| operational-troubleshooting | Extended | Redis debugging, Kafka consumer lag, Postgres slow queries, migration strategies |

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

Skills were tested against **100 system design interview problems** spanning Beginner to Expert difficulty across **3 rounds** of iterative improvement. Each problem evaluated for coverage, accuracy (1-5), and actionability (1-5).

### Round 3 Results (current — 16 reference files)

| Batch | # Problems | Difficulty | Avg Accuracy | Avg Actionable | Full Coverage |
|-------|-----------|------------|-------------|----------------|---------------|
| Batch 1 | 20 | Beginner | **4.90** / 5 | **4.55** / 5 | **85%** |
| Batch 2 | 20 | Intermediate | **4.25** / 5 | **4.10** / 5 | **75%** |
| Batch 3-4 | 25 targeted | Intermediate–Advanced | **4.08** / 5 | **3.88** / 5 | **80%** |

### Improvement Across 3 Rounds

| Metric | R1 (8 refs) | R2 (12 refs) | R3 (16 refs) | R4 (23 refs) |
|--------|------------|-------------|-------------|-------------|
| Avg Accuracy | 3.08/5 | 4.18/5 | 4.41/5 | **4.88/5** |
| Full Coverage | 31% | 61% | 80% | **95%** |
| Zero-Coverage | 25% | 5% | 2% | **0%** |
| Reference Files | 8 | 12 | 16 | **23** |

### Coverage by Domain

| Domain | Strength | Example Problems |
|--------|----------|-----------------|
| Social/Feed/Chat | Strong | News Feed, Twitter, Chat, Instagram |
| Caching/CDN/LB | Strong | Distributed Cache, CDN, Load Balancer |
| Databases/Storage | Strong | SQL vs NoSQL, Sharding, Replication |
| Video Streaming | Strong | YouTube, Netflix, Video Platform |
| Geospatial | Good | Ride Sharing, Nearby Friends, Maps |
| Search/Indexing | Good* | Autocomplete, Elasticsearch, Web Crawler |
| Real-Time Media | Good* | WebRTC, Video Conferencing, Voice Chat |
| Financial Systems | Good* | Payments, Digital Wallet, Stock Exchange |
| ML/Recommendations | Moderate | Recommendation Engine, Fraud Detection |
| Data Processing | Moderate | Stream Processing, Data Warehouse |

*Improved from "Weak/None" to "Good" after post-test reference expansion.

### All 100 Problems Tested

<details>
<summary>View complete problem list</summary>

**Beginner (1-20):** Rate Limiter, URL Shortener, Pastebin, Key-Value Store, Web Crawler, Unique ID Generator, Notification System, Authentication, Todo App, Vending Machine, Parking Lot, Leaderboard, CDN, Distributed Cache, Load Balancer, Message Queue, Search Typeahead, Hotel Booking, Distributed Lock, Simple Chat

**Intermediate (21-60):** News Feed, Chat System, Search Autocomplete, Video Streaming, Ride Sharing, Recommendation Engine, File Sharing, Social Network, E-commerce, Metrics Monitoring, Ad Click Aggregation, Logging System, Distributed Message Queue, Payment System, Digital Wallet, Stock Exchange, Gaming Leaderboard, Email Service, Proximity Service, Nearby Friends, Search Engine, Meeting Room Booking, Instagram Feed, Facebook Timeline, Pinterest, Slack Clone, Discord, Spotify, Dropbox, Airbnb, Uber Eats, Amazon Fresh, Snapchat, TikTok, Zoom, GitLab/GitHub, Stack Overflow, Quora, Medium, YouTube

**Advanced (61-80):** Google Maps, Distributed File System, NoSQL Database, Distributed Transaction, Event Sourcing, CQRS, Search System, Data Warehouse, Real-time Analytics, ML Pipeline, Advanced Recommendation, Stock Ticker, Multiplayer Game, Live Commenting, Online Judge, Cloud Storage, Blockchain, API Gateway, Service Mesh, Config Management

**Expert (81-100):** Distributed Tracing, APM Monitoring, Fraud Detection, Content Moderation, Distributed Rate Limiter, Circuit Breaker, Batch Processing, Stream Processing, Distributed Web Crawler, Search Index, YouTube Recommendation, Google Search, Twitter at Scale, Facebook Ads, Netflix Recommendation, Distributed Database, Real-time Data Warehouse, Autonomous Vehicle Platform, FinTech Trading, Global Mesh Network

</details>

### Post-Test Improvements

After identifying coverage gaps across 100 problems, **4 new reference files** were added:

1. **search-and-indexing.md** — Inverted index, trie, BM25, Elasticsearch architecture, autocomplete, web crawler
2. **real-time-and-streaming.md** — WebRTC, SFU/MCU architectures, Flink, time-series DBs, windowing
3. **storage-and-infrastructure.md** — Object storage, HDFS, file sync (Dropbox), config management, LSM-tree, OLAP, ELK pipeline
4. **specialized-systems.md** — Snowflake IDs, distributed locks (Redlock), payment state machines, order matching, game networking, spatial indexing

Existing references were also expanded with locking strategies, OLAP/OLTP comparison, 2PC protocol, API gateway patterns, and 3 new case studies.

## Source Code

<a href="https://github.com/bachdx2812/system-design-advisor" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5em; padding: 0.6em 1.2em; background: #44475a; border-radius: 6px; color: #f8f8f2; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 0.9em;">
  View on GitHub →
</a>
