import { ref } from 'vue'
import { defineStore, StateTree } from 'pinia'
import axios from 'axios'
import genColor from 'color-generator'
import { ViaBuilderManager } from '@kelexer/via-builder'
import * as VIAplanner from '../types/index.types'
import * as VIAplannerConstants from '../types/index.types'
import { ToastServiceMethods } from 'primevue/toastservice'
import { ViaBuilderCourseInput, ViaBuilderCourseResult, ViaBuilderMeetingTime, ViaBuilderSectionInput } from '@kelexer/via-builder/dist/via-builder'

let managerInstance: ViaBuilderManager | null = null

async function getBuilderManager(): Promise<ViaBuilderManager> {
  if (!managerInstance) managerInstance = await ViaBuilderManager.create()
  return managerInstance
}

const emptySemesterEvents = (): VIAplanner.SemesterEventsData => ({
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
})

export const useTimetableStore = defineStore(
  'timetable',
  () => {
    /**
     * State
     */

    const clearStorage = ref<string>('3')

    const darkMode = ref<boolean>(
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    )

    const divisions = ref<{ data: VIAplanner.Division[]; expiry: number } | null>(null)
    const sessions = ref<{ data: VIAplanner.SessionGroup[]; expiry: number } | null>(null)
    const selectedDivisions = ref<VIAplanner.DivisionCode[]>([])
    const selectedSessionGroup = ref<string | null>(null)
    const selectedSubsessions = ref<string[]>([])
    const selectedSession = ref<VIAplanner.SemesterCode>(VIAplannerConstants.FIRST_SEM)

    const divisionalLegends = ref<VIAplanner.DivisionalLegends | null>(null)
    const divisionalEnrolmentIndicators = ref<VIAplanner.DivisionalEnrolmentIndicators | null>(null)

    const preferredStart = ref<number>(9)
    const preferredMaxEnd = ref<number>(15)
    const maxDayLength = ref<number>(6)
    const minDayLength = ref<number>(2)
    const maxGap = ref<number>(2)
    const maxHours = ref<number>(3)
    const onlinePreference = ref<VIAplanner.OnlinePreference>(VIAplannerConstants.ONLINE_MI)
    const includeUnavailable = ref<boolean>(true)
    const avoidRushHour = ref<boolean>(false)
    const currentlyBuildingTimetable = ref<boolean>(false)

    const cards = ref<{ course: string; visible: boolean; props: VIAplanner.CourseCardProps }[]>([])

    const blockedTimes = ref<Record<VIAplanner.SemesterCode, VIAplanner.BlockedTimeData[]>>({
      [VIAplannerConstants.FIRST_SEM]: [],
      [VIAplannerConstants.SECOND_SEM]: [],
    })

    const blockedTimesPlaceholderCourse = ref<ViaBuilderCourseInput>({
      code: VIAplannerConstants.blockedTimesCourseCodePlaceholder,
      campus: 'Off Campus',
      type: 'LEC',
      sections: [
        {
          name: '',
          meetingTimes: [],
        },
      ],
    })

    const selectedCourses = ref<
      Record<VIAplanner.SemesterCode, Record<string, VIAplanner.SelectedCourseData>>
    >({
      [VIAplannerConstants.FIRST_SEM]: {},
      [VIAplannerConstants.SECOND_SEM]: {},
    })

    const timetables = ref<Record<VIAplanner.SemesterCode, VIAplanner.SemesterEventsData>>({
      [VIAplannerConstants.FIRST_SEM]: emptySemesterEvents(),
      [VIAplannerConstants.SECOND_SEM]: emptySemesterEvents(),
    })

    const lockedSections = ref<Record<VIAplanner.SemesterCode, Record<string, string[]>>>({
      [VIAplannerConstants.FIRST_SEM]: {},
      [VIAplannerConstants.SECOND_SEM]: {},
    })

    const exportOverlay = ref<boolean>(false)
    const aboutOverlay = ref<boolean>(false)
    const noTimetablePopup = ref<boolean>(false)
    const sessionChangeWarning = ref<boolean>(false)
    const tutorialPopup = ref<boolean>(true)
    const searchBarSuggestions = ref<string[]>([])
    const history = ref<StateTree[]>([])
    const historyIndex = ref<number>(0)

    const toast = ref<ToastServiceMethods | null>(null)

    // Whether to switch the displayed session when a timetable event is registered
    const switchSession = ref<boolean>(true)

    /**
     * Actions
     */

    function initializeToast(toastInstance: ToastServiceMethods) {
      toast.value = toastInstance
    }

    function toggleDarkMode() {
      darkMode.value = !darkMode.value
      regenerateColors()
      if (darkMode.value) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }

    async function setLockedHourStatus(hour: number, lock: boolean) {
      const start = hour * 3600
      const end = start + 3600

      for (let day = 0; day < VIAplannerConstants.DAYS.length; day++) {
        setBlockedTime(selectedSession.value, VIAplannerConstants.DAYS[day]!, start, end, lock)
      }

      const manager = await getBuilderManager()
      manager.removeCourse(VIAplannerConstants.blockedTimesCourseCodePlaceholder, '')
      manager.addCourse(blockedTimesPlaceholderCourse.value)
      void generateTimetable()
    }

    async function setLockedDayStatus(day: VIAplanner.Weekday, lock: boolean) {
      for (let hour = 8; hour <= 22; hour++) {
        const start = hour * 3600
        const end = start + 3600
        setBlockedTime(selectedSession.value, day, start, end, lock)
      }

      const manager = await getBuilderManager()
      manager.removeCourse(VIAplannerConstants.blockedTimesCourseCodePlaceholder, '')
      manager.addCourse(blockedTimesPlaceholderCourse.value)
      void generateTimetable()
    }

    async function setLockedTimeStatus(
      semester: VIAplanner.SemesterCode,
      day: VIAplanner.Weekday,
      start: number,
      end: number,
      lock: boolean,
    ) {
      setBlockedTime(semester, day, start, end, lock)
      const manager = await getBuilderManager()
      manager.removeCourse(VIAplannerConstants.blockedTimesCourseCodePlaceholder, '')
      manager.addCourse(blockedTimesPlaceholderCourse.value)
    }

    function setBlockedTime(
      semester: VIAplanner.SemesterCode,
      day: VIAplanner.Weekday,
      start: number,
      end: number,
      block: boolean,
    ) {
      if (block) {
        if (
          !blockedTimes.value[semester].some(
            (blocker) => blocker.day === day && blocker.start === start && blocker.end === end,
          )
        ) {
          blockedTimes.value[semester].push({ day, start, end })
        }

        const placeholderSection = blockedTimesPlaceholderCourse.value.sections?.[0]
        if (
          placeholderSection &&
          !placeholderSection.meetingTimes?.some(
            (blocker) =>
              blocker.day === VIAplannerConstants.DAYS.indexOf(day) &&
              blocker.start === start &&
              blocker.end === end,
          )
        ) {
          placeholderSection.meetingTimes.push({
            start,
            end,
            day: VIAplannerConstants.DAYS.indexOf(day),
            online: false,
            zz: true,
            semester: getSemesterIndex(semester),
          })
        }
      } else {
        blockedTimes.value[semester] = blockedTimes.value[semester].filter(
          (blocker) => !(blocker.day === day && blocker.start === start && blocker.end === end),
        )

        const placeholderSection = blockedTimesPlaceholderCourse.value.sections?.[0]
        if (placeholderSection)
          placeholderSection.meetingTimes = placeholderSection.meetingTimes.filter(
            (blocker) =>
              !(
                blocker.day === VIAplannerConstants.DAYS.indexOf(day) &&
                blocker.start === start &&
                blocker.end === end
              ),
          )
      }
    }

    function syncBlockedTimesPlaceholderCourse() {
      const meetingTimes = []

      for (const [semester, blockers] of Object.entries(blockedTimes.value) as [
        VIAplanner.SemesterCode,
        VIAplanner.BlockedTimeData[],
      ][]) {
        const semesterIndex = getSemesterIndex(semester)

        for (const blocker of blockers) {
          const dayIndex = VIAplannerConstants.DAYS.indexOf(blocker.day)
          if (dayIndex < 0) continue

          meetingTimes.push({
            start: blocker.start,
            end: blocker.end,
            day: dayIndex,
            online: false,
            zz: false,
            semester: semesterIndex,
          })
        }
      }

      blockedTimesPlaceholderCourse.value = {
        ...blockedTimesPlaceholderCourse.value,
        sections: [
          {
            ...blockedTimesPlaceholderCourse.value.sections[0]!,
            meetingTimes,
          },
        ],
      }
    }

    async function loadBlockedTimesToBuilder() {
      syncBlockedTimesPlaceholderCourse()

      const manager = await getBuilderManager()
      manager.removeCourse(VIAplannerConstants.blockedTimesCourseCodePlaceholder, '')
      manager.addCourse(blockedTimesPlaceholderCourse.value)
    }

    async function reloadCoursesToBuilder() {
      const manager = await getBuilderManager()
      manager.reset()
      await loadBlockedTimesToBuilder()

      for (const session of Object.values(selectedCourses.value)) {
        for (const course of Object.values(session)) {
          await addCourseToBuilder(course.courseData)
        }
      }
    }

    async function setIncludeUnavailable(nextIncludeUnavailable: boolean) {
      if (includeUnavailable.value === nextIncludeUnavailable) return

      includeUnavailable.value = nextIncludeUnavailable
      await reloadCoursesToBuilder()
    }

    async function setLockedSectionStatus(course: string, activity: string, lock: boolean) {
      const sessionData = lockedSections.value[selectedSession.value]
      const lockedActivities = Array.isArray(sessionData[course]) ? sessionData[course] : []
      const activityType = activity.slice(0, 3).toUpperCase()

      if (lock) {
        const nextLockedActivities = [
          ...lockedActivities.filter(
            (lockedActivity) => lockedActivity.slice(0, 3).toUpperCase() !== activityType,
          ),
          activity,
        ]

        if (JSON.stringify(nextLockedActivities) !== JSON.stringify(lockedActivities)) {
          lockedSections.value[selectedSession.value] = {
            ...sessionData,
            [course]: nextLockedActivities,
          }
        }
      } else {
        const updatedActivities = lockedActivities.filter(
          (lockedActivity) => lockedActivity !== activity,
        )
        const nextLockedSections = { ...sessionData }

        if (updatedActivities.length === 0) delete nextLockedSections[course]
        else nextLockedSections[course] = updatedActivities

        lockedSections.value[selectedSession.value] = { ...nextLockedSections }
      }

      const courseData = selectedCourses.value[selectedSession.value][course]
      if (!courseData) return
      const manager = await getBuilderManager()
      manager.removeCourse(course, activityType)
      await addCourseToBuilder(courseData.courseData)
    }

    async function addCourse(
      course: string,
      lec: string | null,
      tut: string | null,
      pra: string | null,
      courseData: VIAplanner.Course,
      shouldGenerate = true,
    ) {
      const firstSessionCode = courseData.sessions[0]
      const selectedSessionFromCourse = firstSessionCode
        ? resolveSubsessionSemesters(firstSessionCode)[0] || null
        : null
      const color = genColor(
        darkMode.value ? VIAplannerConstants.DARK_SATURATION : VIAplannerConstants.LIGHT_SATURATION,
        darkMode.value ? VIAplannerConstants.DARK_LIGHTNESS : VIAplannerConstants.LIGHT_LIGHTNESS,
      ).hexString()

      for (const sessionCode of courseData.sessions) {
        for (const session of resolveSubsessionSemesters(sessionCode)) {
          selectedCourses.value[session][course] = {
            lec,
            tut,
            pra,
            color,
            expiry: Date.now() + VIAplannerConstants.COURSE_DATA_CACHE_EXPIRY,
            courseData,
          }
        }
      }

      const previousSwitchSession = switchSession.value
      switchSession.value = false
      await addCourseToBuilder(courseData)
      if (shouldGenerate) await generateTimetable()
      switchSession.value = previousSwitchSession

      if (shouldGenerate && previousSwitchSession && selectedSessionFromCourse) {
        selectedSession.value = selectedSessionFromCourse
      }
    }

    async function addCourseToBuilder(courseData: VIAplanner.Course) {
      const manager = await getBuilderManager()

      const lockedSectionsByType: Record<VIAplanner.ActivityType, string | null> = {
        LEC: null,
        TUT: null,
        PRA: null,
      }

      for (const session of VIAplannerConstants.SEMESTER_CODES) {
        const sessionLockedSections = lockedSections.value[session][courseData.code] || []

        for (const lockedSection of sessionLockedSections) {
          const type = lockedSection.slice(0, 3).toUpperCase() as VIAplanner.ActivityType
          if (!lockedSectionsByType[type]) lockedSectionsByType[type] = lockedSection
        }
      }

      const lecturesJSON: ViaBuilderCourseInput = {
        code: courseData['code'],
        campus: courseData['campus'],
        type: 'LEC',
        sections: [],
      }
      const tutorialsJSON: ViaBuilderCourseInput = {
        code: courseData['code'],
        campus: courseData['campus'],
        type: 'TUT',
        sections: [],
      }
      const practicalsJSON: ViaBuilderCourseInput = {
        code: courseData['code'],
        campus: courseData['campus'],
        type: 'PRA',
        sections: [],
      }

      const sessionsToSemester: Record<string, number> = {}
      const match = selectedSessionGroup.value?.match(/-(\d+)-(\d+)/)
      if (match) {
        sessionsToSemester[match[1] as string] = 0
        sessionsToSemester[match[2] as string] = 1
      } else {
        courseData.sessions.forEach((sessionCode, index) => {
          sessionsToSemester[sessionCode] = index
        })
      }

      for (const sectionData of courseData['sections']) {
        const sectionJSON: ViaBuilderSectionInput = {
          name: sectionData['name'],
          meetingTimes: [],
        }

        let hasMeetingTime = false
        const meetingTimes: VIAplanner.MeetingTime[] = Array.isArray(sectionData['meetingTimes'])
          ? sectionData['meetingTimes']
          : Object.values(sectionData['meetingTimes'] || {})
        for (const meetingTimeData of meetingTimes) {
          const buildingCode = meetingTimeData['building']['buildingCode']
          const fallbackSemesters = resolveSubsessionSemesters(meetingTimeData['sessionCode']).map(
            (semester: VIAplanner.SemesterCode) => getSemesterIndex(semester),
          )
          const mappedSemester = sessionsToSemester[meetingTimeData['sessionCode']]
          const semesterIndexes =
            typeof mappedSemester === 'number' ? [mappedSemester] : fallbackSemesters

          for (const semesterIndex of semesterIndexes) {
            const mode = getCourseSectionDeliveryModeForSession(
              sectionData.deliveryModes,
              meetingTimeData['sessionCode'],
            )

            const meetingTimeJSON: ViaBuilderMeetingTime = {
              start: meetingTimeData['start'],
              end: meetingTimeData['end'],
              day: meetingTimeData['day'] - 1,
              online: mode === 'SYNC' || mode === 'ASYNC',
              zz: buildingCode === 'ZZ',
              semester: semesterIndex,
            }

            sectionJSON['meetingTimes'].push(meetingTimeJSON)
            hasMeetingTime = true
          }
        }

        if (!hasMeetingTime) continue

        const sectionName = String(sectionData['name'] || '').toUpperCase()

        const isLocked =
          (sectionName.startsWith('LEC') &&
            lockedSectionsByType.LEC &&
            sectionName === String(lockedSectionsByType.LEC).toUpperCase()) ||
          (sectionName.startsWith('TUT') &&
            lockedSectionsByType.TUT &&
            sectionName === String(lockedSectionsByType.TUT).toUpperCase()) ||
          (sectionName.startsWith('PRA') &&
            lockedSectionsByType.PRA &&
            sectionName === String(lockedSectionsByType.PRA).toUpperCase())

        if (!isLocked && !includeUnavailable.value && sectionData.openLimitInd === 'C') continue

        if (sectionName.startsWith('LEC')) {
          if (
            lockedSectionsByType.LEC &&
            sectionName !== String(lockedSectionsByType.LEC).toUpperCase()
          )
            continue
          lecturesJSON['sections'].push(sectionJSON)
        } else if (sectionName.startsWith('TUT')) {
          if (
            lockedSectionsByType.TUT &&
            sectionName !== String(lockedSectionsByType.TUT).toUpperCase()
          )
            continue
          tutorialsJSON['sections'].push(sectionJSON)
        } else if (sectionName.startsWith('PRA')) {
          if (
            lockedSectionsByType.PRA &&
            sectionName !== String(lockedSectionsByType.PRA).toUpperCase()
          )
            continue
          practicalsJSON['sections'].push(sectionJSON)
        }
      }

      manager.removeCourse(lecturesJSON['code'], 'LEC')
      if (lecturesJSON['sections'].length > 0) {
        lecturesJSON['type'] = 'LEC'
        manager.addCourse(lecturesJSON)
      }

      manager.removeCourse(tutorialsJSON['code'], 'TUT')
      if (tutorialsJSON['sections'].length > 0) {
        tutorialsJSON['type'] = 'TUT'
        manager.addCourse(tutorialsJSON)
      }

      manager.removeCourse(practicalsJSON['code'], 'PRA')
      if (practicalsJSON['sections'].length > 0) {
        practicalsJSON['type'] = 'PRA'
        manager.addCourse(practicalsJSON)
      }
    }

    function isCourseDataExpired(courseData: VIAplanner.SelectedCourseData): boolean {
      return !courseData.expiry || courseData.expiry < Date.now()
    }

    async function fetchFreshCourseData(
      courseData: VIAplanner.SelectedCourseData,
    ): Promise<VIAplanner.Course | null> {
      try {
        const response = await axios.get<VIAplanner.CourseSearchResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/courses/${courseData.courseData.code}`,
          {
            params: {
              page: 1,
              limit: 5,
              sessions: courseData.courseData.sessionGroup
                ? [courseData.courseData.sessionGroup].join(',')
                : undefined,
            },
          },
        )

        return (
          response.data.courses.find(
            (course) =>
              course.code === courseData.courseData.code &&
              course.sectionCode === courseData.courseData.sectionCode &&
              (!courseData.courseData.sessionGroup ||
                course.sessionGroup === courseData.courseData.sessionGroup),
          ) || null
        )
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error(
          `Failed to refresh course ${courseData.courseData.code} ${courseData.courseData.sectionCode}:`,
          message,
        )
        return null
      }
    }

    async function refreshExpiredCourseData() {
      const refreshTargets: {
        session: VIAplanner.SemesterCode
        course: string
        entry: VIAplanner.SelectedCourseData
      }[] = []
      const fetchCache = new Map<string, Promise<VIAplanner.Course | null>>()

      for (const session of VIAplannerConstants.SEMESTER_CODES) {
        for (const [course, entry] of Object.entries(selectedCourses.value[session])) {
          if (isCourseDataExpired(entry)) {
            refreshTargets.push({ session, course, entry })
          }
        }
      }

      for (const target of refreshTargets) {
        const cacheKey = `${target.entry.courseData.code}::${target.entry.courseData.sectionCode}::${target.entry.courseData.sessionGroup || ''}`

        if (!fetchCache.has(cacheKey)) {
          fetchCache.set(cacheKey, fetchFreshCourseData(target.entry))
        }

        const freshCourseData = await fetchCache.get(cacheKey)!
        if (!freshCourseData) continue

        selectedCourses.value[target.session][target.course] = {
          ...target.entry,
          expiry: Date.now() + VIAplannerConstants.COURSE_DATA_CACHE_EXPIRY,
          courseData: freshCourseData,
        }
      }
    }

    async function removeCourse(course: string, shouldGenerate: boolean = true) {
      for (const session of VIAplannerConstants.SEMESTER_CODES) {
        delete selectedCourses.value[session][course]
        delete lockedSections.value[session][course]

        for (const day of VIAplannerConstants.DAYS) {
          timetables.value[session][day] = timetables.value[session][day].filter((event) => {
            return event.course !== course
          })
        }
      }

      const manager = await getBuilderManager()

      for (const type of ['LEC', 'TUT', 'PRA']) manager.removeCourse(course, type)

      removeUnusedCards()
      if (shouldGenerate) void generateTimetable()
    }

    async function generateTimetable() {
      if (currentlyBuildingTimetable.value) {
        toast.value?.add({
          severity: 'warn',
          summary: 'Timetable already building',
          detail: 'A timetable is already building, try building again shortly',
          life: 2500,
        })
        return
      }

      const previousSwitchSession = switchSession.value
      switchSession.value = false
      currentlyBuildingTimetable.value = true
      try {
        const manager = await getBuilderManager()
        const timetable = manager.build()
        applyBuiltTimetable(timetable)
      } finally {
        currentlyBuildingTimetable.value = false
        switchSession.value = previousSwitchSession
      }
    }

    function applyBuiltTimetable(timetable: ViaBuilderCourseResult[]) {
      const hasBuildFailure = timetable.some((entry) => {
        return (
          entry['code'] !== VIAplannerConstants.blockedTimesCourseCodePlaceholder &&
          entry['section'] === ''
        )
      })

      if (hasBuildFailure) {
        noTimetablePopup.value = true
        return
      }

      noTimetablePopup.value = false

      const normalizedTimetable = normalizeBuiltTimetable(timetable)

      for (const session of Object.keys(normalizedTimetable) as VIAplanner.SemesterCode[]) {
        for (const course of normalizedTimetable[session]) {
          if (course['code'] === VIAplannerConstants.blockedTimesCourseCodePlaceholder) continue
          const courseData = selectedCourses.value[session][course['code']]
          if (!courseData) continue
          switch (course['type']) {
            case 'LEC':
              courseData['lec'] = course['section']
              break
            case 'TUT':
              courseData['tut'] = course['section']
              break
            case 'PRA':
              courseData['pra'] = course['section']
              break
            default:
              continue
          }

          void timetableModifyActivity(courseData['courseData'], course['section'])
        }
      }
    }

    function normalizeBuiltTimetable(timetable: ViaBuilderCourseResult[]) {
      const normalized: Record<VIAplanner.SemesterCode, ViaBuilderCourseResult[]> = {
        [VIAplannerConstants.FIRST_SEM]: [],
        [VIAplannerConstants.SECOND_SEM]: [],
      }

      for (const entry of timetable) {
        if (!entry || entry['code'] === VIAplannerConstants.blockedTimesCourseCodePlaceholder)
          continue

        const candidateSessions = VIAplannerConstants.SEMESTER_CODES
        const matchingCandidateSessions = candidateSessions.filter(
          (session): session is VIAplanner.SemesterCode => {
            return !!selectedCourses.value[session][entry['code']]
          },
        )

        if (matchingCandidateSessions.length === 1) {
          normalized[matchingCandidateSessions[0]!].push(entry)
          continue
        }

        if (matchingCandidateSessions.length > 1) {
          const matchedSessions = matchingCandidateSessions.filter((session) => {
            const selectedCourse = selectedCourses.value[session][entry['code']]
            const sectionData = selectedCourse?.courseData?.sections?.find(
              (section) => section.name === entry['section'],
            )
            if (!sectionData) return false

            const meetingTimes: VIAplanner.MeetingTime[] = Array.isArray(sectionData.meetingTimes)
              ? sectionData.meetingTimes
              : Object.values(sectionData.meetingTimes || {})

            return meetingTimes.some((meetingTime) =>
              resolveSubsessionSemesters(meetingTime.sessionCode).includes(session),
            )
          })

          for (const session of matchedSessions.length > 0
            ? matchedSessions
            : matchingCandidateSessions) {
            normalized[session].push(entry)
          }
        }
      }

      return normalized
    }

    function regenerateColors() {
      for (const semester of VIAplannerConstants.SEMESTER_CODES) {
        Object.values(selectedCourses.value[semester]).forEach((course) => {
          course.color = genColor(
            darkMode.value
              ? VIAplannerConstants.DARK_SATURATION
              : VIAplannerConstants.LIGHT_SATURATION,
            darkMode.value
              ? VIAplannerConstants.DARK_LIGHTNESS
              : VIAplannerConstants.LIGHT_LIGHTNESS,
          ).hexString()
        })
      }
    }

    function saveStateHistory() {
      // Drop future entries if not on the present snapshot, to prevent branching
      if (historyIndex.value < history.value.length - 1)
        history.value = history.value.slice(0, historyIndex.value + 1)

      const newHistory = {
        blockedTimes: JSON.parse(JSON.stringify(blockedTimes.value)) as typeof blockedTimes.value,
        selectedCourses: JSON.parse(
          JSON.stringify(selectedCourses.value),
        ) as typeof selectedCourses.value,
        timetables: JSON.parse(JSON.stringify(timetables.value)) as typeof timetables.value,
        lockedSections: JSON.parse(
          JSON.stringify(lockedSections.value),
        ) as typeof lockedSections.value,
      }

      history.value.push(newHistory)
      historyIndex.value++

      if (history.value.length > VIAplannerConstants.MAX_HISTORY) {
        history.value.shift()
        historyIndex.value--
      }
    }

    function initializeHistory() {
      history.value = [
        {
          blockedTimes: JSON.parse(JSON.stringify(blockedTimes.value)) as typeof blockedTimes.value,
          selectedCourses: JSON.parse(
            JSON.stringify(selectedCourses.value),
          ) as typeof selectedCourses.value,
          timetables: JSON.parse(JSON.stringify(timetables.value)) as typeof timetables.value,
          lockedSections: JSON.parse(
            JSON.stringify(lockedSections.value),
          ) as typeof lockedSections.value,
        },
      ]
      historyIndex.value = 0
    }

    function undo() {
      if (historyIndex.value > 0) {
        historyIndex.value--
        loadState(history.value[historyIndex.value]!)
      }
    }

    function redo() {
      if (historyIndex.value < history.value.length - 1) {
        historyIndex.value++
        loadState(history.value[historyIndex.value]!)
      }
    }

    function loadState(newState: StateTree) {
      blockedTimes.value = newState.blockedTimes as typeof blockedTimes.value
      selectedCourses.value = newState.selectedCourses as typeof selectedCourses.value
      timetables.value = newState.timetables as typeof timetables.value
      lockedSections.value = newState.lockedSections as typeof lockedSections.value
    }

    function registerDetailCard(
      course: string,
      sectionCode: string,
      props: VIAplanner.CourseCardProps,
    ) {
      if (!cards.value.find((card) => card.course === `${course} ${sectionCode}`))
        cards.value.push({ course: `${course} ${sectionCode}`, visible: false, props })
    }

    function removeDetailsCard(course: string) {
      cards.value = cards.value.filter((card) => card.course !== course)
    }

    function removeUnusedCards() {
      cards.value = cards.value.filter((card) => {
        const parts = card.course.split(' ')
        const courseCode = parts[0]
        const sectionCode = parts[1]

        if (searchBarSuggestions.value.includes(card.course)) return true

        for (const session of VIAplannerConstants.SEMESTER_CODES) {
          const entry = selectedCourses.value[session][courseCode!]
          if (
            entry?.courseData?.code === courseCode &&
            entry?.courseData?.sectionCode === sectionCode
          )
            return true
        }

        return false
      })
    }

    function setDetailCardVisibility(course: string, visible: boolean) {
      const card = cards.value.find((card) => card.course === course)
      if (card) card.visible = visible
      else console.error(`No card for ${course} was found`)
    }

    async function getDivisionalLegends(): Promise<VIAplanner.DivisionalLegend[] | null> {
      if (!divisionalLegends.value || divisionalLegends.value.expiry < Date.now()) {
        try {
          const response = await axios.get<VIAplanner.DivisionalLegendsResponse>(
            `${import.meta.env.VITE_API_BASE_URL}/divisionalLegends`,
          )
          const data: VIAplanner.DivisionalLegend[] = response.data.data.map((raw) => ({
            division: raw.division,
            content: raw.content,
          }))
          divisionalLegends.value = {
            expiry: Date.now() + VIAplannerConstants.FETCH_CACHE_EXPIRY,
            data: data,
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error('Failed to retrieve divisional legends:', message)
          return null
        }
      }

      return divisionalLegends.value.data
    }

    async function getDivisionalEnrolmentIndicators(): Promise<
      VIAplanner.DivisionalEnrolmentIndicator[] | null
    > {
      if (
        !divisionalEnrolmentIndicators.value ||
        divisionalEnrolmentIndicators.value.expiry < Date.now()
      ) {
        try {
          const response = await axios.get<VIAplanner.DivisionalEnrolmentIndicatorsResponse>(
            `${import.meta.env.VITE_API_BASE_URL}/divisionalEnrolmentIndicators`,
          )
          const data: VIAplanner.DivisionalEnrolmentIndicator[] = response.data.data.map((raw) => ({
            division: raw.division,
            codes: raw.codes.map((code) => ({ code: code.code, name: code.name })),
          }))
          divisionalEnrolmentIndicators.value = {
            expiry: Date.now() + VIAplannerConstants.FETCH_CACHE_EXPIRY,
            data: data,
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error('Failed to retrieve divisional enrolment indicators:', message)
          return null
        }
      }

      return divisionalEnrolmentIndicators.value.data
    }

    async function getDivisions(): Promise<VIAplanner.Division[] | null> {
      if (!divisions.value || divisions.value.expiry < Date.now()) {
        try {
          const newDivisions = await axios.get<VIAplanner.ReferenceData>(
            `${import.meta.env.VITE_API_BASE_URL}/referenceData`,
          )
          divisions.value = {
            expiry: Date.now() + VIAplannerConstants.FETCH_CACHE_EXPIRY,
            data: newDivisions.data.divisions,
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error('Failed to retrieve divisions:', message)
          return null
        }
      }

      return divisions.value.data
    }

    async function getSessions(): Promise<VIAplanner.SessionGroup[] | null> {
      if (!sessions.value || sessions.value.expiry < Date.now()) {
        try {
          const newSessions = await axios.get<VIAplanner.ReferenceData>(
            `${import.meta.env.VITE_API_BASE_URL}/referenceData`,
          )
          sessions.value = {
            expiry: Date.now() + VIAplannerConstants.FETCH_CACHE_EXPIRY,
            data: newSessions.data.sessions,
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error('Failed to retrieve sessions:', message)
          return null
        }
      }

      return sessions.value.data
    }

    function timetableRegisterActivity(courseData: VIAplanner.Course, activityName: string) {
      let selectedSessionFromActivity: VIAplanner.SemesterCode | null = null

      const activity = courseData.sections.find((section) => section.name === activityName)
      if (activity) {
        for (const meetingTime of activity.meetingTimes) {
          const day = VIAplannerConstants.DAYS[meetingTime.day - 1]
          if (!day) continue

          const sessionsForMeeting = resolveSubsessionSemesters(meetingTime.sessionCode)
          if (!selectedSessionFromActivity && sessionsForMeeting.length > 0)
            selectedSessionFromActivity = sessionsForMeeting[0]!

          for (const session of sessionsForMeeting) {
            if (
              !timetables.value[session][day].some(
                (timeslot) =>
                  timeslot.course === courseData.code &&
                  timeslot.activity === activityName &&
                  timeslot.start === meetingTime.start &&
                  timeslot.end === meetingTime.end,
              )
            ) {
              timetables.value[session][day].push({
                course: courseData.code,
                activity: activityName,
                day: meetingTime.day,
                start: meetingTime.start,
                end: meetingTime.end,
              })
            }
          }
        }

        if (switchSession.value && selectedSessionFromActivity)
          selectedSession.value = selectedSessionFromActivity
      }
    }

    async function timetableModifyActivity(
      courseData: VIAplanner.Course,
      newActivityName: string,
      lockAndGenerate = false,
    ) {
      const activityMatch = newActivityName.match(/^[^\d]+/)
      const activityType = activityMatch ? activityMatch[0] : null

      if (!activityType) return

      const courseExists = VIAplannerConstants.SEMESTER_CODES.some((session) =>
        Object.prototype.hasOwnProperty.call(selectedCourses.value[session], courseData.code),
      )
      if (!courseExists) await addCourse(courseData.code, null, null, null, courseData, false)

      for (const session of VIAplannerConstants.SEMESTER_CODES) {
        const selectedCourse = selectedCourses.value[session][courseData.code]
        if (!selectedCourse) continue

        if (activityType === 'LEC') selectedCourse.lec = newActivityName
        else if (activityType === 'TUT') selectedCourse.tut = newActivityName
        else if (activityType === 'PRA') selectedCourse.pra = newActivityName
      }

      for (const session of VIAplannerConstants.SEMESTER_CODES) {
        if (!selectedCourses.value[session][courseData.code]) continue

        for (const day of VIAplannerConstants.DAYS) {
          timetables.value[session][day] = timetables.value[session][day].filter((event) => {
            if (event.course !== courseData.code) return true

            const eventMatch = event.activity.match(/^[^\d]+/)

            if (eventMatch) return eventMatch[0] !== activityType

            return true
          })
        }
      }

      timetableRegisterActivity(courseData, newActivityName)

      if (lockAndGenerate) {
        await setLockedSectionStatus(courseData.code, newActivityName, true)
        await generateTimetable()
      }
    }

    function subsessionCodeToSession(
      subsessionCode: string,
    ): VIAplanner.SemesterCodeRange | undefined {
      if (!sessions.value || !sessions.value.data) return undefined

      for (const sessionGroup of sessions.value.data) {
        for (const subsession of sessionGroup.subsessions) {
          if (subsession.value === subsessionCode) {
            const match = subsession.label.match(/\((.)\)/)
            if (match) return match[1] as VIAplanner.SemesterCode
          }
        }
      }

      return undefined
    }

    function getSemesterIndex(semester: VIAplanner.SemesterCode): 0 | 1 {
      return semester === VIAplannerConstants.FIRST_SEM ? 0 : 1
    }

    function resolveSubsessionSemesters(subsessionCode: string): VIAplanner.SemesterCode[] {
      const session = subsessionCodeToSession(subsessionCode)
      if (session === VIAplannerConstants.BOTH_SEM)
        return [VIAplannerConstants.FIRST_SEM, VIAplannerConstants.SECOND_SEM]
      if (session === VIAplannerConstants.FIRST_SEM || session === VIAplannerConstants.SECOND_SEM)
        return [session]
      return []
    }

    function parseTime(seconds: number): string {
      const totalMins = Math.floor(seconds / 60)
      const hours = Math.floor(totalMins / 60)
      const mins = String(totalMins % 60).padStart(2, '0')

      const extension = hours < 12 ? 'AM' : 'PM'

      return `${hours % 12 === 0 ? 12 : hours % 12}:${mins} ${extension}`
    }

    function resetTimetable() {
      selectedCourses.value = {
        [VIAplannerConstants.FIRST_SEM]: {},
        [VIAplannerConstants.SECOND_SEM]: {},
      }
      timetables.value = {
        [VIAplannerConstants.FIRST_SEM]: emptySemesterEvents(),
        [VIAplannerConstants.SECOND_SEM]: emptySemesterEvents(),
      }
      lockedSections.value = {
        [VIAplannerConstants.FIRST_SEM]: {},
        [VIAplannerConstants.SECOND_SEM]: {},
      }
    }

    async function updatePreferences() {
      const manager = await getBuilderManager()
      // More info on formatting at https://github.com/Kelexer1/via-builder
      manager.setPreferences({
        maxGap: maxGap.value,
        maxDayLength: maxDayLength.value,
        minDayLength: minDayLength.value,
        maxContinuousClasses: maxHours.value,
        preferredMinStart: preferredStart.value * 3600,
        preferredMaxEnd: preferredMaxEnd.value * 3600,
        guaranteeCrossCampusGap: true,
        avoidRushHours: avoidRushHour.value,
        onlinePreference:
          onlinePreference.value === 'Avoid' ? 0 : onlinePreference.value === 'Prefer' ? 1 : 2,
      })
    }

    function getCourseSectionDeliveryModeForSession(
      deliveryModes: VIAplanner.DeliveryMode[],
      session: string,
    ): VIAplanner.DeliveryModeCode | '' {
      for (const sessionDelivery of deliveryModes) {
        if (sessionDelivery?.session == session) {
          return sessionDelivery.mode
        }
      }

      return ''
    }

    return {
      // state
      clearStorage,
      darkMode,
      divisions,
      sessions,
      selectedDivisions,
      selectedSessionGroup,
      selectedSubsessions,
      selectedSession,
      divisionalLegends,
      divisionalEnrolmentIndicators,
      preferredStart,
      preferredMaxEnd,
      maxDayLength,
      minDayLength,
      maxGap,
      maxHours,
      onlinePreference,
      includeUnavailable,
      avoidRushHour,
      currentlyBuildingTimetable,
      cards,
      blockedTimes,
      blockedTimesPlaceholderCourse,
      selectedCourses,
      timetables,
      lockedSections,
      exportOverlay,
      aboutOverlay,
      noTimetablePopup,
      sessionChangeWarning,
      tutorialPopup,
      searchBarSuggestions,
      history,
      historyIndex,
      toast,
      switchSession,

      // actions
      initializeToast,
      toggleDarkMode,
      setLockedHourStatus,
      setLockedDayStatus,
      setLockedTimeStatus,
      setBlockedTime,
      syncBlockedTimesPlaceholderCourse,
      loadBlockedTimesToBuilder,
      reloadCoursesToBuilder,
      setIncludeUnavailable,
      setLockedSectionStatus,
      addCourse,
      addCourseToBuilder,
      isCourseDataExpired,
      fetchFreshCourseData,
      refreshExpiredCourseData,
      removeCourse,
      generateTimetable,
      applyBuiltTimetable,
      normalizeBuiltTimetable,
      regenerateColors,
      saveStateHistory,
      initializeHistory,
      undo,
      redo,
      loadState,
      registerDetailCard,
      removeDetailsCard,
      removeUnusedCards,
      setDetailCardVisibility,
      getDivisionalLegends,
      getDivisionalEnrolmentIndicators,
      getDivisions,
      getSessions,
      timetableRegisterActivity,
      timetableModifyActivity,
      subsessionCodeToSession,
      getSemesterIndex,
      resolveSubsessionSemesters,
      parseTime,
      resetTimetable,
      updatePreferences,
      getCourseSectionDeliveryModeForSession,
    }
  },
  {
    persist: {
      key: 'timetable',
      storage: localStorage,
      serializer: {
        serialize: (state) => {
          const rest = { ...state } as Record<string, unknown>
          delete rest.cards
          delete rest.history
          delete rest.historyIndex
          delete rest.currentlyBuildingTimetable
          return JSON.stringify(rest)
        },
        deserialize: (value: string) => JSON.parse(value) as unknown as StateTree,
      },
    },
  },
)
