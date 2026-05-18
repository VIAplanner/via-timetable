import { computed, ref, Ref, ComputedRef } from 'vue';

const width: Ref<number> = ref(typeof window !== 'undefined' ? window.innerWidth : 0);
const height: Ref<number> = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

if (typeof window !== 'undefined') {
  updateWindowSize();
  window.addEventListener('resize', updateWindowSize);
}

/**
 * @brief Updates the stored height and width of the window
 */
function updateWindowSize(): void {
  if (typeof window === 'undefined') return;

  width.value = window.innerWidth;
  height.value = window.innerHeight;
}

interface UseWindowSizeReturn {
  width: Ref<number>;
  height: Ref<number>;
  isSmallDevice: ComputedRef<boolean>;
}

export function useWindowSize(breakpoint = 640): UseWindowSizeReturn {
  const isSmallDevice = computed(() => width.value <= breakpoint);

  return {
    width,
    height,
    isSmallDevice
  };
}