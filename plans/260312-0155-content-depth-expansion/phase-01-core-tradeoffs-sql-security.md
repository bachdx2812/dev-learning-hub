# Phase 01: Core Trade-offs, SQL Databases, Security & Reliability

## Parallelization Info
- **Batch**: A (first batch, no prerequisites)
- **Agents**: 3 concurrent
- **File conflicts**: None within phase. ch09 and ch16 reused in Phase 5/6 (sequential dependency).

## Context Links
- Gap analysis: `plans/reports/researcher-260312-0142-content-gap-analysis.md`
- KPS depth: `plans/260312-0155-content-depth-expansion/research/researcher-01-karanpratapsingh-depth.md`
- BBG depth: `plans/260312-0155-content-depth-expansion/research/researcher-02-bytebytego-depth.md`

## Overview
- **Priority**: HIGH
- **Status**: completed
- **Description**: Expand 3 most critical chapters with missing theoretical depth

## Key Insights
- ch03 (319L) is the shortest fundamentals chapter; PACELC is essential CAP extension
- ch09 (423L) has the most gaps: isolation levels, MVCC, B-Tree/LSM-Tree, locking, indexes
- ch16 (446L) needs OAuth 2.0 protocol flows, JWT internals, and rate limiting algorithms
- BBG covers all three topics visually; KPS covers PACELC, 2PC, and OAuth

## Requirements
### Functional
- Each expansion adds new `##` sections BEFORE Practice Questions
- Mermaid diagrams for all protocol flows and algorithm comparisons
- Comparison tables for trade-off analysis
- Cross-references to related chapters

### Non-functional
- Quote special characters in Mermaid node labels
- Maintain Dracula theme compatibility
- 100-300 new lines per chapter

## File Ownership (exclusive in this phase)

| Agent | File | Path |
|-------|------|------|
| A | ch03 | `system-design/part-1-fundamentals/ch03-core-tradeoffs.md` |
| B | ch09 | `system-design/part-2-building-blocks/ch09-databases-sql.md` |
| C | ch16 | `system-design/part-3-architecture-patterns/ch16-security-reliability.md` |

---

## Agent A: ch03 - PACELC Theorem & CAP DB Mapping (+200 lines)

### Implementation Steps
1. Read ch03 fully, locate the CAP Theorem section
2. Add `## PACELC Theorem` section after CAP:
   - Explain PACELC as CAP extension: "if Partition, choose A or C; Else, choose L or C"
   - Mermaid state diagram showing PACELC decision tree
   - Practical explanation: why latency matters when no partition
3. Add `## CAP/PACELC Database Classification` table:
   - Map real databases: MongoDB (PA/EL), Cassandra (PA/EL), PostgreSQL (PC/EC), DynamoDB (PA/EL configurable), CockroachDB (PC/EC), etc.
   - Include columns: Database | CAP | PACELC | Notes
4. Add `## Practical Decision Flowchart`:
   - Mermaid flowchart: "Do you need partition tolerance?" -> branches
   - Guide readers from requirements to database choice
5. Add cross-references to ch09 (SQL) and ch10 (NoSQL)
6. Verify Mermaid syntax (quote labels with special chars)

### Success Criteria
- [x] PACELC theorem explained with state diagram
- [x] DB classification table with 8+ databases (10 databases)
- [x] Decision flowchart Mermaid diagram
- [x] Cross-references to ch09, ch10
- [x] ~200 new lines (+167 actual)

---

## Agent B: ch09 - SQL Deep-Dive (+300 lines)

### Implementation Steps
1. Read ch09 fully, identify existing sections
2. Add `## Transaction Isolation Levels`:
   - Table: Read Uncommitted | Read Committed | Repeatable Read | Serializable
   - Columns: Level | Dirty Read | Non-repeatable Read | Phantom Read | Performance
   - Mermaid sequence diagram showing dirty read scenario
3. Add `## Multi-Version Concurrency Control (MVCC)`:
   - How PostgreSQL implements MVCC (transaction IDs, tuple visibility)
   - Mermaid diagram: read vs write paths with version chains
   - Comparison with traditional locking
4. Add `## B-Tree vs LSM-Tree`:
   - B-Tree: read-optimized, in-place updates, used by PostgreSQL/MySQL InnoDB
   - LSM-Tree: write-optimized, append-only, used by RocksDB/Cassandra
   - Comparison table: Read Perf | Write Perf | Space Amp | Write Amp | Use Case
   - Mermaid diagram of LSM-Tree compaction flow
5. Add `## Database Locking Strategies`:
   - Pessimistic vs Optimistic locking comparison table
   - When to use each (high contention vs low contention)
   - Mermaid sequence diagram: optimistic locking with version check
6. Add `## Advanced Index Types`:
   - Covering indexes, partial indexes, GIN (full-text), GiST (geometric)
   - Table: Index Type | Best For | Example | Overhead
7. Cross-reference ch03 (PACELC), ch10 (NoSQL), ch15 (replication)

### Success Criteria
- [x] Isolation levels table with anomaly matrix
- [x] MVCC explanation with Mermaid diagram
- [x] B-Tree vs LSM-Tree comparison table + diagram
- [x] Locking strategies comparison
- [x] Advanced index types table
- [x] ~300 new lines (+249 actual)

---

## Agent C: ch16 - OAuth 2.0, JWT, Rate Limiting (+280 lines)

### Implementation Steps
1. Read ch16 fully, locate existing auth sections
2. Add `## OAuth 2.0 Authorization Flows`:
   - Authorization Code flow (web apps) - Mermaid sequence diagram
   - Authorization Code + PKCE (mobile/SPA) - Mermaid sequence diagram
   - Client Credentials (machine-to-machine) - brief flow
   - Comparison table: Flow | Use Case | Token Location | Security Level
3. Add `## JWT Deep-Dive`:
   - JWT anatomy: Header.Payload.Signature
   - Mermaid diagram showing JWT creation and validation flow
   - Table: Claim | Purpose | Example (iss, sub, exp, iat, aud)
   - Session-based vs Token-based auth comparison table
   - JWT security pitfalls (none algorithm, secret strength, expiry)
4. Add `## Rate Limiting Algorithms`:
   - **Token Bucket**: Mermaid flowchart of token refill + request check
   - **Leaky Bucket**: Mermaid flowchart of queue-based processing
   - **Fixed Window Counter**: simple counter reset per window
   - **Sliding Window Log**: timestamp-based counting
   - **Sliding Window Counter**: hybrid approach
   - Comparison table: Algorithm | Burst Handling | Memory | Accuracy | Complexity
5. Cross-reference ch13 (API gateway rate limiting), ch06 (load balancer)

### Success Criteria
- [x] OAuth 2.0 flows with 2+ sequence diagrams (Authorization Code + PKCE, Client Credentials, Device Code)
- [x] JWT anatomy + validation flow diagram
- [x] Session vs Token comparison table
- [x] 5 rate limiting algorithms with comparison table
- [x] 2 rate limiting Mermaid flowcharts (Token Bucket + Leaky Bucket)
- [x] ~280 new lines (+256 actual)

---

## Conflict Prevention
- ch09 reused in Phase 5 (case study appendage) -- Phase 5 MUST wait for this phase
- ch16 reused in Phase 6 (case study appendage) -- Phase 6 MUST wait for this phase
- No other file conflicts

## Risk Assessment
- **ch09 is largest expansion** (300 lines into 423L file) -- risk of bloat. Mitigate: keep each sub-section focused, use tables over prose
- **Mermaid syntax errors** -- mitigate: quote all node labels, test locally
- **OAuth flow complexity** -- mitigate: focus on 2-3 most common flows, link to RFC for details

## Next Steps
- After completion, Phase 5 can add Figma case study to ch09
- After completion, Phase 6 can add Shopify case study to ch16
