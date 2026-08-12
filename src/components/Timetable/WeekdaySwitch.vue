<template>
  <div class="flex flex-row items-center justify-center">
    <div
      class="flex flex-row justify-center items-center mx-0 w-full cursor-pointer select-none"
      role="button"
      tabindex="0"
      aria-label="Toggle day lock"
      :style="{ height: height }"
      @click="toggleDayLock()"
      @keydown.enter.prevent="toggleDayLock()"
      @keydown.space.prevent="toggleDayLock()"
    >
      <h3 class="day-label m-0 font-bold leading-none text-sm md:text-md lg:text-lg">
        {{ weekdayLabel || weekday }}
      </h3>
      <div
        v-if="locked && !isExport"
        v-tooltip.bottom="tooltip(toolTipText)"
        class="absolute -bottom-6"
      >
        <Button
          icon="pi pi-lock"
          rounded
          text
          icon-class="text-text-primary"
          aria-label="Toggle Day Lock"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useTimetableStore } from '../../store/timetable'
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip'
import { SemesterCode, Weekday } from '../../types/constants.types'

const store = useTimetableStore()
const { tooltip } = useResponsiveTooltip()

const props = defineProps({
  weekday: {
    type: String as PropType<Weekday>,
    required: true,
  },
  weekdayLabel: {
    type: String,
    default: null,
  },
  semester: {
    type: String as PropType<SemesterCode>,
    required: true,
  },
  isExport: {
    type: Boolean,
    required: false,
    default: false,
  },
  height: {
    type: String,
    required: true,
  },
})

const locked = computed(() => {
  const blockedTimesForSemester = store.blockedTimes[props.semester] || []
  const dayBlocks = blockedTimesForSemester.filter((blocker) => blocker.day === props.weekday)

  for (let hour = 8; hour <= 22; hour++) {
    const start = hour * 3600
    const end = start + 3600

    if (!dayBlocks.some((blocker) => blocker.start === start && blocker.end === end)) return false
  }

  return true
})

const toolTipText = computed(() => {
  return locked.value ? 'Unblock All Times' : 'Block All Times'
})

/**
 * @brief Toggles a lock for all hours of the day specific by props
 */
async function toggleDayLock() {
  await store.setLockedDayStatus(props.weekday, !locked.value)
  store.saveStateHistory()
}
</script>

<style scoped>
.day-label {
  text-align: center;
}
</style>
