<template>
  <div>
    <!-- eslint-disable vue/attribute-hyphenation -->
    <SelectButton
      v-model="selectedSession"
      :options="sessions"
      :allow-empty="false"
      :pt:root:class="'shadow-md'"
      :size="isSmallDevice ? 'small' : 'large'"
      :pt:pcToggleButton:root:class="isSmallDevice ? 'px-0.5! py-0.5! text-xs!' : ''"
      :class="isSmallDevice ? 'mr-1' : ''"
    />
    <!-- eslint-enable vue/attribute-hyphenation -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTimetableStore } from '../../store/timetable'
import { useWindowSize } from '../../composables/useWindowSize'
import { FIRST_SEM, SEMESTER_CODES } from '../../types/constants.types'

const store = useTimetableStore()
const { isSmallDevice } = useWindowSize()

const sessions = ref([...SEMESTER_CODES])

const selectedSession = ref(store.selectedSession || FIRST_SEM)

watch(selectedSession, (val) => {
  if (val !== store.selectedSession) store.selectedSession = val
})

watch(
  () => store.selectedSession,
  (val) => {
    if (val !== selectedSession.value) selectedSession.value = val
  },
)
</script>

<style>
span[data-p~='checked'] {
  background-color: var(--color-active) !important;
  color: white;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
