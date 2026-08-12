<template>
  <div>
    <Button v-tooltip.left="tooltip('Export Timetables')" rounded icon="pi pi-download" :pt:root:class="'text-white'"
      aria-label="Export Timetables" @click="exportTimetables()" />

    <div v-if="exportSemester" aria-hidden="true" class="export-template-stage">
      <ExportTimetableTemplate :semester="exportSemester" :timetable="store.timetables[exportSemester]"
        :title="exportTitle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { toPng } from 'html-to-image'
import { useTimetableStore } from '../../store/timetable'
import ExportTimetableTemplate from './ExportTimetableTemplate.vue'
import { useResponsiveTooltip } from '../../composables/useResponsiveTooltip'
import { FIRST_SEM, SECOND_SEM, SemesterCode } from '../../types/constants.types'
import { SessionGroup } from '../../types/reference_data.types'

const store = useTimetableStore()
const { tooltip } = useResponsiveTooltip()
const exportSemester = ref<SemesterCode | null>(null)
const exportTitle = ref('')

/**
 * @brief Converts a semester code and list of session groups into the subsession within the currently selected session
 * group
 * @param sessions The list of session groups
 * @param semester The semester code
 */
function getSemesterTitle(sessions: SessionGroup[], semester: string): string {
  const sessionGroup = sessions.find((group) => group.group === store.selectedSessionGroup)

  if (!sessionGroup) return ''

  const sessionKey = ` (${semester})`
  const subsession = sessionGroup.subsessions.find((entry) => entry.label.includes(sessionKey))

  return subsession ? subsession.label.replace(sessionKey, '') : ''
}

/**
 * @brief Downloads the timetable for a given semester
 * @param semester The semester code
 * @param title The title that should be displayed on the downloaded timetable
 */
async function captureSemester(semester: SemesterCode, title: string) {
  store.selectedSession = semester
  exportSemester.value = semester
  exportTitle.value = title

  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await nextTick()

  const elementId = `exportTemplate-${semester}`
  const timetableElement = document.getElementById(elementId)

  if (!timetableElement) return

  const dataURL = await toPng(timetableElement, {
    backgroundColor: '#ffffff',
    pixelRatio: 2,
    skipFonts: true,
  })

  const link = document.createElement('a')
  link.href = dataURL
  link.download = `VIAplanner-${semester}.png`
  link.click()
}

/**
 * @brief Downloads all semesters timetables that have at least one event in them
 */
async function exportTimetables() {
  // Export all semesters that have at least one selected course.
  const originalSession = store.selectedSession
  const semestersToExport = [FIRST_SEM, SECOND_SEM].filter(
    (semester) => Object.keys(store.selectedCourses[semester] || {}).length > 0,
  )

  if (!semestersToExport.length) return

  try {
    const sessions = await store.getSessions()
    if (!sessions) return
    for (const semester of semestersToExport) {
      const semesterTitle = getSemesterTitle(sessions, semester)
      await captureSemester(semester, semesterTitle)
    }
  } finally {
    exportSemester.value = null
    exportTitle.value = ''
    store.selectedSession = originalSession
  }
}
</script>

<style scoped>
.export-template-stage {
  position: fixed;
  left: -10000px;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
