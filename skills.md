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
│  > 3 skills    > 8 reference files    > 31 chapters     │
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
| [case-studies](/system-design/part-4-case-studies/) | Ch 18–22 | URL shortener, social feed, chat, video, ride-sharing |
| [modern-and-interview](/system-design/part-5-modern-mastery/) | Ch 23–25 | Cloud-native, ML systems, interview framework |

### Design Patterns (6 chapters)

| Reference File | Chapters | Topics |
|---------------|----------|--------|
| [foundations-creational](/design-patterns/ch01-foundations-creational) | Ch 01 | Factory, Abstract Factory, Builder, Singleton, Prototype |
| [structural-patterns](/design-patterns/ch02-structural-patterns) | Ch 02 | Adapter, Decorator, Facade, Proxy, Composite, Bridge |
| [behavioral-patterns](/design-patterns/ch03-behavioral-patterns) | Ch 03 | Observer, Strategy, Command, Chain of Responsibility, State |
| [modern-application](/design-patterns/ch04-modern-application-patterns) | Ch 04 | Repository, DI, Middleware, Circuit Breaker, Retry |
| [distributed-systems](/design-patterns/ch05-distributed-system-patterns) | Ch 05 | CQRS, Event Sourcing, Saga, Strangler Fig, Sidecar |
| [anti-patterns-guide](/design-patterns/ch06-anti-patterns-selection-guide) | Ch 06 | Anti-patterns, decision matrix, 27-pattern cheat sheet |

## Source Code

<a href="https://github.com/bachdx2812/system-design-advisor" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5em; padding: 0.6em 1.2em; background: #44475a; border-radius: 6px; color: #f8f8f2; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 0.9em;">
  View on GitHub →
</a>
