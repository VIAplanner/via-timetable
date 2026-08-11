// /** Represents a single division (faculty or potentially campus that a course belongs to) */
// export interface DivisionData {
//   label: string // The full name of the division (ex. "University of Toronto Mississauga")
//   value: string // The code for the division (ex. "Erin")
//   __v: number // Internal tracking value
//   _id: string // Internal tracking value
// }

// /** Represents a single session group that a course takes place in (either spanning or a single subsession) */
// export interface SessionData {
//   group: string // The session group that the session belongs to (ex. "FallWinter-20259-20261")
//   label: string // A more idiomatic label for the session group (ex. "Fall-Winter 2025-2026")
//   subsessions: Array<{
//     value: string // The subsession code (ex. 20259)
//     label: string // A more idiomatic label for the subsession (ex. "Fall 2025 (F)")
//     _id: string // Internal tracking value
//   }>
// }

// /** Encodes a blocked time interval */
// export interface BlockedTimeData {
//   day: Weekday // The day the blocked time is on
//   start: number // The start time in seconds after midnight
//   end: number // The end time in seconds after midnight
// }

// /** Represents the chosen activities and other metadata for an entire course independent of activity */
// export interface SelectedCourseData {
//   lec: string | null // The LEC number (null if none)
//   tut: string | null // The TUT number (null if none)
//   pra: string | null // The PRA number (null if none)
//   color: string // The color associated with the course (hex format)
//   expiry: number // When the cached course data expires (in ms since epoch)
//   courseData: any // The JSON object containing all data for the course (ex. meeting times, instructors, etc.)
//   // ^ Exact formatting may change from time to time, (for now) formatted by https://github.com/Kelexer1/UofT-Scraper
// }

// export interface ActivityTimeData {
//   course: string // The course code (ex. 'CSC108H5')
//   activity: string // The activity code (ex. 'LEC0101')
//   day: number // The day the activity is on (1 = Monday, 2 = Tuesday ... 7 = Sunday)
//   start: number // The start time in seconds after midnight
//   end: number // The end time in seconds after midnight
// }

// export interface DivisionalLegend {
//   division: string
//   content: string
// }

// export interface DivisionalLegends {
//   expiry: number
//   data: Array<DivisionalLegend>
// }

// export interface SemesterEventsData {
//   Monday: Array<ActivityTimeData>
//   Tuesday: Array<ActivityTimeData>
//   Wednesday: Array<ActivityTimeData>
//   Thursday: Array<ActivityTimeData>
//   Friday: Array<ActivityTimeData>
//   Saturday: Array<ActivityTimeData>
//   Sunday: Array<ActivityTimeData>
// }

// export interface EnrolmentIndicator {
//   code: string
//   name: string
// }

// export interface DivisionalEnrolmentIndicator {
//   division: string
//   codes: Array<EnrolmentIndicator>
// }

// export interface DivisionalEnrolmentIndicators {
//   expiry: number
//   data: Array<DivisionalEnrolmentIndicator>
// }
