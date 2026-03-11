# Phase 04: Cloud-Native, URL Shortener, Scalability

## Parallelization Info
- **Batch**: B (runs after Batch A completes -- no file dependency, but resource scheduling)
- **Agents**: 3 concurrent
- **File conflicts**: ch23 reused in Phase 6 (sequential dependency).

## Context Links
- Gap analysis: `plans/reports/researcher-260312-0142-content-gap-analysis.md`
- BBG: deployment strategies (5 strategies guide), distributed ID generation

## Overview
- **Priority**: HIGH (ch23), MEDIUM (ch18, ch02)
- **Status**: completed
- **Description**: Expand cloud-native with deployment strategies; add unique ID generation to ch18; add Stack Overflow case study to ch02

## Key Insights
- ch23 (629L) covers K8s but lacks deployment strategy patterns
- ch18 (684L) mentions IDs for URL shortener but no dedicated ID generation section
- ch02 (362L) would benefit from a counter-narrative case study (scale vertically first)

## File Ownership (exclusive in this phase)

| Agent | File | Path |
|-------|------|------|
| A | ch23 | `system-design/part-5-modern-mastery/ch23-cloud-native-serverless.md` |
| B | ch18 | `system-design/part-4-case-studies/ch18-url-shortener-pastebin.md` |
| C | ch02 | `system-design/part-1-fundamentals/ch02-scalability.md` |

---

## Agent A: ch23 - Deployment Strategies & GitOps (+220 lines)

### Implementation Steps
1. Read ch23 fully, locate existing K8s/deployment content
2. Add `## Deployment Strategies`:
   - **Rolling Update**: replace instances gradually. Mermaid diagram showing v1 -> v2 rollout.
   - **Blue-Green**: two identical environments, switch traffic. Mermaid diagram.
   - **Canary**: route small % to new version, monitor, expand. Mermaid sequence diagram.
   - **A/B Testing**: route by user segment, measure business metrics
   - **Shadow / Dark Launch**: mirror traffic to new version without serving responses
   - Comparison table: Strategy | Downtime | Rollback Speed | Resource Cost | Risk | Best For
3. Add `## GitOps`:
   - Principle: Git as single source of truth for infrastructure
   - Push vs Pull model (Flux/ArgoCD pull model)
   - Mermaid flowchart: developer push -> Git -> ArgoCD -> K8s cluster sync
   - Benefits: audit trail, declarative, easy rollback (git revert)
4. Cross-reference ch16 (reliability), ch17 (monitoring for canary)

### Success Criteria
- [x] 5 deployment strategies explained with diagrams
- [x] Strategy comparison table
- [x] GitOps flow diagram
- [x] ~220 new lines (+196 actual)

---

## Agent B: ch18 - Unique ID Generation (+180 lines)

### Implementation Steps
1. Read ch18 fully, locate existing ID mention in URL shortener context
2. Add `## Unique ID Generation Strategies`:
   - **UUID v4**: random 128-bit, no coordination needed
   - **Snowflake ID** (Twitter): timestamp(41) + datacenter(5) + machine(5) + sequence(12) = 64-bit
   - Mermaid diagram: Snowflake ID bit layout
   - **ULID**: lexicographically sortable, timestamp prefix + random
   - **Database auto-increment**: simple but single point of failure
   - **Database ticket server** (Flickr): centralized counter with multiple ticket DBs
   - Comparison table: Method | Sortable | Size | Coordination | Collision Risk | Performance
3. Add `## Choosing an ID Strategy`:
   - Decision flowchart (Mermaid): Need sorting? -> Need distributed? -> Need compact? -> recommendation
   - Real-world usage: Twitter (Snowflake), Instagram (Snowflake variant), Discord (Snowflake), Stripe (random prefix)
4. Cross-reference ch09 (primary keys), ch15 (distributed coordination)

### Success Criteria
- [x] 5+ ID strategies compared
- [x] Snowflake bit layout diagram
- [x] Decision flowchart
- [x] Comparison table with 6+ columns
- [x] ~180 new lines (+143 actual)

---

## Agent C: ch02 - Stack Overflow Mini Case Study (+150 lines)

### Implementation Steps
1. Read ch02 fully, locate existing scaling examples
2. Add `## Case Study: Stack Overflow - Scale Vertically First`:
   - Context: Stack Overflow serves 1.3B+ page views/month on remarkably few servers
   - Architecture: IIS + SQL Server + Redis + Elasticsearch on ~10 web servers
   - Key insight: vertical scaling + aggressive caching before horizontal
   - Comparison table: Metric | Stack Overflow | Typical "at Scale" | Difference
   - Mermaid diagram: simplified Stack Overflow architecture (LB -> Web Tier -> SQL Server + Redis + ES)
3. Add `## Lessons Learned`:
   - Don't prematurely distribute: single powerful DB can handle more than expected
   - Profile before scaling: identify actual bottlenecks
   - Caching multiplies capacity: Redis reduces DB load 10-100x
   - Monolith can work at scale with discipline
4. Cross-reference ch07 (caching strategy), ch09 (SQL at scale)

### Success Criteria
- [x] Stack Overflow architecture diagram
- [x] Metrics comparison table
- [x] Lessons that challenge premature distribution
- [x] ~150 new lines (+122 actual)

---

## Conflict Prevention
- ch23 reused in Phase 6 for Netflix CI/CD case study -- Phase 6 MUST wait
- ch18, ch02 are exclusive across all phases

## Risk Assessment
- **Stack Overflow data** may be slightly dated -- note the approximate timeframe
- **ID generation** is well-documented; risk is low

## Next Steps
- After completion, Phase 6 can add Netflix CI/CD case study to ch23
