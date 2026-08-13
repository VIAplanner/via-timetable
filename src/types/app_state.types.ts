import type { ActivityType, ActivityTypeFull, WeekdayNumber } from './common.types.ts'
import type { Weekday } from './constants.types.ts'
import type { BuildingCode, Course } from './courses.types.ts'
import { DivisionalEnrolmentIndicator, DivisionalLegend } from './divisions.types.js'

/** Encodes a blocked time interval */
export interface BlockedTimeData {
  day: Weekday // The day the blocked time is on
  start: number // The start time in seconds after midnight
  end: number // The end time in seconds after midnight
}

/** Represents the chosen activities and other metadata for an entire course independent of activity */
export interface SelectedCourseData {
  lec: string | null // The LEC number (null if none)
  tut: string | null // The TUT number (null if none)
  pra: string | null // The PRA number (null if none)
  color: string // The color associated with the course (hex format)
  expiry: number // When the cached course data expires (in ms since epoch)
  courseData: Course // The courses metadata
}

/** Represents a single meeting time for a given course section */
export interface ActivityTimeData {
  course: string // The course code (ex. 'CSC108H5')
  activity: string // The activity code (ex. 'LEC0101')
  day: WeekdayNumber // 1 = Monday ... 7 = Sunday
  start: number // The start time in seconds after midnight
  end: number // The end time in seconds after midnight
}

/** Represents all the events for a semester, sorted by day */
export interface SemesterEventsData {
  Monday: ActivityTimeData[]
  Tuesday: ActivityTimeData[]
  Wednesday: ActivityTimeData[]
  Thursday: ActivityTimeData[]
  Friday: ActivityTimeData[]
  Saturday: ActivityTimeData[]
  Sunday: ActivityTimeData[]
}

/** Combines all divisional legends and divisional enrolment indicators into one interface */
export interface DivisionalData {
  divisionalLegends: DivisionalLegend[] | null // The divisional legends, or null if they haven't been fetched
  // yet / error occurred
  divisionalEnrolmentIndicators: DivisionalEnrolmentIndicator[] | null // The divisional enrolment indicators, or null
  // if they haven't been fetched yet / error occurred
}

/** Encapsulates all data required to display a course card for any course */
export interface CourseCardProps {
  courseData: Course // The complete course metadata
  divisionalData?: DivisionalData // All divisional data
}

/**
 * Encodes a course selection for the purposes of display, is NOT used for registering a section selection with
 * via-builder etc.
 */
export interface SectionType {
  key: ActivityType // The type of activity this is
  label: ActivityTypeFull // The type of activity as a human-readable string
  code: string | null // The code of the selected session
}

/** A processed meeting time specially formatted for easy display */
export interface ParsedMeetingTime {
  time: string // The time as a string, ex. '9 AM'
  location: BuildingCode | 'TBA' // The building code or lack of (as a placeholder)
  locationURL: string | null // The location URL for the building, or null if not applicable
}
