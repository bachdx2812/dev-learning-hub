# Phase 2: Part 1 - Fundamentals (Chapters 1-4)

## Context Links
- [Plan Overview](plan.md)
- [Research: Primer Analysis](research/researcher-01-primer-analysis.md) -- foundational concepts, learning path phases 1
- [Research: Taxonomy](research/researcher-02-complete-taxonomy.md) -- weeks 1-4 curriculum

## Parallelization
- **Max Concurrent Agents:** 3
- **Agent Assignment:**
  - Agent A: ch01 + ch02 (introduction flows into scalability)
  - Agent B: ch03 (core trade-offs, independent)
  - Agent C: ch04 (estimation, independent)
- **Estimated Time:** 45 min

## Overview
- **Priority:** P1
- **Status:** pending
- Foundation chapters that all later chapters reference. Must establish terminology, mental models, and estimation skills.

## Key Insights
- From primer: Performance vs Scalability, Latency vs Throughput, Availability vs Consistency form the "holy trinity" of system design thinking
- From taxonomy: FAANG emphasis on trade-off reasoning over memorization
- Estimation chapter enables all case study chapters (Part 4)
- Visual impact: diagrams improve retention 400% -- use mind maps for every chapter

## Requirements

### Chapter 1: Introduction to System Design
- What system design is and why it matters
- Distributed systems overview (single machine vs distributed)
- Key properties: scalability, reliability, availability, maintainability
- System design interview structure overview
- **Diagrams:** Mind map of system design landscape, flowchart of interview process

### Chapter 2: Scalability
- Vertical vs horizontal scaling with diagrams
- Stateless vs stateful architectures
- Database scaling preview (sharding, replication -- details in ch09/10)
- Scaling patterns: read replicas, write sharding, caching layers
- **Diagrams:** Mind map of scalability concepts, flowchart showing scaling decision tree, comparison table vertical vs horizontal

### Chapter 3: Core Trade-offs
- CAP theorem with Venn diagram
- ACID vs BASE comparison table
- Consistency models: strong, eventual, causal
- Availability patterns: failover (active-passive, active-active), replication
- Latency vs throughput trade-offs
- **Diagrams:** Mind map, CAP Venn diagram (Mermaid), consistency spectrum flowchart, ACID vs BASE table

### Chapter 4: Back-of-Envelope Estimation
- Powers of 2 reference table (1KB to 1PB)
- Latency numbers every programmer should know
- QPS/TPS estimation techniques
- Storage estimation formula
- Bandwidth estimation
- Worked example: estimate Twitter's storage needs
- **Diagrams:** Mind map, latency comparison table, estimation workflow flowchart

## File Ownership (Exclusive)
- `part-1-fundamentals/ch01-introduction-to-system-design.md`
- `part-1-fundamentals/ch02-scalability.md`
- `part-1-fundamentals/ch03-core-tradeoffs.md`
- `part-1-fundamentals/ch04-estimation.md`

## Chapter Template

```markdown
# Chapter X: Title

## Mind Map
\`\`\`mermaid
mindmap
  root((Topic))
    Subtopic A
      Detail 1
      Detail 2
    Subtopic B
      Detail 3
\`\`\`

## Overview
Introduction paragraph. Why this matters for system design.

## Core Concepts
### Concept 1
Explanation with diagram.

\`\`\`mermaid
flowchart LR
    A[Component] --> B[Component]
\`\`\`

### Concept 2
...

## How It Works
Detailed explanation with sequence/flow diagrams.

## Trade-offs & Comparisons
| Approach A | Approach B |
|-----------|-----------|
| Pros... | Pros... |
| Cons... | Cons... |

## Real-World Examples
Practical applications at companies like Google, Netflix, etc.

> **Key Takeaway:** One sentence summary of the most important insight.

## Practice Questions
1. Question about applying concepts...
2. Design question...
3. Trade-off analysis question...
```

## Implementation Steps

### Agent A: ch01 + ch02

**ch01-introduction-to-system-design.md (300-400 lines)**
1. Mind map: system design landscape (scalability, reliability, availability, maintainability, security)
2. "What is System Design" section -- define, contrast with algorithm design
3. "Why Distributed Systems" -- single machine limits, CAP preview
4. "Key Properties" -- define each with 1-paragraph explanation
5. "The System Design Interview" -- 4-step framework (requirements, estimation, design, deep-dive)
6. Real-world examples section
7. Key takeaway + 5 practice questions

**ch02-scalability.md (400-500 lines)**
1. Mind map: scalability dimensions
2. Vertical scaling -- add resources, limits, cost curve
3. Horizontal scaling -- add machines, statelessness requirement
4. Stateless vs stateful comparison table
5. Scaling patterns flowchart (when to use what)
6. Database scaling preview (link forward to ch09/10)
7. Load balancing preview (link forward to ch06)
8. Real-world: how Netflix scaled from DVD to streaming
9. Key takeaway + 5 practice questions

### Agent B: ch03

**ch03-core-tradeoffs.md (500-600 lines)**
1. Mind map: trade-off landscape
2. CAP theorem -- definition, Venn diagram, CP vs AP vs CA examples
3. ACID vs BASE -- table comparing each property
4. Consistency models -- strong/eventual/causal with sequence diagrams showing each
5. Availability patterns -- active-passive failover diagram, active-active diagram
6. Latency vs throughput -- definition, relationship graph
7. Performance vs scalability -- when they conflict
8. Real-world: DynamoDB (AP), Spanner (CP), traditional RDBMS (CA)
9. Key takeaway + 5 practice questions

### Agent C: ch04

**ch04-estimation.md (400-500 lines)**
1. Mind map: estimation toolkit
2. Powers of 2 table (byte → petabyte)
3. Latency numbers table (L1 cache → cross-continent roundtrip)
4. QPS estimation technique with formula
5. Storage estimation technique with formula
6. Bandwidth estimation technique
7. Worked example: Twitter storage estimation (step by step)
8. Worked example: YouTube bandwidth estimation
9. Common estimation mistakes to avoid
10. Key takeaway + 5 practice questions

## Todo
- [x] ch01: Mind map + overview + core concepts
- [x] ch01: Interview framework section + practice questions
- [x] ch02: Scaling concepts with diagrams
- [x] ch02: Scaling patterns + real-world examples
- [ ] ch03: CAP theorem with Venn diagram
- [ ] ch03: ACID vs BASE + consistency models
- [ ] ch03: Availability patterns + practice questions
- [ ] ch04: Reference tables (powers of 2, latency)
- [ ] ch04: Estimation techniques with worked examples
- [x] Verify ch01 + ch02 line counts within target ranges

## Success Criteria
- All 4 chapters complete with mind maps, diagrams, tables, practice questions
- Each chapter 300-600 lines
- Terminology consistent across chapters (same definitions for CAP, consistency, etc.)
- Forward references to later chapters use correct filenames

## Conflict Prevention
- Agent A writes ONLY ch01 + ch02
- Agent B writes ONLY ch03
- Agent C writes ONLY ch04
- No agent modifies README.md or any other chapter file

## Risk Assessment
- **Medium:** Terminology consistency across 3 parallel agents. Mitigate by defining key terms in ch01 first (Agent A starts ch01 before ch02).
- **Low:** Chapter length targets -- Mermaid diagrams + tables naturally fill 300-600 lines.

## Next Steps
- Phase 3 begins after all 4 chapters validated
- Part 2 chapters will reference Part 1 terminology
