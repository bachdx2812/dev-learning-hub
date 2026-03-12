<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const { frontmatter } = useData()

const baseUrl = 'https://bachdx-learning-hub.vercel.app'

const shareUrl = computed(() => `${baseUrl}${route.path}`)
const shareTitle = computed(() => frontmatter.value.title || "The Engineer's Handbook")

const twitterUrl = computed(() =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle.value)}&url=${encodeURIComponent(shareUrl.value)}`
)

const linkedinUrl = computed(() =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`
)

const copyLink = () => {
  navigator.clipboard.writeText(shareUrl.value)
  const btn = document.querySelector('.copy-link-btn')
  if (btn) {
    btn.textContent = '✓ Copied!'
    setTimeout(() => { btn.textContent = '🔗 Copy link' }, 2000)
  }
}
</script>

<template>
  <div class="share-buttons" style="margin-top: 2em; padding-top: 1.5em; border-top: 1px solid var(--dracula-current-line); display: flex; gap: 0.75em; flex-wrap: wrap; align-items: center;">
    <span style="color: var(--dracula-comment); font-size: 0.85em; margin-right: 0.5em;">Share:</span>
    <a
      :href="twitterUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="share-btn"
      aria-label="Share on Twitter"
    >
      𝕏 Twitter
    </a>
    <a
      :href="linkedinUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="share-btn"
      aria-label="Share on LinkedIn"
    >
      in LinkedIn
    </a>
    <button
      class="share-btn copy-link-btn"
      @click="copyLink"
      aria-label="Copy link to clipboard"
    >
      🔗 Copy link
    </button>
  </div>
</template>

<style scoped>
.share-btn {
  background: var(--dracula-current-line);
  color: var(--dracula-fg) !important;
  border: 1px solid var(--dracula-comment);
  border-radius: 6px;
  padding: 0.4em 0.8em;
  font-size: 0.8em;
  font-family: 'JetBrains Mono', monospace;
  cursor: pointer;
  text-decoration: none !important;
  transition: all 0.2s ease;
}
.share-btn:hover {
  border-color: var(--dracula-purple);
  color: var(--dracula-purple) !important;
  background: rgba(189, 147, 249, 0.1);
}
</style>
