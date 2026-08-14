import type { DivisionCode } from './common.types.ts'

/** Represents a single divisional legend for a division as HTML content */
export interface DivisionalLegend {
  division: DivisionCode // The division
  content: string // HTML content
}

/** App state divisional legends incorporating an embedded data expiry time */
export interface DivisionalLegends {
  expiry: number // The expiry time in ms after epoch
  data: DivisionalLegend[] // The divisional legends
}

/** A single enrolment-restriction code and its explanation, scoped to a division */
export interface EnrolmentIndicator {
  code: string // The short-form code, such as "P"
  name: string // The human-readable explanation for the code
}

/** All divisional enrolment indicators for a particular division */
export interface DivisionalEnrolmentIndicator {
  division: DivisionCode // The division code
  codes: EnrolmentIndicator[] // The codes
}

/** App state divisional enrolment indicators incorporating an embedded data expiry time */
export interface DivisionalEnrolmentIndicators {
  expiry: number // The expiry time in ms after epoch
  data: DivisionalEnrolmentIndicator[] // The divisional enrolment indicators
}

//
// API Responses
//

/** Root response shape of GET /divisionalLegends: a list of {division, content} entries */
export interface DivisionalLegendsResponse {
  success: boolean // Whether the query was successful
  count: number // The number of divisional legends
  data: DivisionalLegend[] // The divisional legends
}

/**
 * Root response shape of GET /divisionalEnrolmentIndicators: a list of
 * {division, codes} entries. `codes` can be an empty array (e.g. "APSC", "FIS")
 */
export interface DivisionalEnrolmentIndicatorsResponse {
  success: boolean // Whether the query was successful
  count: number // The number of divisional enrolment indicators
  data: DivisionalEnrolmentIndicator[] // The divisional enrolment indicators
}
