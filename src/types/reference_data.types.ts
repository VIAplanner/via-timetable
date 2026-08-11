import type { DivisionCode, DivisionName } from './common.types.ts'

/** A single subsession within a session group (ex. "Fall 2026 (F)") */
export interface Subsession {
  label: string // The human-readable name of the subsession (ex. "Fall 2026 (F)")
  value: string // The code for the subsession (ex. "20269")
}

/**
 * A session group spanning one or more subsessions (ex. "Summer 2026", made up
 * of F/S/Y subsessions). `group` is this group's own key (ex. "Summer-20265",
 * "FallWinter-20269-20271") — the same value used elsewhere to identify it
 */
export interface SessionGroup {
  group: string // The code for the session group (ex. "FallWinter-20269-20271")
  label: string // The human-readable name for the session group (ex. "Fall-Winter 2026-2027")
  value: string // The title of the session group independent of year (ex. "Fall-Winter")
  subsessions: Subsession[] // The subsessions contained in this session group
}

/** A division/faculty option, as returned by the reference-data endpoint */
export interface Division {
  label: DivisionName // The name of the division
  value: DivisionCode // The code of the division
}

//
// API Responses
//

/** Root shape of the reference-data endpoint (sessions and divisions) */
export interface ReferenceData {
  success: boolean // Whether the query was successful
  sessions: SessionGroup[] // The session groups
  divisions: Division[] // The divisions
}
