---
title: "Content Depth Expansion"
description: "Expand 16 chapters with deeper content from KPS and BBG reference repos"
status: validated
priority: P1
effort: 8h
branch: main
tags: [content-expansion, system-design, depth]
created: 2026-03-12
---

# Content Depth Expansion Plan

## Approach
16 expansions across 6 parallel phases. Each phase runs up to 3 agents on files with zero overlap. HIGH priority first, MEDIUM after.

## Dependency Graph
```
Phase 1 (3 agents) ─┐
Phase 2 (3 agents) ─┤── all independent, run in parallel pairs
Phase 3 (3 agents) ─┤
Phase 4 (3 agents) ─┤
Phase 5 (2 agents) ─┤
Phase 6 (2 agents) ─┘
```
No inter-phase dependencies. All phases CAN run in parallel (max 3 agents concurrent).

## File Ownership Matrix

| Phase | Agent | File | Expansion | Priority | ~Lines |
|-------|-------|------|-----------|----------|--------|
| 1 | A | ch03 | PACELC, CAP/PACELC DB mapping | HIGH | +200 |
| 1 | B | ch09 | Isolation levels, MVCC, B-Tree/LSM-Tree, locking, indexes | HIGH | +300 |
| 1 | C | ch16 | OAuth 2.0 flows, JWT deep-dive, rate limiting algorithms | HIGH | +280 |
| 2 | A | ch13 | Service discovery (Consul/etcd/Eureka), API versioning | HIGH | +220 |
| 2 | B | ch14 | Saga pattern, 2PC/3PC, CDC | HIGH | +260 |
| 2 | C | ch15 | Raft step-by-step, distributed locks | HIGH | +240 |
| 3 | A | ch06 | Consistent hashing section, proxy patterns | HIGH | +220 |
| 3 | B | ch05 | DNSSEC, DNS-over-HTTPS, DNS security | HIGH | +180 |
| 3 | C | ch17 | OpenTelemetry, distributed tracing, SLA/SLO/SLI | HIGH | +200 |
| 4 | A | ch23 | Deployment strategies, GitOps | HIGH | +220 |
| 4 | B | ch18 | Unique ID generation (Snowflake, UUID, ULID) | MEDIUM | +180 |
| 4 | C | ch02 | Stack Overflow mini case study | MEDIUM | +150 |
| 5 | A | ch09 | Figma Postgres scaling case study | MEDIUM | +120 |
| 5 | B | ch10 | Discord message storage case study | MEDIUM | +120 |
| 6 | A | ch16 | Shopify payment resilience case study | MEDIUM | +120 |
| 6 | B | ch23 | Netflix CI/CD mini case study | MEDIUM | +120 |

**CONFLICT NOTE**: ch09 appears in Phase 1 and Phase 5; ch16 in Phase 1 and Phase 6; ch23 in Phase 4 and Phase 6. These MUST run sequentially (Phase 5 after Phase 1; Phase 6 after Phase 1+4).

## Execution Order (respecting conflicts)
- **Batch A** (parallel): Phase 1, Phase 2, Phase 3 -- 9 agents, run 3 at a time
- **Batch B** (parallel): Phase 4, Phase 5 -- 5 agents, run after Batch A
- **Batch C** (parallel): Phase 6 -- 2 agents, run after Batch B

## Phase Files
- [Phase 01](./phase-01-core-tradeoffs-sql-security.md) - ch03, ch09, ch16
- [Phase 02](./phase-02-microservices-events-replication.md) - ch13, ch14, ch15
- [Phase 03](./phase-03-loadbalancing-dns-monitoring.md) - ch06, ch05, ch17
- [Phase 04](./phase-04-cloud-urlshortener-scalability.md) - ch23, ch18, ch02
- [Phase 05](./phase-05-case-studies-sql-nosql.md) - ch09, ch10
- [Phase 06](./phase-06-case-studies-security-cloud.md) - ch16, ch23

## Success Criteria
- All 16 expansions merged into existing chapters
- Each expansion adds 100-300 lines with Mermaid diagrams + comparison tables
- No broken cross-references or Mermaid syntax errors
- VitePress builds successfully after each phase

## Validation Summary

**Validated:** 2026-03-12
**Questions asked:** 4

### Confirmed Decisions
- **Chapter size**: Let chapters grow as needed — content completeness over line count
- **Mini case studies**: ~100-120 lines each with architecture overview, key decisions, lessons learned
- **Rate limiting depth**: All 5 algorithms (Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log, Sliding Window Counter)
- **Raft consensus depth**: Step-by-step with diagrams — leader election + log replication sequences, state machine, Raft vs Paxos table (~200+ lines)

### Action Items
- [x] No plan changes needed — all recommended options confirmed
