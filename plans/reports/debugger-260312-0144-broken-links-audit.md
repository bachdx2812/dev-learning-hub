# Broken Links Audit — VitePress Site
**Date:** 2026-03-12
**Site:** http://localhost:5173/
**Scope:** All markdown files in `system-design/`, `index.md`, `.vitepress/config.ts`

---

## Executive Summary

**1 broken link found** across the entire site. All 31 sidebar navigation entries are valid. All 25 chapter banner images exist. All internal cross-reference links between chapters are valid.

---

## Broken Links

### BROKEN — `index.md` line 14

| Field | Value |
|-------|-------|
| **Source file** | `/Users/macos/apps/self/system-design-learning/index.md` |
| **Line** | 14 |
| **Link text** | `Jump to Chapter 1` |
| **Broken URL** | `/system-design/part-1-fundamentals/ch01-scale-from-zero-to-millions` |
| **Correct URL** | `/system-design/part-1-fundamentals/ch01-introduction-to-system-design` |
| **Root cause** | Filename mismatch — link uses old/wrong chapter slug `ch01-scale-from-zero-to-millions`; actual file is `ch01-introduction-to-system-design.md` |

**Broken link in context:**

```yaml
# index.md lines 13-14
actions:
  - theme: alt
    text: Jump to Chapter 1
    link: /system-design/part-1-fundamentals/ch01-scale-from-zero-to-millions   # ← BROKEN
```

**Fix:**
```yaml
    link: /system-design/part-1-fundamentals/ch01-introduction-to-system-design
```

---

## All-Clear Areas

### Sidebar Navigation (config.ts) — ALL VALID
All 31 entries verified against existing `.md` files on disk:

| Link | File Exists |
|------|-------------|
| `/system-design/` | `system-design/index.md` ✓ |
| `/system-design/part-1-fundamentals/` | `system-design/part-1-fundamentals/index.md` ✓ |
| `…/ch01-introduction-to-system-design` | `ch01-introduction-to-system-design.md` ✓ |
| `…/ch02-scalability` | `ch02-scalability.md` ✓ |
| `…/ch03-core-tradeoffs` | `ch03-core-tradeoffs.md` ✓ |
| `…/ch04-estimation` | `ch04-estimation.md` ✓ |
| `/system-design/part-2-building-blocks/` | `part-2-building-blocks/index.md` ✓ |
| `…/ch05-dns` through `…/ch12-communication-protocols` | all 8 files ✓ |
| `/system-design/part-3-architecture-patterns/` | index.md ✓ |
| `…/ch13-microservices` through `…/ch17-monitoring-observability` | all 5 files ✓ |
| `/system-design/part-4-case-studies/` | index.md ✓ |
| `…/ch18-url-shortener-pastebin` through `…/ch22-ride-sharing-geospatial` | all 5 files ✓ |
| `/system-design/part-5-modern-mastery/` | index.md ✓ |
| `…/ch23-cloud-native-serverless` through `…/ch25-interview-framework-cheat-sheets` | all 3 files ✓ |

### Chapter Cross-Reference Links — ALL VALID
All inline cross-reference links within chapters (e.g. "see Chapter 7", "see Ch03") resolve to existing pages. Verified for all 25 chapter files.

### Banner Images (`/images/ch*/banner.png`) — ALL VALID
All 25 chapter banner images referenced at line 7 of each chapter exist in `public/images/`:
- `ch01` through `ch25` — all 25 `/images/ch*/banner.png` files present ✓

### Part Index Navigation Links — ALL VALID
- `system-design/part-1-fundamentals/index.md` — 4 chapter links ✓
- `system-design/part-2-building-blocks/index.md` — 8 chapter links ✓
- `system-design/part-3-architecture-patterns/index.md` — 5 chapter links ✓
- `system-design/part-4-case-studies/index.md` — 5 chapter links ✓
- `system-design/part-5-modern-mastery/index.md` — 3 chapter links ✓

---

## Fix Required

**File:** `/Users/macos/apps/self/system-design-learning/index.md`
**Line 14:** Change link from `ch01-scale-from-zero-to-millions` → `ch01-introduction-to-system-design`

---

## Notes

- VitePress config has `ignoreDeadLinks: [/^http:\/\/localhost/]` — localhost links in plan reports are intentionally skipped by VitePress build checker.
- No relative `.md` file links found (all links are absolute `/` paths) — no relative path resolution issues possible.
- Bash and WebFetch tools were unavailable for live HTTP status checks; link validation performed statically by cross-referencing link targets against actual file paths on disk using VitePress `cleanUrls: true` mapping rules.
