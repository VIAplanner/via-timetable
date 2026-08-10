import { SessionCodeVerbose } from "./courses.types"

/**
 * Escape hatch for API-controlled string sets: keeps literal-union autocomplete
 * for known values without rejecting a value the source adds later.
 */
export type LooseString<T extends string> = T | (string & {})

/**
 * UofT divisions/faculties that own courses. Known set observed in the
 * reference-data endpoint (`divisions[].value`) and in divisional legend/
 * enrolment-indicator data (keyed by the same codes).
 */
export type DivisionCode = LooseString<
  'APSC' | 'ARTSC' | 'FIS' | 'FPEH' | 'MUSIC' | 'ARCLA' | 'ERIN' | 'SCAR'
>

/**
 * Campuses a course/section can be held at. The reference-data endpoint's
 * `campuses` list only surfaces the first three; the rest are observed on
 * individual course records (`Course.campus` in courses.ts).
 */
export type Campus = LooseString<
  | 'St. George'
  | 'Scarborough'
  | 'University of Toronto at Mississauga'
  | 'Off Campus'
  | 'Sheridan College'
  | 'Centennial College'
>

/** LEC/TUT/PRA-style activity kind, shared by raw scraper data and app state. */
export type ActivityType = LooseString<'LEC' | 'TUT' | 'PRA'>

/**
 * Numeric weekday: 1 = Monday ... 7 = Sunday. Shared by raw scraped meeting
 * times and normalized app activity data. Raw course data only ever
 * populates 1-6 in practice (no Sunday classes observed), but the type
 * allows the full week since both domains use the same 1-based encoding.
 */
export type WeekdayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type HourNumber = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22

/** A single enrolment-restriction code and its explanation, scoped to a division. */
export interface EnrolmentIndicator {
  code: string
  name: string
}

export type CourseCode = string
export type CourseCodeSession = `${CourseCode} ${SessionCodeVerbose}`
