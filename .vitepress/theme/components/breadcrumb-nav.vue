<template>
  <nav v-if="crumbs.length > 1" class="breadcrumb-nav" aria-label="Breadcrumb">
    <ol>
      <li v-for="(crumb, i) in crumbs" :key="crumb.path">
        <a v-if="i < crumbs.length - 1" :href="crumb.path">{{ crumb.label }}</a>
        <span v-else aria-current="page">{{ crumb.label }}</span>
        <span v-if="i < crumbs.length - 1" class="sep" aria-hidden="true"> / </span>
      </li>
    </ol>
    <!-- BreadcrumbList JSON-LD for SEO -->
    <component :is="'script'" type="application/ld+json">{{ jsonLd }}</component>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const BASE_URL = 'https://bachdx-learning-hub.vercel.app'

// Static label map for known part segments
const PART_LABELS: Record<string, string> = {
  'part-1-fundamentals': 'Part 1: Fundamentals',
  'part-2-building-blocks': 'Part 2: Building Blocks',
  'part-3-architecture-patterns': 'Part 3: Architecture & Patterns',
  'part-4-case-studies': 'Part 4: Case Studies',
  'part-5-modern-mastery': 'Part 5: Modern Mastery',
}

// Convert a path segment to a human-readable label
function segmentToLabel(seg: string): string {
  if (seg === 'system-design') return 'System Design'
  if (PART_LABELS[seg]) return PART_LABELS[seg]

  // Match chXX-name pattern e.g. ch09-databases-sql → "Ch 09: Databases Sql"
  const chMatch = seg.match(/^ch(\d+)-(.+)$/)
  if (chMatch) {
    const num = chMatch[1]
    const name = chMatch[2]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return `Ch ${num}: ${name}`
  }

  // Generic fallback: title-case hyphenated segment
  return seg
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const route = useRoute()

// Build breadcrumb items from the current path
const crumbs = computed(() => {
  // Strip leading slash and trailing .html / index
  const clean = route.path.replace(/^\//, '').replace(/(index)?\.html$/, '').replace(/\/$/, '')
  if (!clean) return []

  const segments = clean.split('/')
  const items = [{ label: 'Home', path: '/' }]

  let cumulative = ''
  for (const seg of segments) {
    cumulative += `/${seg}`
    items.push({ label: segmentToLabel(seg), path: cumulative })
  }

  return items
})

// JSON-LD BreadcrumbList structured data
const jsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.value.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: `${BASE_URL}${crumb.path}`,
    })),
  })
)
</script>

<style scoped>
.breadcrumb-nav {
  margin-bottom: 1em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.85em;
  color: var(--dracula-comment);
}

.breadcrumb-nav ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0;
}

.breadcrumb-nav li {
  display: flex;
  align-items: center;
}

.breadcrumb-nav a {
  color: var(--dracula-purple);
  text-decoration: none;
  transition: color 0.15s ease;
}

.breadcrumb-nav a:hover {
  color: var(--dracula-pink);
  text-decoration: underline;
}

.breadcrumb-nav span[aria-current="page"] {
  color: var(--dracula-fg);
}

.sep {
  color: var(--dracula-comment);
  margin: 0 0.25em;
  user-select: none;
}
</style>
