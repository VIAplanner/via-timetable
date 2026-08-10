<template>
  <div>
    <Button
      v-tooltip.left="tooltip('View the Tutorial')"
      icon="pi pi-question"
      rounded
      :pt:root:class="'bg-green-400 border-green-400 text-white'"
      class="shadow-md"
      aria-label="View the Tutorial"
      @click="setTutorial"
    />
  </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable'
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip'

const store = useTimetableStore()
const { tooltip } = useResponsiveTooltip()

function setTutorial() {
  store.tutorialPopup = true
}
</script>
