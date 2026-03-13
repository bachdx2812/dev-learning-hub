---
title: "Part 3: Architecture Patterns"
description: "Compose building blocks into production systems: microservices, event-driven architecture, data replication, distributed consensus, security, and observability."
---

# Part 3 — Architecture & Patterns

> Composing building blocks into real systems. Where engineering meets art.

**Prerequisites:** [Part 2 — Building Blocks](/system-design/part-2-building-blocks/) (all chapters)

---

## Overview

Part 3 covers the architectural patterns that compose individual building blocks into real distributed systems. You'll learn both the "happy path" designs and the cross-cutting concerns (security, observability) that make systems production-ready.

By the end of Part 3, you'll be able to:
- Design microservices with proper service discovery and API gateways
- Apply event-driven architecture and CQRS patterns
- Implement distributed consensus and data replication strategies
- Build secure, reliable systems with proper authentication and rate limiting
- Set up observability with metrics, logs, traces, and SLOs

---

## Chapters

### [Chapter 13 — Microservices](/system-design/part-3-architecture-patterns/ch13-microservices)
Service discovery, API gateway, circuit breaker, saga pattern, service mesh. From monolith to microservices.

### [Chapter 14 — Event-Driven Architecture](/system-design/part-3-architecture-patterns/ch14-event-driven-architecture)
Event sourcing, CQRS, event bus, choreography vs orchestration, domain events.

### [Chapter 15 — Data Replication & Consistency](/system-design/part-3-architecture-patterns/ch15-data-replication-consistency)
Consensus protocols (Raft, Paxos), leader election, quorum reads/writes, conflict resolution.

### [Chapter 16 — Security & Reliability](/system-design/part-3-architecture-patterns/ch16-security-reliability)
OAuth2/JWT, rate limiting, DDoS mitigation, circuit breakers, graceful degradation, disaster recovery.

### [Chapter 17 — Monitoring & Observability](/system-design/part-3-architecture-patterns/ch17-monitoring-observability)
Three pillars (metrics, logs, traces), SLIs/SLOs/SLAs, error budgets, distributed tracing, alerting.

---

## Time Estimate

~6 hours of focused reading and practice.
