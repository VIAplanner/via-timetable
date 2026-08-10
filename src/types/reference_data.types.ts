import type { Campus, DivisionCode } from './common.types.ts'

/** A single subsession within a session group (ex. "Fall 2026 (F)"). */
export interface Subsession {
  label: string
  value: string
}

/**
 * A session group spanning one or more subsessions (ex. "Summer 2026", made up
 * of F/S/Y subsessions). In the API response this is keyed by a group key such
 * as "Summer-20265" or "FallWinter-20269-20271" — that key isn't repeated
 * inside the object itself, so it's not a field here; see `CurrentSessions`.
 */
export interface SessionGroup {
  label: string
  value: string
  subsessions: Subsession[]
}

/** `currentSessions` from the reference-data endpoint, keyed by session group key. */
export type CurrentSessions = Record<string, SessionGroup>

/** A division/faculty option, as returned by the reference-data endpoint. */
export interface Division {
  label: string
  value: DivisionCode
}

/** A campus option, as returned by the reference-data endpoint. */
export interface CampusOption {
  label: string
  value: Campus
}

/** Root shape of the reference-data endpoint (current sessions, divisions, campuses). */
export interface ReferenceData {
  currentSessions: CurrentSessions
  divisions: Division[]
  campuses: CampusOption[]
}
