---
title: "Chapter 11: Message Queues & Async Processing"
description: "Learn async processing with Kafka, RabbitMQ, and SQS: delivery guarantees, fan-out patterns, task queues, backpressure, and event-driven architecture design."
---

# Chapter 11: Message Queues & Async Processing

![Chapter banner](/images/ch11/banner.png)

> Synchronous systems are fragile. Asynchronous systems are resilient. A message queue is the contract between the two — it lets producers and consumers evolve, scale, and fail independently without ever blocking each other.

---

## Mind Map

```mermaid
mindmap
  root((Async Processing))
    Message Queues
      Apache Kafka
        Brokers
        Topics & Partitions
        Consumer Groups
        Offset Management
        Log Compaction
      RabbitMQ
        AMQP Protocol
        Exchanges
        Bindings
        Dead Letter Queues
      Amazon SQS
        Standard Queue
        FIFO Queue
        Dead Letter Queues
        Visibility Timeout
    Delivery Guarantees
      At-most-once
      At-least-once
      Exactly-once
        Idempotent Consumers
        Transactional Producers
    Task Queues
      Celery
      Sidekiq
      Priority Queues
      Retry Logic
      Dead Letter Jobs
    Patterns
      Fan-out
      Fan-in
      Request-Reply
      Pub-Sub
      Event Streaming
      Change Data Capture
    Back Pressure
      Drop
      Buffer
      Throttle
      Rate Limiting
```

---

## Why Async Processing

Synchronous request-response works fine for simple CRUD. It breaks down when:

- A downstream service is slow or temporarily unavailable
- A burst of traffic hits faster than consumers can handle
- Multiple services need to react to the same event
- Work is too expensive to complete within an HTTP request timeout

### Synchronous vs Asynchronous Architecture

```mermaid
graph TD
  subgraph Synchronous["Synchronous — Tightly Coupled"]
    U1[User] -->|HTTP request| A1[Service A]
    A1 -->|Waits...| B1[Service B]
    B1 -->|Waits...| C1[Service C]
    C1 -->|Response| B1
    B1 -->|Response| A1
    A1 -->|Response after all 3 complete| U1
  end

  subgraph Asynchronous["Asynchronous — Decoupled"]
    U2[User] -->|HTTP request| A2[Service A]
    A2 -->|Immediate response 202 Accepted| U2
    A2 -->|Publish event| Q[Message Queue]
    Q -->|Consume| B2[Service B]
    Q -->|Consume| C2[Service C]
    B2 & C2 -->|Process independently| DB[(Database)]
  end
```

**Key benefits:**

| Benefit | Explanation |
|---------|-------------|
| **Decoupling** | Producer doesn't know or care about consumers — they can be added or removed without touching the producer |
| **Traffic spike absorption** | Queue acts as a buffer; producers publish at peak rate, consumers process at sustainable rate |
| **Reliability** | If a consumer crashes, messages stay in the queue and are reprocessed when it recovers |
| **Independent scaling** | Scale consumers horizontally without changing producers |
| **Temporal decoupling** | Producer and consumer don't need to be online at the same time |

---

## Message Queue Fundamentals

The core pattern: **Producer → Queue → Consumer**

```mermaid
sequenceDiagram
  participant P as Producer
  participant Q as Queue / Broker
  participant C as Consumer

  P->>Q: Publish message (payload + metadata)
  Note over Q: Message stored durably
  Q-->>P: Acknowledgement (message accepted)

  Note over C: Consumer polls or receives push
  Q->>C: Deliver message
  Note over C: Process message
  C->>Q: ACK (processing complete)
  Note over Q: Message deleted / offset committed

  Note over C: If consumer crashes before ACK
  Q->>C: Redeliver message (at-least-once)
```

**Message anatomy:**

- **Payload** — the actual data (JSON, Avro, Protobuf)
- **Key** — used for partitioning/routing (Kafka) or routing key (RabbitMQ)
- **Headers / Metadata** — timestamp, message ID, content type, correlation ID
- **TTL** — how long the message lives in the queue before expiry

---

## Delivery Guarantees

How a system handles failures during message delivery determines its correctness guarantees.

### The Three Levels

| Guarantee | How it works | Risk | Typical Use Case |
|-----------|-------------|------|-----------------|
| **At-most-once** | Fire and forget. No retries. ACK before processing. | Messages can be lost | Metrics, logs — loss is acceptable |
| **At-least-once** | ACK after processing. Retry on failure. | Messages can be **duplicated** | Most business systems — duplicates are handled |
| **Exactly-once** | Idempotent consumer + transactional producer + at-least-once delivery | Complexity, lower throughput | Payments, inventory — correctness critical |

### How Exactly-Once Is Achieved

Exactly-once is not a single mechanism — it is a combination:

1. **Idempotent producer** (Kafka) — assigns sequence numbers so the broker deduplicates retried sends from the same producer session
2. **Transactional producer** (Kafka Transactions) — writes to multiple partitions atomically; either all succeed or none are visible
3. **Idempotent consumer** — the application assigns a deduplication key to each operation (e.g., `order_id`), checks whether it was already applied, and skips if so

```
Exactly-once = At-least-once delivery + Idempotent consumer
```

In practice, true end-to-end exactly-once requires both the broker **and** the downstream storage to participate in the transaction. Kafka Streams achieves this internally; external sinks require careful design.

---

## Apache Kafka Deep Dive

Kafka is a **distributed commit log** designed for high-throughput, durable, replayable event streaming.

### Architecture

```mermaid
graph TD
  subgraph Cluster["Kafka Cluster"]
    ZK[ZooKeeper / KRaft Controller]

    subgraph Broker1["Broker 1"]
      T1P0["Topic A - Partition 0 LEADER"]
      T1P1["Topic A - Partition 1 FOLLOWER"]
      T2P0["Topic B - Partition 0 FOLLOWER"]
    end

    subgraph Broker2["Broker 2"]
      T1P0R["Topic A - Partition 0 FOLLOWER"]
      T1P1L["Topic A - Partition 1 LEADER"]
      T2P0L["Topic B - Partition 0 LEADER"]
    end
  end

  P1[Producer App] -->|Write to leader| T1P0
  P2[Producer App] -->|Write to leader| T1P1L

  subgraph CG1["Consumer Group — Analytics"]
    C1[Consumer 1]
    C2[Consumer 2]
  end

  subgraph CG2["Consumer Group — Notifications"]
    C3[Consumer 3]
  end

  T1P0 -->|Partition 0| C1
  T1P1L -->|Partition 1| C2
  T1P0 & T1P1L -->|All partitions| C3
```

### Core Concepts

**Broker** — a single Kafka server. A cluster has multiple brokers for redundancy and parallelism.

**Topic** — a named, ordered, append-only log. Topics are split into partitions.

**Partition** — the unit of parallelism. Each partition is an ordered, immutable sequence of messages with monotonically increasing **offsets**. Partitions are replicated across brokers.

**Consumer Group** — a set of consumers sharing a group ID. Each partition is consumed by exactly one consumer within a group, enabling horizontal scaling. Multiple groups can read the same topic independently (pub/sub semantics).

**Offset** — the position of a message within a partition. Consumers commit offsets to track progress. Restarting a consumer replays from the last committed offset.

### Offset Management

| Strategy | Commit Timing | Risk |
|----------|--------------|------|
| Auto-commit (every 5s) | Periodic, automatic | Can lose uncommitted work on crash |
| Manual commit after process | After successful processing | At-least-once; safe for most cases |
| Manual commit before process | Before processing | At-most-once; fast but lossy |
| Transactional | Atomic with downstream write | Exactly-once; complex |

### Log Compaction

Normal Kafka topics are **retention-based** — old messages are deleted after a time or size limit. **Log compaction** keeps only the latest message per key, making the log act like a changelog or snapshot:

- Useful for materializing state (e.g., latest user profile per `user_id`)
- Enables new consumers to rebuild full state by replaying the compacted log
- Used extensively for Kafka Streams state stores and database change data capture (CDC)

### Kafka Use Cases

- **Event streaming** — real-time clickstream, IoT sensor data
- **Log aggregation** — centralize application logs from hundreds of services
- **Change Data Capture (CDC)** — Debezium captures database changes as Kafka events
- **Stream processing** — Kafka Streams / ksqlDB for real-time transformations
- **Event sourcing** — durable, replayable record of all state changes

---

## RabbitMQ

RabbitMQ implements the **AMQP 0-9-1** protocol. Unlike Kafka's pull-based log, RabbitMQ uses a **push-based broker** model: the broker routes messages to queues via exchanges, then pushes them to subscribed consumers.

### Exchange Routing

```mermaid
graph LR
  P[Producer] -->|Publish with routing key| EX

  subgraph Exchanges
    EX_D["Direct Exchange\nrouting_key = error"]
    EX_T["Topic Exchange\nrouting_key = app.*.error"]
    EX_F["Fanout Exchange\nno routing key"]
  end

  P -->|routing_key=error| EX_D
  EX_D -->|exact match| Q1[Queue: error-logs]

  P -->|routing_key=app.payment.error| EX_T
  EX_T -->|pattern match app.*.error| Q2[Queue: payment-errors]
  EX_T -->|pattern match #.error| Q3[Queue: all-errors]

  P -->|any key| EX_F
  EX_F --> Q4[Queue: service-A]
  EX_F --> Q5[Queue: service-B]
  EX_F --> Q6[Queue: service-C]
```

**Exchange types:**

| Type | Routing Logic | Use Case |
|------|--------------|----------|
| **Direct** | Exact match on routing key | Error routing, task dispatch |
| **Topic** | Wildcard pattern (`*` = one word, `#` = zero or more) | Categorized events |
| **Fanout** | Broadcast to all bound queues | Notifications, cache invalidation |
| **Headers** | Match on message header attributes | Complex routing rules |

**RabbitMQ strengths:**
- Complex routing logic without consumer-side filtering
- Per-message acknowledgement and TTL
- Dead letter exchanges (DLX) for failed messages
- Plugin ecosystem (delayed messages, priority queues)

---

## Amazon SQS

SQS is AWS's fully managed message queue — no brokers to provision, patch, or scale.

**Standard Queue:**
- Near-unlimited throughput
- At-least-once delivery (a message may be delivered more than once)
- Best-effort ordering (not guaranteed)
- **Visibility timeout** — after delivery, message becomes invisible to other consumers for a configurable period; if not deleted within that window, it reappears

**FIFO Queue:**
- Exactly-once processing (within the 5-minute deduplication window)
- Strict ordering per `MessageGroupId`
- Max 3,000 messages/second with batching

**Dead Letter Queue (DLQ):**
After `maxReceiveCount` failed delivery attempts, the message is moved to a DLQ for inspection and replay without blocking the main queue.

---

## Kafka vs RabbitMQ vs SQS

| Dimension | Apache Kafka | RabbitMQ | Amazon SQS |
|-----------|-------------|----------|------------|
| **Throughput** | Millions of msg/sec | 50k–100k+ msg/sec (streams: 1M+) | Near-unlimited (Standard) |
| **Message Ordering** | Per partition | Per queue | No guarantee (Standard) / per group (FIFO) |
| **Message Retention** | Days to forever (configurable) | Until ACKed (default) | 4 days default, up to 14 days |
| **Message Replay** | Yes — rewind offset | No — consumed = deleted | No |
| **Protocol** | Custom TCP binary | AMQP 0-9-1 | HTTPS / AWS SDK |
| **Push vs Pull** | Pull (consumer polls) | Push (broker delivers) | Pull (long polling) |
| **Routing** | Topic + partition key | Exchanges + binding keys | Queue URL (single destination) |
| **Delivery Guarantee** | At-least-once; exactly-once with transactions | At-least-once | At-least-once; exactly-once (FIFO) |
| **Scaling Model** | Add partitions + consumers | Add consumers or cluster nodes | Fully managed, auto-scales |
| **Ops Overhead** | High (ZooKeeper/KRaft, tuning) | Medium (cluster management) | None (managed service) |
| **Latency** | ~5–15 ms (batching) | Sub-millisecond | ~1–20 ms |
| **Primary Use Case** | Event streaming, CDC, log aggregation | Task dispatch, complex routing | Simple async decoupling on AWS |

**Decision guide:**
- Need **replay** or **event sourcing** → Kafka
- Need **complex routing** or **per-message TTL** → RabbitMQ
- On **AWS** and want zero ops → SQS
- Need **high throughput with ordering** → Kafka + partition by key

---

## Task Queues

Task queues are higher-level abstractions on top of message queues, designed for **job dispatch** rather than raw event streaming.

### Worker Pattern

```mermaid
graph LR
  App[Application] -->|Enqueue job| TQ[(Task Queue\nRedis / RabbitMQ)]
  TQ -->|Fetch job| W1[Worker 1]
  TQ -->|Fetch job| W2[Worker 2]
  TQ -->|Fetch job| W3[Worker 3]
  W1 & W2 & W3 -->|Write result| DB[(Result Store)]

  subgraph Retry Logic
    W1 -->|Exception| TQ
    Note["Retry with exponential backoff\nmax_retries=3"]
  end
```

**Celery (Python)** — uses Redis or RabbitMQ as broker; supports chaining, groups, chords, canvas for complex workflows.

**Sidekiq (Ruby)** — Redis-backed; uses threads for concurrency; built-in retry with exponential backoff.

### Priority Queues

Tasks with higher priority jump ahead in the queue. Implemented by:
- Multiple queues with polling priority (Sidekiq: poll high → default → low)
- Broker-native priority (RabbitMQ priority queues, max 255 levels)

### Retry Logic Best Practices

- **Exponential backoff with jitter** — `delay = min(cap, base * 2^attempt) + random_jitter`
- **Max retries** — set a limit; after exhaustion, move to Dead Letter Queue
- **Idempotency** — retried jobs must produce the same result as the first run
- **Alerting on DLQ depth** — monitor for jobs that never succeed

---

## Back Pressure

Back pressure is the mechanism by which a consumer signals to the producer that it cannot keep up. Without it, queues grow unbounded until memory is exhausted or latency becomes unacceptable.

### The Problem

```
Producer: 10,000 msg/sec  →  Queue fills up  →  Consumer: 1,000 msg/sec
```

### Strategies

| Strategy | Mechanism | Trade-off |
|----------|-----------|-----------|
| **Drop** | Discard new messages when queue is full | Fast; loses data — acceptable for metrics/logs |
| **Buffer** | Expand in-memory queue | Temporary relief; risks OOM on sustained overload |
| **Throttle** | Slow down the producer (rate limit) | Preserves data; requires producer cooperation |
| **Block** | Producer blocks until queue has capacity | Simple; can cause cascading slowdown upstream |
| **Reject + retry** | Return 429 to producer; let it retry later | Decouples pacing; requires producer to handle 429 |

**Reactive Streams** (RxJava, Akka Streams, Project Reactor) formalize back pressure in code: a consumer requests `N` items from the producer, preventing the producer from overwhelming it.

In Kafka, consumers naturally control pace because **they** poll the broker. The queue depth (consumer lag) is a key metric — when lag grows, scale out consumers.

---

## Patterns

### Fan-out: One Message to Many Consumers

One producer publishes a single event; multiple independent consumers each receive a copy.

```mermaid
graph LR
  P[Order Service] -->|order.placed| T[Topic / Fanout Exchange]
  T -->|copy| C1[Inventory Service]
  T -->|copy| C2[Email Notification Service]
  T -->|copy| C3[Analytics Service]
  T -->|copy| C4[Fraud Detection Service]
```

Kafka: multiple consumer groups on the same topic, each maintaining their own offset.
RabbitMQ: fanout exchange bound to N queues.

### Fan-in: Many Producers to One Consumer

Multiple producers emit events into a single queue; one consumer (or consumer group) processes all of them.

```mermaid
graph LR
  P1[Service A] -->|event| Q[(Aggregated Queue)]
  P2[Service B] -->|event| Q
  P3[Service C] -->|event| Q
  Q -->|consume| AGG[Aggregator / Processor]
```

Use case: centralised audit log, combined metrics ingestion.

### Request-Reply over Queues

Asynchronous request-reply decouples caller from callee while still allowing the caller to get a result.

```mermaid
sequenceDiagram
  participant Caller
  participant RequestQueue
  participant Worker
  participant ReplyQueue

  Caller->>RequestQueue: message + replyTo="reply.xyz" + correlationId="abc123"
  Worker->>RequestQueue: consume message
  Worker->>ReplyQueue: reply to "reply.xyz" with correlationId="abc123"
  Caller->>ReplyQueue: consume reply (match by correlationId)
```

The caller creates a temporary reply queue (or uses a shared one with `correlationId` filtering). Used in RPC-over-MQ patterns.

---

## Real-World Cases

### LinkedIn — Kafka at 7 Trillion Messages per Day

LinkedIn built Kafka in 2010 specifically because no existing system could handle their activity feed requirements. Today:
- **7 trillion messages/day** across their Kafka clusters
- Single largest Kafka deployment in the world
- Used for activity tracking, metrics, log aggregation, and stream processing with Samza
- Key insight: treating logs as first-class data streams unlocked entirely new product capabilities (who viewed your profile, trending posts)

### Uber — Async Processing for Reliability

Uber's ride dispatch, surge pricing, and notification systems all rely heavily on async queues:
- **Cherami** (Uber's internal queue) was built when SQS latency was too high and Kafka's model didn't fit task-queue semantics
- **microtransactions** — each step of the ride lifecycle (request, match, pickup, complete) publishes an event; downstream services (billing, driver payments, analytics) react asynchronously
- **Resilience pattern**: if the notification service is down during a ride, the events buffer in the queue; once service recovers, all notifications are delivered in order

See also: [Chapter 14 — Event-Driven Architecture](/system-design/part-3-architecture-patterns/ch14-event-driven-architecture) for how these patterns compose into full system designs.

For async cache invalidation patterns (where message queues propagate cache eviction events), see [Chapter 7 — Caching](/system-design/part-2-building-blocks/ch07-caching).

---

## Key Takeaway

> Message queues transform brittle synchronous chains into resilient, independently scalable systems. The choice of broker matters far less than the discipline of designing idempotent consumers, monitoring queue depth, and handling back pressure gracefully. A queue is only as reliable as the consumer that processes it.

---

## Designing Idempotent Consumers

### Why Idempotency Matters

- At-least-once delivery means messages CAN be delivered multiple times
- Without idempotent consumers, duplicate processing causes bugs (double charges, duplicate records)

### Idempotency Strategies

| Strategy | How It Works | Best For |
|----------|-------------|----------|
| **Idempotency key** | Store processed message IDs in a set; skip duplicates | Payment processing |
| **Natural idempotency** | Operations that produce same result regardless of repetition (SET vs INCREMENT) | State updates |
| **Optimistic locking** | Check version/timestamp before applying changes | Concurrent updates |
| **Deduplication window** | Track message IDs within a time window (e.g., 24h) | High-throughput streams |

### Code Example: Idempotent Kafka Consumer (Go)

```go
func processMessage(ctx context.Context, db *sql.DB, msg kafka.Message) error {
    msgID := string(msg.Key)

    // Check if already processed (idempotency key)
    var exists bool
    db.QueryRowContext(ctx,
        "SELECT EXISTS(SELECT 1 FROM processed_messages WHERE message_id = $1)",
        msgID).Scan(&exists)
    if exists {
        return nil // Skip duplicate
    }

    // Process within transaction
    tx, _ := db.BeginTx(ctx, nil)
    defer tx.Rollback()

    // Business logic here
    if err := handleOrder(tx, msg.Value); err != nil {
        return err
    }

    // Mark as processed
    tx.Exec("INSERT INTO processed_messages (message_id, processed_at) VALUES ($1, NOW())", msgID)
    return tx.Commit()
}
```

---

## Schema Evolution in Event-Driven Systems

### The Problem

- Producers and consumers evolve independently
- Changing event schemas can break downstream consumers
- Need backward AND forward compatibility

### Schema Compatibility Types

| Compatibility | Rule | Example |
|--------------|------|---------|
| **Backward** | New schema can read old data | Adding optional field |
| **Forward** | Old schema can read new data | Removing optional field |
| **Full** | Both backward and forward | Only add/remove optional fields |
| **None** | No guarantees | Changing field type |

### Schema Registry Pattern

```mermaid
%%{init: {'theme': 'dark'}}%%
graph LR
  P["Producer"] -->|"validate schema"| SR["Schema Registry"]
  P -->|"publish event"| K["Kafka"]
  K -->|"consume event"| C["Consumer"]
  C -->|"deserialize schema"| SR
```

### Best Practices

- Use Avro or Protobuf (not JSON) for schema enforcement
- Deploy schema registry (Confluent, Apicurio)
- Set compatibility mode to BACKWARD or FULL
- Never remove required fields or change field types
- Use schema evolution as a deployment gate

---

## Go Implementation Example

The following implements an in-memory publish/subscribe message queue — the core pattern behind Kafka topics and RabbitMQ fanout exchanges.

```go
package main

import (
	"fmt"
	"sync"
)

// Message is the unit of data flowing through the queue.
type Message struct {
	Topic   string
	Payload string
}

// Broker manages topics and delivers messages to all subscribers.
type Broker struct {
	mu          sync.RWMutex
	subscribers map[string][]chan Message // topic → list of subscriber channels
}

func NewBroker() *Broker {
	return &Broker{subscribers: make(map[string][]chan Message)}
}

// Subscribe returns a channel that receives all messages published to topic.
// bufSize controls how many messages can queue before the subscriber blocks.
func (b *Broker) Subscribe(topic string, bufSize int) <-chan Message {
	ch := make(chan Message, bufSize)
	b.mu.Lock()
	b.subscribers[topic] = append(b.subscribers[topic], ch)
	b.mu.Unlock()
	return ch
}

// Publish delivers msg to every subscriber of msg.Topic (fan-out pattern).
func (b *Broker) Publish(msg Message) {
	b.mu.RLock()
	subs := b.subscribers[msg.Topic]
	b.mu.RUnlock()

	for _, ch := range subs {
		// Non-blocking send: drop message if subscriber's buffer is full.
		// In production, this is the "drop" back-pressure strategy.
		select {
		case ch <- msg:
		default:
			fmt.Printf("⚠ subscriber buffer full, dropping message on topic %q\n", msg.Topic)
		}
	}
}

func main() {
	broker := NewBroker()

	// Two independent consumer groups subscribe to "order.placed".
	inventory := broker.Subscribe("order.placed", 10)
	email := broker.Subscribe("order.placed", 10)

	var wg sync.WaitGroup
	consume := func(name string, ch <-chan Message, count int) {
		defer wg.Done()
		for i := 0; i < count; i++ {
			msg := <-ch
			fmt.Printf("[%s] received: %s\n", name, msg.Payload)
		}
	}

	wg.Add(2)
	go consume("inventory-service", inventory, 2)
	go consume("email-service", email, 2)

	broker.Publish(Message{Topic: "order.placed", Payload: `{"order_id":"101"}`})
	broker.Publish(Message{Topic: "order.placed", Payload: `{"order_id":"102"}`})

	wg.Wait()
}
```

Key patterns illustrated:
- Each `Subscribe` call gets its own buffered channel — this is how Kafka consumer groups achieve independent offsets (each group sees every message)
- `sync.RWMutex` allows concurrent reads (many publishers) with exclusive writes (new subscriptions)
- The `select { case ch <- msg: default: }` non-blocking send is the "drop" back-pressure strategy — replace with a blocking send for "buffer" strategy

---

## Related Chapters

| Chapter | Relevance |
|---------|-----------|
| [Ch14 — Event-Driven Architecture](/system-design/part-3-architecture-patterns/ch14-event-driven-architecture) | Event sourcing and Saga patterns built on message queues |
| [Ch12 — Communication Protocols](/system-design/part-2-building-blocks/ch12-communication-protocols) | Async vs sync protocol trade-offs complement queue design |
| [Ch13 — Microservices](/system-design/part-3-architecture-patterns/ch13-microservices) | Queues enable async inter-service communication |

---

## Practice Questions

### Beginner

1. **Async Order Processing:** Design an order processing system where placing an order triggers inventory reservation, payment processing, and email notification — all asynchronously. Specify the queues or topics needed, the failure handling for each step, and how you ensure no step is silently skipped.

   <details>
   <summary>Hint</summary>
   Use a single `order.placed` topic with multiple consumer groups (one per downstream service); each consumer handles its own retries and dead-letter queue independently.
   </details>

### Intermediate

2. **Idempotent Payments:** Your payment service charges a credit card in response to a Kafka message. The consumer crashes after charging but before committing the offset. The message is redelivered. How do you prevent double-charging using idempotency keys?

   <details>
   <summary>Hint</summary>
   Store a `payment_attempt_id` (derived from the Kafka offset or a UUID in the message) in the database with a UNIQUE constraint before charging; duplicate delivery hits the constraint and is safely ignored.
   </details>

3. **Back Pressure:** Your email service processes at 500 emails/second. Marketing launches a campaign that enqueues 50,000 messages in 10 seconds. Describe three back pressure strategies (queue buffering, rate limiting at producer, consumer scaling) and compare their trade-offs for this workload.

   <details>
   <summary>Hint</summary>
   Queue buffering absorbs the burst but risks memory exhaustion; producer rate limiting prevents the burst entirely but requires coordination; horizontal consumer scaling adds throughput but has a warm-up lag — consider which failure mode is least acceptable.
   </details>

4. **Kafka Partition Design:** You're designing a Kafka topic for user activity events (clicks, views, purchases) for 10M DAU. Users must see their own events in order, but global ordering across all users is not required. How do you set the partition key, how many partitions do you create, and what breaks if you add more partitions later?

   <details>
   <summary>Hint</summary>
   Partition by `user_id` to guarantee per-user ordering; adding partitions later remaps some keys to new partitions, breaking the ordering guarantee for affected users during the transition window.
   </details>

### Advanced

5. **Fan-out vs Fan-in:** An e-commerce platform must respond to order placement by: (a) sending a receipt email, (b) updating inventory, (c) triggering loyalty points, and (d) logging to analytics. Compare fan-out (one topic, multiple consumer groups) vs fan-in (multiple queues feeding one processor) on: operational coupling, failure isolation, and scalability. When would you choose each pattern?

   <details>
   <summary>Hint</summary>
   Fan-out decouples consumers so a slow email service doesn't affect inventory updates; fan-in centralizes logic but creates a single point of failure — fan-out is the right default when consumers have different SLAs or scaling needs.
   </details>

---

## References & Further Reading

- **"Designing Data-Intensive Applications"** — Martin Kleppmann, Chapter 4 (Encoding and Evolution)
- [**Kafka documentation**](https://kafka.apache.org/documentation/)
- **"The Log: What every software engineer should know"** — Jay Kreps
- [**Confluent Schema Registry documentation**](https://docs.confluent.io/platform/current/schema-registry/index.html)
- **"Building Event-Driven Microservices"** — Adam Bellemare
