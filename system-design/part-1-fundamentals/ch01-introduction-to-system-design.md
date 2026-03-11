---
title: "Chapter 1: Introduction to System Design"
---

# Chapter 1: Introduction to System Design

![Chapter banner](/images/ch01/banner.png)

## Mind Map

```mermaid
mindmap
  root((System Design))
    Scalability
      Vertical Scaling
      Horizontal Scaling
      Sharding
    Reliability
      Fault Tolerance
      Redundancy
      Replication
    Availability
      Uptime SLAs
      Failover
      Health Checks
    Maintainability
      Observability
      Modularity
      Documentation
    Security
      Authentication
      Authorization
      Encryption
    Efficiency
      Latency
      Throughput
      Resource Utilization
```

## Overview

System design is the process of defining the architecture, components, modules, interfaces, and data flow of a system to satisfy specified requirements. Unlike algorithm problems — which test your ability to solve well-defined puzzles with optimal code — system design asks you to reason about ambiguous, large-scale problems where there is no single correct answer. You are not writing code; you are making architectural decisions that will affect millions of users, engineering teams for years to come, and company revenue.

This chapter lays the foundation for everything that follows. We define what system design is, why distributed systems became necessary, introduce the five key properties every system must balance, and walk through a practical interview framework you can use immediately.

---

## What Is System Design?

System design is the discipline of translating requirements into a concrete technical blueprint. It covers decisions like:

- How many servers do we need?
- How is data stored, replicated, and retrieved?
- What happens when a component fails?
- How does the system behave under 10× normal load?

### System Design vs. Algorithm Design

These two disciplines are often confused early in an engineering career. The table below clarifies the distinction:

| Dimension | Algorithm / Coding Interview | System Design Interview |
|---|---|---|
| **Problem scope** | Narrow, well-defined | Broad, open-ended |
| **Answer type** | Optimal solution | Best trade-off for context |
| **Output** | Working code | Architecture diagram + rationale |
| **Skills tested** | Data structures, logic | Distributed systems, trade-offs |
| **Time horizon** | Minutes to hours | Years of operation |
| **Failure modes** | Wrong output | Cascading failures, data loss |

A coding interview asks: "Find the shortest path in this graph." A system design interview asks: "Design a URL shortener that handles 10 billion redirects per day." The latter has no single correct answer — only better or worse trade-offs given constraints.

---

## Why Distributed Systems?

### The Limits of a Single Machine

Early web applications ran on a single powerful server. As traffic grew, engineers upgraded that server — more CPU, more RAM, faster disks. This approach worked until it didn't. Every physical machine has a hardware ceiling: at some point you cannot buy a bigger box, and even before that ceiling, the cost curve turns exponential while performance gains become marginal.

Beyond cost and hardware limits, a single machine is a **single point of failure (SPOF)**. One hardware fault, one kernel panic, one misconfigured deployment — and your entire service goes down. For a consumer product with an SLA of 99.99% uptime (52 minutes of downtime per year), a single machine is simply not viable.

### Enter Distribution

Distributed systems solve these problems by spreading work and data across many machines connected by a network. The tradeoffs are real — distributed systems introduce network latency, partial failures, and consistency challenges — but the alternative (a single machine) cannot scale to internet scale. Google serves over 8.5 billion searches per day. Netflix streams to 260 million subscribers simultaneously. Amazon processes millions of transactions per hour. None of these workloads fit on one machine.

```mermaid
flowchart LR
    subgraph Single["Single Machine (Scale-Up)"]
        direction TB
        S1["Server\n32 CPU / 256GB RAM"]
        S1 -->|"Hardware Ceiling"| S2["Server\n64 CPU / 512GB RAM"]
        S2 -->|"Exponential Cost"| S3["Server\n128 CPU / 1TB RAM\n($500K+)"]
    end

    subgraph Distributed["Distributed (Scale-Out)"]
        direction TB
        D1["Server 1"] & D2["Server 2"] & D3["Server 3"]
        D1 & D2 & D3 --> LB["Load Balancer"]
    end

    Single -->|"Alternative Approach"| Distributed
```

---

## Key Properties of Well-Designed Systems

Every system design decision involves balancing five core properties. Understanding them precisely is essential before any interview or production architecture work.

### Scalability

Scalability is a system's ability to handle increased load without proportional increases in cost or latency degradation. A scalable system processes 1 million requests as gracefully as it handles 1,000 — the architecture accommodates growth. Scalability can be achieved by scaling vertically (upgrading hardware), scaling horizontally (adding machines), or both. We dedicate all of [Chapter 2](./ch02-scalability.md) to this topic.

### Reliability

Reliability is the probability that a system performs its intended function under stated conditions for a specified period. A reliable system continues operating correctly even when individual components fail. This is achieved through redundancy (no single points of failure), replication (data exists in multiple places), and graceful degradation (partial failures do not cascade). Reliability is measured as Mean Time Between Failures (MTBF) and Mean Time To Recovery (MTTR).

### Availability

Availability is the percentage of time a system is operational and accessible to users. It is closely related to reliability but specifically measures uptime. Availability is expressed as "nines":

| Availability | Downtime per Year | Downtime per Month |
|---|---|---|
| 99% ("two nines") | 3.65 days | 7.3 hours |
| 99.9% ("three nines") | 8.77 hours | 43.8 minutes |
| 99.99% ("four nines") | 52.6 minutes | 4.4 minutes |
| 99.999% ("five nines") | 5.26 minutes | 26 seconds |

High availability requires eliminating SPOFs, implementing health checks and automatic failover, and deploying across multiple availability zones or regions. Availability and consistency are in tension — a concept formalized in the CAP theorem, covered in [Chapter 3](./ch03-core-tradeoffs.md).

### Maintainability

Maintainability describes how easily engineers can understand, modify, and operate a system over time. It encompasses three dimensions: **operability** (easy to monitor and manage in production), **simplicity** (new engineers can understand the system without months of onboarding), and **evolvability** (the system can be extended or changed without major rewrites). Systems that score low on maintainability accumulate technical debt, become fragile, and eventually slow down the entire engineering organization.

### Efficiency

Efficiency measures how well a system utilizes resources to deliver results. Two key metrics capture this: **latency** (time to complete a single operation, measured in milliseconds) and **throughput** (number of operations completed per unit time, measured in requests per second). These two are often in tension — optimizing for maximum throughput may require batching operations, which increases latency for individual requests. Good system design understands and explicitly manages this trade-off.

---

## The System Design Interview

System design interviews assess your ability to reason about ambiguous large-scale problems. Unlike coding interviews with a clear correct answer, success here means demonstrating structured thinking, knowing the right questions to ask, and communicating trade-offs clearly. Use this four-step framework consistently.

```mermaid
flowchart TD
    A["START: Problem Statement"] --> B

    B["Step 1: Requirements & Constraints\n(~5 minutes)"]
    B --> B1["Functional requirements\nWhat must the system DO?"]
    B --> B2["Non-functional requirements\nScale? Latency SLA? Consistency?"]
    B --> B3["Out of scope\nWhat are we NOT building?"]
    B1 & B2 & B3 --> C

    C["Step 2: Back-of-Envelope Estimation\n(~5 minutes)"]
    C --> C1["Daily Active Users (DAU)"]
    C --> C2["Reads per second / Writes per second"]
    C --> C3["Storage needs (1 year)"]
    C --> C4["Bandwidth requirements"]
    C1 & C2 & C3 & C4 --> D

    D["Step 3: High-Level Design\n(~20 minutes)"]
    D --> D1["API design (endpoints/contracts)"]
    D --> D2["Data model (entities, schema)"]
    D --> D3["Core components diagram"]
    D1 & D2 & D3 --> E

    E["Step 4: Deep Dive\n(~10 minutes)"]
    E --> E1["Bottleneck identification"]
    E --> E2["Scaling the weakest component"]
    E --> E3["Handle edge cases / failures"]
    E --> F["DONE: Summarize trade-offs"]
```

### Step 1: Requirements & Constraints (5 minutes)

Never begin designing before understanding what you are building. Ask clarifying questions to separate:

- **Functional requirements** — the features the system must provide. "Users can shorten URLs. Users can access shortened URLs."
- **Non-functional requirements** — performance, scalability, and reliability expectations. "100 million URLs created per day. Redirects must complete in under 100ms. 99.99% availability."
- **Out of scope** — explicitly state what you are not building to manage time. "We are not building analytics dashboards or user authentication in this session."

This step prevents you from designing the wrong system and demonstrates business awareness.

### Step 2: Back-of-Envelope Estimation (5 minutes)

Translate requirements into numbers before touching architecture. This grounds your design decisions in reality. Key estimates to compute:

- **Queries per second (QPS):** `DAU × actions_per_day / 86,400 seconds`
- **Storage (1 year):** `writes_per_day × record_size × 365`
- **Bandwidth:** `QPS × average_response_size`

See [Chapter 4](./ch04-estimation.md) for detailed estimation techniques and worked examples.

### Step 3: High-Level Design (20 minutes)

Sketch the overall architecture on the whiteboard before diving into any component. Cover:

1. **API design** — define the key endpoints and their contracts. Example: `POST /api/v1/shorten` accepts `{ url: string }` and returns `{ shortCode: string }`.
2. **Data model** — define core entities and their relationships. What does a URL record look like? What indices are needed?
3. **Component diagram** — clients, load balancers, application servers, databases, caches, message queues. Draw boxes and arrows showing data flow.

Keep this high-level. Do not tune database parameters or choose between Redis data structures yet — that is Step 4.

### Step 4: Deep Dive (10 minutes)

Now investigate the most interesting or challenging aspect of your design. The interviewer will often guide this, but good candidates proactively identify bottlenecks:

- Where does the system break under the estimated load?
- How does it handle the failure of one component?
- What is the consistency/availability trade-off in the data tier?

Demonstrate depth by exploring one area thoroughly rather than skimming all areas shallowly.

### Applying the Framework: URL Shortener Example

To make the framework concrete, here is how you would apply all four steps to a common interview problem — designing a URL shortener like bit.ly.

**Step 1 — Requirements (5 min):**
- Functional: users submit a long URL and receive a short code; any user accessing the short URL is redirected to the original
- Non-functional: 100M new URLs per day, 10B redirects per day, redirects in under 100ms, 99.99% availability
- Out of scope: analytics dashboard, user accounts, custom short codes

**Step 2 — Estimation (5 min):**
- Write QPS: 100M / 86,400 ≈ 1,160 writes/sec
- Read QPS: 10B / 86,400 ≈ 115,740 reads/sec (100:1 read-write ratio)
- Storage (5 years): 100M/day × 365 × 5 × 500 bytes ≈ 91 TB
- Peak read bandwidth: 115,740 × 500 bytes ≈ 55 MB/s

**Step 3 — High-Level Design (20 min):**

```mermaid
flowchart LR
    Client["Client"] --> LB["Load Balancer"]
    LB --> AppS["App Servers\n(stateless, horizontally scaled)"]
    AppS -->|"Write"| DB["Primary DB\n(URL mappings)"]
    AppS -->|"Read"| Cache["Cache\n(Redis, hot URLs)"]
    Cache -->|"Cache miss"| DB
    AppS -->|"Static redirect"| CDN["CDN\n(cache redirect responses)"]
```

**Step 4 — Deep Dive (10 min):** The most interesting challenge is generating short codes that are unique, short, and not predictable (to prevent enumeration). Options include base62 encoding of a counter, MD5 hash truncation, or a dedicated ID generation service (Snowflake). Each has trade-offs in uniqueness guarantees, performance, and complexity.

This example demonstrates how the four-step framework transforms a vague problem statement into a structured architecture discussion in 40 minutes.

---

## Common System Design Mistakes

Understanding what not to do is as important as knowing the right patterns. These are the most common errors seen in system design interviews and production systems:

**Premature optimization:** Designing for 1 billion users before you have 1,000. Start with a simple architecture and add complexity only when a specific bottleneck is demonstrated. The best system design for a startup is usually the simplest one that works.

**Ignoring the data model:** Many candidates jump to architecture diagrams without defining the core entities and their relationships. A poorly designed data model is extremely expensive to change later and is often the root cause of scalability issues.

**Treating the database as infinitely scalable:** The database is almost always the first bottleneck in a distributed system. Candidates often scale the stateless application tier while ignoring database capacity.

**No failure handling:** Production systems encounter hardware failures, network partitions, and unexpected traffic spikes constantly. A design that only describes the happy path is incomplete. Always ask: "What happens when X fails?"

**Over-engineering:** Adding Kafka, Kubernetes, and microservices to a system that could be a simple monolith is a red flag in interviews. Interviewers want to see appropriate complexity, not maximum complexity.

---

## The System Design Learning Path

System design is a broad discipline. The chapters in this book follow a deliberate learning path:

```mermaid
flowchart TD
    P1["Part 1: Fundamentals\nCh1-4: Concepts, Scalability,\nTrade-offs, Estimation"]
    P1 --> P2

    P2["Part 2: Building Blocks\nCh5-12: Load Balancers, Caches,\nDatabases, Queues, APIs"]
    P2 --> P3

    P3["Part 3: Architecture Patterns\nCh13-17: Microservices, Event-Driven,\nReliability, Security, Observability"]
    P3 --> P4

    P4["Part 4: Case Studies\nCh18-24: URL Shortener, Social Feed,\nChat, Video Streaming, Search"]
    P4 --> P5

    P5["Part 5: Modern Mastery\nCh25-28: ML Systems, Real-Time Analytics,\nGlobal Distribution, Serverless"]
```

Each part builds on the previous. Part 1 establishes the vocabulary and mental models. Part 2 introduces the components you will compose in designs. Part 3 covers how to combine them into production-grade architectures. Part 4 applies everything to realistic interview scenarios. Part 5 addresses the cutting edge of modern distributed systems.

---

## Real-World Perspectives

### Google

Google's infrastructure is built around the principle that hardware fails constantly at scale, so software must tolerate failure transparently. Their Bigtable paper (2006) and MapReduce paper (2004) introduced the industry to distributed data processing at scale. Google Search serves billions of queries per day with sub-second response times — achieved through massive horizontal scaling, aggressive caching, and years of infrastructure optimization.

### Netflix

Netflix migrated from a monolithic DVD rental system to a microservices architecture deployed entirely on AWS. Today, Netflix runs over 700 microservices. Their chaos engineering practice (Chaos Monkey deliberately kills production servers) was born from the need to prove that the system handles failures gracefully. At peak, Netflix accounts for approximately 15% of global internet bandwidth. Their full scaling story is covered in [Chapter 2](./ch02-scalability.md#real-world-how-netflix-scaled).

### Amazon

Amazon's retail platform evolved from a monolith to a service-oriented architecture in the early 2000s — driven by Jeff Bezos's famous "API mandate" requiring all teams to communicate through service interfaces. This internal discipline eventually became AWS, now the world's largest cloud provider. Amazon's DynamoDB, built for the shopping cart, is a canonical example of trading consistency for availability and performance — a pattern covered in [Chapter 3](./ch03-core-tradeoffs.md).

---

> **Key Takeaway:** System design is not about finding the perfect architecture — it is about making informed trade-offs between scalability, reliability, availability, maintainability, and efficiency given real-world constraints. Master the four-step interview framework and practice articulating *why* you made each decision.

---

## Practice Questions

1. A startup's single-server web application is struggling under growing traffic. The CTO says "just upgrade the server." What are the limits of this approach, and what would you recommend instead?

2. Define the difference between availability and reliability. Give an example of a system that is highly available but not highly reliable.

3. You are designing a social media feed system. List five functional requirements and five non-functional requirements you would clarify in Step 1 of the interview framework.

4. A system has 99.9% availability. How many minutes of downtime per month does that allow? If the business requires 99.99%, what architectural changes would you consider?

5. Google serves 8.5 billion searches per day. Without looking up the answer, estimate the average queries per second (QPS) this represents. What does this imply about the minimum number of servers Google needs if each server handles 1,000 QPS?
