import type { ActivityType, Campus, LooseString, WeekdayNumber } from './common.types.ts'
import type { SessionCodeVerbose } from './constants.types.js'

export type SectionType = LooseString<'Lecture' | 'Tutorial' | 'Practical'>

export type DeliveryModeCode = LooseString<'INPER' | 'SYNC' | 'ASYNC' | 'HYBR'>

/** Enrolment restriction indicator, e.g. "P" (priority), "R" (restricted), "AR", "R1*", etc. */
export type EnrolmentInd = LooseString<
  | ''
  | 'P'
  | 'E'
  | 'R'
  | 'R1'
  | 'A'
  | 'AP'
  | 'RP'
  | 'AR'
  | 'R2'
  | 'P*'
  | 'RP*'
  | 'R1*'
  | 'AE'
  | 'C'
  | 'AR1'
>

export type YNFlag = 'Y' | 'N'
export type OpenLimitInd = LooseString<'N' | 'C' | 'Y'>

export type Repetition = LooseString<'WEEKLY' | 'BI_WEEKLY' | 'MANUAL'>
export type RepetitionTime = LooseString<
  'ONCE_A_WEEK' | 'SECOND_AND_FOURTH_WEEK' | 'FIRST_AND_THIRD_WEEK' | 'MANUAL'
>

export type BreadthKind = LooseString<'BREADTH' | 'DISTRIBUTION' | 'ELECTIVE'>

export interface OrgRef {
  code: string
  name: string | null
}

export interface Instructor {
  firstName: string
  lastName: string
}

export interface Building {
  buildingCode: string
  buildingUrl: string | null
}

export interface MeetingTime {
  /** Seconds since midnight. */
  start: number
  /** Seconds since midnight. */
  end: number
  building: Building
  sessionCode: string
  repetition: Repetition
  repetitionTime: RepetitionTime
  day: WeekdayNumber
}

export interface DeliveryMode {
  session: string
  mode: DeliveryModeCode
}

export interface Note {
  name: string
  type: string
  content: string
}

export interface LinkedMeetingSection {
  sectionNumber: string
  teachMethod: string
  /** Always null in observed data; kept nullable in case the source ever populates it. */
  type: null
}

export interface Section {
  name: string
  type: SectionType
  sectionNumber: string
  meetingTimes: MeetingTime[]
  instructors: Instructor[]
  currentEnrolment: number
  maxEnrolment: number
  subTitle: string
  cancelInd: YNFlag
  waitlistInd: YNFlag
  deliveryModes: DeliveryMode[]
  currentWaitlist: number
  enrolmentInd: EnrolmentInd
  tbaInd: YNFlag
  openLimitInd: OpenLimitInd
  notes: Note[]
  enrolmentControls: string[]
  linkedMeetingSections: LinkedMeetingSection[] | null
}

export interface PublicationSection {
  section: string
  subSections: string[] | null
}

/** Rich course-calendar metadata; the whole object can be null. */
export interface CmCourseInfo {
  description: string
  title: string
  levelOfInstruction: string | null
  prerequisitesText: string | null
  corequisitesText: string | null
  exclusionsText: string | null
  recommendedPreparation: string | null
  /** May contain raw HTML (e.g. "<p>...</p>"). */
  note: string | null
  division: string
  breadthRequirements: string[] | null
  distributionRequirements: string[] | null
  publicationSections: string[] | null
  cmPublicationSections: PublicationSection[] | null
}

export interface BreadthType {
  kind: BreadthKind
  type: string
  description: string
  code: string
}

export interface Breadth {
  org: OrgRef
  breadthTypes: BreadthType[]
}

export interface Course {
  name: string
  /** Course code, e.g. "ACMC01H3". */
  code: string
  sectionCode: SessionCodeVerbose
  campus: Campus
  /** Session codes this course runs in, e.g. ["20265"]. */
  sessions: string[]
  sections: Section[]
  cmCourseInfo: CmCourseInfo | null
  primaryTeachMethod: ActivityType
  faculty: OrgRef
  coSec: OrgRef
  department: OrgRef
  /** Always null in observed data. */
  title: null
  maxCredit: number
  minCredit: number
  breadths: Breadth[]
  notes: Note[]
  /** "N" or "" in observed data — registrar leaves it blank rather than omitting it. */
  cancelInd: YNFlag | ''
  fullyOnline: boolean
  primaryFull: boolean
  primaryWaitlistable: boolean
}
