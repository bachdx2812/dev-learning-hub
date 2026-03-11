# Phase 3: Part 2 Building Blocks Group A (Chapters 5-8)

## Context Links
- [Plan Overview](plan.md)
- [Research: Primer](research/researcher-01-primer-analysis.md) -- DNS, CDN, Load Balancing, Reverse Proxy
- [Research: Taxonomy](research/researcher-02-complete-taxonomy.md) -- weeks 5-8 infrastructure components

## Parallelization
- **Max Concurrent Agents:** 3
- **Agent Assignment:**
  - Agent A: ch05 (DNS) + ch06 (Load Balancing)
  - Agent B: ch07 (Caching)
  - Agent C: ch08 (CDN)
- **Estimated Time:** 45 min

## Overview
- **Priority:** P1
- **Status:** pending
- Infrastructure layer: networking and content delivery. These are foundational building blocks referenced by architecture chapters.

## Key Insights
- DNS, LB, caching, CDN are the "front door" of every distributed system
- From primer: L4 vs L7 load balancing is frequent interview topic
- Caching is cross-cutting -- touches every layer (client, CDN, server, DB)
- CDN overlaps with caching; distinguish by scope (edge network vs application layer)

## Requirements

### Chapter 5: DNS
- How DNS works (recursive resolution, hierarchy)
- Record types: A, AAAA, CNAME, MX, NS, TXT
- DNS routing strategies: round-robin, weighted, latency-based, geolocation
- DNS as load balancer (limitations)
- TTL and caching at DNS level
- DNS failover and health checks
- **Diagrams:** Mind map, DNS resolution sequence diagram, routing strategy flowchart

### Chapter 6: Load Balancing
- Why load balancing (single point of failure, horizontal scaling)
- L4 vs L7 load balancing comparison
- Algorithms: round-robin, least connections, IP hash, weighted, consistent hashing
- Active-passive vs active-active failover
- Health checks and circuit breaking
- Reverse proxy concepts (SSL termination, compression)
- **Diagrams:** Mind map, L4 vs L7 flowchart, algorithm comparison table, failover diagram

### Chapter 7: Caching
- Cache hierarchy: client, CDN, reverse proxy, application, database
- Caching strategies: cache-aside, read-through, write-through, write-behind, refresh-ahead
- Cache invalidation (TTL, event-based, manual)
- Eviction policies: LRU, LFU, FIFO
- Cache stampede / thundering herd problem
- Tools: Redis, Memcached comparison
- **Diagrams:** Mind map, cache hierarchy flowchart, strategy comparison table, cache-aside sequence diagram

### Chapter 8: CDN
- How CDNs work (edge servers, PoPs)
- Push vs Pull CDN models
- Origin shielding
- TTL and cache invalidation at edge
- CDN for static vs dynamic content
- Multi-CDN strategies
- **Diagrams:** Mind map, CDN request flow diagram, push vs pull comparison table

## File Ownership (Exclusive)
- `part-2-building-blocks/ch05-dns.md`
- `part-2-building-blocks/ch06-load-balancing.md`
- `part-2-building-blocks/ch07-caching.md`
- `part-2-building-blocks/ch08-cdn.md`

## Chapter Template
Same template as Phase 2. Each chapter must include:
1. Mind map (Mermaid mindmap)
2. At least 2 architecture/flow diagrams (Mermaid flowchart/sequence)
3. At least 1 comparison table
4. Key takeaway blockquote
5. 5 practice questions
6. 300-600 lines

## Implementation Steps

### Agent A: ch05 + ch06

**ch05-dns.md (300-400 lines)**
1. Mind map: DNS ecosystem
2. "How DNS Works" -- recursive resolution with sequence diagram
3. Record types table with examples
4. Routing strategies with flowchart decision tree
5. DNS caching and TTL explanation
6. DNS failover patterns
7. Real-world: how Cloudflare DNS handles billions of queries
8. Key takeaway + 5 practice questions

**ch06-load-balancing.md (400-500 lines)**
1. Mind map: load balancing landscape
2. Why LB matters -- single point of failure diagram
3. L4 vs L7 comparison table + flowchart
4. Algorithm deep-dive with visual for each (round-robin, least-conn, consistent hashing)
5. Active-passive vs active-active failover diagrams
6. Reverse proxy section (SSL termination, compression, static serving)
7. Health checks and circuit breaking
8. Real-world: AWS ELB/ALB/NLB comparison
9. Key takeaway + 5 practice questions

### Agent B: ch07

**ch07-caching.md (500-600 lines)**
1. Mind map: caching strategies and layers
2. Cache hierarchy diagram (5 layers)
3. Cache-aside pattern -- sequence diagram
4. Read-through / write-through -- sequence diagrams
5. Write-behind (write-back) -- sequence diagram with async flush
6. Refresh-ahead pattern
7. Eviction policies comparison table (LRU, LFU, FIFO)
8. Cache invalidation strategies
9. Cache stampede problem + solutions (locking, probabilistic early expiration)
10. Redis vs Memcached comparison table
11. Key takeaway + 5 practice questions

### Agent C: ch08

**ch08-cdn.md (300-400 lines)**
1. Mind map: CDN architecture
2. How CDNs work -- request flow diagram (user → edge → origin)
3. Push vs Pull comparison table
4. Origin shielding explanation with diagram
5. Cache invalidation at edge (purge, TTL, versioned URLs)
6. Static vs dynamic content strategies
7. Multi-CDN failover
8. Real-world: Netflix Open Connect, Cloudflare network
9. Key takeaway + 5 practice questions

## Todo
- [x] ch05: DNS resolution diagram + record types table
- [x] ch05: Routing strategies + practice questions
- [x] ch06: L4/L7 comparison + algorithms
- [x] ch06: Failover patterns + reverse proxy
- [ ] ch07: Cache hierarchy + all 5 strategy diagrams
- [ ] ch07: Eviction policies + Redis vs Memcached
- [x] ch08: CDN flow diagram + push vs pull
- [x] ch08: Origin shielding + real-world examples
- [x] Verify ch05 (308 lines) + ch06 (442 lines) within 300-600 range

## Success Criteria
- All 4 chapters complete with mind maps, diagrams, tables, practice questions
- Each chapter 300-600 lines
- No circular references between chapters in this phase
- Forward references to ch09-12 use correct filenames

## Conflict Prevention
- Agent A: ONLY ch05 + ch06
- Agent B: ONLY ch07
- Agent C: ONLY ch08
- Caching (ch07) and CDN (ch08) may both discuss edge caching; ch07 focuses on application/server caching, ch08 focuses on edge/network caching

## Risk Assessment
- **Medium:** Caching/CDN content overlap. Mitigate by clear scope boundaries above.
- **Low:** DNS and LB are highly independent topics.

## Next Steps
- Phase 4 begins after validation
- Database chapters (ch09-10) will reference caching strategies from ch07
