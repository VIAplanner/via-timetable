<template>
  <div class="flex flex-col items-start justify-between">
    <div class="flex flex-row items-start justify-between">
      <TimeSettingSelect v-model:output="start" label="Pref. Min Start" default-value="9am" />
      <TimeSettingSelect v-model:output="maxEnd" label="Pref. Max End" default-value="3pm" />
    </div>
    <div class="flex flex-row items-start justify-between">
      <MaxDayLengthInput />
      <MinDayLengthInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { useTimetableStore } from '../../../store/timetable'
import TimeSettingSelect from './TimeSettingSelect.vue'
import MaxDayLengthInput from './MaxDayLengthInput.vue'
import MinDayLengthInput from './MinDayLengthInput.vue'

const store = useTimetableStore() as any

const start: Ref<number> = ref(store.preferredStart || 9)
const maxEnd: Ref<number> = ref(store.preferredMaxEnd || 15)

watch(start, (val: number) => {
  if (val !== store.start) store.preferredStart = val
})

watch(
  () => store.start,
  (val: number) => {
    if (val !== start.value) start.value = val
  },
)

watch(maxEnd, (val: number) => {
  if (val !== store.maxEnd) store.preferredMaxEnd = val
})

watch(
  () => store.maxEnd,
  (val: number) => {
    if (val !== maxEnd.value) maxEnd.value = val
  },
)
</script>
