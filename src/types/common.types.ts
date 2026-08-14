/**
 * Escape hatch for API-controlled string sets: keeps literal-union autocomplete
 * for known values without rejecting a value the source adds later
 */
export type LooseString<T extends string> = T | (string & {})

/** UofT divisions/faculties that own courses */
export type DivisionCode = LooseString<
  'APSC' | 'ARTSC' | 'FIS' | 'FPEH' | 'MUSIC' | 'ARCLA' | 'ERIN' | 'SCAR'
>

/** Human-readable representation of a division */
export type DivisionName = LooseString<
  | 'University of Toronto Scarborough'
  | 'Arts and Science, Faculty of'
  | 'Applied Science & Engineering, Faculty of'
  | 'Architecture, Landscape, and Design, John H. Daniels Faculty of'
  | 'University of Toronto Mississauga'
  | 'Information, Faculty of'
  | 'Kinesiology and Physical Education, Faculty of'
  | 'Music, Faculty of'
>

/** Campuses a course/section can be held at */
export type Campus = LooseString<
  | 'St. George'
  | 'Scarborough'
  | 'University of Toronto at Mississauga'
  | 'Off Campus'
  | 'Sheridan College'
  | 'Centennial College'
>

/** All possible activity kinds */
export type ActivityType = 'LEC' | 'TUT' | 'PRA'

/** Human-readable representations of ActivityType */
export type ActivityTypeFull = LooseString<'Lecture' | 'Tutorial' | 'Practical'>

/**
 * Numeric weekday: 1 = Monday ... 7 = Sunday. Course data only ever
 * populates 1-6 in practice (no Sunday classes observed)
 */
export type WeekdayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7
