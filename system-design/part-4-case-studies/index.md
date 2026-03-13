---
title: "Part 4: Case Studies"
description: "Design real-world systems end-to-end: URL shortener, social media feed, chat system, video streaming platform, and ride-sharing with geospatial matching — interview-ready."
---

# Part 4 — Case Studies

> Real systems, real constraints. Apply everything from Parts 1-3.

**Prerequisites:** [Part 3 — Architecture & Patterns](/system-design/part-3-architecture-patterns/) (all chapters)

---

## Overview

Part 4 applies every concept from previous parts to real-world system designs. Each chapter follows both interview-style (requirements → estimation → design → deep dive) and production-style (monitoring, failure modes, cost) approaches.

By the end of Part 4, you'll be able to:
- Design a URL shortener handling billions of redirects
- Architect a social media feed with fan-out strategies
- Build a real-time chat system with delivery guarantees
- Design a video streaming platform with adaptive bitrate
- Create a ride-sharing system with geospatial matching

---

## Chapters

### [Chapter 18 — URL Shortener & Pastebin](/system-design/part-4-case-studies/ch18-url-shortener-pastebin)
Base62 encoding, consistent hashing, read-heavy optimization, analytics tracking. The #1 interview question.

### [Chapter 19 — Social Media Feed](/system-design/part-4-case-studies/ch19-social-media-feed)
Fan-out on write vs read, hybrid approach for celebrities, feed ranking, notification system.

### [Chapter 20 — Chat & Messaging System](/system-design/part-4-case-studies/ch20-chat-messaging-system)
WebSockets, message delivery guarantees, group chat fan-out, online presence, end-to-end encryption.

### [Chapter 21 — Video Streaming Platform](/system-design/part-4-case-studies/ch21-video-streaming-platform)
Upload pipeline, transcoding, adaptive bitrate (HLS/DASH), CDN distribution, recommendation system.

### [Chapter 22 — Ride-Sharing & Geospatial](/system-design/part-4-case-studies/ch22-ride-sharing-geospatial)
Geohash/quadtree, driver matching, surge pricing, real-time tracking, trip lifecycle.

---

## Time Estimate

~8 hours of focused reading and practice.
