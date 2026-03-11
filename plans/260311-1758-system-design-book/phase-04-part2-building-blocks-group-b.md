# Phase 4: Part 2 Building Blocks Group B (Chapters 9-12)

## Context Links
- [Plan Overview](plan.md)
- [Research: Primer](research/researcher-01-primer-analysis.md) -- RDBMS, NoSQL, message queues, communication protocols
- [Research: Taxonomy](research/researcher-02-complete-taxonomy.md) -- databases, message queues, in-memory stores

## Parallelization
- **Max Concurrent Agents:** 3
- **Agent Assignment:**
  - Agent A: ch09 (SQL) + ch10 (NoSQL) -- coupled topics, same agent avoids duplication
  - Agent B: ch11 (Message Queues)
  - Agent C: ch12 (Communication Protocols)
- **Estimated Time:** 50 min

## Overview
- **Priority:** P1
- **Status:** in-progress (Agent A complete; Agent B/C pending)
- Data layer and communication. These chapters are heavily referenced by Part 3 (architecture) and Part 4 (case studies).

## Key Insights
- From primer: SQL vs NoSQL decision is the most common interview trade-off question
- Sharding, replication, denormalization are core DB scaling techniques
- Message queues enable async processing -- foundational for event-driven arch (ch14)
- Communication protocols (HTTP, RPC, REST, GraphQL) underpin all service communication

## Requirements

### Chapter 9: Databases - SQL
- RDBMS fundamentals (ACID, normalization)
- Indexing strategies (B-tree, hash, composite)
- Replication: master-slave, master-master
- Partitioning: horizontal (sharding) vs vertical
- Sharding strategies: range, hash, directory-based
- Federation (functional partitioning)
- Denormalization trade-offs
- SQL tuning basics
- **Diagrams:** Mind map, replication topology diagrams, sharding strategy flowchart, index structure diagram

### Chapter 10: Databases - NoSQL
- NoSQL categories: key-value, document, wide-column, graph
- When to use NoSQL vs SQL (decision matrix)
- Key-value stores (Redis, DynamoDB) -- use cases
- Document stores (MongoDB, CouchDB) -- schema flexibility
- Wide-column stores (Cassandra, HBase) -- time-series, analytics
- Graph databases (Neo4j) -- relationship-heavy data
- CAP theorem applied to database selection
- **Diagrams:** Mind map, NoSQL category comparison table, SQL vs NoSQL decision flowchart, data model diagrams per type

### Chapter 11: Message Queues
- Why async processing (decouple producers/consumers)
- Message queue vs event stream
- Pub/sub vs point-to-point
- Back pressure and flow control
- Exactly-once / at-least-once / at-most-once delivery
- Dead letter queues
- Tools: Kafka vs RabbitMQ vs SQS comparison
- Task queues (Celery, Sidekiq)
- **Diagrams:** Mind map, pub/sub sequence diagram, message flow with back pressure, tool comparison table

### Chapter 12: Communication Protocols
- TCP vs UDP comparison
- HTTP/1.1 vs HTTP/2 vs HTTP/3
- REST principles (resource URIs, HATEOAS, stateless)
- RPC frameworks (gRPC, Thrift, Protobuf)
- REST vs RPC comparison
- GraphQL overview (query flexibility, N+1 problem)
- WebSockets for real-time communication
- Long polling vs SSE vs WebSockets comparison
- **Diagrams:** Mind map, protocol stack diagram, REST vs RPC vs GraphQL table, WebSocket handshake sequence

## File Ownership (Exclusive)
- `part-2-building-blocks/ch09-databases-sql.md`
- `part-2-building-blocks/ch10-databases-nosql.md`
- `part-2-building-blocks/ch11-message-queues.md`
- `part-2-building-blocks/ch12-communication-protocols.md`

## Chapter Template
Same as Phase 2. Each chapter: mind map + 2+ diagrams + 1+ comparison table + key takeaway + 5 practice questions. 300-600 lines.

## Implementation Steps

### Agent A: ch09 + ch10

**ch09-databases-sql.md (500-600 lines)**
1. Mind map: SQL database ecosystem
2. ACID properties explanation
3. Normalization levels (1NF-3NF) brief
4. Indexing deep-dive with B-tree diagram
5. Master-slave replication -- sequence diagram
6. Master-master replication -- diagram + conflict resolution
7. Sharding strategies (range, hash, directory) -- flowchart + comparison table
8. Federation/functional partitioning
9. Denormalization: when and why
10. Real-world: how Uber migrated from Postgres to MySQL sharding
11. Key takeaway + 5 practice questions

**ch10-databases-nosql.md (400-500 lines)**
1. Mind map: NoSQL landscape
2. 4 categories with data model diagrams
3. SQL vs NoSQL decision matrix (large comparison table)
4. Key-value stores deep-dive (Redis, DynamoDB)
5. Document stores (MongoDB schema example)
6. Wide-column stores (Cassandra data model)
7. Graph databases (Neo4j traversal example)
8. CAP theorem applied -- which DB for which guarantee
9. Real-world: how Facebook uses TAO (graph) + Cassandra (wide-column)
10. Key takeaway + 5 practice questions

### Agent B: ch11

**ch11-message-queues.md (400-500 lines)**
1. Mind map: async processing
2. Why queues -- producer/consumer decoupling diagram
3. Queue vs stream comparison table
4. Pub/sub pattern -- sequence diagram
5. Delivery guarantees comparison table (exactly-once etc.)
6. Back pressure mechanisms with diagram
7. Dead letter queues -- flow diagram
8. Kafka vs RabbitMQ vs SQS comparison table (throughput, ordering, delivery)
9. Task queues (Celery) brief
10. Real-world: how LinkedIn uses Kafka for event streaming
11. Key takeaway + 5 practice questions

### Agent C: ch12

**ch12-communication-protocols.md (500-600 lines)**
1. Mind map: protocol landscape
2. TCP vs UDP comparison table + when to use which
3. HTTP evolution (1.1 → 2 → 3) comparison table
4. REST principles with example API design
5. RPC deep-dive -- gRPC with Protobuf example
6. REST vs RPC decision flowchart
7. GraphQL -- query example, advantages, N+1 problem
8. Real-time: WebSockets sequence diagram
9. Long polling vs SSE vs WebSockets comparison table
10. Real-world: how Slack uses WebSockets + REST fallback
11. Key takeaway + 5 practice questions

## Todo
- [x] ch09: ACID + indexing + replication diagrams
- [x] ch09: Sharding strategies + denormalization
- [x] ch10: 4 NoSQL categories with data models
- [x] ch10: SQL vs NoSQL decision matrix
- [ ] ch11: Queue patterns + delivery guarantees
- [ ] ch11: Tool comparison (Kafka/RabbitMQ/SQS)
- [ ] ch12: Protocol comparisons + REST/RPC/GraphQL
- [ ] ch12: Real-time communication patterns
- [ ] Verify all chapters 300-600 lines

## Success Criteria
- All 4 chapters complete with diagrams and tables
- SQL vs NoSQL content clearly split (no duplication between ch09/10)
- Message queue terminology consistent with ch14 (event-driven) forward reference
- Protocol terminology consistent with ch13 (microservices) forward reference

## Conflict Prevention
- Agent A: ONLY ch09 + ch10
- Agent B: ONLY ch11
- Agent C: ONLY ch12
- SQL/NoSQL split: ch09 = relational only, ch10 = non-relational only, decision matrix in ch10

## Risk Assessment
- **Medium:** ch09/ch10 overlap on replication/sharding. Mitigate: ch09 covers SQL-specific (master-slave, federation), ch10 covers NoSQL-specific (consistent hashing, gossip protocol).
- **Low:** Message queues and protocols are independent.

## Next Steps
- Phase 5 (Architecture) builds directly on these building blocks
- ch13 (Microservices) references ch06, ch11, ch12
- ch14 (Event-Driven) references ch11 heavily
- ch15 (Replication/Consistency) references ch09, ch10
