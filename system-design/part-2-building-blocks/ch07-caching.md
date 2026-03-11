---
title: "Chapter 7: Caching"
---

# Chapter 7: Caching

![Chapter banner](/images/ch07/banner.png)

> Caching is the single highest-leverage optimization in distributed systems. A well-designed cache can reduce database load by 90%, cut latency from milliseconds to microseconds, and enable systems to scale beyond what raw compute alone could achieve.

---

## Mind Map

```mermaid
mindmap
  root((Caching))
    Layers
      Client Browser
      CDN Edge
      Reverse Proxy
      Application In-Memory
      Database Buffer Pool
    Strategies
      Cache-Aside
      Read-Through
      Write-Through
      Write-Behind
      Refresh-Ahead
    Invalidation
      TTL-Based
      Event-Based Pub-Sub
      Manual Purge
      Versioned Keys
    Eviction Policies
      LRU Least Recently Used
      LFU Least Frequently Used
      FIFO First In First Out
      Random
      TTL-Based Expiry
    Problems
      Cache Stampede
      Thundering Herd
      Cache Penetration
      Cache Avalanche
    Solutions
      Distributed Locking
      Probabilistic Early Expiry
      Request Coalescing
      Bloom Filters
    Tools
      Redis
        Strings Hash List Set ZSet
        Persistence AOF RDB
        Pub-Sub
        Cluster Mode
      Memcached
        Simple Key-Value
        Multi-Threaded
        No Persistence
```

---

## Overview

A cache is a fast, temporary storage layer that holds a subset of data so future requests can be served without reaching the slower source of truth (typically a database or external service).

Three properties define cache value:

- **Speed** — cache reads are orders of magnitude faster than disk or network I/O
- **Cost** — CPU and RAM are cheaper per operation than database queries at high scale
- **Proximity** — edge caches reduce geographic latency that no optimization can fix

The fundamental challenge is **consistency**: how do you keep a fast local copy of data in sync with the authoritative source?

---

## Cache Hierarchy

Every modern system uses multiple cache layers. Understanding which layer to target for a given problem is a core design skill.

```mermaid
flowchart TD
    USER([User / Browser])
    L1[L1: Client Cache\nBrowser HTTP cache\nLocalStorage / IndexedDB\nIn-memory JS state]
    L2[L2: CDN Cache\nEdge PoP nodes\nGeographically distributed\nStatic & dynamic content]
    L3[L3: Reverse Proxy Cache\nVarnish / Nginx\nApplication-layer gateway\nSSL termination point]
    L4[L4: Application Cache\nRedis / Memcached\nSession data, computed results\nShared across app servers]
    L5[L5: Database Cache\nBuffer pool / query cache\nMaterialised views\nRead replicas]
    DB[(Source of Truth\nPostgres / MySQL\nMongoDB etc.)]

    USER -->|HTTP request| L1
    L1 -->|Cache miss| L2
    L2 -->|Cache miss| L3
    L3 -->|Cache miss| L4
    L4 -->|Cache miss| L5
    L5 -->|Cache miss| DB

    style L1 fill:#dbeafe,stroke:#3b82f6
    style L2 fill:#dcfce7,stroke:#22c55e
    style L3 fill:#fef9c3,stroke:#eab308
    style L4 fill:#ffe4e6,stroke:#f43f5e
    style L5 fill:#f3e8ff,stroke:#a855f7
    style DB fill:#fee2e2,stroke:#dc2626
```

Each layer has different characteristics:

| Layer | Typical Latency | Capacity | Scope |
|---|---|---|---|
| Browser cache | ~0 ms | MB range | Per user |
| CDN | 1–10 ms | TB range | Global edge |
| Reverse proxy | < 1 ms | GB range | Datacenter |
| App cache (Redis) | 0.1–1 ms | GB–TB | All app instances |
| DB buffer pool | 0.5–5 ms | RAM of DB host | Single DB node |

> Cross-reference: CDN caching is explored in detail in [Chapter 8](/system-design/part-2-building-blocks/ch08-cdn). Database buffer pools and query caching are covered in [Chapter 9](/system-design/part-2-building-blocks/ch09-databases-sql).

---

## Caching Strategies

The strategy you choose determines **when** data enters the cache, **who** is responsible for populating it, and **what consistency guarantees** you get.

### Strategy 1: Cache-Aside (Lazy Loading)

The application owns all cache interactions. On a read, the app checks the cache first. On a miss, it reads from the database and populates the cache before returning.

```mermaid
sequenceDiagram
    participant App as Application
    participant Cache as Cache (Redis)
    participant DB as Database

    App->>Cache: GET user:42
    Cache-->>App: MISS (nil)
    App->>DB: SELECT * FROM users WHERE id=42
    DB-->>App: {id:42, name:"Alice"}
    App->>Cache: SET user:42 {id:42, name:"Alice"} TTL=300s
    App-->>App: return data to caller

    Note over App,Cache: Subsequent reads hit cache until TTL expires
    App->>Cache: GET user:42
    Cache-->>App: HIT → {id:42, name:"Alice"}
```

**Characteristics:**
- Cache only contains data that was actually requested — no wasted memory
- First request always pays the DB latency cost (cold start)
- Cache and DB can diverge if DB is updated without invalidating the cache
- Application code is tightly coupled to cache logic

**Best for:** Read-heavy workloads with a predictable hot set. User profile pages, product detail pages.

---

### Strategy 2: Read-Through

The cache layer sits transparently in front of the database. The application only talks to the cache; the cache handles DB reads on misses automatically.

```mermaid
sequenceDiagram
    participant App as Application
    participant Cache as Cache Layer
    participant DB as Database

    App->>Cache: GET product:99
    Cache->>Cache: Internal lookup — MISS
    Cache->>DB: SELECT * FROM products WHERE id=99
    DB-->>Cache: {id:99, price:29.99}
    Cache->>Cache: Store with TTL
    Cache-->>App: {id:99, price:29.99}

    Note over App,DB: App never directly contacts DB for reads
    App->>Cache: GET product:99
    Cache-->>App: HIT → {id:99, price:29.99}
```

**Characteristics:**
- Application code is simpler — no cache miss handling logic
- Cache warms lazily on first access, same cold-start problem as cache-aside
- Cache library or proxy must implement the read-through logic (e.g., AWS ElastiCache, Ehcache)

**Best for:** When you want to abstract cache complexity from application code.

---

### Strategy 3: Write-Through

Every write goes to both the cache and the database synchronously before the write is acknowledged to the caller.

```mermaid
sequenceDiagram
    participant App as Application
    participant Cache as Cache (Redis)
    participant DB as Database

    App->>Cache: SET user:42 {name:"Bob"}
    Cache->>DB: UPDATE users SET name="Bob" WHERE id=42
    DB-->>Cache: OK
    Cache-->>App: OK (write acknowledged)

    Note over App,Cache: Cache and DB always consistent after a write
    App->>Cache: GET user:42
    Cache-->>App: HIT → {name:"Bob"}
```

**Characteristics:**
- Cache is always consistent with the database — reads never return stale data
- Write latency doubles (cache + DB in sequence)
- Cache may hold data that is never read (write-heavy, rare-read items waste memory)
- Typically combined with read-through for complete coverage

**Best for:** Systems where read consistency is critical: financial account balances, inventory counts.

---

### Strategy 4: Write-Behind (Write-Back)

The application writes to the cache only. The cache acknowledges immediately, then asynchronously flushes the data to the database in the background.

```mermaid
sequenceDiagram
    participant App as Application
    participant Cache as Cache
    participant Queue as Write Queue
    participant DB as Database

    App->>Cache: SET order:7 {status:"paid"}
    Cache-->>App: OK (immediate ack)
    Cache->>Queue: Enqueue write: order:7

    Note over Cache,DB: Async flush — decoupled from request path
    Queue->>DB: UPDATE orders SET status="paid" WHERE id=7
    DB-->>Queue: OK
```

**Characteristics:**
- Lowest write latency of all strategies — DB write is off the critical path
- Risk of data loss: if cache crashes before flush, writes are lost
- DB can be temporarily out of sync — inconsistency window exists
- Requires a durable write queue to mitigate data loss risk

**Best for:** Write-intensive workloads tolerant of eventual consistency: analytics events, counters, leaderboards, shopping carts.

---

### Strategy 5: Refresh-Ahead

The cache proactively refreshes entries before they expire, based on predicted access patterns. When an item's TTL drops below a threshold, a background refresh is triggered while still serving the current (soon-to-expire) value.

```mermaid
sequenceDiagram
    participant App as Application
    participant Cache as Cache
    participant DB as Database

    Note over Cache: item TTL: 300s, refresh threshold: 60s
    App->>Cache: GET report:monthly
    Cache->>Cache: TTL remaining = 45s (below threshold)
    Cache-->>App: Serve stale-while-revalidate value
    Cache->>DB: Async: SELECT * FROM reports WHERE type="monthly"
    DB-->>Cache: Fresh data
    Cache->>Cache: Reset TTL to 300s

    Note over App,Cache: Next request gets fresh data with full TTL
```

**Best for:** Expensive-to-compute data accessed frequently with predictable patterns: dashboards, aggregation reports, recommendation scores.

---

### Strategy Comparison

| Strategy | Read Latency | Write Latency | Consistency | Data Loss Risk | Complexity | Best Use Case |
|---|---|---|---|---|---|---|
| Cache-Aside | High on miss | DB only | Eventual | None | Low | Read-heavy, simple CRUD |
| Read-Through | High on miss | DB only | Eventual | None | Medium | Simplify app read logic |
| Write-Through | Low (warm) | High (sync) | Strong | None | Medium | Consistency-critical reads |
| Write-Behind | Low (warm) | Very low | Eventual | Medium | High | Write-intensive workloads |
| Refresh-Ahead | Always low | DB only | Near-real-time | None | High | Predictable hot data |

---

## Cache Invalidation

Phil Karlton's famous observation: *"There are only two hard things in Computer Science: cache invalidation and naming things."*

Invalidation is hard because you must atomically decide: **when is my cached copy no longer trustworthy?**

### TTL-Based (Time-To-Live)

Every cached entry carries an expiry timestamp. After TTL elapses, the entry is treated as absent and the next read re-fetches from the source.

```
SET user:42 <data> EX 300   # Redis: expire in 300 seconds
```

**Pros:** Simple, no coordination needed, automatic cleanup.
**Cons:** Stale window exists for the full TTL duration; choosing TTL is a trade-off between freshness and cache efficiency.

**Guideline:** Short TTL (seconds) for frequently-changing data. Long TTL (hours–days) for static or slowly-changing data.

---

### Event-Based (Pub/Sub)

When data changes, the writer publishes an invalidation event. All cache nodes subscribed to that event delete or refresh their local copy.

```mermaid
sequenceDiagram
    participant Writer as Write Service
    participant Bus as Event Bus (Redis Pub/Sub)
    participant CacheA as Cache Node A
    participant CacheB as Cache Node B

    Writer->>Bus: PUBLISH invalidate "user:42"
    Bus-->>CacheA: MESSAGE "user:42"
    Bus-->>CacheB: MESSAGE "user:42"
    CacheA->>CacheA: DEL user:42
    CacheB->>CacheB: DEL user:42
```

**Pros:** Near-instant consistency; scales to many cache nodes.
**Cons:** Adds infrastructure dependency on the event bus; message delivery is not guaranteed without at-least-once semantics.

---

### Manual Purge

An operator or deployment pipeline explicitly deletes or tags specific cache entries. Used when deploying content updates (e.g., CDN cache purge on new software release).

**Pros:** Precise control.
**Cons:** Operationally burdensome; error-prone at scale.

---

### Versioned Keys

Instead of invalidating, embed a version or content hash in the cache key. When data changes, the key changes, and the old entry is simply never accessed again (expires via TTL cleanup).

```
# Old key: user:42:v1  →  abandoned
# New key: user:42:v2  →  populated on next read
```

**Pros:** No invalidation race conditions; atomic by design.
**Cons:** Orphan keys accumulate; requires TTL to reclaim memory.

---

## Eviction Policies

When cache memory is full, the eviction policy determines which entries to remove to make room for new ones.

| Policy | Algorithm | Evicts | Pros | Cons | Ideal For |
|---|---|---|---|---|---|
| **LRU** | Least Recently Used | Entry not accessed longest | Good approximation of hot set | Higher memory overhead (access tracking) | General-purpose; most common default |
| **LFU** | Least Frequently Used | Entry with fewest accesses | Favours truly popular data | Slow to adapt after access pattern shifts | Stable, long-lived hot sets |
| **FIFO** | First In First Out | Oldest entry inserted | Simple, predictable | Ignores access frequency entirely | Time-ordered data streams |
| **Random** | Uniform random | Random entry | Zero overhead | Unpredictable; can evict hot data | When overhead matters more than hit rate |
| **TTL-based** | Shortest remaining TTL | Entry expiring soonest | Proactive memory reclaim | May evict rarely-accessed items early | When freshness > recency |

**Redis default:** `allkeys-lru`. For session caches where all keys should expire eventually, `volatile-lru` (only evict keys with TTL set) is common.

---

## Cache Stampede / Thundering Herd

### The Problem

When a popular cache entry expires (or is evicted), many concurrent requests simultaneously miss the cache, each independently query the database, and each independently write the same result back to the cache. This is a **cache stampede** — also called thundering herd.

```mermaid
sequenceDiagram
    participant R1 as Request 1
    participant R2 as Request 2
    participant R3 as Request 3
    participant Cache as Cache
    participant DB as Database

    Note over Cache: Key "homepage" expires at T=0
    R1->>Cache: GET homepage → MISS
    R2->>Cache: GET homepage → MISS
    R3->>Cache: GET homepage → MISS
    R1->>DB: SELECT expensive_query (t=1ms)
    R2->>DB: SELECT expensive_query (t=1ms)
    R3->>DB: SELECT expensive_query (t=1ms)
    DB-->>R1: result
    DB-->>R2: result
    DB-->>R3: result
    R1->>Cache: SET homepage result
    R2->>Cache: SET homepage result
    R3->>Cache: SET homepage result

    Note over DB: DB receives N identical queries simultaneously
```

At high traffic this amplifies into hundreds or thousands of redundant queries, potentially overloading the database.

---

### Solution 1: Distributed Locking

Only the first request that observes a cache miss acquires a lock. All other requests wait and re-read from cache once the lock is released.

```
# Pseudo-code (Redis SET NX = set if not exists)
value = cache.GET(key)
if value is nil:
    if cache.SET(lock_key, 1, NX, EX=5):   # acquired lock
        value = db.query()
        cache.SET(key, value, EX=ttl)
        cache.DEL(lock_key)
    else:
        sleep(10ms)
        value = cache.GET(key)              # re-read after lock released
```

**Trade-off:** Adds latency for waiting requests; risk of deadlock if lock holder crashes (mitigated by lock TTL).

---

### Solution 2: Probabilistic Early Expiration (PER)

Before TTL reaches zero, a probability calculation decides whether to proactively refresh. As the TTL decreases, the probability of triggering a refresh increases. Individual requests independently decide to refresh early, distributing the load.

```
# XFetch algorithm
remaining_ttl = cache.TTL(key)
# β is a tunable constant (typically 1.0)
if -β * log(random()) >= remaining_ttl:
    refresh_from_db()  # proactive refresh
```

**Trade-off:** No coordination needed; small overhead on every read. Occasional duplicate refreshes are acceptable.

---

### Solution 3: Request Coalescing

An intermediary layer (e.g., a request proxy or a fan-in goroutine) deduplicates in-flight requests for the same key. Only one backend request is issued; all waiting callers receive the same result.

```mermaid
sequenceDiagram
    participant R1 as Request 1
    participant R2 as Request 2
    participant R3 as Request 3
    participant Coalescer as Request Coalescer
    participant DB as Database

    R1->>Coalescer: GET homepage (miss)
    R2->>Coalescer: GET homepage (in-flight, wait)
    R3->>Coalescer: GET homepage (in-flight, wait)
    Coalescer->>DB: SELECT (single query)
    DB-->>Coalescer: result
    Coalescer-->>R1: result
    Coalescer-->>R2: result
    Coalescer-->>R3: result
```

**Trade-off:** Requires infrastructure support (singleflight in Go, similar libraries in other languages). Slightly increases latency for R2/R3 compared to independent queries.

---

## Redis vs Memcached

Both are widely used in-memory key-value stores. Redis has become the dominant choice for most modern systems, but Memcached retains advantages in specific high-throughput, low-complexity scenarios.

| Dimension | Redis | Memcached |
|---|---|---|
| **Data structures** | Strings, Hashes, Lists, Sets, Sorted Sets, Streams, HyperLogLog, Bitmaps | Strings (byte blobs) only |
| **Persistence** | RDB snapshots + AOF (append-only file log) | None — memory only |
| **Replication** | Master-replica replication built-in | Not built-in (requires external tooling) |
| **Clustering** | Redis Cluster (hash slot sharding, native) | Client-side sharding only |
| **Pub/Sub** | Yes — lightweight message bus | No |
| **Scripting** | Lua scripts executed atomically | No |
| **Transactions** | MULTI/EXEC (optimistic locking with WATCH) | No |
| **Threading model** | Single-threaded event loop (Redis 6+ I/O threads) | Multi-threaded |
| **Memory efficiency** | Higher overhead per key (richer metadata) | Lower overhead, more efficient for simple strings |
| **Operational maturity** | Very high — widely adopted, rich tooling | High — simpler operationally |
| **Max value size** | 512 MB | 1 MB |
| **Use case fit** | Sessions, leaderboards, pub/sub, queues, rate limiting, feature flags | Pure high-throughput object caching |

**Decision rule:**
- Need any data structure beyond strings, persistence, pub/sub, or transactions → **Redis**
- Pure cache, maximum throughput, minimal operational complexity → **Memcached**

---

## Real-World: Facebook's Memcached at Scale

Facebook's 2013 paper *"Scaling Memcache at Facebook"* (Nishtala et al.) describes one of the largest cache deployments in existence. Key lessons:

**Scale:** Hundreds of servers, tens of billions of items cached, handling millions of requests per second.

**Regional pools.** Facebook partitioned Memcached servers into regional pools. Infrequently accessed ("cold") items live in a shared pool; popular items live in dedicated pools where hot data gets more cache capacity.

**Demand-filled Windows.** To prevent stampedes, Facebook used **leases**: when a client experiences a cache miss, the cache issues a 64-bit token (lease). Only the holder of the lease may populate the cache for that key. Other clients requesting the same key during the fill window receive a "wait" signal, dramatically reducing redundant DB hits.

**Incast congestion prevention.** When a web server fans out to hundreds of Memcached servers for a single page load, the simultaneous responses create incast — a network congestion event. Facebook solved this with **sliding window** request scheduling, limiting the number of simultaneous outstanding requests per client.

**McRouter (client-side proxy).** Facebook built McRouter, a Memcached protocol-compatible proxy that handles routing, replication, deletion broadcast, and failover transparently — decoupling client libraries from topology changes.

**Thundering herd at cold start.** During cluster failovers, cold caches generate DB-killing traffic. Facebook uses **Gutter pools** — a small reserve of spare servers. When a primary Memcached server fails, cache misses are redirected to the gutter pool rather than directly to the database.

**Key takeaway from Facebook's experience:** At massive scale, the hard problems are not single-node performance but **coordination** (leases, coalescing) and **topology management** (failover, cold start).

---

## Cache Anti-Patterns to Avoid

**Cache everything naively.** Caching rarely-accessed data wastes memory and evicts actually-hot data. Measure access patterns first.

**Missing TTL on all keys.** Without TTL, caches grow unbounded and fill with stale data that is never refreshed. Always set a sensible default TTL.

**Caching by mutable state.** If a cached value encodes mutable state that multiple writers can change (without invalidation), you will serve stale data silently. Consider if write-through or event-based invalidation is needed.

**Ignoring cache penetration.** Requests for non-existent keys (e.g., `user:9999` where no user 9999 exists) always miss the cache and always hit the database. At scale, malicious or buggy clients can use this to DOS a database. Solutions: cache negative results (`SET user:9999 "NOT_FOUND" EX 60`) or use a Bloom filter to reject non-existent key lookups before they reach the DB.

**Over-relying on cache for durability.** Cache is volatile. Never use it as the sole store for data that must survive a restart.

---

## Key Takeaway

> Caching is a consistency-performance trade-off. Every caching decision is a bet that the cost of serving slightly stale data (or the complexity of perfect invalidation) is worth the latency and throughput gains. Design cache strategies deliberately — matching invalidation guarantees to the tolerance of the data being cached.

---

## Practice Questions

1. You are designing a product catalog for an e-commerce site with 10 million SKUs. 1% of products account for 80% of traffic. Which caching strategy do you use, and how do you handle price updates that must be reflected within 60 seconds?

2. Your Redis cache is running at 85% memory capacity. The eviction policy is `noeviction` (returns errors instead of evicting). How do you resolve this without taking the cache offline, and which eviction policy would you switch to and why?

3. A user's session data is stored in Redis. The user changes their password and you immediately revoke their session by deleting the Redis key. Twenty seconds later, the user reports they are still logged in. What is the likely cause, and how do you fix the architecture?

4. Your team proposes using write-behind caching for an e-commerce order management system to improve checkout latency. A senior engineer objects on reliability grounds. What are the concrete failure scenarios, and under what conditions (if any) would you accept write-behind for this use case?

5. Describe how you would use Redis to implement a rate limiter that enforces a maximum of 100 requests per user per minute, using only atomic Redis operations. What Redis data structure and commands would you use?
