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
│  > 3 skills    > 12 reference files   > 31 chapters     │
│  > Claude Code + Cursor support                         │
│                                                         │
│  $ claude /system-design-advisor                        │
└─────────────────────────────────────────────────────────┘
```

</div>

31 chapters of system design and design patterns knowledge — distilled into AI coding assistant skills. Get real-time architectural guidance, generate design plans, and review your codebase against best practices.

## Available Skills

### `/system-design-advisor`

**Answer system design questions.** Ask about scalability, databases, caching, CAP theorem, load balancing, microservices, or any distributed systems concept. Get structured answers with trade-off tables, recommendations, and key numbers.

**Example prompts:**
- *"Should I use SQL or NoSQL for my use case?"*
- *"Explain the trade-offs between push and pull fan-out"*
- *"When should I add a message queue?"*

---

### `/design-plan-generator`

**Generate complete system design plans.** Uses the 4-step framework (Requirements → Estimation → High-Level Design → Deep Dive) to produce structured plans for any system.

**Example prompts:**
- *"Design a URL shortener"*
- *"Architect a real-time chat messaging system"*
- *"Plan a video streaming platform"*

---

### `/architecture-reviewer`

**Auto-scan and review your project architecture.** Reads your project configuration, identifies components, and evaluates against scalability, reliability, security, and observability checklists. Outputs a findings table with severity and recommendations.

**Example prompts:**
- *"Review my architecture"*
- *"Is my system scalable?"*
- *"What are the bottlenecks in this project?"*

## Installation

### Claude Code

```bash
# Clone the repo
git clone https://github.com/bachdx2812/system-design-advisor.git

# Copy skills + references to your Claude Code skills directory
cp -r system-design-advisor/skills/* ~/.claude/skills/
cp -r system-design-advisor/references ~/.claude/skills/system-design-advisor/
cp -r system-design-advisor/references ~/.claude/skills/design-plan-generator/
cp -r system-design-advisor/references ~/.claude/skills/architecture-reviewer/
```

After installing, invoke with `/system-design-advisor`, `/design-plan-generator`, or `/architecture-reviewer`.

### Cursor

```bash
# Clone the repo
git clone https://github.com/bachdx2812/system-design-advisor.git

# Copy rules to your project
mkdir -p .cursor/rules
cp system-design-advisor/cursor/rules/* .cursor/rules/
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

Skills were tested against **100 well-known system design interview problems** spanning Beginner to Expert difficulty. Each problem was evaluated for coverage, accuracy (1-5), and actionability (1-5).

### Test Results

| Batch | # Problems | Difficulty | Avg Accuracy | Avg Actionable | Full Coverage |
|-------|-----------|------------|-------------|----------------|---------------|
| Batch 1 | 20 | Beginner | **4.15** / 5 | **4.10** / 5 | 55% |
| Batch 2 | 20 | Intermediate | **3.55** / 5 | **3.45** / 5 | 40% |
| Batch 3 | 20 | Intermediate | **2.95** / 5 | **2.80** / 5 | 20% |
| Batch 4 | 20 | Advanced | **3.05** / 5 | **2.95** / 5 | 35% |
| Batch 5 | 20 | Expert | **2.25** / 5 | **2.15** / 5 | 20% |

**Pre-improvement aggregate:** 3.08/5 accuracy, 31% full coverage across 100 problems.

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
