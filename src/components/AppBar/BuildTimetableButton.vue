<template>
  <div class="flex h-full items-center">
    <Button
      label="Build Timetable"
      icon="pi pi-calendar"
      icon-pos="left"
      class="text-white"
      @click="build"
    />
  </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable'
const store = useTimetableStore()

function build() {
  store.switchSession = false
  store.generateTimetable()
}
</script>
