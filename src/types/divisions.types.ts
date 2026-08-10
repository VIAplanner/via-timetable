import type { DivisionCode, EnrolmentIndicator } from './common.types.ts'

/* ---------------------------------------------------------------------- */
/* Raw fetch-response shapes, as returned directly by the scraper API     */
/* ---------------------------------------------------------------------- */

/** Raw HTML string (tables/lists explaining course-code and enrolment legends) per division. */
export type DivisionalLegendsResponse = Record<DivisionCode, string>

/** Per-division list of enrolment indicator codes; can be an empty array (e.g. "APSC", "FIS"). */
export type DivisionalEnrolmentIndicatorsResponse = Record<DivisionCode, EnrolmentIndicator[]>

/* ---------------------------------------------------------------------- */
/* Client-side cache shapes, as normalized/stored in app state            */
/* ---------------------------------------------------------------------- */

export interface DivisionalLegend {
  division: DivisionCode
  content: string
}

export interface DivisionalLegends {
  expiry: number
  data: DivisionalLegend[]
}

export interface DivisionalEnrolmentIndicator {
  division: DivisionCode
  codes: EnrolmentIndicator[]
}

export interface DivisionalEnrolmentIndicators {
  expiry: number
  data: DivisionalEnrolmentIndicator[]
}
