# Phase 1: VitePress Setup + Directory Structure

## Context Links
- [Plan Overview](plan.md)
- [Research: Primer Analysis](research/researcher-01-primer-analysis.md)

## Parallelization
- **Group:** Sequential (blocker for all content phases)
- **Agents:** 1
- **Estimated Time:** 20 min

## Overview
- **Priority:** P1 (blocker)
- **Status:** completed
- Initialize VitePress project with Mermaid plugin, custom theme, sidebar navigation, and Gemini image generation script.

## Key Insights
- VitePress has native Mermaid support via `vitepress-plugin-mermaid`
- Sidebar auto-generation from directory structure preferred
- Gemini API script creates images in `public/images/` per chapter
- Use `imagen-4` model for high-quality infographic generation

## Requirements

### Functional
- Init VitePress project with TypeScript config
- Configure Mermaid plugin for diagram rendering
- Create sidebar with all 5 parts and 25 chapters
- Create home page (index.md) with hero + features
- Create image generation script using Gemini API
- Set up directory structure for all parts

### Non-Functional
- Fast build times (<30s for full site)
- Mobile-responsive layout
- Dark/light mode support (VitePress default)

## File Ownership (Exclusive)
```
package.json
.vitepress/config.ts
.vitepress/theme/index.ts
.vitepress/theme/custom.css
index.md
scripts/generate-chapter-images.ts
part-1-fundamentals/index.md
part-2-building-blocks/index.md
part-3-architecture-patterns/index.md
part-4-case-studies/index.md
part-5-modern-mastery/index.md
```

## Implementation Steps

### 1. Initialize Project
```bash
npm init -y
npm install -D vitepress vitepress-plugin-mermaid mermaid
npm install @google/genai
```

### 2. Create VitePress Config (`.vitepress/config.ts`)
- Title: "System Design Learning"
- Description: "Complete guide to system design"
- Enable Mermaid plugin via `withMermaid` wrapper
- Configure sidebar with 5 parts, each listing chapters
- Configure nav with part links
- Set base URL, head metadata

### 3. Create Custom Theme (`.vitepress/theme/`)
- Extend default theme
- Add custom CSS for:
  - Chapter image styling (full-width banners)
  - Info/warning/tip boxes
  - Practice question styling
  - Mind-map container styling

### 4. Create Home Page (`index.md`)
- VitePress hero layout
- Features grid: 5 parts with icons
- Quick start guide
- Learning path overview

### 5. Create Part Index Pages
Each `part-X/index.md`:
- Part overview
- Chapter listing with descriptions
- Prerequisites

### 6. Create Image Generation Script (`scripts/generate-chapter-images.ts`)
- Uses `@google/genai` with Gemini `imagen-4` model
- For each chapter, generates:
  - Header banner image (infographic style)
  - 1-2 concept illustration images
- Saves to `public/images/chXX/`
- Handles rate limiting and retries
- Can target specific chapters or generate all

### 7. Create Directory Structure
```bash
mkdir -p part-{1..5}-*/
mkdir -p public/images/ch{01..25}
mkdir -p scripts/
```

## Todo
- [ ] npm init + install VitePress, Mermaid plugin, Gemini SDK
- [ ] Create .vitepress/config.ts with sidebar + Mermaid
- [ ] Create .vitepress/theme/ with custom styles
- [ ] Create index.md home page
- [ ] Create 5 part index pages
- [ ] Create scripts/generate-chapter-images.ts
- [ ] Create full directory structure
- [ ] Verify `npm run docs:dev` works

## Success Criteria
- `npm run docs:dev` starts dev server
- Mermaid diagrams render in browser
- Sidebar shows all 25 chapters (as placeholder links)
- Image generation script runs without errors (test with 1 chapter)

## Conflict Prevention
- Only this phase touches VitePress config and project setup files
- Content phases (2-8) only write chapter `.md` files
- Phase 9 only runs the image script + writes to `public/images/`

## Risk Assessment
- **Medium:** Mermaid plugin compatibility with latest VitePress
- **Low:** Gemini API rate limits (handled by retry logic)

## Next Steps
- Phase 2 begins immediately after Phase 1 completes
