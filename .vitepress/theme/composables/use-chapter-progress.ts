import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'handbook-progress'
const TOTAL_CHAPTERS = 25

export function useChapterProgress() {
  const completed = ref<Record<string, boolean>>({})

  onMounted(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) completed.value = JSON.parse(stored)
    } catch {
      // localStorage unavailable or data corrupted — silently reset
    }
  })

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed.value))
    } catch {
      // ignore write errors
    }
  }

  const toggle = (chapterId: string) => {
    completed.value = {
      ...completed.value,
      [chapterId]: !completed.value[chapterId]
    }
    save()
  }

  const isCompleted = (chapterId: string) => !!completed.value[chapterId]

  const completedCount = computed(() =>
    Math.min(TOTAL_CHAPTERS, Object.values(completed.value).filter(Boolean).length)
  )

  const progressPercent = computed(() =>
    Math.min(100, Math.round((completedCount.value / TOTAL_CHAPTERS) * 100))
  )

  return { completed, toggle, isCompleted, completedCount, progressPercent, TOTAL_CHAPTERS }
}
