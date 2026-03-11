---
title: "Chapter 17: Monitoring & Observability"
---

# Chapter 17: Monitoring & Observability

![Chapter banner](/images/ch17/banner.png)

> *Monitoring tells you when something is wrong. Observability tells you why. The difference is whether your system was built to be questioned.*

---

## Mind Map

```mermaid
mindmap
  root((Observability))
    Metrics
      Counters
        Request count
        Error count
      Gauges
        CPU usage
        Queue depth
      Histograms
        Latency percentiles
        Request size
      Tools
        Prometheus
        StatsD
        Atlas
    Logs
      Structured JSON
      Log Levels
      Aggregation Pipeline
        Fluentd
        Logstash
        Filebeat
      Storage
        Elasticsearch
        Loki
        CloudWatch
    Traces
      Distributed Tracing
        Correlation ID
        Span Tree
        Parent-Child Spans
      Sampling
        Head-based
        Tail-based
      Tools
        Jaeger
        Zipkin
        AWS X-Ray
    Alerting
      SLI
      SLO
      SLA
      Error Budgets
      Alert Fatigue
      On-Call
    Health Checks
      Readiness Probe
      Liveness Probe
      Startup Probe
```

---

## The Three Pillars of Observability

Observability is built on three complementary signal types. Each answers different questions:

| Dimension | Metrics | Logs | Traces |
|-----------|---------|------|--------|
| **What is it?** | Numeric measurements over time | Timestamped text/structured records | Request journey across services |
| **Granularity** | Aggregated (not per-request) | Per-event | Per-request, cross-service |
| **Best for** | Dashboards, alerting, trends | Debugging specific events | Latency attribution, dependency mapping |
| **When to use** | "Is something wrong?" | "What happened at 14:03:22?" | "Which service added 800ms?" |
| **Cost** | Low (aggregates) | Medium (storage scales with volume) | High (sampling required at scale) |
| **Common tools** | Prometheus, Datadog, Atlas | ELK Stack, Loki, CloudWatch | Jaeger, Zipkin, AWS X-Ray |
| **Retention** | Weeks–months | Days–weeks | Hours–days (sampled) |
| **Cardinality risk** | High (too many labels = explosion) | Low | Medium |

You need all three. Metrics alone tell you latency spiked; logs tell you which user was affected; traces tell you which service in the call chain caused it.

---

## Metrics Types

Prometheus and most metrics systems define three fundamental types:

| Type | Definition | Example Use Cases | Example Values |
|------|-----------|-------------------|----------------|
| **Counter** | Monotonically increasing integer, only goes up (resets on restart) | Total HTTP requests, total errors, total bytes sent | `http_requests_total{method="GET", status="200"} 10482` |
| **Gauge** | Arbitrary value that can go up or down | CPU %, active connections, queue depth, memory usage | `queue_depth{queue="payments"} 42` |
| **Histogram** | Samples observations into configurable buckets, exposes `_count`, `_sum`, `_bucket` | Request latency distribution, request size | `http_duration_seconds_bucket{le="0.1"} 8234` |

### Why Histograms Matter: Percentiles vs. Averages

Averages hide tail latency. A p99 latency of 2s means 1% of your users wait 2 seconds — that can be thousands of users. Always alert on percentiles (p95, p99, p999) for latency metrics.

```
p50 = 50ms  ← Typical user
p95 = 200ms ← Most users
p99 = 800ms ← Tail (worst 1%)
```

Prometheus computes percentiles from histograms server-side using `histogram_quantile(0.99, ...)`.

---

## Distributed Tracing

In a microservices system, a single user request may fan out to 10+ services. Traditional logging — per-service — cannot answer "which service is slow." Distributed tracing reconstructs the full call tree.

### Core Concepts

- **Trace:** The complete journey of one request, from entry point to all leaf calls
- **Span:** One unit of work within a trace (e.g., one service call, one DB query)
- **Correlation ID / Trace ID:** A unique ID injected at the entry point and propagated via HTTP headers (`X-Trace-ID`) to every downstream call
- **Parent-child spans:** Each span records its parent span ID, enabling tree reconstruction

### Trace Sequence Example

```mermaid
sequenceDiagram
    participant U as User
    participant GW as API Gateway
    participant US as User Service
    participant OS as Order Service
    participant DB as Database

    U->>GW: GET /order/456\n[Trace-ID: abc123]
    GW->>US: Validate token\n[Trace-ID: abc123, Span: span_001]
    US->>GW: User valid
    GW->>OS: GET /order/456\n[Trace-ID: abc123, Span: span_002]
    OS->>DB: SELECT * FROM orders\n[Trace-ID: abc123, Span: span_003]
    DB->>OS: Row data (45ms)
    OS->>GW: Order response
    GW->>U: 200 OK (total: 120ms)

    Note over GW,DB: Jaeger/Zipkin reconstructs the span tree from Trace-ID + parent Span-IDs
```

### Span Tree Visualization

```
abc123 [120ms total]
├── span_001: Auth (User Service)  [15ms]
└── span_002: Order Service        [98ms]
    └── span_003: DB Query         [45ms]
```

This immediately surfaces that the DB query and Order Service overhead account for 98ms, making optimization target obvious.

### Sampling Strategies

At 10,000 req/sec, storing every trace is prohibitively expensive. Two approaches:

| Strategy | How It Works | Pros | Cons |
|----------|-------------|------|------|
| **Head-based** | Decide at trace start (random %) | Low overhead, simple | Misses rare errors |
| **Tail-based** | Buffer full trace, decide after completion based on outcome | Captures all errors/slow requests | Higher memory/processing cost |

Production recommendation: sample 1% normally, 100% of errors and traces > p99 latency threshold.

### W3C TraceContext: Trace Propagation Standard

Distributed tracing requires trace and span IDs to flow across service boundaries via HTTP headers. W3C TraceContext (RFC 2019) defines the standard:

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^ ^^
          version       trace-id (128-bit)         parent-span-id   flags
```

Every service reads this header, creates a child span with the parent-span-id, and propagates the same trace-id to downstream calls. No proprietary vendor format needed.

### Tracing Tools Comparison

| | Jaeger | Zipkin | Grafana Tempo |
|---|--------|--------|---------------|
| **Storage backends** | Cassandra, Elasticsearch, in-memory | MySQL, Cassandra, Elasticsearch | Object storage (S3, GCS, Azure Blob) |
| **UI** | Full-featured: trace timeline, service dependency graph | Simpler: trace list + timeline | Minimal native UI; relies on Grafana |
| **Sampling** | Head-based and adaptive (remote controlled) | Head-based | Delegated to OTel Collector |
| **OpenTelemetry** | Native OTLP support | Via adapter | Native OTLP (primary protocol) |
| **Integration** | CNCF project, Kubernetes-native | Widely adopted, many client libs | Grafana stack (pairs with Prometheus + Loki) |
| **Scale** | Medium-large | Medium | Very large (object storage = cheap at scale) |
| **Deployment** | Moderate complexity | Simple | Simple (no search index needed) |
| **Cost** | Free (Elasticsearch costs extra) | Free | Free (storage cost only) |
| **Best for** | Kubernetes microservices, CNCF stack | Existing Zipkin instrumentation | Grafana-centric observability stacks |

---

## OpenTelemetry

OpenTelemetry (OTel) is a CNCF project that provides a **vendor-neutral standard** for instrumentation, collection, and export of telemetry data — traces, metrics, and logs — under a single unified API and SDK.

Before OTel, each observability vendor required its own SDK. Switching from Jaeger to Datadog meant re-instrumenting every service. OpenTelemetry solves this with a single instrumentation layer and pluggable exporters.

### Three Pillars Unified

```mermaid
flowchart TD
    APP["Application\n(any language)"]
    SDK["OTel SDK\n(auto + manual instrumentation)"]
    COLL["OTel Collector\n(receive, process, export)"]
    JAE["Jaeger\n(traces)"]
    PROM["Prometheus\n(metrics)"]
    LOKI["Loki\n(logs)"]
    DD["Datadog\n(all-in-one)"]

    APP -->|"traces + metrics + logs"| SDK
    SDK -->|"OTLP\n(gRPC or HTTP)"| COLL
    COLL -->|"traces"| JAE
    COLL -->|"metrics"| PROM
    COLL -->|"logs"| LOKI
    COLL -->|"all signals"| DD
```

**OTLP** (OpenTelemetry Protocol) is the wire format. It runs over gRPC (port 4317) or HTTP/protobuf (port 4318). Any backend that speaks OTLP can receive OTel data.

### OTel Collector Architecture

The Collector is an optional but recommended middle tier. It decouples instrumented apps from backend destinations:

```mermaid
flowchart LR
    subgraph apps["Instrumented Services"]
        S1["Service A\n(OTel SDK)"]
        S2["Service B\n(OTel SDK)"]
        S3["Service C\n(OTel SDK)"]
    end

    subgraph collector["OTel Collector"]
        RCV["Receivers\n(OTLP, Prometheus, Zipkin, Jaeger)"]
        PROC["Processors\n(batch, filter, sample, enrich)"]
        EXP["Exporters\n(OTLP, Jaeger, Prometheus, Datadog)"]
        RCV --> PROC --> EXP
    end

    subgraph backends["Observability Backends"]
        B1["Jaeger / Tempo"]
        B2["Prometheus / Mimir"]
        B3["Loki / Elasticsearch"]
    end

    S1 & S2 & S3 -->|"OTLP"| RCV
    EXP --> B1 & B2 & B3
```

**Collector benefits:**
- **Tail-based sampling** at the Collector level (buffer spans, sample on outcome)
- **Data transformation:** filter PII from logs, rename labels, add resource attributes
- **Multi-backend export:** send same data to two backends simultaneously (migration, redundancy)
- **Decoupled upgrades:** swap backends without touching application code

### Auto-Instrumentation vs Manual Instrumentation

| Dimension | Auto-Instrumentation | Manual Instrumentation |
|-----------|---------------------|----------------------|
| **How** | Agent/bytecode injection at startup, no code changes | Developer adds `tracer.start_span()` calls in code |
| **Effort** | Zero code changes | Per-operation instrumentation required |
| **Coverage** | HTTP clients, DB drivers, frameworks (Spring, Express, Django) | Any custom business logic, critical paths |
| **Span quality** | Generic (framework-level, missing business context) | Rich (custom attributes: user_id, order_id, feature flags) |
| **Latency** | Slight overhead from agent | Minimal (only instrumented operations) |
| **Maintenance** | Agent version updates | Code changes when logic changes |
| **Best for** | Getting started, standardizing infrastructure calls | High-value business operations, SLO-critical paths |

**Recommendation:** Use auto-instrumentation as the baseline (catches all HTTP and DB calls), then add manual spans around critical business operations (payment processing, fraud check, recommendation engine) where custom attributes are needed for debugging.

### OTel Language Support

OTel provides SDKs for all major languages: Java, Python, Go, JavaScript/Node, .NET, Ruby, Rust, C++, PHP. Auto-instrumentation is most mature for Java (via Java agent) and Node.js (via `@opentelemetry/auto-instrumentations-node`).

Cross-reference: [Chapter 16: Reliability Patterns](/system-design/part-3-architecture-patterns/ch16-security-reliability) for SLO-driven reliability engineering. [Chapter 23: Cloud-Native Architecture](/system-design/part-5-modern-mastery/ch23-cloud-native-serverless) for OTel in Kubernetes.

---

## Log Aggregation Pipeline

Individual service logs are useless if you cannot search them across all instances. A log aggregation pipeline centralizes logs from every container, VM, and serverless function:

```mermaid
flowchart LR
    subgraph "Collection"
        A1[App Container 1\nStdout/Stderr]
        A2[App Container 2\nStdout/Stderr]
        A3[App Container N\nStdout/Stderr]
    end

    subgraph "Shipping"
        B[Log Shipper\nFluentd / Filebeat\nFluent Bit]
    end

    subgraph "Processing"
        C[Log Processor\nLogstash\nVector]
    end

    subgraph "Storage"
        D[(Search Index\nElasticsearch / Loki)]
    end

    subgraph "Analysis & Visualization"
        E[Kibana / Grafana\nDashboards & Search]
    end

    A1 & A2 & A3 -->|Tail log files\nor OTLP| B
    B -->|Parse, filter,\nenrich| C
    C -->|Indexed storage| D
    D --> E
```

**Structured logging** (JSON over plaintext) is essential for the search step. A structured log line:
```json
{
  "timestamp": "2026-03-12T00:40:00Z",
  "level": "ERROR",
  "service": "order-service",
  "trace_id": "abc123",
  "user_id": "user_789",
  "message": "Payment timeout after 5000ms",
  "duration_ms": 5000
}
```

This allows queries like: `level:ERROR AND service:order-service AND duration_ms:>3000`.

---

## SLI / SLO / SLA

Google's Site Reliability Engineering introduced the SLI → SLO → SLA hierarchy as a way to make reliability quantitative and contractual:

```mermaid
graph TD
    SLI["SLI - Service Level Indicator\nActual measurement\ne.g. fraction of requests under 200ms"]
    SLO["SLO - Service Level Objective\nInternal reliability target\ne.g. 99.9% of requests under 200ms"]
    SLA["SLA - Service Level Agreement\nExternal contract with consequences\ne.g. 99.5% uptime or credit issued"]

    SLI -->|"Measured against"| SLO
    SLO -->|"Weaker version of, with penalties"| SLA
```

### Definitions

| Concept | Owner | Consequence of breach | Example |
|---------|-------|-----------------------|---------|
| **SLI** | Engineering | None — it is a measurement | 99.92% of requests succeeded this month |
| **SLO** | Engineering | Internal alert, error budget consumed | Target: 99.9% success rate |
| **SLA** | Business/Legal | Financial penalty, contract clause | Guarantee: 99.5% or credit issued |

**SLO is always stricter than SLA.** The gap between SLO (internal target) and SLA (contractual guarantee) is the safety buffer — if engineering hits 99.8% and the SLO was 99.9%, the team is alerted and investigates before breaching the 99.5% SLA.

### Common SLI Examples by Metric Type

| Metric Type | Example SLI | Example SLO | Measurement Method |
|-------------|------------|-------------|-------------------|
| **Availability** | Fraction of successful HTTP requests (2xx/3xx) | 99.9% success rate over 30 days | Synthetic probes + real traffic |
| **Latency** | p99 response time | p99 < 500ms over 1-hour window | Histogram (Prometheus `histogram_quantile`) |
| **Error rate** | Fraction of 5xx responses | < 0.1% error rate | Error counter / total request counter |
| **Throughput** | Requests processed per second | > 1,000 RPS sustained | Gauge metric on queue consumer |
| **Freshness** | Age of most recent data ingested | Data lag < 5 minutes | Timestamp comparison metric |
| **Durability** | Fraction of written objects successfully retrieved | 99.999999% (11 nines) | Periodic read-back verification |

### Error Budgets

An error budget is the allowable unreliability within an SLO period:

```
Error budget = 1 − SLO target
99.9% SLO → 0.1% budget → 43.8 minutes/month of allowed downtime
99.99% SLO → 0.01% budget → 4.38 minutes/month
```

### The Nines: Downtime Allowance per SLO Target

| SLO Target | Downtime per Month | Downtime per Year | Downtime per Week | Common Name |
|-----------|-------------------|-------------------|-------------------|-------------|
| **99%** | 7.3 hours | 3.65 days | 1.68 hours | Two nines |
| **99.5%** | 3.65 hours | 1.83 days | 50.4 minutes | — |
| **99.9%** | 43.8 minutes | 8.77 hours | 10.1 minutes | Three nines |
| **99.95%** | 21.9 minutes | 4.38 hours | 5.04 minutes | — |
| **99.99%** | 4.38 minutes | 52.6 minutes | 60.5 seconds | Four nines |
| **99.999%** | 26.3 seconds | 5.26 minutes | 6.05 seconds | Five nines |
| **99.9999%** | 2.63 seconds | 31.6 seconds | 0.605 seconds | Six nines |

**Cost of an additional nine:** Each additional nine of availability roughly doubles infrastructure cost and operational complexity. Going from 99.9% to 99.99% is not a 10× improvement — it requires eliminating every planned maintenance window, active-active multi-region deployment, and sub-minute failover. Most SaaS products target 99.9% (43 min/month), which is achievable with a single region + good health checks. Five nines (26s/month) requires active-active multi-region with automated failover in under 10 seconds.

**Error budget policy:** When the budget is exhausted, new feature deployments halt and reliability work takes priority. This creates a natural feedback loop: engineering teams that want to ship features are incentivized to keep the service reliable.

**Real-World — Google SRE:** Google's SRE teams hold joint ownership of error budgets with product teams. If a service exhausts its error budget, the SRE team can unilaterally halt launches. This removes the "reliability vs. velocity" organizational conflict by making reliability a shared engineering metric.

---

### Connecting SLOs to Observability Signals

SLOs require SLIs, which require the right observability signals:

```mermaid
flowchart LR
    subgraph signals["Observability Signals"]
        M["Metrics\n(Prometheus counter/histogram)"]
        L["Logs\n(structured JSON)"]
        T["Traces\n(Jaeger / Tempo)"]
    end

    subgraph sli["SLI Computation"]
        AV["Availability SLI\nsuccessful_requests / total_requests"]
        LAT["Latency SLI\nhistogram_quantile(0.99, ...)"]
        ERR["Error Rate SLI\nerror_count / total_count"]
    end

    subgraph slo["SLO Evaluation"]
        EB["Error Budget\n= 1 - SLO target"]
        ALERT["Alert when budget\n< 5% remaining"]
    end

    M --> AV & LAT & ERR
    AV & LAT & ERR --> EB --> ALERT
    T -->|"Diagnose why\nSLI is breaching"| ALERT
    L -->|"Find affected\nusers/requests"| ALERT
```

**Burn rate alerts:** Rather than alerting when the budget is fully exhausted, alert when the consumption rate predicts exhaustion. A burn rate of 14.4× means you will exhaust a 30-day budget in 2 days. Alert at 2× burn rate (14-day warning) and 14.4× burn rate (2-hour warning). This is the multi-window, multi-burn-rate alerting pattern from Google's SRE Workbook.

---

## Alerting Strategies

### Alert Fatigue

The biggest failure mode in alerting is **alert fatigue** — too many low-signal alerts cause engineers to ignore them, including critical ones. Symptoms:
- On-call engineers acknowledge without investigating
- Alert volume exceeds 10/day on average
- Many alerts resolve without human action

**Solution:** Every alert must be actionable. If an alert fires and no action is required, delete or demote it.

### Severity Levels

| Severity | Definition | Response SLA | Example |
|----------|-----------|-------------|---------|
| **P1 / Critical** | Service down, revenue impact | Wake on-call immediately, < 5 min | Payment API returning 500 |
| **P2 / High** | Degraded, SLO at risk | Alert on-call during business hours, < 30 min | p99 latency > 2s |
| **P3 / Medium** | Anomaly, no immediate user impact | Ticket, fix in sprint | Disk > 80% on non-critical host |
| **P4 / Low** | Informational | Review weekly | Dependency approaching end of support |

### On-Call Best Practices

- Rotate on-call weekly to distribute burden and knowledge
- Keep runbooks for every P1/P2 alert — reduce MTTR with documented steps
- Conduct blameless post-mortems within 48 hours of incidents
- Track Mean Time To Detect (MTTD) and Mean Time To Resolve (MTTR) as team metrics
- Alert on symptoms (user-visible impact) not causes (CPU high) where possible

---

## Health Checks

Health checks allow orchestrators (Kubernetes, load balancers) to route traffic away from unhealthy instances automatically. Three probe types:

```mermaid
flowchart TD
    K([Kubernetes / Load Balancer]) --> SP{Startup Probe\nIs the app initialized?}
    SP -->|Failing| WAIT[Wait — do not send traffic\ndo not restart yet]
    SP -->|Passing| LP{Liveness Probe\nIs the app alive?}
    LP -->|Failing| RESTART([Restart container])
    LP -->|Passing| RP{Readiness Probe\nIs the app ready\nfor traffic?}
    RP -->|Failing| DRAIN([Remove from load balancer\npool — stop sending traffic])
    RP -->|Passing| SERVE([Route traffic normally])
```

| Probe | Question | Failure Action | Example Endpoint |
|-------|---------|----------------|-----------------|
| **Startup** | Has the app finished initializing? | Wait (don't kill yet) | `/health/startup` — checks migrations complete |
| **Liveness** | Is the process alive and not deadlocked? | Restart the container | `/health/live` — returns 200 if process is responsive |
| **Readiness** | Can the app serve traffic right now? | Remove from LB pool | `/health/ready` — checks DB connection, cache connection |

**Cross-reference:** [Chapter 6](/system-design/part-2-building-blocks/ch06-load-balancing) covers how load balancers use health checks to remove unhealthy backends from rotation.

**Readiness check design:** Be conservative. If your app cannot reach its database, it should fail readiness — sending traffic that will fail is worse than not sending traffic at all. However, a slow downstream service should not fail readiness if the app can degrade gracefully.

---

## Tools Comparison

| Tool | Category | What It Does | Deployment | Strengths | Weaknesses | Cost |
|------|----------|-------------|------------|-----------|------------|------|
| **Prometheus** | Metrics | Pull-based metrics collection, storage, PromQL | Self-hosted | CNCF standard, powerful query language | No long-term storage built-in, cardinality limits | Free |
| **Grafana** | Visualization | Dashboards for metrics, logs, traces from many sources | Self-hosted / Cloud | Universal frontend, supports 50+ data sources | Requires data source backends | Free / Paid |
| **Elasticsearch** | Log storage | Distributed search and analytics engine | Self-hosted / Cloud | Full-text search, flexible schema | Resource-intensive, complex to operate | Free / Paid |
| **Logstash** | Log processing | ETL pipeline for logs — parse, filter, enrich | Self-hosted | Powerful filter plugins | Heavy JVM resource usage |  Free |
| **Jaeger** | Tracing | Distributed trace collection, storage, UI | Self-hosted | CNCF, OpenTelemetry compatible | No metrics, no logs | Free |
| **Datadog** | All-in-one APM | Metrics + logs + traces + APM + alerting | SaaS | Low operational overhead, fast setup | Expensive at scale | Per-host pricing |
| **New Relic** | All-in-one APM | Full-stack observability, error tracking | SaaS | Good out-of-box instrumentation | Cost scales with data ingest | Per-GB ingest |
| **AWS CloudWatch** | Cloud-native | Metrics + logs for AWS resources | SaaS (AWS) | Zero setup for AWS services | Vendor lock-in, limited query capability | Per metric/log |

**Practical guidance:**
- **Startups:** Datadog or New Relic for speed of setup
- **Mid-size, cost-conscious:** Prometheus + Grafana + ELK + Jaeger (more ops burden, much cheaper)
- **AWS-native:** CloudWatch + X-Ray + managed Prometheus/Grafana
- **OpenTelemetry:** Use the vendor-neutral OTLP standard for instrumentation — swap backends without re-instrumenting code

**Real-World — Netflix Atlas:** Netflix built Atlas, their internal metrics platform, to handle billions of time series from thousands of services. Atlas uses in-memory storage optimized for real-time dashboards and pattern-matching queries across tag dimensions. Netflix open-sourced Atlas; its design influenced Prometheus's label model.

---

## Trade-offs & Comparisons

| Decision | Option A | Option B | Recommendation |
|----------|---------|---------|----------------|
| **Metrics storage** | Prometheus (self-hosted) | Datadog (SaaS) | SaaS if <$5K/month matters less than ops cost |
| **Log sampling** | Store all logs | Sample + retain errors | Sample at high volume (>10GB/day) |
| **Trace sampling** | Head-based (simple) | Tail-based (smart) | Tail-based if budget allows — captures all errors |
| **SLO target** | 99.9% (43 min/month budget) | 99.99% (4 min/month budget) | Higher SLO = higher infra cost, diminishing returns |
| **Alert strategy** | Alert on causes (high CPU) | Alert on symptoms (error rate) | Symptom-based reduces noise |

---

> **Key Takeaway:** Observability is the foundation of reliability. You cannot improve what you cannot measure, and you cannot debug what you cannot trace. Instrument before you need it — adding tracing during an incident is too late. The three pillars (metrics, logs, traces) are complements, not substitutes.

---

## Practice Questions

1. A microservices request takes 3 seconds end-to-end, but each individual service logs less than 100ms of processing time. How would you use distributed tracing to find the missing ~2.7 seconds?

2. Your team's SLO is 99.9% availability. After a 2-hour outage, the SRE lead says you have "used 2.7× your monthly error budget in one incident." What does this mean, and what are the operational consequences?

3. You are designing a readiness probe for a service that connects to PostgreSQL, Redis, and calls a third-party payment API. The payment API is sometimes slow (2–5s). How do you design the readiness check so that a slow payment API does not pull your service out of the load balancer rotation?

4. Compare Prometheus + Grafana (self-hosted) vs. Datadog (SaaS) for a team of 5 engineers running 50 microservices. What are the real hidden costs on each side that rarely appear in vendor comparisons?

5. Your on-call engineer receives 200 alerts in one week. 180 resolve automatically within 10 minutes, 15 require investigation but no action, and 5 require actual fixes. Design an alert restructuring plan to reduce noise while ensuring no critical alert is missed.
