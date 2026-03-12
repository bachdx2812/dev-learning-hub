# System Design

> A complete learning path from first principles to production-grade distributed systems.

## What You'll Master

This guide covers everything from scaling a simple web server to millions of users, all the way to designing the infrastructure behind the world's largest tech companies.

## The Learning Path

Work through the parts sequentially — each builds on concepts from the previous.

---

### [Part 1 — Fundamentals](/system-design/part-1-fundamentals/)

The non-negotiable foundations. Scalability, trade-offs, and estimation — the bedrock every engineer must know.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 01 | [Introduction to System Design](/system-design/part-1-fundamentals/ch01-introduction-to-system-design) | Beginner | 20 min |
| 02 | [Scalability](/system-design/part-1-fundamentals/ch02-scalability) | Beginner | 30 min |
| 03 | [Core Trade-offs](/system-design/part-1-fundamentals/ch03-core-tradeoffs) | Intermediate | 45 min |
| 04 | [Back-of-Envelope Estimation](/system-design/part-1-fundamentals/ch04-estimation) | Beginner | 25 min |

---

### [Part 2 — Building Blocks](/system-design/part-2-building-blocks/)

The atomic components of every distributed system. DNS, databases, caching, queues, and protocols.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 05 | [DNS](/system-design/part-2-building-blocks/ch05-dns) | Beginner | 20 min |
| 06 | [Load Balancing](/system-design/part-2-building-blocks/ch06-load-balancing) | Intermediate | 30 min |
| 07 | [Caching](/system-design/part-2-building-blocks/ch07-caching) | Intermediate | 35 min |
| 08 | [Content Delivery Networks](/system-design/part-2-building-blocks/ch08-cdn) | Beginner | 25 min |
| 09 | [Databases: SQL](/system-design/part-2-building-blocks/ch09-databases-sql) | Intermediate | 40 min |
| 10 | [Databases: NoSQL](/system-design/part-2-building-blocks/ch10-databases-nosql) | Intermediate | 35 min |
| 11 | [Message Queues](/system-design/part-2-building-blocks/ch11-message-queues) | Intermediate | 30 min |
| 12 | [Communication Protocols](/system-design/part-2-building-blocks/ch12-communication-protocols) | Intermediate | 35 min |

---

### [Part 3 — Architecture & Patterns](/system-design/part-3-architecture-patterns/)

Production architecture patterns — microservices, events, replication, security, and observability.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 13 | [Microservices](/system-design/part-3-architecture-patterns/ch13-microservices) | Intermediate | 35 min |
| 14 | [Event-Driven Architecture](/system-design/part-3-architecture-patterns/ch14-event-driven-architecture) | Intermediate | 35 min |
| 15 | [Data Replication & Consistency](/system-design/part-3-architecture-patterns/ch15-data-replication-consistency) | Advanced | 45 min |
| 16 | [Security & Reliability](/system-design/part-3-architecture-patterns/ch16-security-reliability) | Intermediate | 40 min |
| 17 | [Monitoring & Observability](/system-design/part-3-architecture-patterns/ch17-monitoring-observability) | Intermediate | 30 min |

---

### [Part 4 — Case Studies](/system-design/part-4-case-studies/)

Full deep-dives into real-world system designs — from URL shorteners to ride-sharing platforms.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 18 | [URL Shortener & Pastebin](/system-design/part-4-case-studies/ch18-url-shortener-pastebin) | Intermediate | 35 min |
| 19 | [Social Media Feed](/system-design/part-4-case-studies/ch19-social-media-feed) | Advanced | 40 min |
| 20 | [Chat & Messaging System](/system-design/part-4-case-studies/ch20-chat-messaging-system) | Advanced | 40 min |
| 21 | [Video Streaming Platform](/system-design/part-4-case-studies/ch21-video-streaming-platform) | Advanced | 45 min |
| 22 | [Ride-Sharing & Geospatial](/system-design/part-4-case-studies/ch22-ride-sharing-geospatial) | Advanced | 40 min |

---

### [Part 5 — Modern Mastery](/system-design/part-5-modern-mastery/)

Cloud-native, ML systems, and a comprehensive interview framework to tie it all together.

| # | Chapter | Difficulty | ~Time |
|---|---------|-----------|-------|
| 23 | [Cloud-Native & Serverless](/system-design/part-5-modern-mastery/ch23-cloud-native-serverless) | Advanced | 40 min |
| 24 | [ML Systems & AI Infrastructure](/system-design/part-5-modern-mastery/ch24-ml-systems-ai-infrastructure) | Advanced | 45 min |
| 25 | [Interview Framework & Cheat Sheets](/system-design/part-5-modern-mastery/ch25-interview-framework-cheat-sheets) | Beginner | 30 min |

---

## How to Use This Guide

1. **Read sequentially** — concepts compound on each other
2. **Draw diagrams** — don't just read, sketch the architecture
3. **Attempt estimates** — pause at capacity estimation sections and calculate yourself
4. **Practice the questions** — each chapter has interview-style exercises with difficulty levels and hints
5. **Revisit** — come back after completing later chapters for new perspective

**Total estimated time: ~14 hours across 25 chapters**

```
$ grep -r "TODO" ./system-design/ | wc -l
# 0 — all 25 chapters await you
```
