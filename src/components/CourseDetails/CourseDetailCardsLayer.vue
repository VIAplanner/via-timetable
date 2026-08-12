<template>
  <div>
    <CourseDetailsPopup
      v-for="card of visibleCards"
      :key="card.course"
      v-bind="card.props"
      @close="store.setDetailCardVisibility(card.course, false)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTimetableStore } from '../../store/timetable'

import CourseDetailsPopup from './CourseDetailsPopup.vue'
import { CourseCardProps } from '../../types/app_state.types'

const store = useTimetableStore()

const visibleCards = computed(() => {
  return store.cards.filter(
    (card: { course: string; visible: boolean; props: CourseCardProps }) => card && card.visible,
  )
})
</script>
