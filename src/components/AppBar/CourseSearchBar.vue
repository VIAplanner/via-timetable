<template>
  <div class="w-3 md:w-4">
    <AutoComplete ref="searchBarComponent" v-model="currentQuery" option-label="formattedName" :suggestions="allCourses"
      loader="pi pi-spinner" :loading="loading"
      :placeholder="!loading ? (isSmallDevice ? 'Search' : 'Search courses...') : 'Loading...'" :input-style="{
        'background-color': dynamicColor,
        border: 'none',
        'border-radius': '16px',
        color: dynamicTextColor,
      }" :pt="{
        panel: {
          style: isSmallDevice
            ? { width: 'calc(100vw - 1rem)', maxWidth: 'calc(100vw - 1rem)' }
            : { maxWidth: '42rem' },
        },
        option: {
          style: {
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
          },
        },
      }" fluid @complete="populateRecommendations()" @focus="onFocus()" @blur="isActive = false"
      @option-select="courseSearched()" @min-length="5" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { useTimetableStore } from '../../store/timetable'
import { useWindowSize } from '../../composables/useWindowSize'
import { Course, CourseSearchResponse } from '../../types/courses.types'

/** Represents a single course for the purposes of displaying in the search bar, so it encodes only essential data */
interface SearchCourse extends Course {
  formattedName?: string
}

const store = useTimetableStore()
const { isSmallDevice } = useWindowSize()

const searchBarComponent = ref<{ overlayVisible: boolean } | null>(null)
const allCourses = ref<SearchCourse[]>([])
const loading = ref(false)
const isActive = ref(false)
const currentQuery = ref<SearchCourse | string | null>(null)

const dynamicTextColor = computed(() => {
  return store.darkMode ? '#ffffff' : '#222222'
})

const dynamicColor = computed(() => {
  if (isActive.value || currentQuery.value) return store.darkMode ? '#18181b' : '#ffffff'
  return store.darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(179, 179, 179, 0.3)'
})

function parseSessionEmoji(sessions: string[]) {
  return sessions
    .map((session) => {
      if (session.length < 5) return ''

      const month = session.substring(4, 5)

      return session.length === 6 ? '☀️' : month === '9' ? '🍁' : month === '5' ? '☀️' : '❄️'
    })
    .join('')
}

let abortController: AbortController | null = null

async function populateRecommendations() {
  abortController?.abort()
  abortController = null

  if (!currentQuery.value) return
  const query =
    typeof currentQuery.value === 'string' ? currentQuery.value : currentQuery.value.code
  const queryTrimmed = query.trim()
  if (!queryTrimmed || queryTrimmed.length < 3) {
    loading.value = false
    return
  }

  abortController = new AbortController()

  try {
    loading.value = true

    const coursesDataResult = await axios.get<CourseSearchResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/courses/${queryTrimmed}`,
      {
        params: {
          page: 1,
          limit: 5,
          sessions: [...store.selectedSubsessions].join(','),
          divisions: [...store.selectedDivisions].join(','),
        },
        signal: abortController.signal,
      },
    )

    const courses: Course[] = coursesDataResult.data.courses

    allCourses.value = courses.map((course): SearchCourse => ({
      ...course,
      formattedName: `${parseSessionEmoji(course.sessions)}  ${course.code} ${course.sectionCode} - ${course.name}`,
    }))

    store.searchBarSuggestions = courses.map((course) => `${course.code} ${course.sectionCode}`)

    loading.value = false
  } catch (error: any) {
    if (axios.isCancel(error)) return
    loading.value = false
    console.error(`Error fetching data for ${query}: ${error.message}`)
  }
}

async function courseSearched() {
  abortController?.abort()
  abortController = null

  const searchValue = currentQuery.value
  if (!searchValue || typeof searchValue === 'string') return

  currentQuery.value = '' // Clear search bar

  store.removeUnusedCards() // Remove any leftover cards from before

  const divisionalLegends = await store.getDivisionalLegends()
  const divisionalEnrolmentIndicators = await store.getDivisionalEnrolmentIndicators()

  if (divisionalLegends && divisionalEnrolmentIndicators) {
    store.registerDetailCard(searchValue.code, searchValue.sectionCode, {
      courseData: searchValue,
      divisionalData: {
        divisionalLegends,
        divisionalEnrolmentIndicators,
      },
    })
  } else {
    // Show detail card without any divisional data (the property is optional)
    store.registerDetailCard(searchValue.code, searchValue.sectionCode, {
      courseData: searchValue,
    })
  }

  store.setDetailCardVisibility(`${searchValue.code} ${searchValue.sectionCode}`, true)
}

function onFocus() {
  isActive.value = true
  if (
    allCourses.value.length > 0 &&
    currentQuery.value &&
    typeof currentQuery.value === 'string' &&
    currentQuery.value.length >= 3 &&
    searchBarComponent.value
  ) {
    searchBarComponent.value.overlayVisible = true
  }
}
</script>
