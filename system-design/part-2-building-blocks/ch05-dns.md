---
title: "Chapter 5: DNS"
description: "Explore DNS resolution, record types, TTL trade-offs, geolocation and latency-based routing strategies, and how DNS enables global failover in distributed systems."
---

# Chapter 5: DNS

![Chapter banner](/images/ch05/banner.png)

## Mind Map

```mermaid
mindmap
  root((DNS))
    Resolution
      Recursive Resolver
      Root Name Server
      TLD Name Server
      Authoritative Server
      Iterative vs Recursive
    Record Types
      A - IPv4 Address
      AAAA - IPv6 Address
      CNAME - Alias
      MX - Mail Exchange
      NS - Name Server
      TXT - Verification
    Routing Strategies
      Round-Robin
      Weighted
      Latency-Based
      Geolocation
      Failover
    Caching and TTL
      Browser Cache
      OS Cache
      ISP Resolver Cache
      TTL Trade-offs
      Negative Caching
    Failover
      Health Checks
      Automatic Failover
      Secondary DNS
    DNS as Load Balancer
      Limitations
      No Health Awareness
      Long TTLs
      vs Dedicated LB
```

## Overview

DNS (Domain Name System) is the internet's distributed phone book. It translates human-readable hostnames like `api.example.com` into machine-routable IP addresses like `93.184.216.34`. Without DNS, every user would need to memorize IP addresses for every service — impractical at internet scale.

DNS is also one of the most underappreciated load balancing and traffic routing tools in a system designer's toolkit. Every major platform — Cloudflare, AWS, Google — uses DNS routing as the first layer of global traffic management, before a single packet reaches an application server.

This chapter covers how DNS resolution works, the record types you need to know, DNS-based routing strategies, caching and TTL trade-offs, and when DNS is sufficient as a load balancer versus when you need a dedicated solution. See [Chapter 6](/system-design/part-2-building-blocks/ch06-load-balancing) for application-layer load balancing.

---

## How DNS Works

DNS resolution is a hierarchical, distributed lookup process. When a browser resolves `www.example.com` for the first time, it traverses the DNS hierarchy from root to authoritative server.

```mermaid
sequenceDiagram
    participant B as Browser
    participant OS as OS Resolver
    participant R as Recursive Resolver (ISP / 8.8.8.8)
    participant ROOT as Root Name Server
    participant TLD as TLD Name Server (.com)
    participant AUTH as Authoritative Server (example.com)

    B->>OS: Resolve www.example.com
    OS->>OS: Check local hosts file and OS cache

    alt Cache miss
        OS->>R: Query www.example.com
        R->>R: Check resolver cache

        alt Cache miss
            R->>ROOT: Query www.example.com
            ROOT-->>R: "Ask .com TLD server at 192.5.6.30"

            R->>TLD: Query www.example.com
            TLD-->>R: "Ask authoritative server at 205.251.196.1"

            R->>AUTH: Query www.example.com
            AUTH-->>R: A record: 93.184.216.34 (TTL 300s)

            R->>R: Cache result for TTL duration
        end

        R-->>OS: 93.184.216.34
    end

    OS-->>B: 93.184.216.34
    B->>B: Open TCP connection to 93.184.216.34
```

### The Four Components

**Root name servers** are the top of the DNS hierarchy. There are 13 logical root server addresses (A through M), operated by different organizations globally, with hundreds of physical instances using anycast routing. They do not know IP addresses — they only know which TLD server to ask next.

**TLD name servers** handle top-level domains (.com, .org, .io, .uk). ICANN delegates management of each TLD to a registry operator. The .com TLD is operated by Verisign and manages ~160 million domain names.

**Authoritative name servers** are the final authority for a specific domain. They hold the actual DNS records and return the final answer. When you purchase `example.com` and configure records in AWS Route 53, Route 53 becomes the authoritative server for your domain.

**Recursive resolvers** (also called caching resolvers or recursive DNS servers) do the work on behalf of the client. Your ISP provides one, and public alternatives include Google (8.8.8.8), Cloudflare (1.1.1.1), and Quad9 (9.9.9.9). The resolver queries each level of the hierarchy, caches responses according to TTL, and returns the final answer to the client.

---

## DNS Record Types

| Record | Full Name | Purpose | Example |
|---|---|---|---|
| **A** | Address | Maps hostname to IPv4 address | `api.example.com → 93.184.216.34` |
| **AAAA** | IPv6 Address | Maps hostname to IPv6 address | `api.example.com → 2606:2800:220:1:248:1893:25c8:1946` |
| **CNAME** | Canonical Name | Alias to another hostname | `www.example.com → example.com` |
| **MX** | Mail Exchange | Email routing, with priority | `example.com → mail.google.com (priority 10)` |
| **NS** | Name Server | Delegates a zone to name servers | `example.com → ns1.awsdns.com` |
| **TXT** | Text | Arbitrary text; used for domain verification, SPF, DKIM | `example.com → "v=spf1 include:_spf.google.com ~all"` |
| **PTR** | Pointer | Reverse DNS — IP to hostname | `34.216.184.93.in-addr.arpa → api.example.com` |
| **SOA** | Start of Authority | Zone metadata (serial, refresh, TTL defaults) | Present in every DNS zone |

### CNAME Constraints

CNAME records cannot coexist with other records at the same name. Most critically, you **cannot** put a CNAME on your root domain (`example.com`) because the root must have an SOA and NS record. This is why DNS providers offer proprietary extensions: Route 53 ALIAS, Cloudflare CNAME flattening — these behave like CNAMEs but resolve at the authoritative server level, making them compatible with root domains.

---

## DNS Routing Strategies

Modern authoritative DNS servers can return different answers to the same query based on configurable routing policies. This makes DNS a powerful global traffic management layer.

```mermaid
flowchart TD
    Start["DNS Query Received\nfor api.example.com"] --> Q1{"Routing Policy?"}

    Q1 -->|"Round-Robin"| RR["Return IPs in rotation\n10.0.0.1, 10.0.0.2, 10.0.0.3\n(cycle each response)"]

    Q1 -->|"Weighted"| W["Return IPs weighted by capacity\n10.0.0.1 → 70%\n10.0.0.2 → 20%\n10.0.0.3 → 10%"]

    Q1 -->|"Latency-Based"| L["Measure latency to each endpoint\nReturn lowest-latency IP\nfor client's region"]

    Q1 -->|"Geolocation"| G{"Client region?"}
    G -->|"EU"| G1["Return 10.0.1.1\n(Frankfurt)"]
    G -->|"US"| G2["Return 10.0.2.1\n(Virginia)"]
    G -->|"APAC"| G3["Return 10.0.3.1\n(Singapore)"]

    Q1 -->|"Failover"| F{"Primary healthy?"}
    F -->|"Yes"| F1["Return primary\n10.0.0.1"]
    F -->|"No"| F2["Return secondary\n10.0.0.2"]
```

### Round-Robin

The simplest strategy: the DNS server rotates through a list of IP addresses, returning them in sequence. Each DNS response contains the same set of IPs but in a different order — clients typically use the first IP in the list. This distributes load across multiple servers without any knowledge of server health or capacity.

**Limitation:** DNS round-robin is client-transparent — if a server fails, the DNS server has no way to stop returning its IP until a human removes it. Clients that cached the failed IP will continue attempting connections until TTL expires.

### Weighted Routing

Assign a weight to each endpoint. Higher-weight endpoints receive a proportionally larger share of traffic. Common uses: blue-green deployments (send 5% traffic to new version before full rollout), A/B testing, or proportional allocation to data centers with different capacities.

### Latency-Based Routing

The DNS resolver measures (or estimates) network latency from the client's region to each registered endpoint and returns the IP of the lowest-latency option. AWS Route 53 latency routing uses AWS regional measurements. This is the most effective strategy for minimizing global round-trip times — users in Tokyo automatically get routed to the Tokyo endpoint without any manual geo-mapping.

### Geolocation Routing

Route based on the geographic location of the DNS resolver (which approximates the client's location). Unlike latency-based routing, this is policy-driven rather than performance-driven. Use cases: data residency compliance (EU users must be served by EU servers), content localization, regulatory restrictions.

**Accuracy limitation:** Geolocation is determined by the resolver's IP, not the client's IP. Corporate VPNs and public DNS servers (8.8.8.8) can cause misclassification — a user in Berlin using 8.8.8.8 may resolve to a US-based endpoint.

### Failover Routing

Configure a primary endpoint and one or more secondary endpoints. DNS returns the primary's IP when health checks pass; if the primary fails health checks, DNS automatically returns the secondary's IP. This is the foundation of DNS-based disaster recovery.

---

## DNS Caching and TTL

DNS responses include a Time-To-Live (TTL) value in seconds. Resolvers cache the response and serve it from cache for subsequent queries until the TTL expires.

### Cache Hierarchy

```
Client Browser Cache  →  OS DNS Cache  →  ISP/Corporate Resolver Cache  →  Authoritative Server
  (seconds to hours)      (minutes)           (up to TTL)                  (always fresh)
```

1. **Browser cache:** Modern browsers maintain their own DNS cache. Chrome's DNS cache is separate from the OS cache and has its own expiry behavior.
2. **OS cache:** The operating system resolver (e.g., `nscd` on Linux, the Windows DNS Client service) caches responses for their TTL duration.
3. **ISP recursive resolver cache:** Your ISP's or configured resolver's cache is shared across all users using that resolver. A popular domain may be cached here for thousands of simultaneous users.
4. **Authoritative server:** Always has the current record but is only queried on a cache miss.

### TTL Trade-offs

| TTL | Propagation on Change | DNS Query Load | Recommendation |
|---|---|---|---|
| **30 seconds** | Very fast (~1 min) | High (frequent re-queries) | Pre-migration, active failover |
| **300 seconds (5 min)** | Fast (~5-10 min) | Moderate | Production default for dynamic services |
| **3600 seconds (1 hr)** | Slow (~1-2 hr) | Low | Stable records (MX, NS) |
| **86400 seconds (1 day)** | Very slow (~24+ hr) | Very low | Static records unlikely to change |

**Key insight:** Lower TTLs mean faster propagation but higher query volumes hitting your authoritative DNS servers. Cloudflare, AWS Route 53, and other managed DNS providers serve authoritative DNS from globally distributed anycast networks, making high-query-volume from low TTLs affordable. For self-hosted DNS, low TTLs can create load concerns.

**Pre-migration TTL reduction:** Before any IP change, lower TTL to 60–300 seconds 24–48 hours in advance. This ensures stale cached records expire quickly after the change. After migration stabilizes, raise TTL back to production values.

### Negative Caching

When a DNS query returns NXDOMAIN (domain does not exist), the resolver caches this negative response for the Negative TTL specified in the zone's SOA record. This prevents repeated queries for non-existent names but can delay propagation of new records if a name was queried before it existed.

---

## DNS Failover Patterns

DNS failover combines health checking with automatic routing changes to implement disaster recovery without manual intervention.

### How DNS Failover Works

```mermaid
flowchart TD
    HCK["Health Check Agent\n(Cloudflare / Route 53)\nHTTP GET /health every 30s"] --> Q1{"Primary healthy?"}

    Q1 -->|"200 OK"| PRI["DNS returns:\nPrimary IP 10.0.1.10\n(TTL 60s)"]

    Q1 -->|"Timeout / 5xx\n3 consecutive failures"| ALT["DNS returns:\nSecondary IP 10.0.2.10\n(TTL 60s)\nAlert fired to on-call"]

    ALT --> MONITOR["Continue health checks\non primary"]
    MONITOR -->|"Primary recovers"| PRI
```

**Typical configuration:**
- Health check interval: 30 seconds
- Failure threshold: 3 consecutive failures before failover (90 seconds to detect failure)
- TTL: 60 seconds (maximum time clients serve stale primary IP after failover)
- Total maximum failover time: ~2.5 minutes (90s detection + 60s TTL propagation)

### Multi-Region Failover

For large-scale deployments, DNS failover can be layered: primary region → secondary region → static maintenance page, with each tier having its own health check and TTL configuration.

---

## DNS as Load Balancer

DNS round-robin is frequently used as a simple, zero-cost load balancer. Understanding when it is sufficient — and when it is not — is a core system design competency.

### DNS Load Balancing: Capabilities and Gaps

| Capability | DNS Round-Robin | Dedicated Load Balancer |
|---|---|---|
| **Traffic distribution** | Yes (coarse-grained) | Yes (request-level granularity) |
| **Health awareness** | No (unless via health-check routing) | Yes (removes unhealthy backends immediately) |
| **SSL termination** | No | Yes |
| **Session persistence (sticky sessions)** | No | Yes (cookie-based, IP-based) |
| **Request-level routing** | No | Yes (path-based, header-based) |
| **Rate limiting** | No | Yes (at L7) |
| **Zero-downtime rolling deployments** | Difficult | Yes (drain connections before removal) |
| **Client-side caching of IPs** | Yes (cannot override) | N/A |
| **Cost** | Free / low | Moderate to high |

### When DNS Load Balancing Is Sufficient

- Distributing traffic across multiple independent data centers (coarse global routing)
- Microservice internal DNS-based service discovery (Kubernetes DNS, Consul)
- Simple active-passive failover with acceptable failover time (minutes)

### When You Need a Dedicated Load Balancer

- Health-aware routing that removes failed instances within seconds
- SSL/Transport Layer Security (TLS) termination and certificate management
- Request routing based on URL path, HTTP headers, or content
- Session persistence requirements
- Sub-second failover on backend failure

DNS and load balancers are complementary, not competing: DNS routes traffic to the correct data center or region; the load balancer distributes traffic across servers within that region.

---

## Real-World: How Cloudflare DNS Handles Billions of Queries

Cloudflare operates the world's fastest public DNS resolver (1.1.1.1) and manages authoritative DNS for millions of customer domains. As of 2024, Cloudflare handles over 1.7 trillion DNS queries per day.

**Anycast routing:** Cloudflare's entire infrastructure uses BGP anycast. The IP address `1.1.1.1` is announced from 300+ data centers worldwide. When your device queries `1.1.1.1`, the internet's routing infrastructure automatically directs the packet to the nearest Cloudflare PoP — not a specific server, but the nearest announcement point. This ensures sub-5ms latency for most of the world's internet users.

**Privacy-first design:** Standard DNS is unencrypted UDP — ISPs and network observers can see every domain you query. Cloudflare's 1.1.1.1 supports DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT), encrypting queries. Cloudflare commits to deleting all query logs within 24 hours and undergoes annual audits by KPMG to verify this.

**Authoritative at the edge:** For customers using Cloudflare's authoritative DNS, queries are answered directly at the edge PoP — the authoritative and recursive resolver are co-located, eliminating the cross-internet round-trip to a customer's origin authoritative server.

**DNSSEC:** Cloudflare supports DNSSEC (DNS Security Extensions), which adds cryptographic signatures to DNS records. This prevents cache poisoning attacks (Kaminsky attack), where a malicious actor injects fake DNS responses to redirect traffic to attacker-controlled IPs.

---

> **Key Takeaway:** DNS is not just a phone book — it is a global traffic management layer. TTL controls propagation speed vs. query load trade-offs. DNS routing strategies (latency-based, geolocation, failover) provide coarse-grained traffic direction. For fine-grained routing, health-aware failover, and SSL termination, DNS must be paired with a dedicated load balancer (see [Chapter 6](/system-design/part-2-building-blocks/ch06-load-balancing)).

---

## DNS Security Threats

DNS was designed in 1983 for a trusted academic network. Security was not a requirement. The result is a protocol that is unauthenticated, unencrypted by default, and a persistent attack surface.

### DNS Cache Poisoning (Kaminsky Attack)

An attacker injects a forged DNS response into a resolver's cache. Once poisoned, every client using that resolver receives the attacker's IP for the target domain — redirecting traffic to a phishing site or an attacker-controlled server.

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Recursive Resolver
    participant ATK as Attacker
    participant AUTH as Authoritative Server

    C->>R: Resolve bank.example.com
    R->>AUTH: Query bank.example.com
    ATK->>R: Flood forged responses with random Tx IDs
    Note over ATK,R: Attacker races to match 16-bit Transaction ID
    ATK-->>R: Forged A record: bank.example.com = 1.2.3.4 (attacker IP)
    R->>R: Cache poisoned response (TTL hours)
    AUTH-->>R: Legitimate response (arrives too late or ignored)
    R-->>C: 1.2.3.4 (attacker IP)
    C->>ATK: Client connects to attacker server
```

**Mitigation:** DNSSEC (authenticates records), source port randomization (increases entropy beyond 16-bit Tx ID), DNS-over-TLS/HTTPS (prevents interception).

### DNS Amplification (DDoS Vector)

DNS amplification exploits the asymmetry between small query size and large response size, combined with UDP spoofing:

1. Attacker sends a small DNS query (e.g., `ANY example.com` — 40 bytes) with the **victim's IP spoofed** as the source
2. Open DNS resolvers send large responses (up to 4,096 bytes) to the victim
3. Amplification factor: up to **100×** — 1 Gbps of outbound attacker traffic generates 100 Gbps at the victim

**Mitigations:**
- Disable open resolvers (only allow recursive queries from trusted clients)
- Rate-limit DNS responses per source IP (Response Rate Limiting / RRL)
- Drop DNS `ANY` queries (RFC 8482)

### DNS Tunneling

DNS tunneling encodes arbitrary data (commands, file exfiltration) inside DNS query/response packets to bypass firewalls. Since DNS (port 53 UDP) is almost always permitted outbound, it is used as a covert channel:

```
exfiltrated_data.attacker-c2.com  → encodes data in subdomains
TXT response                      → encodes command responses
```

Tools like `iodine` and `dnscat2` implement full TCP-over-DNS tunnels. Detection requires monitoring for:
- Unusually long subdomain labels (>50 characters)
- High query rate to a single domain
- High entropy in subdomain strings (base64/hex encoded data)
- Large TXT record responses

**Mitigation:** DNS filtering (Cisco Umbrella, Cloudflare Gateway), anomaly detection on query patterns.

---

## DNSSEC (DNS Security Extensions)

DNSSEC adds **cryptographic signatures** to DNS records, allowing resolvers to verify that a response came from the legitimate authoritative server and was not tampered with in transit. It does **not** encrypt queries — it only authenticates them.

### Chain of Trust

DNSSEC establishes a chain of trust from the DNS root downward:

```mermaid
flowchart TD
    ROOT["Root Zone\n(ICANN)\nSigned by Root KSK"]
    COM["TLD: .com\n(Verisign)\nDS record signed by root"]
    EXAMPLE["example.com\n(Registrar/Route 53)\nDS record signed by .com"]
    RECORD["A record: 93.184.216.34\nSigned by example.com ZSK"]

    ROOT -->|"Delegates trust via DS record"| COM
    COM -->|"Delegates trust via DS record"| EXAMPLE
    EXAMPLE -->|"Signs all records with"| RECORD
```

A DNSSEC-validating resolver starts at the root (whose public key is hardcoded) and verifies each delegation link until it can verify the final record's signature.

### DNSSEC Record Types

| Record | Purpose |
|--------|---------|
| **RRSIG** | Cryptographic signature over a DNS record set. Every signed record has an RRSIG. |
| **DNSKEY** | Public key used to verify RRSIG records. Two types: ZSK (Zone Signing Key) and KSK (Key Signing Key). |
| **DS** | Delegation Signer — a hash of the child zone's KSK, stored in the parent zone. Links the chain of trust across zone boundaries. |
| **NSEC / NSEC3** | Authenticated denial of existence — proves that a queried name does not exist, preventing enumeration attacks. |

### DNSSEC Limitations

| Limitation | Detail |
|-----------|--------|
| **No query encryption** | DNSSEC authenticates responses but queries are still plaintext UDP — ISPs can still log your DNS queries |
| **Zone enumeration (NSEC)** | NSEC records allow walking the entire zone to enumerate all names. NSEC3 mitigates with hashing but adds complexity. |
| **Operational complexity** | Key rotation, signing infrastructure, and DS record publishing require careful management. Misconfiguration breaks the domain. |
| **Not universally validated** | ~30% of resolvers validate DNSSEC signatures; many ignore signatures entirely |
| **Large response sizes** | RRSIG and DNSKEY records increase response size significantly, worsening amplification risk |

---

## DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT)

Traditional DNS sends queries as plaintext UDP on port 53. Anyone on the network path (ISP, router, coffee shop Wi-Fi) can see every domain you query. DoH and DoT encrypt the DNS transport layer.

### How They Work

**DNS-over-TLS (DoT):** Wraps DNS messages in TLS on TCP port **853**. The DNS wire format is preserved; only the transport changes.

**DNS-over-HTTPS (DoH):** Sends DNS queries as HTTPS POST or GET requests to a URL like `https://cloudflare-dns.com/dns-query`. Port **443** — indistinguishable from regular HTTPS traffic.

### Comparison Table

| Dimension | Traditional DNS | DNSSEC | DoT | DoH |
|-----------|---------------|--------|-----|-----|
| **Transport** | UDP/TCP port 53 | UDP/TCP port 53 | TLS port 853 | HTTPS port 443 |
| **Encrypts queries** | No | No | Yes | Yes |
| **Authenticates responses** | No | Yes | No (relies on TLS cert of resolver) | No (relies on TLS cert of resolver) |
| **Privacy from ISP** | None | None | Yes | Yes |
| **Network visibility** | Full (ISP can log all) | Full | Port 853 visible (can be blocked) | Invisible (mixed with HTTPS) |
| **Browser support** | Native | Transparent | No | Yes (Firefox, Chrome built-in) |
| **Enterprise inspection** | Easy (port 53) | Easy | Possible (intercept port 853) | Difficult (blends with HTTPS) |
| **Latency overhead** | Low | Low (adds signature validation) | Medium (TLS handshake) | Medium (HTTPS overhead) |
| **IETF RFC** | RFC 1035 | RFC 4033 | RFC 7858 | RFC 8484 |

### Trade-off: Privacy vs. Operator Visibility

DoH in particular is controversial for enterprise and ISP network operators:

- **Privacy advocates:** DoH prevents ISPs from monetizing/logging DNS traffic; protects users on untrusted networks
- **Enterprise operators:** DNS is used for security filtering, malware domain blocking, data loss prevention — DoH bypasses corporate DNS resolvers if browsers use their own DoH server
- **ISPs:** Lose ability to offer parental controls, regional content filtering, compliance logging

**Resolution pattern:** Enterprises deploy internal DoH/DoT resolvers that respect corporate policy while still encrypting to the stub resolver. Browsers are configured to use the enterprise DoH resolver.

---

## Advanced DNS Failover Patterns

DNS-based failover uses health checks and automatic record updates to redirect traffic when primary endpoints fail. This section expands the failover overview above with specific patterns and timing analysis.

### Pattern 1: Active-Passive Failover

The simplest pattern. One primary endpoint receives all traffic; a standby secondary is only activated on primary failure.

```mermaid
flowchart TD
    HC["Health Check Agent\n(Route 53 / Cloudflare)\nHTTP GET /health every 30s"]
    PRIMARY["Primary Endpoint\n10.0.1.10\n(us-east-1)"]
    SECONDARY["Secondary Endpoint\n10.0.2.10\n(us-west-2)"]
    DNS_OK["DNS returns\nPrimary IP\n(TTL 60s)"]
    DNS_FAIL["DNS returns\nSecondary IP\n(TTL 60s)\n+ alert fired"]

    HC -->|"200 OK"| DNS_OK
    HC -->|"3x failure\n90s detection"| DNS_FAIL
    DNS_OK --> PRIMARY
    DNS_FAIL --> SECONDARY
    SECONDARY -->|"Primary recovers\n3x success"| DNS_OK
```

**Failover time analysis:**
- Health check interval: 30s
- Failure threshold: 3 consecutive failures = **90s to detect**
- TTL: 60s = **60s for resolvers to expire stale record**
- Total worst-case: ~150 seconds (~2.5 minutes)

### Pattern 2: Latency-Based Routing with Failover

Combine latency routing with health checks to achieve both performance and resilience:

1. Route 53 measures latency from each AWS region to the resolver's location
2. Normally: users in Tokyo → Tokyo endpoint; users in London → London endpoint
3. On Tokyo endpoint failure: Tokyo users fall back to nearest healthy region (e.g., Singapore)

This is the standard pattern for global SaaS with regional redundancy.

### Pattern 3: Weighted Failover (Traffic Shifting)

Use weighted DNS routing for controlled traffic migration — a gradual version of failover:

| Phase | Primary Weight | Secondary Weight | Use Case |
|-------|--------------|-----------------|---------|
| Normal | 100 | 0 | All traffic to primary |
| Canary | 95 | 5 | Test secondary with 5% traffic |
| Migration | 50 | 50 | Parallel validation |
| Cutover | 0 | 100 | Full migration to secondary |
| Emergency rollback | 100 | 0 | Restore previous state |

### Failover Pattern Comparison

| Pattern | Failover Time | Complexity | Best For |
|---------|-------------|------------|---------|
| **Active-Passive (DNS)** | ~2–5 minutes | Low | Disaster recovery, cost-sensitive |
| **Active-Active (latency)** | ~30–90 seconds | Medium | Global performance + resilience |
| **Weighted shift** | Manual / gradual | Low | Planned migrations, blue-green |
| **Dedicated LB health check** | ~5–30 seconds | Higher | High-availability production services |

Cross-reference: [Chapter 6: Load Balancing](/system-design/part-2-building-blocks/ch06-load-balancing) for sub-second failover within a region. [Chapter 8: CDN](/system-design/part-2-building-blocks/ch08-cdn) for edge-level failover.

---

## Related Chapters

| Chapter | Relevance |
|---------|-----------|
| [Ch06 — Load Balancing](/system-design/part-2-building-blocks/ch06-load-balancing) | DNS global routing hands off to LB for regional distribution |
| [Ch08 — CDN](/system-design/part-2-building-blocks/ch08-cdn) | DNS-based CDN routing for edge cache selection |
| [Ch16 — Security & Reliability](/system-design/part-3-architecture-patterns/ch16-security-reliability) | DNSSEC, DDoS mitigation at the DNS layer |

---

## Practice Questions

### Beginner

1. **DNS Migration:** Your team is planning to migrate `api.example.com` from IP `10.0.1.10` to `10.0.2.10`. The current A record TTL is 24 hours. Walk through the migration process — what do you do 48 hours before cutover, at cutover, and for the 24 hours after? What is the risk if you skip the TTL reduction step?

   <details>
   <summary>Hint</summary>
   Reduce TTL to 60s well before the cutover window so cached records expire quickly; after confirming the new IP is healthy, update the A record and monitor for errors during the old TTL drain period.
   </details>

### Intermediate

2. **Routing Policies:** Explain the difference between latency-based and geolocation DNS routing. A global SaaS company wants EU users served by EU servers for GDPR data residency compliance — which strategy should they use, and what failure mode does each strategy introduce if the target region goes down?

   <details>
   <summary>Hint</summary>
   Geolocation enforces hard regional boundaries (required for GDPR); latency-based may route EU users to US servers if latency favors it — combine geolocation with a health-check failover policy.
   </details>

3. **DNS Round-Robin Failure:** A startup uses DNS round-robin across three backend servers. One server crashes at 3 AM. Calculate how long users will experience errors given a 300-second TTL. What architectural change eliminates this problem entirely?

   <details>
   <summary>Hint</summary>
   Round-robin has no health awareness — DNS continues returning the crashed IP until TTL expires; a load balancer with active health checks removes unhealthy backends in seconds, not minutes.
   </details>

4. **CNAME Limitation:** Why can't you put a CNAME record on a root domain (e.g., `example.com`)? What proprietary DNS features (ALIAS/ANAME) solve this, and what vendor lock-in trade-offs do they introduce?

   <details>
   <summary>Hint</summary>
   RFC 1034 forbids CNAMEs at the zone apex because they conflict with SOA/NS records; ALIAS records are non-standard and resolved server-side by specific DNS providers.
   </details>

### Advanced

5. **Anycast Internals:** Cloudflare uses anycast routing for `1.1.1.1`. Explain how anycast works at the BGP level and why it is superior to unicast for a globally distributed DNS resolver with 300+ PoPs. What happens to in-flight DNS queries when a Cloudflare PoP goes offline, and how quickly does BGP convergence restore service?

   <details>
   <summary>Hint</summary>
   All PoPs announce the same IP prefix; BGP routers select the shortest path, so clients automatically route to the nearest healthy PoP — convergence typically takes 30–90 seconds depending on BGP timer configuration.
   </details>

---

## References & Further Reading

- "DNS and BIND" — Cricket Liu & Paul Albitz
- Cloudflare Learning Center — DNS articles
- RFC 1035 — Domain Names Implementation
- ["The Illustrated TLS Connection"](https://tls13.xargs.org/)
