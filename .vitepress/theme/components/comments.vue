<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useRoute } from 'vitepress'
import { ref, watch } from 'vue'

const route = useRoute()
const key = ref(route.path)

watch(() => route.path, (newPath) => {
  key.value = newPath
})
</script>

<template>
  <div class="giscus-comments" style="margin-top: 3em; padding-top: 2em; border-top: 1px solid var(--dracula-current-line);">
    <Giscus
      :key="key"
      repo="bachdx2812/dev-learning-hub"
      repo-id=""
      category="Comments"
      category-id=""
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      theme="dark_dimmed"
      lang="en"
      loading="lazy"
    />
    <p style="text-align: center; color: var(--dracula-comment); font-size: 0.75em; margin-top: 1em;">
      Comments powered by <a href="https://giscus.app" target="_blank" rel="noopener">Giscus</a>.
      Enable <a href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-features/managing-github-discussions" target="_blank" rel="noopener">GitHub Discussions</a> on the repo to activate.
    </p>
  </div>
</template>
