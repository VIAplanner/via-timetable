<template>
  <div class="m-2">
    <label for="onlinePreferenceSetting" class="block mb-0 text-sm font-bold"
      >Online Preference</label
    >
    <SelectButton
      v-model="onlinePreference"
      :options="options"
      :allow-empty="false"
      :pt:root:class="'shadow-md'"
      :pt:pcToggleButton:root:id="'onlinePreferenceSetting'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTimetableStore } from '../../../store/timetable'
import { ONLINE_HI, ONLINE_LO, ONLINE_MI, OnlinePreference } from '../../../types/constants.types'

const store = useTimetableStore()

const onlinePreference = ref(store.onlinePreference ?? ONLINE_MI)

const options = ref([ONLINE_LO, ONLINE_MI, ONLINE_HI])

watch(onlinePreference, (val: OnlinePreference) => {
  if (val !== store.onlinePreference) store.onlinePreference = val
})

watch(
  () => store.onlinePreference,
  (val: OnlinePreference) => {
    if (val !== onlinePreference.value) onlinePreference.value = val
  },
)
</script>
