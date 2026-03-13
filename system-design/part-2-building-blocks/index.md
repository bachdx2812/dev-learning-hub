---
title: "Part 2: Building Blocks"
description: "Master the core infrastructure primitives: DNS, load balancing, caching, CDNs, SQL and NoSQL databases, message queues, and communication protocols like REST and gRPC."
---

# Part 2 — Building Blocks

> The atomic components. Every large-scale system is assembled from these primitives.

**Prerequisites:** [Part 1 — Fundamentals](/system-design/part-1-fundamentals/) (especially Ch01-Ch03)

---

## Overview

Part 2 covers the core infrastructure components that appear in almost every distributed system. You'll understand how each works internally, when to use it, and the trade-offs at every decision point.

By the end of Part 2, you'll be able to:
- Explain DNS resolution and routing strategies
- Choose the right load balancing algorithm for your use case
- Design multi-layer caching strategies
- Select between SQL and NoSQL databases with clear reasoning
- Design async processing pipelines with message queues

---

## Chapters

### [Chapter 05 — DNS](/system-design/part-2-building-blocks/ch05-dns)
How DNS works, record types, routing strategies (round-robin, weighted, latency-based, geolocation), DNS as load balancer.

### [Chapter 06 — Load Balancing](/system-design/part-2-building-blocks/ch06-load-balancing)
L4 vs L7, algorithms (round-robin, least connections, consistent hashing), active-passive vs active-active failover, reverse proxy.

### [Chapter 07 — Caching](/system-design/part-2-building-blocks/ch07-caching)
Cache hierarchy, strategies (cache-aside, read-through, write-through, write-behind), eviction policies, Redis vs Memcached.

### [Chapter 08 — Content Delivery Networks](/system-design/part-2-building-blocks/ch08-cdn)
How CDNs work, push vs pull models, origin shielding, TTL management, multi-CDN strategies.

### [Chapter 09 — Databases: SQL](/system-design/part-2-building-blocks/ch09-databases-sql)
Replication (master-slave, master-master), sharding, federation, denormalization, SQL tuning.

### [Chapter 10 — Databases: NoSQL](/system-design/part-2-building-blocks/ch10-databases-nosql)
Key-value, document, wide-column, graph databases. When to use each, CAP trade-offs in practice.

### [Chapter 11 — Message Queues](/system-design/part-2-building-blocks/ch11-message-queues)
Kafka, RabbitMQ, SQS. Task queues, back pressure, exactly-once delivery, async processing patterns.

### [Chapter 12 — Communication Protocols](/system-design/part-2-building-blocks/ch12-communication-protocols)
HTTP, TCP/UDP, RPC, REST, GraphQL, WebSockets. When to use each protocol.

---

## Time Estimate

~8 hours of focused reading and practice.
