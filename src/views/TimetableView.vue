<template>
  <div>
    <div
      class="overflow-y-auto max-h-[85vh] overflow-x-hidden"
      tabindex="0"
      role="region"
      aria-label="Timetable"
    >
      <TimetableGrid
        :id="store.selectedSession === FIRST_SEM ? 'exportFirstMe' : 'exportSecondMe'"
        :timetable="store.timetables[store.selectedSession]"
        :semester="store.selectedSession"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../store/timetable'
import TimetableGrid from '../components/Timetable/TimetableGrid.vue'
import { FIRST_SEM } from '../types/constants.types'

const store = useTimetableStore()
</script>
