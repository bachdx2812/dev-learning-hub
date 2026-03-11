# Phase 03: Load Balancing, DNS, Monitoring & Observability

## Parallelization Info
- **Batch**: A (first batch, no prerequisites)
- **Agents**: 3 concurrent
- **File conflicts**: None. All files exclusive to this phase.

## Context Links
- Gap analysis: `plans/reports/researcher-260312-0142-content-gap-analysis.md`
- KPS: consistent hashing covered
- BBG: deployment strategies, SLA/SLO covered

## Overview
- **Priority**: HIGH
- **Status**: pending
- **Description**: Expand Part 2 building block chapters with missing networking and observability depth

## Key Insights
- ch06 (444L) briefly mentions consistent hashing; needs dedicated section + proxy patterns
- ch05 (310L) is shortest building block chapter; DNS security is a real-world gap
- ch17 (363L) is shortest Part 3 chapter; missing distributed tracing and SRE metrics

## Requirements
### Functional
- Dedicated consistent hashing section with hash ring diagram
- DNS security patterns (DNSSEC, DoH)
- OpenTelemetry and distributed tracing fundamentals
- Mermaid diagrams + comparison tables throughout

### Non-functional
- 100-300 new lines per chapter
- Quote Mermaid special characters

## File Ownership (exclusive)

| Agent | File | Path |
|-------|------|------|
| A | ch06 | `system-design/part-2-building-blocks/ch06-load-balancing.md` |
| B | ch05 | `system-design/part-2-building-blocks/ch05-dns.md` |
| C | ch17 | `system-design/part-3-architecture-patterns/ch17-monitoring-observability.md` |

---

## Agent A: ch06 - Consistent Hashing & Proxy Patterns (+220 lines)

### Implementation Steps
1. Read ch06 fully, locate existing hashing/distribution mentions
2. Add `## Consistent Hashing`:
   - Problem: naive modulo hashing causes massive redistribution on node add/remove
   - **Hash Ring**: map servers + keys to ring. Mermaid diagram showing ring with nodes and keys.
   - **Virtual Nodes**: solve uneven distribution. Each physical node -> N virtual nodes on ring.
   - Walk-through: add node -> only K/N keys remapped (vs K keys in modulo)
   - Comparison table: Modulo Hashing vs Consistent Hashing (Redistribution | Balance | Complexity)
   - Real-world usage: DynamoDB, Cassandra, Memcached, CDN edge routing
3. Add `## Proxy Patterns`:
   - **Forward Proxy**: client-side, masks client identity. Use cases: corporate filtering, geo-unblocking.
   - **Reverse Proxy**: server-side, masks server identity. Use cases: SSL termination, caching, compression.
   - Mermaid diagram: client -> forward proxy -> internet -> reverse proxy -> servers
   - Comparison table: Forward vs Reverse Proxy (Direction | Protects | Use Cases | Examples)
   - Reverse proxy vs Load Balancer vs API Gateway -- when to use which
4. Cross-reference ch07 (caching), ch08 (CDN), ch13 (API gateway)

### Success Criteria
- [ ] Hash ring Mermaid diagram
- [ ] Virtual nodes explained
- [ ] Modulo vs consistent hashing comparison table
- [ ] Forward vs reverse proxy diagram
- [ ] Proxy vs LB vs API gateway comparison
- [ ] ~220 new lines

---

## Agent B: ch05 - DNS Security (+180 lines)

### Implementation Steps
1. Read ch05 fully, locate existing DNS resolution content
2. Add `## DNS Security Threats`:
   - DNS cache poisoning / spoofing: attacker injects fake records
   - DNS amplification attacks (DDoS vector)
   - DNS tunneling: data exfiltration through DNS queries
   - Mermaid sequence diagram: DNS poisoning attack flow
3. Add `## DNSSEC (DNS Security Extensions)`:
   - Chain of trust: root -> TLD -> authoritative
   - RRSIG, DNSKEY, DS record types
   - Mermaid diagram: DNSSEC validation chain
   - Limitations: doesn't encrypt queries, only authenticates
4. Add `## DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT)`:
   - Encrypts DNS queries to prevent eavesdropping
   - Comparison table: Traditional DNS vs DNSSEC vs DoH vs DoT (Encryption | Auth | Privacy | Adoption)
   - Trade-offs: privacy vs network visibility for operators
5. Add `## DNS Failover Patterns`:
   - Health-checked DNS: Route 53 health checks
   - Failover routing: primary/secondary
   - Latency-based routing
   - Mermaid flowchart: DNS failover decision tree
6. Cross-reference ch06 (load balancing), ch08 (CDN)

### Success Criteria
- [ ] DNS attack types explained
- [ ] DNSSEC validation chain diagram
- [ ] DoH vs DoT comparison table
- [ ] DNS failover patterns with flowchart
- [ ] ~180 new lines

---

## Agent C: ch17 - OpenTelemetry, Distributed Tracing, SLA/SLO/SLI (+200 lines)

### Implementation Steps
1. Read ch17 fully, locate existing monitoring content
2. Add `## Distributed Tracing`:
   - Why: single request spans multiple services, logs alone insufficient
   - **Trace, Span, Context** concepts
   - Mermaid sequence diagram: request flow with trace/span IDs propagated across 3 services
   - Trace propagation: W3C TraceContext header format
   - Tools comparison table: Jaeger vs Zipkin vs Tempo (Storage | UI | Sampling | Integration)
3. Add `## OpenTelemetry`:
   - Three pillars unified: traces, metrics, logs
   - Architecture: SDK -> Collector -> Backend
   - Mermaid flowchart: OTel data pipeline (App+SDK -> Collector -> Export to Jaeger/Prometheus/Loki)
   - Auto-instrumentation vs manual instrumentation trade-offs
4. Add `## SLA, SLO, and SLI`:
   - **SLI** (Service Level Indicator): measurable metric (latency p99, error rate, throughput)
   - **SLO** (Service Level Objective): target for SLI (p99 < 200ms)
   - **SLA** (Service Level Agreement): contractual commitment with consequences
   - Relationship: SLI measures -> SLO targets -> SLA promises
   - Mermaid diagram: SLI -> SLO -> SLA hierarchy
   - Table: Metric Type | Example SLI | Example SLO | Measurement Method
   - Error budgets: 99.9% SLO = 43.8 min/month downtime allowed
   - Error budget calculation table for common nines (99%, 99.9%, 99.99%, 99.999%)
5. Cross-reference ch16 (reliability), ch23 (cloud-native)

### Success Criteria
- [ ] Distributed tracing concepts + sequence diagram
- [ ] Tracing tools comparison table
- [ ] OpenTelemetry architecture flowchart
- [ ] SLA/SLO/SLI definitions + hierarchy diagram
- [ ] Error budget calculation table
- [ ] ~200 new lines

---

## Conflict Prevention
- All 3 files exclusive to this phase across entire plan
- No sequential dependencies

## Risk Assessment
- **Consistent hashing diagrams** can be complex in Mermaid -- use simple flowchart, not graph
- **DNS security** may need careful fact-checking on DNSSEC record types

## Next Steps
- No downstream dependencies. Fully self-contained.
