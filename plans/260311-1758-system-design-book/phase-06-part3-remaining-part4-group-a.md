# Phase 6: Part 3 Remaining + Part 4 Group A (Chapters 16-19)

## Context Links
- [Plan Overview](plan.md)
- [Research: Primer](research/researcher-01-primer-analysis.md) -- security, Pastebin, Twitter scenarios
- [Research: Taxonomy](research/researcher-02-complete-taxonomy.md) -- operational concerns, case studies

## Parallelization
- **Max Concurrent Agents:** 3
- **Agent Assignment:**
  - Agent A: ch16 (Security & Reliability) + ch17 (Monitoring & Observability)
  - Agent B: ch18 (URL Shortener & Pastebin)
  - Agent C: ch19 (Social Media Feed)
- **Estimated Time:** 50 min

## Overview
- **Priority:** P1
- **Status:** pending
- Completes Part 3 with cross-cutting concerns (security, monitoring), then starts case studies applying all previous concepts.

## Key Insights
- From taxonomy: biggest gap in primers is operational concerns (monitoring, graceful degradation)
- Security/reliability are cross-cutting -- touch every layer
- URL shortener is the #1 most common system design interview question
- Social media feed (Twitter/Instagram) is #2 most common

## Requirements

### Chapter 16: Security & Reliability
- Authentication vs authorization
- OAuth 2.0 / JWT token flow
- Encryption: TLS, at-rest encryption
- Rate limiting algorithms (token bucket, sliding window)
- DDoS mitigation strategies
- Input validation (XSS, SQL injection, CSRF)
- Reliability patterns: retries, timeouts, bulkhead, graceful degradation
- Disaster recovery: RPO/RTO, backup strategies
- **Diagrams:** Mind map, OAuth2 sequence diagram, rate limiting algorithm flowcharts, reliability patterns diagram

### Chapter 17: Monitoring & Observability
- Three pillars: metrics, logs, traces
- Metrics types: counters, gauges, histograms
- Distributed tracing (correlation IDs, span trees)
- Log aggregation pipeline (collection → storage → analysis)
- Alerting strategies (SLIs, SLOs, SLAs, error budgets)
- Health checks and readiness probes
- Tools overview: Prometheus, Grafana, ELK, Jaeger
- **Diagrams:** Mind map, observability pipeline flowchart, distributed trace sequence diagram, SLO/SLA relationship diagram

### Chapter 18: URL Shortener & Pastebin
- Requirements gathering (functional + non-functional)
- Capacity estimation (QPS, storage for 5 years)
- High-level design with system diagram
- URL encoding: base62, MD5/SHA hash + collision handling
- Database schema (SQL vs NoSQL choice with reasoning)
- Read-heavy optimization (caching layer, CDN)
- Expiration and cleanup
- Analytics tracking (click counts, geo)
- Deep dive: consistent hashing for distributed key generation
- **Diagrams:** Mind map, system architecture diagram, URL encoding flowchart, read path sequence diagram, database schema

### Chapter 19: Social Media Feed
- Requirements (post, follow, timeline, notifications)
- Capacity estimation (users, posts/day, fanout)
- Fan-out on write vs fan-out on read comparison
- Hybrid approach for celebrity accounts
- Feed ranking algorithm overview
- Database choices: posts (SQL), timeline cache (Redis), media (object storage)
- Notification system design
- Deep dive: sharding user data, feed generation pipeline
- **Diagrams:** Mind map, system architecture, fan-out comparison diagrams, feed generation pipeline, notification flow

## File Ownership (Exclusive)
- `part-3-architecture-patterns/ch16-security-reliability.md`
- `part-3-architecture-patterns/ch17-monitoring-observability.md`
- `part-4-case-studies/ch18-url-shortener-pastebin.md`
- `part-4-case-studies/ch19-social-media-feed.md`

## Chapter Template
Same as previous phases. Case study chapters (18-19) follow interview-style structure:
```markdown
# Chapter X: [System] Design

## Mind Map

## Overview
What we're building, why it's a classic interview question.

## Step 1: Requirements & Constraints
### Functional Requirements
### Non-Functional Requirements
### Capacity Estimation

## Step 2: High-Level Design
System architecture diagram.

## Step 3: Detailed Design
### Component A
### Component B
(With diagrams for each)

## Step 4: Deep Dives
### Scaling Bottleneck
### Trade-off Discussion

## Trade-offs & Comparisons

> **Key Takeaway:** ...

## Practice Questions
```

## Implementation Steps

### Agent A: ch16 + ch17

**ch16-security-reliability.md (500-600 lines)**
1. Mind map: security & reliability landscape
2. AuthN vs AuthZ explanation
3. OAuth2 flow -- sequence diagram (authorization code grant)
4. JWT structure and validation
5. TLS handshake diagram (simplified)
6. Rate limiting: token bucket + sliding window log algorithms with flowcharts
7. Input validation checklist (XSS, SQLi, CSRF)
8. Reliability patterns: retry with exponential backoff, circuit breaker reference to ch13, bulkhead
9. Graceful degradation strategies
10. Disaster recovery: RPO vs RTO table, backup strategies
11. Key takeaway + 5 practice questions

**ch17-monitoring-observability.md (400-500 lines)**
1. Mind map: observability ecosystem
2. Three pillars comparison table (metrics vs logs vs traces)
3. Metrics types with examples (counter, gauge, histogram)
4. Distributed tracing -- sequence diagram with correlation IDs
5. Log aggregation pipeline flowchart
6. SLI → SLO → SLA relationship diagram
7. Error budgets concept
8. Health checks and readiness probes
9. Tool comparison table (Prometheus, Grafana, ELK, Jaeger, Datadog)
10. Real-world: how Google uses SRE error budgets
11. Key takeaway + 5 practice questions

### Agent B: ch18

**ch18-url-shortener-pastebin.md (500-600 lines)**
1. Mind map: URL shortener system
2. Requirements section (functional: shorten, redirect, analytics; non-functional: low latency, high availability)
3. Capacity estimation (100M URLs/day, 10:1 read:write, 5-year storage)
4. High-level architecture diagram (client → LB → app servers → DB + cache)
5. URL encoding: base62 math, hash + collision handling flowchart
6. Database design: key-value vs SQL table schema
7. Read path sequence diagram (check cache → DB → redirect)
8. Write path sequence diagram (generate key → store → return)
9. Caching layer design (Redis for hot URLs)
10. Expiration and cleanup (TTL, cron job)
11. Analytics: click tracking, async write to analytics DB
12. Deep dive: consistent hashing for key distribution
13. Key takeaway + 5 practice questions

### Agent C: ch19

**ch19-social-media-feed.md (500-600 lines)**
1. Mind map: social media feed system
2. Requirements (post CRUD, follow, timeline, notifications, 500M users)
3. Capacity estimation (1B posts/day, fanout factor, storage)
4. High-level architecture diagram
5. Fan-out on write -- diagram (post → push to all followers' caches)
6. Fan-out on read -- diagram (pull from all followed users at read time)
7. Comparison table: write vs read fanout
8. Hybrid approach for celebrities (>1M followers use pull, others use push)
9. Feed ranking: chronological vs algorithmic
10. Database choices diagram (posts SQL, timelines Redis, media S3)
11. Notification system -- flow diagram
12. Deep dive: sharding strategy for user data
13. Key takeaway + 5 practice questions

## Todo
- [x] ch16: OAuth2 + rate limiting diagrams
- [x] ch16: Reliability patterns + disaster recovery
- [x] ch17: Three pillars + distributed tracing
- [x] ch17: SLI/SLO/SLA + tool comparison
- [ ] ch18: Full URL shortener design with all diagrams
- [ ] ch18: Capacity estimation + encoding flowchart
- [ ] ch19: Fan-out comparison + hybrid approach
- [ ] ch19: Feed ranking + notification system
- [ ] Verify all chapters 300-600 lines

## Success Criteria
- Part 3 chapters complete cross-cutting concern coverage
- Case study chapters follow interview-style 4-step structure
- Case studies reference building blocks by chapter (e.g., "see ch07 for caching details")
- Capacity estimations use techniques from ch04

## Conflict Prevention
- Agent A: ONLY ch16 + ch17
- Agent B: ONLY ch18
- Agent C: ONLY ch19
- Security in ch16 is general; case studies may mention security briefly with back-reference

## Risk Assessment
- **Medium:** Case study chapters risk being too long (many subsections). Mitigate: strict 600-line cap, link to building block chapters instead of re-explaining.
- **Low:** Security/monitoring are independent topics.

## Next Steps
- Phase 7 continues case studies (ch20-22) + starts Part 5 (ch23)
