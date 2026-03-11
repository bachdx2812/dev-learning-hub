# Phase 02: Microservices, Event-Driven, Replication & Consistency

## Parallelization Info
- **Batch**: A (first batch, no prerequisites)
- **Agents**: 3 concurrent
- **File conflicts**: None. All files exclusive to this phase.

## Context Links
- Gap analysis: `plans/reports/researcher-260312-0142-content-gap-analysis.md`
- KPS: service discovery, distributed transactions covered
- BBG: CDC, event-driven patterns covered

## Overview
- **Priority**: HIGH
- **Status**: pending
- **Description**: Expand Part 3 architecture chapters with missing patterns and protocols

## Key Insights
- ch13 (611L) mentions service discovery but no deep-dive on implementations
- ch14 (454L) covers event sourcing but lacks Saga, 2PC/3PC, CDC
- ch15 (512L) covers replication basics but consensus (Raft) is shallow, no distributed locks

## Requirements
### Functional
- New sections before Practice Questions in each chapter
- Mermaid sequence/state diagrams for all protocols
- Comparison tables for pattern alternatives
- Cross-references between ch13/ch14/ch15

### Non-functional
- Quote Mermaid special characters
- 100-300 new lines per chapter

## File Ownership (exclusive)

| Agent | File | Path |
|-------|------|------|
| A | ch13 | `system-design/part-3-architecture-patterns/ch13-microservices.md` |
| B | ch14 | `system-design/part-3-architecture-patterns/ch14-event-driven-architecture.md` |
| C | ch15 | `system-design/part-3-architecture-patterns/ch15-data-replication-consistency.md` |

---

## Agent A: ch13 - Service Discovery & API Versioning (+220 lines)

### Implementation Steps
1. Read ch13 fully, find existing service discovery mention
2. Add `## Service Discovery Deep-Dive`:
   - **Client-side discovery**: client queries registry, picks instance. Mermaid sequence diagram.
   - **Server-side discovery**: load balancer queries registry. Mermaid sequence diagram.
   - Comparison table: Pattern | Pros | Cons | Example
3. Add `## Service Registry Comparison`:
   - Table: Tool | Protocol | Health Check | Consistency | Language Support
   - Consul: CP, HTTP/DNS, health checks built-in
   - etcd: CP (Raft), key-value, used by Kubernetes
   - Eureka: AP, REST-based, Netflix ecosystem
   - ZooKeeper: CP, general coordination
4. Add `## Health Check Patterns`:
   - Liveness vs Readiness vs Startup probes
   - Mermaid state diagram: service lifecycle (starting -> ready -> healthy -> degraded -> unhealthy)
5. Add `## API Versioning Strategies`:
   - URL path versioning (`/v1/users`), header versioning, query param
   - Comparison table: Strategy | Caching | Breaking Changes | Client Complexity
   - Best practices for backward compatibility
6. Cross-reference ch06 (load balancing), ch23 (Kubernetes)

### Success Criteria
- [ ] Client-side vs server-side discovery with diagrams
- [ ] Registry comparison table (4+ tools)
- [ ] Health check patterns
- [ ] API versioning strategies table
- [ ] ~220 new lines

---

## Agent B: ch14 - Saga Pattern, 2PC/3PC, CDC (+260 lines)

### Implementation Steps
1. Read ch14 fully, locate event sourcing section
2. Add `## Distributed Transaction Protocols`:
   - **Two-Phase Commit (2PC)**: Prepare + Commit phases
   - Mermaid sequence diagram: coordinator -> participants (prepare -> vote -> commit/abort)
   - **Three-Phase Commit (3PC)**: adds pre-commit phase to avoid blocking
   - Comparison table: Protocol | Blocking | Fault Tolerance | Latency | Use Case
3. Add `## Saga Pattern`:
   - **Orchestration**: central coordinator manages steps. Mermaid sequence diagram.
   - **Choreography**: services emit events, each reacts. Mermaid sequence diagram.
   - Compensation logic: how to undo completed steps on failure
   - Comparison table: Approach | Coupling | Complexity | Debugging | Best For
   - Example: e-commerce order (create order -> reserve inventory -> charge payment -> confirm)
4. Add `## Change Data Capture (CDC)`:
   - What: capture row-level changes from DB transaction log
   - Approaches: log-based (Debezium), trigger-based, polling
   - Mermaid flowchart: DB -> WAL -> Debezium -> Kafka -> Consumers
   - Use cases: cache invalidation, search index sync, analytics pipeline
   - Comparison table: Approach | Latency | DB Impact | Complexity
5. Cross-reference ch15 (consensus), ch11 (message queues), ch09 (transactions)

### Success Criteria
- [ ] 2PC sequence diagram + explanation
- [ ] 3PC vs 2PC comparison
- [ ] Saga orchestration + choreography diagrams
- [ ] Compensation logic explained
- [ ] CDC flowchart + approach comparison
- [ ] ~260 new lines

---

## Agent C: ch15 - Raft Algorithm & Distributed Locks (+240 lines)

### Implementation Steps
1. Read ch15 fully, locate consensus section
2. Add `## Raft Consensus Algorithm`:
   - **Node states**: Follower, Candidate, Leader. Mermaid state diagram.
   - **Leader Election**: timeout -> candidate -> requestVote -> majority wins
   - Mermaid sequence diagram: election process (follower timeout -> candidate -> votes -> leader)
   - **Log Replication**: leader appends -> replicates to followers -> majority ack -> commit
   - Mermaid sequence diagram: log replication flow
   - **Safety guarantees**: election safety, leader append-only, log matching
   - Comparison table: Raft vs Paxos (Understandability | Leader | Membership Changes | Implementation)
3. Add `## Distributed Locks`:
   - Why needed: prevent concurrent access to shared resources across nodes
   - **Redis-based (Redlock)**: acquire lock with TTL, majority of Redis instances
   - Mermaid sequence diagram: Redlock acquire -> process -> release
   - **ZooKeeper-based**: ephemeral sequential znodes, watch predecessor
   - **etcd-based**: lease-based locking with TTL
   - Comparison table: Implementation | Availability | Safety | Complexity | Use Case
   - Fencing tokens: prevent stale lock holders from corrupting data
4. Cross-reference ch03 (consistency), ch09 (locking), ch14 (distributed transactions)

### Success Criteria
- [ ] Raft state diagram (Follower/Candidate/Leader)
- [ ] Leader election sequence diagram
- [ ] Log replication sequence diagram
- [ ] Raft vs Paxos comparison table
- [ ] Distributed locks: 3 implementations compared
- [ ] Fencing tokens explained
- [ ] ~240 new lines

---

## Conflict Prevention
- All 3 files exclusive to this phase across entire plan
- No sequential dependencies on other phases

## Risk Assessment
- **Saga + 2PC + CDC in ch14** is ambitious (260 lines) -- keep each subsection tight, use diagrams over prose
- **Raft complexity** -- focus on intuition, not mathematical proofs. Link to Raft paper for details

## Next Steps
- No downstream dependencies. This phase is fully self-contained.
