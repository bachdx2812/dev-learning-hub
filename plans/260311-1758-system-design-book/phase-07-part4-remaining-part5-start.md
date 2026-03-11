# Phase 7: Part 4 Remaining + Part 5 Start (Chapters 20-23)

## Context Links
- [Plan Overview](plan.md)
- [Research: Primer](research/researcher-01-primer-analysis.md) -- chat apps, WhatsApp, video streaming
- [Research: Taxonomy](research/researcher-02-complete-taxonomy.md) -- Uber geospatial, cloud-native, serverless

## Parallelization
- **Max Concurrent Agents:** 3
- **Agent Assignment:**
  - Agent A: ch20 (Chat) + ch21 (Video Streaming)
  - Agent B: ch22 (Ride-Sharing & Geospatial)
  - Agent C: ch23 (Cloud-Native & Serverless)
- **Estimated Time:** 50 min

## Overview
- **Priority:** P1
- **Status:** pending
- Completes remaining case studies + begins modern topics. Chat and video streaming are high-frequency interview topics.

## Key Insights
- Chat systems require WebSocket expertise (builds on ch12)
- Video streaming involves CDN (ch08) + encoding pipelines
- Ride-sharing introduces geospatial indexing (unique topic)
- Cloud-native/serverless is 2026's most relevant modern topic

## Requirements

### Chapter 20: Chat & Messaging System
- Requirements: 1:1 chat, group chat, online status, message history, media
- Connection management: WebSockets, connection gateway
- Message delivery: sent/delivered/read receipts
- Message storage: per-conversation partitioning
- Group chat fan-out (small groups vs channels)
- Online presence system (heartbeat-based)
- Push notifications integration
- End-to-end encryption overview
- **Diagrams:** Mind map, system architecture, WebSocket connection flow, message delivery sequence, group message fan-out

### Chapter 21: Video Streaming Platform
- Requirements: upload, transcode, stream, recommendations
- Video upload pipeline (chunked upload, metadata)
- Transcoding: resolution ladder, adaptive bitrate (HLS/DASH)
- Video storage: original + transcoded variants
- CDN distribution for streaming
- Video player: adaptive bitrate streaming sequence
- Recommendation system brief (collaborative filtering)
- Live streaming vs VOD differences
- **Diagrams:** Mind map, upload pipeline flowchart, transcoding architecture, adaptive bitrate sequence, CDN distribution diagram

### Chapter 22: Ride-Sharing & Geospatial
- Requirements: rider request, driver matching, real-time tracking, pricing
- Geospatial indexing: geohash, quadtree, S2 cells
- Driver location tracking (GPS updates, in-memory store)
- Matching algorithm: nearest driver with ETA
- Surge pricing: supply/demand calculation
- Trip lifecycle: request → match → pickup → ride → dropoff
- Real-time tracking: location streaming to rider
- Payment processing flow
- **Diagrams:** Mind map, system architecture, geohash grid diagram, matching sequence, trip state machine, surge pricing flowchart

### Chapter 23: Cloud-Native & Serverless
- Cloud-native principles (12-factor app)
- Containers: Docker basics, image layers
- Orchestration: Kubernetes architecture (pods, services, deployments)
- Service mesh (Istio/Envoy sidecar pattern)
- Serverless: FaaS (Lambda, Cloud Functions)
- Serverless patterns: API Gateway + Lambda, event processing
- Cold start problem and mitigation
- Cost optimization: reserved vs spot vs serverless comparison
- Infrastructure as Code brief (Terraform, Pulumi)
- **Diagrams:** Mind map, K8s architecture diagram, service mesh sidecar diagram, serverless request flow, cost comparison table

## File Ownership (Exclusive)
- `part-4-case-studies/ch20-chat-messaging-system.md`
- `part-4-case-studies/ch21-video-streaming-platform.md`
- `part-4-case-studies/ch22-ride-sharing-geospatial.md`
- `part-5-modern-mastery/ch23-cloud-native-serverless.md`

## Chapter Template
Case studies (ch20-22) follow interview-style 4-step structure from Phase 6.
Ch23 follows standard concept chapter template.

## Implementation Steps

### Agent A: ch20 + ch21

**ch20-chat-messaging-system.md (500-600 lines)**
1. Mind map: chat system components
2. Requirements (functional: 1:1, group, presence, history; non-functional: <100ms latency, 99.99% uptime)
3. Capacity estimation (50M DAU, 40 messages/user/day)
4. High-level architecture diagram (client → gateway → chat service → DB)
5. WebSocket connection management -- gateway diagram
6. Message delivery sequence (sender → server → receiver with acknowledgments)
7. Sent/delivered/read receipts flow
8. Group chat: small group (push to all) vs channel (lazy load)
9. Online presence: heartbeat mechanism diagram
10. Message storage: partitioned by conversation_id
11. Push notifications for offline users
12. E2E encryption: signal protocol overview
13. Key takeaway + 5 practice questions

**ch21-video-streaming-platform.md (500-600 lines)**
1. Mind map: video platform components
2. Requirements (upload, stream, search, recommend; 1B videos, 100M DAU)
3. Capacity estimation (500 hours uploaded/min, storage, bandwidth)
4. High-level architecture diagram
5. Upload pipeline flowchart (chunked upload → object storage → transcode queue)
6. Transcoding architecture: resolution ladder (360p→4K), codec selection
7. Adaptive bitrate streaming -- HLS/DASH sequence diagram
8. CDN distribution: how video chunks reach users
9. Video metadata service (title, tags, thumbnails)
10. Recommendation system: collaborative filtering brief
11. Live streaming: RTMP ingest → transcode → HLS distribution
12. Key takeaway + 5 practice questions

### Agent B: ch22

**ch22-ride-sharing-geospatial.md (500-600 lines)**
1. Mind map: ride-sharing system
2. Requirements (request ride, match driver, track, price; 100M riders, 5M drivers)
3. Capacity estimation (10M rides/day, GPS updates every 4s)
4. High-level architecture diagram
5. Geospatial indexing comparison table (geohash vs quadtree vs S2)
6. Geohash grid diagram with proximity search
7. Driver location service: GPS updates → in-memory store (Redis geospatial)
8. Matching algorithm sequence: find nearby → rank by ETA → assign
9. Trip state machine diagram (requested → matched → arrived → in-progress → completed)
10. Surge pricing: supply/demand heatmap, pricing formula
11. Real-time tracking: location stream to rider via WebSocket
12. Payment flow: hold → charge → split
13. Key takeaway + 5 practice questions

### Agent C: ch23

**ch23-cloud-native-serverless.md (500-600 lines)**
1. Mind map: cloud-native landscape
2. 12-factor app principles table
3. Container basics: Docker image layers diagram
4. Kubernetes architecture diagram (control plane + worker nodes)
5. K8s core concepts: pods, services, deployments, ConfigMaps
6. Service mesh: sidecar proxy pattern diagram
7. Serverless FaaS: request lifecycle flowchart
8. Serverless patterns: API Gateway + Lambda, event-driven processing
9. Cold start: causes, mitigation strategies table
10. Cost comparison table: EC2 reserved vs spot vs Lambda vs Fargate
11. Infrastructure as Code: Terraform workflow diagram
12. Real-world: how Airbnb migrated to Kubernetes
13. Key takeaway + 5 practice questions

## Todo
- [ ] ch20: WebSocket architecture + message delivery sequence
- [ ] ch20: Group chat + presence + E2E encryption
- [ ] ch21: Upload pipeline + transcoding architecture
- [ ] ch21: Adaptive bitrate + CDN distribution
- [ ] ch22: Geospatial indexing (geohash/quadtree)
- [ ] ch22: Matching algorithm + trip state machine
- [ ] ch23: K8s architecture + service mesh
- [ ] ch23: Serverless patterns + cost comparison
- [ ] Verify all chapters 300-600 lines

## Success Criteria
- Case studies follow consistent 4-step interview structure
- Geospatial chapter introduces new indexing concepts not covered elsewhere
- Cloud-native chapter bridges infra concepts with modern deployment
- All capacity estimations use techniques from ch04

## Conflict Prevention
- Agent A: ONLY ch20 + ch21
- Agent B: ONLY ch22
- Agent C: ONLY ch23
- WebSocket content: ch20 uses it for chat (application), ch12 introduced protocol (theory)

## Risk Assessment
- **Medium:** Video streaming chapter could explode in scope (encoding details). Mitigate: focus on architecture, not codec internals.
- **Medium:** Geospatial indexing is niche -- keep explanation accessible.
- **Low:** Cloud-native is well-scoped.

## Next Steps
- Phase 8 completes final 2 chapters + updates README with cross-references
