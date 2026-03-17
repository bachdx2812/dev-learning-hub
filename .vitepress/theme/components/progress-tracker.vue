<template>
  <div v-if="shouldRender" class="progress-tracker">
    <!-- Progress bar section: always visible on chapter pages and system-design index -->
    <div class="progress-bar-wrapper" aria-label="Handbook progress">
      <div class="progress-bar-track">
        <div
          class="progress-bar-fill"
          :style="{ width: progressPercent + '%' }"
          role="progressbar"
          :aria-valuenow="progressPercent"
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      <span class="progress-label">
        {{ completedCount }}/{{ TOTAL_CHAPTERS }} chapters completed ({{ progressPercent }}%)
      </span>
    </div>

    <!-- Mark complete button: only on chapter pages -->
    <div v-if="chapterId" class="chapter-toggle">
      <button
        class="mark-complete-btn"
        :class="{ completed: isCompleted(chapterId) }"
        @click="toggle(chapterId)"
        :aria-pressed="isCompleted(chapterId)"
      >
        <span class="btn-icon">{{ isCompleted(chapterId) ? '✓' : '○' }}</span>
        {{ isCompleted(chapterId) ? 'Completed' : 'Mark as Complete' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useChapterProgress } from '../composables/use-chapter-progress'

const route = useRoute()
const { toggle, isCompleted, completedCount, progressPercent, TOTAL_CHAPTERS } = useChapterProgress()

// Extract section-prefixed chapter ID from path: /database/.../ch01-introduction → "database-ch01"
const chapterId = computed(() => {
  const match = route.path.match(/\/(system-design|database|design-patterns)\/.*\/(ch\d{2})-/)
  return match ? `${match[1]}-${match[2]}` : null
})

// Render on chapter pages or any section index
const isSectionIndex = computed(() => {
  const p = route.path
  return p === '/system-design/' || p === '/database/' || p === '/design-patterns/' ||
    p.endsWith('/system-design/index.html') || p.endsWith('/database/index.html') || p.endsWith('/design-patterns/index.html')
})

const shouldRender = computed(() =>
  chapterId.value !== null || isSectionIndex.value
)
</script>

<style scoped>
.progress-tracker {
  margin-bottom: 1.5rem;
  padding: 0.875rem 1rem;
  background: #282a36;
  border: 1px solid #44475a;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.progress-bar-track {
  flex: 1;
  height: 8px;
  background: #44475a;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #bd93f9;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 0.8rem;
  color: #6272a4;
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
}

.chapter-toggle {
  display: flex;
}

.mark-complete-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.875rem;
  font-size: 0.82rem;
  font-family: inherit;
  border-radius: 6px;
  border: 1px solid #44475a;
  background: transparent;
  color: #6272a4;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mark-complete-btn:hover {
  border-color: #bd93f9;
  color: #bd93f9;
}

.mark-complete-btn.completed {
  border-color: #50fa7b;
  color: #50fa7b;
  background: rgba(80, 250, 123, 0.08);
}

.mark-complete-btn.completed:hover {
  background: rgba(80, 250, 123, 0.15);
}

.btn-icon {
  font-size: 0.9rem;
  line-height: 1;
}
</style>
