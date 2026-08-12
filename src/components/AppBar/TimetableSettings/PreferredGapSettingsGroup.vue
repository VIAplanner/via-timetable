<template>
  <div class="flex flex-col items-start justify-between">
    <MaxHoursInput />
    <MaxGapInput />
  </div>
</template>

<script setup lang="ts">
import MaxHoursInput from './MaxContinuousHoursInput.vue'
import MaxGapInput from './MaxGapInput.vue'
</script>
