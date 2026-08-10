import { LooseString } from "./common.types"

/** Controls how colors should be selected for courses */
export const DARK_SATURATION: number = 0.4
export const DARK_LIGHTNESS: number = 0.3
export const LIGHT_SATURATION: number = 0.8
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

/** All the possible valid weekdays, shortened for small screens etc. */
export const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const

/** All the possible valid times, in display and numerical format */
export const TIMES = [
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

/** All the possible valid semester codes, corresponding to First, Second, and Both */
export const FIRST_SEM = 'F' as const
export const SECOND_SEM = 'S' as const
export const BOTH_SEM = 'Y' as const
export const SEMESTER_CODES = [FIRST_SEM, SECOND_SEM] as const
export const SEMESTER_CODES_RANGE = [FIRST_SEM, SECOND_SEM, BOTH_SEM] as const

export type SessionCodeVerbose = LooseString<'F' | 'S' | 'Y' | 'F2' | 'S2' | 'F3' | 'F4' | 'S3' | 'S4'>

export type Weekday = (typeof DAYS)[number]
export type SemesterCode = (typeof SEMESTER_CODES)[number]
export type SemesterCodeRange = (typeof SEMESTER_CODES_RANGE)[number]

export const ONLINE_LO = 'Avoid'
export const ONLINE_MI = 'Neutral'
export const ONLINE_HI = 'Prefer'
export type OnlinePreference = typeof ONLINE_LO | typeof ONLINE_MI | typeof ONLINE_HI

/** We can simulate blocked times using a placeholder course with activities on all blocked times */
export const blockedTimesCourseCodePlaceholder: string = 'BLOCKERS'
