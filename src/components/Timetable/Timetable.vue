<template>
  <div class="flex flex-row h-full">
    <NoTimetablePopup />
    <div
      class="flex flex-col ml-0 md:ml-1 mr-0"
      :style="{ 'margin-top': `${oneHourHeightPixels * 0.6}px` }"
    >
      <div
        v-for="(time, index) in timeRange"
        :key="index"
        class="time-axis-number w-13 md:w-16"
        :style="{ height: oneHourHeight }"
      >
        <HourSwitch
          :time="time"
          :last="index !== timeRange.length - 1"
          :semester="semester"
          :is-export="isExport"
          :height="oneHourHeight"
        />
      </div>
    </div>
    <div class="col-11 w-full p-0 pr-8">
      <!-- Weekday Axis -->
      <div class="grid grid-nogutter" name="weekDaysAxis">
        <div v-for="(weekday, index) in weekdays" :key="weekday" class="col">
          <WeekdaySwitch
            :weekday="weekday"
            :weekday-label="useShortWeekdays ? (weekdaysShort[index] as string) : weekday"
            :semester="semester"
            :is-export="isExport"
            :height="`${oneHourHeightPixels * 0.6}px`"
          />
        </div>
      </div>
      <!-- Timetable Content -->
      <div class="grid grid-nogutter timetableContent" name="timetableContent">
        <div v-for="(meetingSections, day) in timetable" :key="day" class="col relative">
          <div
            v-for="hour in timeSlotCount"
            :key="hour"
            :style="{
              height: oneHourHeight,
              'box-sizing': 'border-box',
              'border-right': '1px solid gray',
              'border-bottom': '1px solid gray',
              ...(day === 'Monday' ? { 'border-left': '1px solid gray' } : {}),
            }"
            :class="isExport ? 'bg-white timetablecell' : 'bg-timetablecell timetablecell'"
          />
          <div
            v-for="event in getEventsForDay(meetingSections)"
            :key="event.start + '-' + event.currEnd + (event.overlapIndex || 0)"
            class="absolute left-0 right-0 flex pb-px"
            :style="{
              top: `${(event.currStart / 3600 - timetableStart) * oneHourHeightPixels}px`,
              height: `${((event.currEnd - event.currStart) / 3600) * oneHourHeightPixels}px`,
              width: event.totalOverlapping ? `${100 / event.totalOverlapping}%` : '100%',
              marginLeft:
                event.totalOverlapping > 1
                  ? `${(event.overlapIndex * 100) / event.totalOverlapping}%`
                  : '0%',
              ...(day === 'Monday' && (event.overlapIndex === 0 || event.isEmpty)
                ? { 'padding-left': '1px' }
                : {}),
              ...(event.isEmpty || event.overlapIndex === event.totalOverlapping - 1
                ? { 'padding-right': '1px' }
                : {}),
            }"
          >
            <template v-if="!event.isEmpty">
              <TimetableEvent
                v-for="(courseActivityData, index) in event.courses"
                :key="courseActivityData.course + courseActivityData.activity + index"
                :event-data="courseActivityData"
                :semester="semester"
                :day="day"
                :is-empty="false"
                :is-export="isExport"
                :style="{
                  'background-color':
                    store.selectedCourses[store.selectedSession][courseActivityData.course]?.color,
                }"
              />
            </template>
            <template v-else-if="!isExport">
              <TimetableEvent
                :event-data="{
                  course: '', // Placeholder value, wont be accessed since is-empty === true
                  activity: '', // Placeholder value, wont be accessed since is-empty === true
                  day: 1, // Placeholder value, wont be accessed since is-empty === true
                  start: event.currStart,
                  end: event.currEnd,
                }"
                :semester="semester"
                :day="day"
                :is-empty="true"
                :is-export="isExport"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import { useTimetableStore } from '../../store/timetable'
import TimetableEvent from './TimetableEvent.vue'
import NoTimetablePopup from '../Popup/NoTimetablePopup.vue'
import HourSwitch from './HourSwitch.vue'
import WeekdaySwitch from './WeekdaySwitch.vue'
import { useWindowSize } from '../../composables/useWindowSize'
import { DAYS, DAYS_SHORT, SemesterCode, Weekday } from '../../types/constants.types'
import { ActivityTimeData, SemesterEventsData } from '../../types/app_state.types'

const store = useTimetableStore()
const { height, isSmallDevice } = useWindowSize()

const props = withDefaults(
  defineProps<{
    timetable: SemesterEventsData
    semester: SemesterCode
    isExport?: boolean
  }>(),
  { isExport: false },
)

const weekdays: Ref<Array<Weekday>> = ref([...DAYS])
const weekdaysShort: Ref<Array<String>> = ref([...DAYS_SHORT])
const useShortWeekdays = computed(() => isSmallDevice.value)

/** The hour that the earliest class starts on for any day in the given semester */
const timetableStart = computed(() => {
  let earliest = 9

  for (const dayEvents of Object.values(props.timetable)) {
    for (const event of dayEvents) {
      const start = Math.floor(event.start / 3600)
      if (start < earliest) earliest = start
    }
  }

  return earliest
})

/** The hour that the latest class starts on for any day in the given semester */
const timetableEnd = computed(() => {
  let latest = 18

  for (const dayEvents of Object.values(props.timetable)) {
    for (const event of dayEvents) {
      const end = Math.ceil(event.end / 3600)
      if (end > latest) latest = end
    }
  }

  return latest
})

/**
 * An array containing all the formatted (12 hour with extension) times that are between the start and of the
 * timetable
 */
const timeRange = computed(() => {
  const result = []

  for (let i = timetableStart.value; i <= timetableEnd.value; i++) {
    if (i > 12) result.push(`${i % 12} PM`)
    else if (i === 12) result.push(`12 PM`)
    else result.push(`${i % 12} AM`)
  }

  return result
})

/** The number of rows of cells to render */
const timeSlotCount = computed(() => {
  return Math.max(timeRange.value.length - 1, 0)
})

/** The height in pixels as an integer that any timetable event cell should be */
const oneHourHeightPixels = computed(() => {
  if ((height.value - 168) / 9 > 65) return Math.round((height.value - 168) / 9)
  return 65
})

/** The height in pixels as a style string that any timetable event cell should be */
const oneHourHeight = computed(() => {
  return `${oneHourHeightPixels.value}px`
})

const HOUR_OFFSET = 3600

/**
 * Internal working state for a real event while overlap groups are still being computed.
 * Never returned to the caller. see TimetableDayEvent for the public shape.
 */
interface WorkingEvent {
  start: number
  end: number
  currStart: number
  currEnd: number
  courses: ActivityTimeData[]
  totalOverlapping: number
  overlapIndex: number
  overlapGroupStart: number // Start of this event's overlap group, in seconds after midnight. Only needed mid-computation
  overlapGroupEnd: number // End of this event's overlap group, in seconds after midnight. Only needed mid-computation
  processed: boolean // Whether this event's overlap group has already been computed
  addedToResult: boolean // Whether this event has already been pushed into the day's final slot list
}

/** An empty placeholder slot filling a gap where nothing is scheduled for the day */
interface EmptyDaySlot {
  start: number // Negative sentinel, not a real time. Only exists so each empty slot gets a unique v-for :key
  end: number // Negative sentinel, not a real time. see start
  currStart: number // Clipped start time actually used to position this slot on the grid, in seconds after midnight
  currEnd: number // Clipped end time actually used to size this slot on the grid, in seconds after midnight
  isEmpty: true
  courses: []
  totalOverlapping: number
  overlapIndex: number
}

/** A real event slot ready for rendering: one or more overlapping activities occupying the same time range */
interface TimetableDayEvent {
  start: number // Original scheduled start time, in seconds after midnight
  end: number // Original scheduled end time, in seconds after midnight
  currStart: number // Same as start for real events; kept distinct from start to mirror EmptyDaySlot's shape
  currEnd: number // Same as end for real events; kept distinct from end to mirror EmptyDaySlot's shape
  isEmpty: false
  courses: ActivityTimeData[] // The activities occupying this slot — more than one if activities overlap in time
  totalOverlapping: number // How many events share this slot's overlap group (side-by-side column count)
  overlapIndex: number // This event's 0-based column position within its overlap group, left to right
}

/** A single rendered slot in a day's timetable column: either a real event or an empty placeholder */
type TimetableDaySlot = TimetableDayEvent | EmptyDaySlot

/** Strips WorkingEvent's construction-only bookkeeping fields down to the shape callers should see */
function toPublicEvent(event: WorkingEvent): TimetableDayEvent {
  return {
    start: event.start,
    end: event.end,
    currStart: event.currStart,
    currEnd: event.currEnd,
    isEmpty: false,
    courses: event.courses,
    totalOverlapping: event.totalOverlapping,
    overlapIndex: event.overlapIndex,
  }
}

/**
 * @brief Constructs an array of JSONs encoding timetable events for each day, including placeholder events for empty
 * events. Used to render timetable events on the timetable component
 *
 * Runs in two passes over the day's activities (both assume `allEvents` is sorted by start time):
 *  1. Overlap grouping — sweeps forward from each unprocessed event, absorbing any later event that starts
 *     before the group's current end time (expanding the group's end as it goes), then stamps every event in
 *     that group with its column count/position so the template can lay overlapping events side by side.
 *  2. Gap filling — sweeps across the visible time range a second time, emitting each already-grouped event
 *     once it becomes active and synthesizing `EmptyDaySlot`s to cover any stretch of time nothing is active.
 *
 * @param meetingSections The day's scheduled activities (one day's worth of `SemesterEventsData`)
 * @return The day's slots — real events and empty-gap placeholders — in chronological order
 */
function getEventsForDay(meetingSections: Array<ActivityTimeData>): Array<TimetableDaySlot> {
  // Empty day case
  if (!meetingSections.length) {
    const result: Array<TimetableDaySlot> = []
    let invalidStart = -1
    for (let i = timetableStart.value; i < timetableEnd.value; i++) {
      result.push({
        start: invalidStart,
        end: invalidStart,
        currStart: i * HOUR_OFFSET,
        currEnd: (i + 1) * HOUR_OFFSET,
        isEmpty: true,
        courses: [],
        totalOverlapping: 0,
        overlapIndex: 0,
      })
      invalidStart--
    }
    return result
  }

  // Create individual events for each activity
  const allEvents: Array<WorkingEvent> = []
  for (const course of meetingSections) {
    allEvents.push({
      start: course.start,
      end: course.end,
      currStart: course.start,
      currEnd: course.end,
      courses: [course],
      processed: false,
      addedToResult: false,
      totalOverlapping: 0,
      overlapIndex: 0,
      overlapGroupStart: 0,
      overlapGroupEnd: 0,
    })
  }

  // Sort by start time
  allEvents.sort((a, b) => a.start - b.start)

  // Find overlapping groups and assign positions
  for (let i = 0; i < allEvents.length; i++) {
    const current = allEvents[i]
    if (!current || current.processed) continue

    // Find all events that overlap with current
    const overlappingEvents: Array<WorkingEvent> = [current]
    const groupStart = current.start
    let groupEnd = current.end

    for (let j = i + 1; j < allEvents.length; j++) {
      const other = allEvents[j]
      if (other && other.start < groupEnd) {
        overlappingEvents.push(other)
        groupEnd = Math.max(groupEnd, other.end)
        other.processed = true
      }
    }

    // Assign position information to overlapping events
    overlappingEvents.forEach((event, index) => {
      event.totalOverlapping = overlappingEvents.length
      event.overlapIndex = index
      event.overlapGroupStart = groupStart
      event.overlapGroupEnd = groupEnd
    })

    current.processed = true
  }

  // Fill gaps with empty slots
  const finalResult: Array<TimetableDaySlot> = []
  let currentTime = timetableStart.value * HOUR_OFFSET
  let invalidStart = -1

  // Reset processed flag and sort again
  allEvents.forEach((event) => (event.processed = false))
  allEvents.sort((a, b) => a.start - b.start)

  while (currentTime < timetableEnd.value * HOUR_OFFSET) {
    // Find events that start at or before current time and haven't ended
    const activeEvents: Array<WorkingEvent> = []

    for (let i = 0; i < allEvents.length; i++) {
      const event = allEvents[i]
      if (event && event.start <= currentTime && event.end > currentTime) {
        activeEvents.push(event)
      }
    }

    if (activeEvents.length > 0) {
      // Add all active events
      activeEvents.forEach((event) => {
        if (!event.addedToResult) {
          finalResult.push(toPublicEvent(event))
          event.addedToResult = true
        }
      })

      // Move to next change point
      const nextChangeTime = Math.min(
        ...activeEvents.map((e) => e.end),
        ...allEvents.filter((e) => e.start > currentTime).map((e) => e.start),
        timetableEnd.value * HOUR_OFFSET,
      )

      currentTime = nextChangeTime
    } else {
      // Add empty slot
      const nextEventStart =
        allEvents.find((e) => e.start > currentTime)?.start ?? timetableEnd.value * HOUR_OFFSET
      const nextHour = Math.min(currentTime + HOUR_OFFSET, nextEventStart)

      if (nextHour > currentTime) {
        finalResult.push({
          start: invalidStart,
          end: invalidStart,
          currStart: currentTime,
          currEnd: nextHour,
          isEmpty: true,
          courses: [],
          totalOverlapping: 0,
          overlapIndex: 0,
        })
        invalidStart--
      }

      currentTime = nextHour
    }
  }

  return finalResult
}
</script>

<style scoped>
.col {
  padding: 0px !important;
}

.time-axis-number {
  text-align: right;
}

.time-label {
  text-align: right;
}

.timetableContent {
  border-top: 1px solid gray;
}
</style>
