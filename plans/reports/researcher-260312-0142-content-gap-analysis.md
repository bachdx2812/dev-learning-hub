# Research Report: Content Gap Analysis

## Executive Summary

Compared our 25-chapter handbook against karanpratapsingh/system-design (KPS) and ByteByteGoHq/system-design-101 (BBG). Our handbook covers most foundational topics but has significant gaps in **depth of specific patterns**, **real-world case study breadth**, **payment/fintech systems**, and **security deep-dives**. Both reference repos provide more granular coverage of certain topics that our chapters gloss over.

**Key finding:** Our content is NOT shallow across the board — it's uneven. Case studies (Part 4) and Building Blocks (Part 2) are reasonably deep. The gaps are in **missing topics entirely** and **specific patterns that deserve their own sections**.

## Research Methodology
- Sources: 2 GitHub repos (KPS ~50 topics, BBG ~300+ visual articles)
- Our handbook: 25 chapters, 13,479 lines, 198 Mermaid diagrams, 1,334 table rows
- Comparison method: Topic-by-topic mapping

---

## Gap Analysis

### Category 1: MISSING TOPICS (not covered at all)

| Topic | Source | Priority | Action |
|---|---|---|---|
| **PACELC Theorem** | KPS | HIGH | Add to ch03 (Core Trade-offs) — extends CAP with latency/consistency trade-off |
| **Consistent Hashing** (dedicated) | KPS, BBG | HIGH | Currently mentioned briefly in ch06/ch09 — needs standalone deep section |
| **Distributed Transactions** (2PC/3PC/Saga) | KPS | HIGH | ch14 mentions event sourcing but lacks 2PC/3PC protocol detail |
| **Service Discovery** | KPS | HIGH | ch13 mentions it but no deep-dive (Consul, etcd, Eureka) |
| **Proxy** (Forward vs Reverse) | KPS, BBG | MEDIUM | Not covered — BBG has reverse proxy vs API gateway vs LB comparison |
| **N-tier Architecture** | KPS | MEDIUM | Basic pattern not explicitly covered |
| **Enterprise Service Bus (ESB)** | KPS | LOW | Legacy pattern, brief mention sufficient |
| **Payment Systems** | BBG (20+ articles) | MEDIUM | Not covered at all — VISA processing, payment reconciliation, double-payment prevention |
| **Unique ID Generation** (Snowflake, UUID, TSID) | BBG | HIGH | Only mentioned in ch18 URL shortener — needs dedicated section |
| **B-Tree vs LSM-Tree** | BBG | MEDIUM | ch09 mentions B-tree indexing but doesn't compare with LSM-Tree |
| **Database Locking** (Pessimistic vs Optimistic) | BBG | MEDIUM | Not covered |
| **Change Data Capture (CDC)** | BBG | MEDIUM | Not covered — important for event-driven systems |
| **Distributed Locks** | BBG | MEDIUM | Not covered |
| **SSO / OAuth 2.0 / JWT deep-dive** | KPS, BBG | HIGH | ch16 covers auth briefly but lacks protocol flow detail |
| **Deployment Strategies** (Blue-Green, Canary, Rolling) | BBG | MEDIUM | ch23 mentions K8s but lacks deployment pattern detail |

### Category 2: TOPICS COVERED BUT TOO SHALLOW

| Our Chapter | Gap | What to Add |
|---|---|---|
| **ch03 Core Trade-offs** | CAP theorem is high-level | Add PACELC, real DB mapping (which DBs are PA/EL, PC/EC), practical decision flowchart |
| **ch05 DNS** | Missing DNS security | Add DNSSEC, DNS-over-HTTPS, DNS poisoning attacks, DNS failover patterns |
| **ch09 SQL Databases** | Index internals shallow | Add B-Tree vs LSM-Tree deep-dive, covering indexes, partial indexes, GIN/GiST |
| **ch09 SQL Databases** | Transactions shallow | Add isolation levels (Read Uncommitted → Serializable), MVCC, distributed transactions |
| **ch13 Microservices** | Service discovery brief | Add Consul/etcd/Eureka comparison, client-side vs server-side discovery, health check patterns |
| **ch14 Event-Driven** | Missing Saga pattern detail | Add orchestration vs choreography Sagas, compensation logic, failure handling |
| **ch15 Replication** | Consensus shallow | Add Raft algorithm step-by-step, leader election detail, log replication mechanics |
| **ch16 Security** | Auth protocols brief | Add OAuth 2.0 flows (auth code, PKCE, client credentials), JWT anatomy, session vs token comparison |
| **ch16 Security** | Rate limiting brief | Add token bucket, leaky bucket, sliding window algorithms with diagrams |
| **ch17 Monitoring** | Missing distributed tracing detail | Add OpenTelemetry, Jaeger, trace propagation, span correlation |
| **ch23 Cloud-Native** | Deployment strategies missing | Add blue-green, canary, rolling, A/B deployment patterns |

### Category 3: REAL-WORLD CASE STUDIES GAP

BBG has 30+ real-world architecture breakdowns. KPS covers 5. We cover 5.

**Missing high-value case studies from BBG:**

| System | Why Important | Source |
|---|---|---|
| Discord message storage | Different from WhatsApp — Cassandra → ScyllaDB migration | BBG |
| Stack Overflow architecture | Single-server scaling philosophy | BBG |
| Figma's Postgres scaling | Horizontal scaling a relational DB | BBG |
| Shopify payment resilience | Payment system design patterns | BBG |
| Slack message journey | Real-time messaging variant | BBG |
| Google Maps / proximity service | Location-based service design | BBG |
| Stock exchange / low-latency | Extreme performance requirements | BBG |
| McDonald's event-driven | Non-tech company EDA adoption | BBG |

### Category 4: CONTENT FORMAT GAPS

| Format | KPS | BBG | Ours | Gap |
|---|---|---|---|---|
| Excalidraw diagrams | 30+ | - | - | We use Mermaid (fine) |
| Visual infographics | - | 300+ | 25 banners | BBG is primarily visual — each topic as an infographic |
| Comparison tables | Some | Many | 1,334 rows | We're strong here |
| Code examples | Few | Few | Some | All similar |
| Real-world examples | 5 case studies | 30+ mini-studies | 5 deep studies | We go deeper but narrower |

---

## Priority Recommendations

### Immediate (HIGH priority — content completeness)

1. **Expand ch03**: Add PACELC theorem, practical CAP/PACELC DB mapping table
2. **Expand ch09**: Add isolation levels, B-Tree vs LSM-Tree, database locking
3. **Expand ch14**: Add Saga pattern (orchestration vs choreography), distributed transactions (2PC/3PC)
4. **Expand ch16**: Add OAuth 2.0 complete flows, JWT deep-dive, rate limiting algorithms (token bucket, sliding window)
5. **Expand ch13**: Add service discovery deep-dive (Consul vs etcd vs Eureka)
6. **Add to ch15**: Raft algorithm step-by-step walkthrough
7. **Add consistent hashing dedicated section** to ch06 or ch09

### Medium Priority (content depth)

8. Add unique ID generation section (Snowflake, UUID, ULID, TSID) — fits ch18 or new
9. Expand ch23 with deployment strategies (blue-green, canary, rolling)
10. Add CDC (Change Data Capture) to ch14 event-driven
11. Add DNS security to ch05
12. Add proxy patterns (forward/reverse) — fits ch06 or ch08
13. Add distributed locks to ch15

### Lower Priority (nice to have)

14. Add 3-5 mini case studies from BBG list (Discord, Stack Overflow, Figma)
15. Payment system basics (VISA flow, reconciliation)
16. Stock exchange / low-latency design

---

## Unresolved Questions

1. Should we add new chapters (e.g., ch26-payment-systems) or expand existing chapters?
2. How deep should case studies go? Our 5 deep-dives (~700L each) vs BBG's 30 brief ones?
3. Should we prioritize visual infographics (BBG style) or keep our text+diagram approach?
