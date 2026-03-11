# Phase 05: Case Studies - Figma Postgres & Discord Message Storage

## Parallelization Info
- **Batch**: B (runs after Phase 1 completes -- ch09 dependency)
- **Agents**: 2 concurrent
- **File conflicts**: ch09 modified in Phase 1 (MUST wait for Phase 1 completion)

## Context Links
- Gap analysis: `plans/reports/researcher-260312-0142-content-gap-analysis.md` (Category 3: case studies)
- BBG: Discord and Figma case studies referenced

## Overview
- **Priority**: MEDIUM
- **Status**: completed
- **Description**: Add mini case studies to ch09 and ch10 based on BBG reference material

## Key Insights
- ch09 will already be expanded by Phase 1 (+300L); this adds a focused case study (+120L)
- ch10 (447L) has no file conflicts; case study adds real-world NoSQL migration example
- Both case studies reinforce concepts already in the chapters

## File Ownership (exclusive in this phase)

| Agent | File | Path | Dependency |
|-------|------|------|------------|
| A | ch09 | `system-design/part-2-building-blocks/ch09-databases-sql.md` | After Phase 1 Agent B |
| B | ch10 | `system-design/part-2-building-blocks/ch10-databases-nosql.md` | None |

---

## Agent A: ch09 - Figma Postgres Scaling Case Study (+120 lines)

### Implementation Steps
1. Read ch09 (will include Phase 1 expansions)
2. Add `## Case Study: Figma's PostgreSQL Scaling Journey` BEFORE Practice Questions:
   - Context: Figma scaled Postgres horizontally to handle rapid growth
   - Challenges: connection pooling limits, replication lag, partition strategy
   - Solutions:
     - PgBouncer for connection pooling
     - Horizontal sharding by team/organization ID
     - Read replicas for analytics workloads
   - Mermaid diagram: Figma's sharded Postgres architecture (App -> PgBouncer -> Shard 1..N)
   - Table: Challenge | Solution | Trade-off
   - Key takeaway: relational DBs CAN scale horizontally with careful sharding
3. Cross-reference ch03 (PACELC), ch15 (replication)

### Success Criteria
- [x] Figma architecture diagram
- [x] Challenge/solution/trade-off table
- [x] Reinforces ch09 sharding and replication concepts
- [x] ~120 new lines (+90 actual)

---

## Agent B: ch10 - Discord Message Storage Case Study (+120 lines)

### Implementation Steps
1. Read ch10 fully
2. Add `## Case Study: Discord's Message Storage Migration` BEFORE Practice Questions:
   - Context: Discord migrated from MongoDB -> Cassandra -> ScyllaDB for message storage
   - Phase 1 (MongoDB): worked initially, struggled with data size
   - Phase 2 (Cassandra): better write throughput, but GC pauses and read latency issues
   - Phase 3 (ScyllaDB): Cassandra-compatible, written in C++ (no GC), lower tail latency
   - Mermaid timeline/flowchart: MongoDB(2015) -> Cassandra(2017) -> ScyllaDB(2022)
   - Table: Database | Why Chosen | Pain Point | When Migrated
   - Key insight: database choice evolves with scale; what works at 10M users may fail at 200M
   - Data model: messages partitioned by channel_id, sorted by message_id (Snowflake)
3. Cross-reference ch09 (SQL alternative), ch18 (Snowflake IDs), ch20 (chat system design)

### Success Criteria
- [x] Migration timeline diagram
- [x] Database comparison table with pain points
- [x] Data model description
- [x] Reinforces NoSQL evolution concepts
- [x] ~120 new lines (+91 actual)

---

## Conflict Prevention
- **CRITICAL**: ch09 Agent A MUST NOT start until Phase 1 Agent B is complete
- ch10 has no conflicts, can start immediately
- Both agents can run concurrently ONLY IF Phase 1 is done

## Risk Assessment
- **Figma details** are based on public blog posts; note approximate dates
- **Discord migration** well-documented in Discord engineering blog; low risk

## Next Steps
- No downstream dependencies from this phase.
