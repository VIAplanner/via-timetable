/** Controls how colors should be selected for courses */
export const DARK_SATURATION: number = 0.4;
export const DARK_LIGHTNESS: number = 0.3;
export const LIGHT_SATURATION: number = 0.8;
export const LIGHT_LIGHTNESS: number = 0.85;

/** How long certain data is considered valid before refetching (ex. divisional data) */
export const FETCH_CACHE_EXPIRY: number = 3 * 60 * 1000; // Expire in 3 mins (in ms)

/** All the possible valid weekdays */
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

/** All the possible valid weekdays, shortened for small screens etc. */
export const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

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
    { display: '10 PM', numerical: 22 }
] as const;

/** All the possible valid semester codes, corresponding to First and Second */
export const FIRST_SEM = 'F' as const;
export const SECOND_SEM = 'S' as const;
export const BOTH_SEM = 'Y' as const;
export const SEMESTER_CODES = [FIRST_SEM, SECOND_SEM] as const;

/** We can simulate blocked times using a placeholder course with activities on all blocked times */
export const blockedTimesCourseCodePlaceholder: string = 'BLOCKERS';

/** The maximum number of state snapshots to store in history before clearing old ones */
export const MAX_HISTORY = 25;

/** Derived types based on the constant arrays above */
export type Weekday = typeof DAYS[number];
export type SemesterCode = typeof SEMESTER_CODES[number];

export type ActivityType = 'LEC' | 'TUT' | 'PRA';

/** Represents a single division (faculty or potentially campus that a course belongs to) */
export interface DivisionData {
	label: string, // The full name of the division (ex. "University of Toronto Mississauga")
	value: string, // The code for the division (ex. "Erin")
	__v: number, // Internal tracking value
	_id: string // Internal tracking value
}

/** Represents a single session group that a course takes place in (either spanning or a single subsession) */
export interface SessionData {
	group: string, // The session group that the session belongs to (ex. "FallWinter-20259-20261")
	label: string, // A more idiomatic label for the session group (ex. "Fall-Winter 2025-2026")
	subsessions: Array<{
		value: string, // The subsession code (ex. 20259)
		label: string, // A more idiomatic label for the subsession (ex. "Fall 2025 (F)")
		_id: string // Internal tracking value
	}>
}

/** Encodes a blocked time interval */
export interface BlockedTimeData {
	day: Weekday, // The day the blocked time is on
	start: number, // The start time in seconds after midnight
	end: number // The end time in seconds after midnight
}

/** Represents the chosen activities and other metadata for an entire course independent of activity */
export interface SelectedCourseData {
	lec: string | null, // The LEC number (null if none)
	tut: string | null, // The TUT number (null if none)
	pra: string | null, // The PRA number (null if none)
	color: string, // The color associated with the course (hex format)
	courseData: any // The JSON object containing all data for the course (ex. meeting times, instructors, etc.)
	// ^ Exact formatting may change from time to time, (for now) formatted by https://github.com/Kelexer1/UofT-Scraper
}

export interface ActivityTimeData {
	course: string, // The course code (ex. 'CSC108H5')
	activity: string, // The activity code (ex. 'LEC0101')
	day: number, // The day the activity is on (1 = Monday, 2 = Tuesday ... 7 = Sunday)
	start: number, // The start time in seconds after midnight
	end: number // The end time in seconds after midnight
}

export interface SemesterEventsData {
	Monday: Array<ActivityTimeData>,
	Tuesday: Array<ActivityTimeData>,
	Wednesday: Array<ActivityTimeData>,
	Thursday: Array<ActivityTimeData>,
	Friday: Array<ActivityTimeData>,
	Saturday: Array<ActivityTimeData>,
	Sunday: Array<ActivityTimeData>
}
