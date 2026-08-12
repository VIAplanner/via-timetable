<template>
  <div
    class="filter shadow-md shadow-shadow flex flex-row items-center w-full bg-timetablecell mb-2 rounded-md"
  >
    <div
      class="rounded-l-md w-1 h-10 mr-2 shrink-0"
      :style="{
        backgroundColor: course.color,
      }"
    />
    <div class="flex flex-row items-center justify-between w-full">
      <h2>{{ course.courseData.code }}</h2>
      <div class="flex flex-row">
        <Button
          icon="pi pi-pen-to-square"
          text
          rounded
          icon-class="text-text-primary"
          aria-label="Edit Course"
          @click="editCourse()"
        />
        <Button
          icon-class="text-text-primary"
          icon="pi pi-trash"
          text
          rounded
          aria-label="Delete Course"
          @click="deleteCourse()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '../../store/timetable'
import { SelectedCourseData } from '../../types/app_state.types'

const store = useTimetableStore()

const props = defineProps<{
  course: SelectedCourseData
}>()

/**
 * @brief Opens the details card of the course given by props
 */
function editCourse() {
  store.setDetailCardVisibility(
    `${props.course.courseData.code} ${props.course.courseData.sectionCode}`,
    true,
  )
}

/**
 * @brief Deletes the course given by props from the timetable
 */
function deleteCourse() {
  store.removeCourse(props.course.courseData.code)
  store.saveStateHistory()
}
</script>
