<template>
  <div>
    <div>
      <h2 class="font-bold text-lg">Select Divisions</h2>
      <div v-for="division of divisions" :key="division.value" class="flex items-center gap-2">
        <Checkbox v-model="selectedDivisions" :input-id="division.value" name="division" :value="division.value" />
        <label :for="division.value">
          {{ division.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import { useTimetableStore } from '../../../store/timetable'
import { Division } from '../../../types/reference_data.types'

const store = useTimetableStore()

const selectedDivisions = ref([...(store.selectedDivisions || [])])
const divisions = ref<Division[]>([])

watch(
  selectedDivisions,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(store.selectedDivisions))
      store.selectedDivisions = val
  },
  { deep: true },
)

watch(
  () => store.selectedDivisions,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(selectedDivisions.value))
      selectedDivisions.value = [...(val || [])]
  },
  { deep: true },
)

watchEffect(async () => {
  divisions.value = (await store.getDivisions()) || []
})
</script>
