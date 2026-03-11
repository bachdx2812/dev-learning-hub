# Phase 9: Gemini AI Image Generation

## Context Links
- [Plan Overview](plan.md)
- Depends on: ALL content phases (2-8) completed

## Parallelization
- **Group:** Sequential (runs after all content complete)
- **Agents:** 1
- **Estimated Time:** 45 min (API calls + processing)

## Overview
- **Priority:** P1
- **Status:** pending
- Generate AI images for all 25 chapters using Gemini API's imagen-4 model. Each chapter gets a header banner + 1-2 concept illustrations.

## Key Insights
- Gemini `imagen-4` generates high-quality images from text prompts
- Each chapter needs ~2-3 images (header + concepts) = ~60-75 total images
- Rate limiting: batch process with delays between requests
- Images should have consistent visual style (tech/blueprint aesthetic)

## Requirements

### Functional
- Generate header banner for each chapter (16:9 aspect ratio, infographic style)
- Generate 1-2 concept images per chapter illustrating key ideas
- Save all images to `public/images/chXX/` directories
- Update chapter markdown files to reference generated images

### Non-Functional
- Consistent visual style across all images
- Optimized file sizes (compress if needed)
- Graceful error handling (skip failed generations, log for retry)

## File Ownership (Exclusive)
```
public/images/ch01/ through public/images/ch25/ (all contents)
scripts/generate-chapter-images.ts (execution only, created in Phase 1)
```

## Implementation Steps

### 1. Image Prompt Design
For each chapter, create prompts following this pattern:
```
"A clean, modern infographic-style illustration about [TOPIC].
Technical blueprint aesthetic with dark blue background.
Show [KEY CONCEPTS] as visual elements.
Professional, educational, minimalist design.
No text overlays."
```

### 2. Chapter-Specific Image Prompts
Define prompt map for all 25 chapters:
- Ch01: System design overview with interconnected components
- Ch02: Vertical vs horizontal scaling visual metaphor
- Ch03: CAP theorem triangle, consistency spectrum
- Ch04: Powers of 2, latency numbers visual
- Ch05-Ch25: Topic-specific infographics

### 3. Batch Generation Script
- Read all chapter files to extract key concepts
- Generate prompts dynamically based on chapter content
- Call Gemini API with imagen-4 model
- Save images with descriptive names
- Add image references to chapter markdown (prepend after title)

### 4. Image Integration
Insert at top of each chapter:
```markdown
![Chapter Banner](/images/chXX/banner.png)
```
Insert concept images inline where relevant.

## Todo
- [ ] Define image prompts for all 25 chapters
- [ ] Run generation script for all header banners
- [ ] Run generation script for concept images
- [ ] Verify all images generated successfully
- [ ] Insert image references into chapter markdown files
- [ ] Test images render in VitePress dev server
- [ ] Compress images if >500KB each

## Success Criteria
- All 25 chapters have header banner images
- At least 1 concept image per chapter
- All images render correctly in VitePress
- Consistent visual style across chapters
- Total image size <50MB

## Conflict Prevention
- Only this phase writes to `public/images/` directories
- Chapter file edits limited to inserting image tags (no content changes)

## Risk Assessment
- **Medium:** Gemini API rate limits (mitigate with delays + retries)
- **Medium:** Image quality consistency (mitigate with detailed prompts)
- **Low:** File size (compress if needed)

## Next Steps
- After completion, run full VitePress build to verify site
- Deploy or share locally
