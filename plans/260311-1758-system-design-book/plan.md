---
title: "The Engineer's Handbook - VitePress Website"
description: "VitePress-powered learning site starting with system design. Dracula theme, JetBrains Mono, Gemini AI images."
status: complete
priority: P1
effort: 12h
branch: main
tags: [system-design, vitepress, mermaid, gemini-api, dracula, learning]
created: 2026-03-11
---

# The Engineer's Handbook (VitePress + Gemini Images)

## Tech Stack
- **Site:** VitePress (static site generator)
- **Theme:** Dracula color scheme + JetBrains Mono (full monospace aesthetic)
- **Diagrams:** Mermaid.js (built-in VitePress plugin)
- **Images:** Gemini API (imagen-4, AI-generated infographics per chapter)
- **Deploy:** Vercel (auto-deploy on push)

## Site Architecture
- **Name:** The Engineer's Handbook
- **Structure:** Sections as top-level nav (System Design first, expandable later)
- **Future sections:** Design Patterns, Algorithms, etc. (added later)
- **Nav:** `System Design | (future sections)` - each section independent

## Content Decisions
- **Case studies:** Interview-depth AND production-depth (both perspectives)
- **Images:** Generated all at end (Phase 9) for style consistency
- **Chapter length:** 500-800 lines for case studies, 300-600 for concept chapters

## Execution Strategy

9 phases, max 3 concurrent agents per phase. Exclusive file ownership per agent.

## Dependency Graph

```
Phase 1 (VitePress + Vercel Setup) ──> Phase 2 (Fundamentals ch01-04)
  ──> Phase 3 (Building Blocks A ch05-08) ──> Phase 4 (Building Blocks B ch09-12)
  ──> Phase 5 (Architecture ch13-15) ──> Phase 6 (Arch+Cases ch16-19)
  ──> Phase 7 (Cases+Modern ch20-23) ──> Phase 8 (Final ch24-25 + polish)
  ──> Phase 9 (Gemini Image Generation - after all content)
```

## File Ownership Matrix

| Phase | Exclusive Files |
|-------|----------------|
| 1 | `package.json`, `.vitepress/`, `index.md`, `scripts/`, `vercel.json`, dirs |
| 2 | `system-design/part-1-fundamentals/ch01-*` through `ch04-*` |
| 3 | `system-design/part-2-building-blocks/ch05-*` through `ch08-*` |
| 4 | `system-design/part-2-building-blocks/ch09-*` through `ch12-*` |
| 5 | `system-design/part-3-architecture-patterns/ch13-*` through `ch15-*` |
| 6 | `system-design/part-3-*/ch16-*,ch17-*`, `system-design/part-4-*/ch18-*,ch19-*` |
| 7 | `system-design/part-4-*/ch20-22`, `system-design/part-5-*/ch23-*` |
| 8 | `system-design/part-5-*/ch24-*,ch25-*`, sidebar update |
| 9 | `public/images/**`, script execution |

## Phase Status

| # | Phase | File | Status |
|---|-------|------|--------|
| 1 | VitePress + Vercel Setup | [phase-01-vitepress-setup.md](phase-01-vitepress-setup.md) | complete |
| 2 | Part 1 Fundamentals | [phase-02-part1-fundamentals.md](phase-02-part1-fundamentals.md) | complete |
| 3 | Part 2 Blocks A | [phase-03-part2-building-blocks-group-a.md](phase-03-part2-building-blocks-group-a.md) | complete |
| 4 | Part 2 Blocks B | [phase-04-part2-building-blocks-group-b.md](phase-04-part2-building-blocks-group-b.md) | complete |
| 5 | Part 3 Arch Core | [phase-05-part3-architecture-core.md](phase-05-part3-architecture-core.md) | complete |
| 6 | Part 3 + Cases A | [phase-06-part3-remaining-part4-group-a.md](phase-06-part3-remaining-part4-group-a.md) | complete |
| 7 | Part 4 + Modern | [phase-07-part4-remaining-part5-start.md](phase-07-part4-remaining-part5-start.md) | complete |
| 8 | Final + Polish | [phase-08-part5-final-polish.md](phase-08-part5-final-polish.md) | complete |
| 9 | Image Generation | [phase-09-gemini-image-generation.md](phase-09-gemini-image-generation.md) | complete |

## Validation Summary

**Validated:** 2026-03-11
**Questions asked:** 7

### Confirmed Decisions
- **Theme:** Dracula color scheme (dark purple/pink/green on dark bg)
- **Font:** JetBrains Mono everywhere (full hacker/terminal aesthetic)
- **Site name:** The Engineer's Handbook (expandable beyond system design)
- **Structure:** Sections as top-level nav; System Design first, add Design Patterns etc. later
- **Case studies:** Both interview-depth AND production-depth coverage
- **Images:** All generated at end (Phase 9) for consistency
- **Deploy:** Vercel with auto-deploy

### Action Items
- [ ] Update Phase 1 to include Vercel config + Dracula theme + JetBrains Mono
- [ ] Update file paths: content under `system-design/` section prefix
- [ ] Update case study phases (6-7) to include production-depth sections
- [ ] Add design research findings to Phase 1 when research completes

## Research Reports
- [researcher-01-primer-analysis.md](research/researcher-01-primer-analysis.md)
- [researcher-02-complete-taxonomy.md](research/researcher-02-complete-taxonomy.md)
- [researcher-03-nerdy-design-aesthetic.md](research/researcher-03-nerdy-design-aesthetic.md) (in progress)
