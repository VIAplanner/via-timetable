import { computed, ref, Ref, ComputedRef } from 'vue'

const width = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
const height = ref(typeof window !== 'undefined' ? window.innerHeight : 0)

if (typeof window !== 'undefined') {
  updateWindowSize()
  window.addEventListener('resize', updateWindowSize)
}

/**
 * @brief Updates the stored height and width of the window
 */
function updateWindowSize(): void {
  if (typeof window === 'undefined') return

  width.value = window.innerWidth
  height.value = window.innerHeight
}

/** Encodes data about the current state of the window */
interface UseWindowSizeReturn {
  width: Ref<number> // Width in px
  height: Ref<number> // Height in px
  isSmallDevice: ComputedRef<boolean> // Whether the window is "small", for mobile formats etc.
}

export function useWindowSize(breakpoint = 640): UseWindowSizeReturn {
  const isSmallDevice = computed(() => width.value <= breakpoint)

  return {
    width,
    height,
    isSmallDevice,
  }
}
