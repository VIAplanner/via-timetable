import type { ActivityType, ActivityTypeFull, Campus, WeekdayNumber } from './common.types.ts'
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

export interface DivisionalData {
  divisionalLegends: DivisionalLegend[] | null
  divisionalEnrolmentIndicators: DivisionalEnrolmentIndicator[] | null
}

export interface CourseCardProps {
  courseData: Course
  divisionalData?: DivisionalData
}

export interface BuilderCourseSelection {
  code: string
  campus: Campus
  type: ActivityType
  section: string
}

export interface BuilderEvent {
  start: number
  end: number
  day: number
  online: boolean
  zz: boolean
  semester: number
}

export interface BuilderCourseSectionInput {
  name: string
  meetingTimes: BuilderEvent[]
}

export interface BuilderCourseInput {
  code: string
  campus: string
  type: ActivityType
  sections: BuilderCourseSectionInput[]
}

export interface SectionType {
  key: ActivityType
  label: ActivityTypeFull
  field: string | null
}

export interface ParsedMeetingTime {
  time: string
  location: BuildingCode | 'TBA'
  locationURL: string | null
}
