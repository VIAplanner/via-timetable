import type { WeekdayNumber } from './common.types.ts'
import type { Weekday } from './constants.types.ts'
import type { Course } from './courses.types.ts'

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
  /** Full scraped course record; see courses.ts. Formatted per github.com/Kelexer1/UofT-Scraper. */
  courseData: Course
}

export interface ActivityTimeData {
  course: string // The course code (ex. 'CSC108H5')
  /** The activity code (ex. 'LEC0101') — a teach-method + section-number pair, not a bare ActivityType. */
  activity: string
  day: WeekdayNumber // 1 = Monday ... 7 = Sunday
  start: number // The start time in seconds after midnight
  end: number // The end time in seconds after midnight
}

export interface SemesterEventsData {
  Monday: ActivityTimeData[]
  Tuesday: ActivityTimeData[]
  Wednesday: ActivityTimeData[]
  Thursday: ActivityTimeData[]
  Friday: ActivityTimeData[]
  Saturday: ActivityTimeData[]
  Sunday: ActivityTimeData[]
}
