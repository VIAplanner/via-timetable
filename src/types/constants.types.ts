import { LooseString } from './common.types'

/** Saturation level for dark mode course color selection */
export const DARK_SATURATION: number = 0.4

/** Lightness level for dark mode course color selection */
export const DARK_LIGHTNESS: number = 0.3

/** Saturation level for light mode course color selection */
export const LIGHT_SATURATION: number = 0.8

/** Lightness level for light mode course color selection */
export const LIGHT_LIGHTNESS: number = 0.85

/** How long certain data is considered valid before refetching (ex. divisional data) */
export const FETCH_CACHE_EXPIRY: number = 6 * 60 * 60 * 1000 // Expire in 6 hours (in ms)

/** How long selected course data is considered valid before being refetched */
export const COURSE_DATA_CACHE_EXPIRY: number = 12 * 60 * 60 * 1000 // Expire in 12 hours (in ms)

/** All the possible valid weekdays */
export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

/** Typing for a valid weekday string */
export type Weekday = (typeof DAYS)[number]

/** All the possible valid weekdays, shortened for small screens etc. */
export const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const

/** All the possible valid times, in display and numerical format */
export const TIMES = [
  { display: '8 AM', numerical: 8 },
  { display: '9 AM', numerical: 9 },
  { display: '10 AM', numerical: 10 },
  { display: '11 AM', numerical: 11 },
  { display: '12 PM', numerical: 12 },
  { display: '1 PM', numerical: 13 },
  { display: '2 PM', numerical: 14 },
  { display: '3 PM', numerical: 15 },
  { display: '4 PM', numerical: 16 },
  { display: '5 PM', numerical: 17 },
  { display: '6 PM', numerical: 18 },
  { display: '7 PM', numerical: 19 },
  { display: '8 PM', numerical: 20 },
  { display: '9 PM', numerical: 21 },
  { display: '10 PM', numerical: 22 },
] as const

/** The maximum number of state snapshots to store in history before clearing old ones */
export const MAX_HISTORY = 25

/** First semester symbol */
export const FIRST_SEM = 'F' as const

/** Second semester symbol */
export const SECOND_SEM = 'S' as const

/** Both semesters symbol */
export const BOTH_SEM = 'Y' as const

/** Atomic semesters as an array */
export const SEMESTER_CODES = [FIRST_SEM, SECOND_SEM] as const

/** Semester ranges as an array */
export const SEMESTER_CODES_RANGE = [FIRST_SEM, SECOND_SEM, BOTH_SEM] as const

/** Typing for atomic semesters */
export type SemesterCode = (typeof SEMESTER_CODES)[number]

/** Typing for semester ranges */
export type SemesterCodeRange = (typeof SEMESTER_CODES_RANGE)[number]

/** Represents all possible session codes that can be given by a course */
export type SessionCodeVerbose = LooseString<
  'F' | 'S' | 'Y' | 'F2' | 'S2' | 'F3' | 'F4' | 'S3' | 'S4'
>

/** Low online course section preference */
export const ONLINE_LO = 'Avoid' as const

/** Medium online course section preference */
export const ONLINE_MI = 'Neutral' as const

/** High online course section preference */
export const ONLINE_HI = 'Prefer' as const

/** Typing for online course preference */
export type OnlinePreference = typeof ONLINE_LO | typeof ONLINE_MI | typeof ONLINE_HI

/**
 * The name of the blocked times placeholder course. We can simulate blocked times using a placeholder course with
 * activities on all blocked times
 */
export const blockedTimesCourseCodePlaceholder = 'BLOCKERS' as const
