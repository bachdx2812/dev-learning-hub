# Phase 5: Part 3 Architecture Core (Chapters 13-15)

## Context Links
- [Plan Overview](plan.md)
- [Research: Primer](research/researcher-01-primer-analysis.md) -- microservices, consistency patterns
- [Research: Taxonomy](research/researcher-02-complete-taxonomy.md) -- architectural patterns weeks 9-15

## Parallelization
- **Max Concurrent Agents:** 3
- **Agent Assignment:**
  - Agent A: ch13 (Microservices)
  - Agent B: ch14 (Event-Driven Architecture)
  - Agent C: ch15 (Data Replication & Consistency)
- **Estimated Time:** 45 min

## Overview
- **Priority:** P1
- **Status:** pending
- Architecture patterns that compose the building blocks from Part 2 into real systems. These chapters are the bridge between individual components and full case studies.

## Key Insights
- From taxonomy: microservices, event-driven, CQRS are the top 3 architecture patterns in interviews
- From primer: service discovery (Consul, Etcd, Zookeeper) is key microservices infrastructure
- Consistency/replication chapters expand on CAP theorem from ch03
- Event-driven architecture builds on message queues (ch11)

## Requirements

### Chapter 13: Microservices
- Monolith vs microservices comparison
- Service decomposition strategies (by domain, by team)
- API gateways (routing, rate limiting, auth)
- Service discovery (client-side vs server-side)
- Inter-service communication (sync REST/gRPC vs async events)
- Saga pattern for distributed transactions
- Circuit breaker pattern
- **Diagrams:** Mind map, monolith vs microservices architecture diagram, API gateway flow, saga sequence diagram, circuit breaker state machine

### Chapter 14: Event-Driven Architecture
- Event sourcing fundamentals
- CQRS pattern
- Event-driven vs request-driven comparison
- Event schemas and evolution
- Choreography vs orchestration
- Eventual consistency implications
- Idempotency requirements
- **Diagrams:** Mind map, event sourcing sequence diagram, CQRS architecture diagram, choreography vs orchestration comparison

### Chapter 15: Data Replication & Consistency
- Why replication (fault tolerance, read scaling, geo-distribution)
- Single-leader replication with sync/async followers
- Multi-leader replication and conflict resolution
- Leaderless replication (Dynamo-style, quorum reads/writes)
- Consensus protocols: Raft overview, Paxos conceptual
- Distributed transactions: 2PC, 3PC limitations
- Consistency guarantees spectrum (linearizability → eventual)
- **Diagrams:** Mind map, replication topology diagrams, quorum read/write diagram, 2PC sequence, consistency spectrum flowchart

## File Ownership (Exclusive)
- `part-3-architecture-patterns/ch13-microservices.md`
- `part-3-architecture-patterns/ch14-event-driven-architecture.md`
- `part-3-architecture-patterns/ch15-data-replication-consistency.md`

## Chapter Template
Same as previous phases. Each chapter: mind map + 2+ diagrams + 1+ comparison table + key takeaway + 5 practice questions. 300-600 lines.

## Implementation Steps

### Agent A: ch13

**ch13-microservices.md (500-600 lines)**
1. Mind map: microservices ecosystem
2. Monolith → microservices evolution diagram
3. When to use monolith vs microservices (comparison table)
4. Service decomposition: domain-driven design boundaries
5. API gateway pattern -- flow diagram (client → gateway → services)
6. Service discovery -- client-side vs server-side diagrams
7. Sync vs async communication comparison table
8. Saga pattern -- choreography sequence diagram for order processing
9. Circuit breaker -- state machine (closed → open → half-open)
10. Sidecar/service mesh brief (Istio, Envoy)
11. Real-world: Netflix microservices architecture
12. Key takeaway + 5 practice questions

### Agent B: ch14

**ch14-event-driven-architecture.md (400-500 lines)**
1. Mind map: event-driven patterns
2. Request-driven vs event-driven comparison table
3. Event sourcing explained -- append-only log diagram
4. CQRS architecture diagram (separate read/write models)
5. Event sourcing + CQRS combined flow
6. Choreography vs orchestration -- sequence diagrams for each
7. Event schema evolution strategies (versioning)
8. Idempotency techniques (idempotency keys, deduplication)
9. Eventual consistency trade-offs
10. Real-world: how Uber uses event sourcing for trip lifecycle
11. Key takeaway + 5 practice questions

### Agent C: ch15

**ch15-data-replication-consistency.md (500-600 lines)**
1. Mind map: replication and consistency landscape
2. Why replicate -- fault tolerance, performance, geo diagram
3. Single-leader replication -- diagram with sync + async followers
4. Multi-leader replication -- conflict resolution strategies table
5. Leaderless (Dynamo-style) -- quorum diagram (W + R > N)
6. Raft consensus -- leader election sequence diagram
7. 2PC protocol -- sequence diagram with coordinator
8. Consistency spectrum diagram (linearizable → eventual)
9. Real-world: how DynamoDB achieves high availability with eventual consistency
10. Key takeaway + 5 practice questions

## Todo
- [ ] ch13: Monolith vs microservices + API gateway
- [ ] ch13: Saga pattern + circuit breaker diagrams
- [ ] ch14: Event sourcing + CQRS diagrams
- [ ] ch14: Choreography vs orchestration
- [ ] ch15: Replication topologies (single/multi/leaderless)
- [ ] ch15: Consensus (Raft) + distributed transactions (2PC)
- [ ] Verify all chapters 300-600 lines

## Success Criteria
- All 3 chapters complete with comprehensive diagrams
- References to Part 2 chapters use correct filenames
- Saga pattern (ch13) doesn't duplicate distributed transaction content (ch15)
- Event-driven (ch14) references message queues (ch11) without repeating content

## Conflict Prevention
- Agent A: ONLY ch13
- Agent B: ONLY ch14
- Agent C: ONLY ch15
- Distributed transactions: ch13 covers saga pattern (application level), ch15 covers 2PC/3PC (infrastructure level)
- Async communication: ch13 mentions briefly with link to ch14, ch14 goes deep

## Risk Assessment
- **Medium:** Overlap between saga (ch13) and distributed transactions (ch15). Clear scope: ch13 = application-level coordination, ch15 = protocol-level guarantees.
- **Low:** Event-driven is independent topic with clear boundaries.

## Next Steps
- Phase 6 picks up remaining Part 3 (ch16-17) + starts Part 4 case studies (ch18-19)
- Case studies will compose patterns from ch13-15 into full system designs
