<template>
  <div :id="`exportTemplate-${semester}`" class="export-template">
    <link rel="stylesheet" href="https://unpkg.com/primeicons/primeicons.css" />
    <div class="export-template__header">
      <img alt="VIAplanner logo" :src="logo" class="max-w-32.5 h-15 m-2 mr-0" />
      <p class="export-template__subtitle ml-2">{{ title }} Timetable</p>
    </div>

    <div class="export-template__content">
      <Timetable :timetable="timetable" :semester="semester" :is-export="true" />
    </div>

    <div class="export-template__footer">
      <slot name="watermark">
        <p class="export-template__watermark">Generated with VIAplanner (viaplanner.net)</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Timetable from '../Timetable/Timetable.vue'
import logo from '../../assets/VIA-Planner-Blue.png?inline'
import { SemesterCode } from '../../types/constants.types.js'
import { SemesterEventsData } from '../../types/app_state.types.js'

const props = defineProps<{
  semester: SemesterCode
  timetable: SemesterEventsData
  title: string
}>()
</script>

<style scoped>
.export-template {
  width: 1280px;
  padding: 24px;
  background: #ffffff;
  color: #101828;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.12);
}

.export-template__header {
  margin-bottom: 12px;
}

.export-template__title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
}

.export-template__subtitle {
  margin: 4px 0 0;
  font-size: 15px;
  color: #475467;
}

.export-template__content {
  background: #ffffff;
}

.export-template__footer {
  margin-top: 12px;
  text-align: right;
}

.export-template__watermark {
  margin: 0;
  font-size: 12px;
  color: #667085;
}
</style>
