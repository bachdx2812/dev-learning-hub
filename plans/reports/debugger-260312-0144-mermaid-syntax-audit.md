# Mermaid Syntax Audit — All 25 Chapters

**Date:** 2026-03-12
**Scope:** `system-design/` — 25 chapter markdown files
**Blocks audited:** ~180 mermaid blocks total

---

## Executive Summary

- **2 files** have diagrams that will fail to parse entirely (ch05, ch21)
- **~12 files** have issues that cause degraded rendering (partial failure, missing text, garbled labels)
- **~8 files** have cosmetic issues (long labels, orphan nodes, unicode chars that may or may not render)
- Remaining files are clean

---

## SEVERITY 1 — WILL BREAK (diagram fails to parse / render entirely)

### ch05-dns.md — sequenceDiagram, lines ~66–90

**Issue:** `<br/>` HTML tag inside `participant ... as ...` declarations.
Mermaid does not support HTML in participant alias text — the diagram will fail to render.

```
participant R as Recursive Resolver<br/>(ISP / 8.8.8.8)
participant TLD as TLD Name Server<br/>(.com)
participant AUTH as Authoritative Server<br/>(example.com)
```

**Fix:** Replace `<br/>` with `\n` (which Mermaid supports in quoted aliases), or split the alias to a single line:
```
participant R as "Recursive Resolver (ISP / 8.8.8.8)"
participant TLD as "TLD Name Server (.com)"
participant AUTH as "Authoritative Server (example.com)"
```

---

### ch21-video-streaming-platform.md — graph TB (CDN distribution diagram), lines ~426–456

**Issue:** 4 subgraph declarations with unquoted names containing spaces and/or em-dashes. Mermaid requires subgraph names with spaces to be quoted.

```
subgraph Origin Region us-east-1
subgraph CDN Edge PoP — North America
subgraph CDN Edge PoP — Europe
subgraph CDN Edge PoP — Asia
```

**Fix:** Quote all subgraph names:
```
subgraph "Origin Region us-east-1"
subgraph "CDN Edge PoP — North America"
subgraph "CDN Edge PoP — Europe"
subgraph "CDN Edge PoP — Asia"
```

---

## SEVERITY 2 — LIKELY RENDERING ISSUES (may break or silently mangle labels)

### ch03-core-tradeoffs.md — flowchart TD (Active/Passive HA diagram), lines ~324–338

**Issue:** Emoji characters in **unquoted** `[]` node labels. Mermaid rendering of emoji in unquoted labels is version-dependent; many renderers fail.

```
Active[Active Server\n✅ Handling traffic]
Passive[Passive Server\n⏸ Standby]
ActiveFail[Active Server\n💀 Failed]
```

Also in a sequenceDiagram:
```
R1->>L: ✅ Acknowledged
```

**Fix:** Quote labels containing emoji: `Active["Active Server\n✅ Handling traffic"]`

---

### ch09-databases-sql.md — multiple graph LR/TD blocks

**Issue 1** (graph LR, master-master replication): Colon in unquoted label:
```
App1[App: Region A]
```
Colons inside unquoted `[]` labels are treated as label separators in some Mermaid versions.

**Issue 2** (graph TD, sharding): Slash in unquoted label:
```
App[Application / Shard Router]
```

**Issue 3** (graph TD, sharding strategies): Unicode arrow and en-dash in unquoted label:
```
RB[Range-Based\ne.g. user_id 0–999k → Shard 1]
```
The `→` and `–` characters can cause parse failures in strict Mermaid environments.

**Fix:** Quote all affected labels:
```
App1["App: Region A"]
App["Application / Shard Router"]
RB["Range-Based\ne.g. user_id 0–999k → Shard 1"]
```

---

### ch10-databases-nosql.md — graph LR/TD blocks

**Issue 1**: Colon in unquoted label:
```
Product1[Product: Shoes]
```

**Issue 2**: Question mark in unquoted label:
```
Rec[Recommend to Carol?]
```

**Fix:** Quote labels: `Product1["Product: Shoes"]`, `Rec["Recommend to Carol?"]`

---

### ch11-message-queues.md — graph TD (Kafka architecture), lines ~200–250

**Issue:** Em-dash in **unquoted** `[]` labels across multiple nodes:
```
T1P0[Topic A — Partition 0 LEADER]
T1P1[Topic A — Partition 1 FOLLOWER]
T2P0L[Topic B — Partition 0 LEADER]
```
(and similar for all partition nodes)

Em-dashes in unquoted labels cause parse errors in stricter Mermaid versions.

**Fix:** Quote all affected labels: `T1P0["Topic A — Partition 0 LEADER"]`

---

### ch12-communication-protocols.md — sequenceDiagram (RPC/gRPC), line ~273

**Issue:** `<br/>` HTML tag inside a `Note over` declaration:
```
Note over CS: Serialize arguments<br/>(marshal to bytes)
```

**Fix:** Remove `<br/>` — Mermaid sequenceDiagram notes do not support HTML. Use a plain space or abbreviate:
```
Note over CS: Serialize arguments (marshal to bytes)
```

---

### ch17-monitoring-observability.md

**Issue 1** (sequenceDiagram, line ~143): `<br/>` in `Note over`:
```
Note over GW,DB: Jaeger/Zipkin reconstructs the span tree<br/>from Trace-ID + parent Span-IDs
```

**Fix:** Remove `<br/>`:
```
Note over GW,DB: Jaeger/Zipkin reconstructs the span tree from Trace-ID + parent Span-IDs
```

**Issue 2** (graph TD, SLI/SLO/SLA diagram, line ~227): `<` character inside a quoted label:
```
SLI["SLI — Service Level Indicator\nActual measurement\ne.g., fraction of requests < 200ms"]
```
Angle brackets inside quoted labels are escaped in modern Mermaid but can break in older renderers or strict HTML contexts. Minimal risk but worth noting.

**Fix (optional):** Use `&lt;` or rephrase: `under 200ms`

---

### ch19-social-media-feed.md — flowchart TD (fan-out decision diagram)

**Issue 1**: `>` inside `{}` diamond node (unquoted):
```
CHECK{"author follower\ncount > 10K?"}
```
`>` in unquoted diamond labels can be interpreted as HTML entity or arrow in some parsers.

**Fix:** The label is already in quotes (`{" "}`), so this is safe in modern Mermaid. Low risk — verify renders correctly.

**Issue 2 (cosmetic/long label)**: `SMALL_FAN` node label is ~180 characters with bullet points, colons, and multi-line indentation. Exceeds the ~60 char visual limit significantly — text will be truncated or overflow the node box in screenshots.

---

### ch20-chat-messaging-system.md — flowchart TD (group chat fan-out)

**Same `SMALL_FAN` long-label issue** as ch19 — copied or nearly identical node with ~180-char bullet-point label.

---

## SEVERITY 3 — COSMETIC / MINOR ISSUES

### ch08-cdn.md — graph TB

**Issue:** Orphan note node with no edges (displays as disconnected box):
```
Note1["Failover latency:..."]
```
Not a parse error, but creates visual noise in the diagram.

---

### ch10-databases-nosql.md — graph LR (Cassandra ring)

**Issue:** Orphan note node:
```
Note1[Replication Factor = 3]
```

---

### ch11-message-queues.md — flowchart LR

**Issue:** Orphan note node:
```
Note["Retry with exponential backoff..."]
```

---

### ch13-microservices.md — stateDiagram-v2 (circuit breaker)

**Issue:** `\n` newline escape in stateDiagram-v2 transition label — will render literally as `\n` not as a line break:
```
Closed --> Open : Failure threshold exceeded\n(e.g. 50% errors in 10s window)
```
Also contains `%` character in label which is safe but unusual.

**Fix:** Remove `\n` and split the label or abbreviate:
```
Closed --> Open : Failure threshold exceeded (50% errors / 10s)
```

---

### ch15-data-replication-consistency.md — graph TB

**Issue:** Unicode `→` arrow in unquoted node labels:
```
Note1[W=2 reached → write confirmed]
Note2[R=2 reached → return highest version v2]
```
Unicode arrows in unquoted labels may render incorrectly. Low risk in modern Mermaid but inconsistent.

**Fix:** Quote labels: `Note1["W=2 reached → write confirmed"]`

---

### ch04-estimation.md — flowchart TD (latency hierarchy)

**Issue:** En-dash `–` and emoji `⚡` in quoted label with `classDef`:
```
A["⚡ Nanoseconds\n0.5ns – 100ns\nL1 Cache, RAM"]:::ns
```
Quoted label with classDef is valid syntax; the `–` en-dash and `⚡` emoji are low-risk in modern renderers. Cosmetic only.

---

### ch06-load-balancing.md — flowchart TD

**Issue:** `✗` in a quoted label:
```
B3["Server 3\n(unhealthy) ✗"]
```
Quoted label — low risk. Cosmetic.

---

### ch22-ride-sharing-geospatial.md — CLEAN

No issues found. All subgraphs quoted, all special chars in quoted labels, sequences use standard syntax, stateDiagram-v2 transitions are clean. Parallel `par`/`and`/`end` used correctly.

---

### ch23-cloud-native-serverless.md — CLEAN with minor note

**Issue (minor):** In `graph TB` (Kubernetes control plane), unquoted node labels contain colons and newlines:
```
API[API Server\nkube-apiserver\nAll state flows through here]
ETCD[(etcd\nDistributed KV store\nCluster state)]
```
Colons in bare `[]` with `\n` — works in current Mermaid but is fragile. Low risk.

The Lambda flowchart has a floating `note1` node:
```
note1["Container kept warm\nfor ~15 minutes after invocation"]
WARM -.-> note1
```
This node has an edge (dashed), so not orphaned — but uses lowercase `note1` as node ID which is fine.

**Gantt block:** `dateFormat X` with `axisFormat %s` — valid for numeric axis. Cosmetic: `%s` displays seconds which looks odd for the labels used, but renders without error.

---

### ch24-ml-systems-ai-infrastructure.md — CLEAN with minor note

**Issue (minor):** `gantt` block (continuous vs static batching) uses `dateFormat X` with numeric labels like `0, 4, 8` — valid. The `axisFormat %s` format code will display as seconds. Cosmetic only, not a parse error.

`graph TB` (two-tower model) and all other diagrams are clean — all subgraphs quoted, special chars in quoted labels.

---

### ch25-interview-framework-cheat-sheets.md — CLEAN

**Gantt block** (interview timeline): `dateFormat mm` with `axisFormat %M min` — this is a non-standard format. `mm` is "minutes" in moment.js format; the axis label `%M min` will render but the axis tick formatting may be off. Cosmetic only — not a parse error.

All flowchart nodes are clean. Mindmap uses only simple text (no special chars in labels).

---

## Summary Table

| File | Severity | Issue Type | Count |
|------|----------|-----------|-------|
| ch05-dns.md | **WILL BREAK** | `<br/>` in participant declarations | 3 |
| ch21-video-streaming-platform.md | **WILL BREAK** | Unquoted subgraph names with spaces/em-dash | 4 |
| ch03-core-tradeoffs.md | Likely breaks | Emoji in unquoted `[]` labels | 4 |
| ch09-databases-sql.md | Likely breaks | Colon/slash/unicode in unquoted labels | 3 |
| ch10-databases-nosql.md | Likely breaks | Colon/`?` in unquoted labels | 2 |
| ch11-message-queues.md | Likely breaks | Em-dash in unquoted labels | 4+ |
| ch12-communication-protocols.md | Likely breaks | `<br/>` in sequenceDiagram Note | 1 |
| ch17-monitoring-observability.md | Likely breaks | `<br/>` in Note; `<` in quoted label | 2 |
| ch13-microservices.md | Cosmetic | `\n` in stateDiagram-v2 transition | 1 |
| ch15-data-replication-consistency.md | Cosmetic | Unicode `→` in unquoted labels | 2 |
| ch08-cdn.md | Cosmetic | Orphan note node | 1 |
| ch10-databases-nosql.md | Cosmetic | Orphan note node | 1 |
| ch11-message-queues.md | Cosmetic | Orphan note node | 1 |
| ch19-social-media-feed.md | Cosmetic | `SMALL_FAN` label ~180 chars | 1 |
| ch20-chat-messaging-system.md | Cosmetic | `SMALL_FAN` label ~180 chars | 1 |
| ch23-cloud-native-serverless.md | Low | Colon in unquoted node labels (K8s diagram) | 3 |
| ch24-ml-systems-ai-infrastructure.md | Low | Gantt `axisFormat %s` cosmetic | 1 |
| ch25-interview-framework-cheat-sheets.md | Low | Gantt `dateFormat mm` cosmetic | 1 |
| ch01, ch02, ch04, ch06, ch07 | Low/none | Minor emoji/unicode in quoted labels | — |
| ch14, ch16, ch18, ch22 | Clean | No issues | — |

---

## Prioritized Fix Order

1. **Fix ch05 first** — DNS sequence diagram is a core foundational chapter and fully broken
2. **Fix ch21** — Video platform CDN diagram is fully broken
3. **Fix ch03, ch09, ch10, ch11** — Multiple label-quoting fixes across key building-block chapters
4. **Fix ch12, ch17** — `<br/>` in Notes (2 files, 3 instances)
5. **Fix ch13** — `\n` in stateDiagram-v2 transition label
6. **Fix ch19, ch20** — `SMALL_FAN` long labels (split into multiple lines or shorten)
7. Remaining cosmetic issues at discretion

---

## Unresolved Questions

- Mermaid version in use is not specified in the repo. Some issues (e.g., emoji in unquoted labels, colon in `[]`) are version-dependent — behavior differs between Mermaid v9 and v11. Confirm target version to triage severity 2 issues more precisely.
- The `SMALL_FAN` node in ch19/ch20 — is the intent to show all bullet points inside the node, or should this be refactored to a separate table/list outside the diagram?
- ch25 Gantt: `dateFormat mm` — is this intentional (minutes axis) or should it be `dateFormat HH:mm`?
