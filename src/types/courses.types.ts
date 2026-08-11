import type {
  ActivityType,
  ActivityTypeFull,
  Campus,
  DivisionName,
  LooseString,
  WeekdayNumber,
} from './common.types.ts'
import type { SessionCodeVerbose } from './constants.types.js'

/** Represents all possible delivery modes of a class
 * INPER = In person
 * SYNC  = Online Synchronous
 * ASYNC = Online Asynchronous
 * HYBR  = Hybrid
 */
export type DeliveryModeCode = LooseString<'INPER' | 'SYNC' | 'ASYNC' | 'HYBR'>

/** Enrolment restriction indicator, e.g. "P" (priority), "R" (restricted), "AR", "R1*", etc. */
export type EnrolmentInd = LooseString<
  | 'AR'
  | 'E'
  | ''
  | 'A'
  | 'P'
  | 'AP'
  | 'R'
  | 'RP'
  | 'R1'
  | 'RP*'
  | 'P*'
  | 'R2'
  | 'R1*'
  | 'AE'
  | 'C'
  | 'AR1'
>

/** Represents a section indicator, e.g. "C" (closed) */ // todo
export type Ind = LooseString<'N' | 'C' | 'Y'>

export type CancelInd = '' | 'N' // todo

/** Represents a course sections meeting time frequency */
export type Repetition = LooseString<'WEEKLY' | 'BI_WEEKLY' | 'MANUAL'>
export type RepetitionTime = LooseString<
  'ONCE_A_WEEK' | 'SECOND_AND_FOURTH_WEEK' | 'FIRST_AND_THIRD_WEEK' | 'MANUAL'
>

/** Represents a specific breadth requirement */
export type BreadthRequirement = LooseString<
  | 'Arts, Literature & Language'
  | 'Creative and Cultural Representations (1)'
  | 'Living Things and Their Environment (4)'
  | 'Society and its Institutions (3)'
  | 'None'
  | 'Natural Sciences'
  | 'Social & Behavioural Sciences'
  | 'The Physical and Mathematical Universes (5)'
  | 'History, Philosophy & Cultural Studies'
  | 'Thought, Belief and Behaviour (2)'
  | 'Quantitative Reasoning'
  | 'Society and Its Institutions (3)'
  | 'Required'
  | 'Behavioural (B)'
  | 'Biophysical (C)'
  | 'Physical Cultural (A)'
  | 'TBA'
  | 'Thought, Belief, and Behaviour (2)'
  | 'Applications'
>

/** Represents a distribution requirement */
export type DistributionRequirement = LooseString<
  'Humanities' | 'Social Science' | 'Science' | 'None' | 'TBA'
>

/** Represents the level of instruction for a course */
export type CourseLevelOfInstruction = LooseString<'undergraduate'>

/** Represents the short-form code for an organization */
export type OrganizationCode = LooseString<
  | ''
  | 'SCAR'
  | 'ERIN'
  | 'ARTSC'
  | 'APSC'
  | 'ARCLA'
  | 'ACMSC'
  | 'STAT'
  | 'AFR'
  | 'ANA'
  | 'ANT'
  | 'ANTSC'
  | 'MAT'
  | 'CDP'
  | 'AST'
  | 'CHMPS'
  | 'CSB'
  | 'BCH'
  | 'UMBIO'
  | 'BIOSC'
  | 'ICC'
  | 'OISUT'
  | 'SMC'
  | 'CHM'
  | 'PESSC'
  | 'CINE'
  | 'GGRSC'
  | 'UMCIP'
  | 'JSP'
  | 'HCSSC'
  | 'UC'
  | 'CMSSC'
  | 'ENGSC'
  | 'CSC'
  | 'MCS'
  | 'DTS'
  | 'EAS'
  | 'ECO'
  | 'UMECO'
  | 'VIC'
  | 'FGI'
  | 'EEB'
  | 'ENG'
  | 'UMGGR'
  | 'ENVMT'
  | 'ESC'
  | 'ES'
  | 'CERES'
  | 'FRE'
  | 'CFLSC'
  | 'UMFSC'
  | 'GER'
  | 'HIS'
  | 'CHSSC'
  | 'HMB'
  | 'IHPST'
  | 'CDSSC'
  | 'ASABS'
  | 'ASIP2'
  | 'ASIP3'
  | 'IRE'
  | 'ISPLA'
  | 'LIN'
  | 'LMP'
  | 'MGTSC'
  | 'COMPG'
  | 'UMMGT'
  | 'MEDGM'
  | 'NEW'
  | 'PSYSC'
  | 'GLAF'
  | 'PCL'
  | 'PHL'
  | 'UMPHL'
  | 'PHLSC'
  | 'PHY'
  | 'POL'
  | 'UMPOL'
  | 'POLSC'
  | 'PSL'
  | 'UMPSY'
  | 'PSY'
  | 'RLG'
  | 'ASDN'
  | 'SOC'
  | 'SOCSC'
  | 'TRIN'
  | 'GGR'
  | 'HISCL'
  | 'FIS'
  | 'ANTRL'
  | 'AE1'
  | 'CCS'
  | 'UMVIS'
  | 'CLAS'
  | 'CRIM'
  | 'CITA'
  | 'ENGDR'
  | 'DRAMA'
  | 'FAR'
  | 'IMM'
  | 'ISUP'
  | 'FPEH'
  | 'MUSIC'
  | 'NMC'
  | 'SDST'
  | 'UMSOC'
  | 'ISTEP'
  | 'WGSI'
  | 'INNIS'
  | 'WDW'
  | 'ECE'
  | 'IMI'
  | 'PHM'
  | 'SLP'
  | 'CSUS'
  | 'MIE'
  | 'BME'
  | 'ASI'
  | 'CHE'
  | 'CIVIL'
  | 'CTLSC'
  | 'ENT'
  | 'SLA'
  | 'MMS'
  | 'NUSCI'
  | 'ASIP'
  | 'SAS'
  | 'ETHIC'
  | 'ITA'
>

/** Represents the full name for an organization */
export type OrganizationName = LooseString<
  | 'University of Toronto Scarborough'
  | 'University of Toronto Mississauga'
  | 'Faculty of Arts and Science'
  | 'Faculty of Applied Science & Engineering'
  | 'John H. Daniels Faculty of Architecture, Landscape, & Design'
  | 'Dept. of Arts, Culture & Media (UTSC)'
  | 'Department of Statistical Sciences'
  | 'African Studies Centre'
  | 'Department of Anatomy and Cell Biology'
  | 'Department of Anthropology'
  | 'Department of Anthropology (UTSC)'
  | 'Department of Mathematics'
  | 'Cross-Disciplinary Programs Office'
  | 'Department of Astronomy and Astrophysics'
  | 'Department of Chemical and Physical Sciences'
  | 'Department of Cell and Systems Biology'
  | 'Department of Biochemistry'
  | 'Department of Biology'
  | 'Department of Biological Sciences (UTSC)'
  | 'Institute of Communication and Culture'
  | 'Ontario Institute for Studies in Education/Univ. of Toronto'
  | "St. Michael's College"
  | 'Department of Chemistry'
  | 'Dept. of Physical & Environmental Sci (UTSC)'
  | 'Cinema Studies Institute'
  | 'Department of Human Geography (UTSC)'
  | 'UTM Co-op Internship Program'
  | 'Jewish Studies'
  | 'Dept. of Historical & Cultural Studies (UTSC)'
  | 'University College'
  | 'Dept. of Computer & Mathematical Sci (UTSC)'
  | 'Department of English (UTSC)'
  | 'Department of Computer Science'
  | 'Department of Mathematical and Computational Sciences'
  | 'Centre for Diaspora & Transnational Studies'
  | 'Department of East Asian Studies'
  | 'Department of Economics'
  | 'Victoria College'
  | 'Department of Language Studies'
  | 'Department of Ecology and Evolutionary Biology'
  | 'Department of English'
  | 'Department of Geography, Geomatics and Environment'
  | 'School of Environment'
  | 'Division of Engineering Science'
  | 'Department of Earth Sciences'
  | 'Centre for European and Eurasian Studies'
  | 'Department of French'
  | 'Department of Language Studies (UTSC)'
  | 'Institute of Forensic Sciences'
  | 'Department of Germanic Languages & Literatures'
  | 'Department of History'
  | 'Department of Health and Society (UTSC)'
  | 'Human Biology Program'
  | 'Inst. for the History & Philosophy of Science & Technology'
  | 'Department of Global Development Studies (UTSC)'
  | 'Indigenous Studies - Arts & Science'
  | 'Arts & Science Internship Program - Year 2'
  | 'Arts & Science Internship Program - Year 3'
  | 'Centre for Industrial Relations and Human Resources'
  | 'Dept. of Italian Spanish Portuguese & Latin American Studies'
  | 'Department of Linguistics'
  | 'Department of Laboratory Medicine and Pathobiology'
  | 'Department of Management (UTSC)'
  | 'Rotman Commerce'
  | 'Department of Management'
  | 'Department of Molecular Genetics'
  | 'New College'
  | 'Department of Psychology (UTSC)'
  | 'Munk School of Global Affairs and Public Policy'
  | 'Department of Pharmacology'
  | 'Department of Philosophy'
  | 'Department of Philosophy (UTSC)'
  | 'Department of Physics'
  | 'Department of Political Science'
  | 'Department of Political Science (UTSC)'
  | 'Department of Physiology'
  | 'Department of Psychological and Brain Sciences'
  | 'Department of Psychology'
  | 'Department for the Study of Religion'
  | 'ASDN: Arts and Science, Office of the Dean'
  | 'Department of Sociology'
  | 'Department of Sociology (UTSC)'
  | 'Trinity College'
  | 'Department of Geography and Planning'
  | 'Department of Historical Studies'
  | 'Faculty of Information'
  | 'Engineering First Year Office'
  | 'Centre for Caribbean Studies'
  | 'Department of Visual Studies'
  | 'Department of Classics'
  | 'Centre for Criminology and Sociolegal Studies'
  | 'Canadian Institute for Theoretical Astrophysics'
  | 'Department of English and Drama'
  | 'Centre for Drama, Theatre and Performance Studies'
  | 'Department of Art History'
  | 'Department of Immunology'
  | 'Institute for the Study of University Pedagogy'
  | 'Faculty of Kinesiology and Physical Education'
  | 'Faculty of Music'
  | 'Department of Near & Middle Eastern Civilizations'
  | 'Mark S. Bonham Centre for Sexual Diversity Studies'
  | 'Inst for Studies in Transdisciplinary Engin Educ & Practice'
  | 'Women and Gender Studies Institute'
  | 'Innis College'
  | 'Woodsworth College'
  | 'Edward S. Rogers Sr. Dept. of Electrical & Computer Engin.'
  | 'Institute for Management and Innovation'
  | 'The Leslie Dan Faculty of Pharmacy'
  | 'Department of Speech-Language Pathology'
  | 'Centre for Study of United States'
  | 'Department of Mechanical & Industrial Engineering'
  | 'Institute of Biomedical Engineering'
  | 'Contemporary East and Southeast Asian Studies'
  | 'Department of Chemical Engineering and Applied Chemistry'
  | 'Department of Civil and Mineral Engineering'
  | 'Centre for Teaching and Learning (UTSC)'
  | 'Centre for Entrepreneurship'
  | 'Department of Slavic and East European Languages & Cultures'
  | 'Department of Materials Science and Engineering'
  | 'Department of Nutritional Sciences'
  | 'Arts & Science Internship Program'
  | 'South Asian Studies'
  | 'Centre for Ethics'
  | 'Department of Italian Studies'
>

/** Represents a breadth-type kind for a course */
export type BreadthTypeKind = LooseString<'BREADTH' | 'DISTRIBUTION' | 'ELECTIVE'>

/** Represents a breadth-type type for a course */
export type BreadthTypeType = LooseString<
  | 'Arts Lit & Lang'
  | 'Science'
  | 'Physical Universe'
  | 'Compl Studies'
  | 'Creative Cultural'
  | 'Living Things'
  | 'Hum&SocSci'
  | 'Social Science'
  | 'Society Institutions'
  | 'Natural Sciences'
  | 'Social & Behavioural'
  | 'APSc-Nat Science'
  | 'Humanities'
  | 'Hist Phil. Cultural'
  | 'Thought'
  | 'Quant. Reasoning'
>

/** Represents a breadth-type code for a course */
export type BreadthTypeCode = LooseString<
  | 'Arts'
  | 'Sci'
  | 'BR=5'
  | 'CS'
  | 'BR=1'
  | 'BR=4'
  | 'HSS'
  | 'SSc'
  | 'BR=3'
  | 'NatSci'
  | 'SocBeh'
  | 'NSC'
  | 'Hum'
  | 'HisPhil'
  | 'BR=2'
  | 'Quant'
>

/** Represents a breadth-type description for a course */
export type BreadthTypeDescription = LooseString<
  | 'Arts, Literature & Language'
  | 'Science'
  | 'BR=5 The Physical and Mathematical Universes'
  | 'Complementary Studies'
  | 'BR=1 Creative and Cultural Representation'
  | 'BR=4 Living Things and Their Environment'
  | 'Humanities & Social Sciences'
  | 'Social Science'
  | 'BR=3 Society and Its Institutions'
  | 'Natural Sciences'
  | 'Social & Behavioural Sciences'
  | 'APSc-Natural Science'
  | 'Humanities'
  | 'History, Philosophy & Cultural Studies'
  | 'BR=2 Thought, Belief and Behaviour'
  | 'Quantitative Reasoning'
>

/** Represents the short-form code for a physical building */
export type BuildingCode = LooseString<
  | ''
  | 'HL'
  | 'IA'
  | 'BA'
  | 'CC'
  | 'DV'
  | 'SW'
  | 'SY'
  | 'IB'
  | 'RW'
  | 'SS'
  | 'EV'
  | 'IC'
  | 'KW'
  | 'MP'
  | 'ZZ'
  | 'DH'
  | 'MN'
  | 'OI'
  | 'BV'
  | 'FE'
  | 'GB'
  | 'UC'
  | 'ES'
  | 'RL'
  | 'AA'
  | 'AP'
  | 'SF'
  | 'WI'
  | 'MY'
  | 'DA'
  | 'PB'
  | 'MC'
  | 'AC'
  | 'WW'
  | 'HS'
  | 'AB'
  | 'BL'
  | 'SK'
  | 'SH'
  | 'LI'
  | 'EP'
  | 'WE'
  | 'NB'
  | 'BN'
  | 'WS'
  | 'WO'
  | 'SB'
  | 'BF'
  | 'SM'
  | 'CR'
  | 'ON'
  | 'WB'
  | 'KP'
  | 'MS'
  | 'BR'
  | 'EM'
  | 'MB'
  | 'HA'
  | 'RS'
  | 'HW'
  | 'VC'
  | 'AH'
  | 'LA'
  | 'NF'
  | 'SU'
  | 'CH'
  | 'KN'
  | 'TF'
  | 'GI'
  | 'TL'
  | 'TC'
  | 'LM'
  | 'NL'
  | 'IN'
  | 'EJ'
  | 'JH'
  | 'BT'
  | 'UP'
  | 'SD'
  | 'HI'
  | 'PT'
  | 'OH'
  | 'JP'
  | 'MK'
  | 'BY'
  | 'RT'
  | 'UY'
  | 'ZO'
  | 'RO'
  | 'PR'
>

/** Represents the name of a note */
export type NoteName = LooseString<'Course Note' | 'Section Note'>

/** Represents the type of a note */
export type NoteType = LooseString<'COURSE' | 'SECTION'>

/** Represents an organization, such as the Department of Applied Science and Engineering */
export interface Organization {
  code: OrganizationCode // The code, ex. "ARTSC"
  name: OrganizationName | null // The human-readable name, ex. "Faculty of Arts and Science"
}

/** Encodes the full name of an instructor */
export interface Instructor {
  firstName: string // The first name of the instructor
  lastName: string // The last name of the instructor
}

/** Encodes a physical building */
export interface Building {
  buildingCode: BuildingCode // The code of the building, ex. "DH"
  buildingUrl: string | null // A URL for the building, usually null or a link to a campus map at that building
}

/** Encodes a single contiguous meeting time */
export interface MeetingTime {
  start: number // The start time in seconds after midnight
  end: number // The end time in seconds after midnight
  building: Building // The building the meeting time is in
  sessionCode: string // The session that this course is in (ex. "20261")
  repetition: Repetition // The repetition frequency for this meeting time
  repetitionTime: RepetitionTime // The repetition times for this meeting time
  day: WeekdayNumber // The weekday this meeting time occurs on
}

/** Encodes a delivery method for a session */
export interface DeliveryMode {
  session: string // The session this applies to
  mode: DeliveryModeCode // The delivery mode
}

/** Encodes a note */
export interface Note {
  name: NoteName // The name of the note
  type: NoteType // The type of the note
  content: string // The note content
}

/** Encodes a relationship between two activities, where both must be selected if either one is */
export interface LinkedMeetingSection {
  teachMethod: ActivityType // The type of activity the meeting section is linked to
  sectionNumber: string // The NUMERICAL portion of the section code (ex. "0101")
  type: null // Always null in observed data; kept nullable in case the source ever populates it
}

/** Encodes a single section offering for a course */
export interface Section {
  name: string // The activity type
  type: ActivityTypeFull // The full activity type
  sectionNumber: string // The NUMERICAL portion of the section code (ex. "0101")
  meetingTimes: MeetingTime[] // The meeting times for this section
  instructors: Instructor[] // The instructors teaching this section
  currentEnrolment: number // The current number of students enrolled
  maxEnrolment: number // The maximum number of students that can enrol in this section
  subTitle: string // The subtitle of this section
  cancelInd: Ind // todo
  waitlistInd: Ind // todo
  deliveryModes: DeliveryMode[] // The delivery modes of this section
  currentWaitlist: number // The number of students currently on the waitlist for this section
  enrolmentInd: EnrolmentInd // The enrolment indicator for this section
  tbaInd: Ind // todo
  openLimitInd: Ind // The open limit indicator for this section todo
  notes: Note[] // The notes for this section
  enrolmentControls: string[] // The enrolment controls for this section
  linkedMeetingSections: LinkedMeetingSection[] | null // The linked meeting times for this section
}

/** Encodes a publication section */
export interface PublicationSection {
  section: string // todo
  subSections: string[] | null // todo
}

/** Rich course-calendar metadata */
export interface CmCourseInfo {
  description: string // The course description
  title: string // The title of the course
  levelOfInstruction: CourseLevelOfInstruction | null // The level of instruction of the course (ex. "undergraduate")
  prerequisitesText: string | null // Human-readable prerequisites text
  corequisitesText: string | null // Human-readable corequisites text
  exclusionsText: string | null // Human-readable exclusions text
  recommendedPreparation: string | null // Human-readable recommended prep text
  note: string | null // Any additional notes about the course. May contain raw HTML (e.g. "<p>...</p>")
  division: DivisionName // The division of the course
  breadthRequirements: BreadthRequirement[] | null // The breadth requirements of this course
  distributionRequirements: DistributionRequirement[] | null // The distribution requirements of this course
  publicationSections: string[] | null // The publication sections of the course
  cmPublicationSections: PublicationSection[] | null // todo
}

/** Represents a single breadth type for a course */
export interface BreadthType {
  kind: BreadthTypeKind
  type: BreadthTypeType
  description: BreadthTypeDescription
  code: BreadthTypeCode
}

/** Represents a set of breadth data for a course */
export interface Breadth {
  org: Organization
  breadthTypes: BreadthType[]
}

/** Represents all required information for a single course */
export interface Course {
  name: string // A human-readable name for the course
  code: string // The course code
  sectionCode: SessionCodeVerbose // The section code for the course
  sessionGroup: string // Session identifier this specific course record belongs to, e.g. "20269" (NOT FROM SCRAPER FMT)
  campus: Campus // The campus this course is at
  sessions: string[] // Session codes this course runs in, (ex. ["20265"])
  sections: Section[] // The available sections for the course
  cmCourseInfo: CmCourseInfo | null // Course metadata
  primaryTeachMethod: ActivityType // The primary content delivery type of the course
  faculty: Organization // The faculty in charge of the course
  coSec: Organization // todo
  department: Organization // The department in charge of the course
  title: null // Always null in observed data
  maxCredit: number // The maximum number of credits obtainable from the course
  minCredit: number // The minimum number of credits obtainable from the course
  breadths: Breadth[] // The breadths of the course
  notes: Note[] // The notes for the course
  cancelInd: CancelInd // todo
  fullyOnline: boolean // Whether the course is fully online
  primaryFull: boolean // Whether the primary teach method for the course is full
  primaryWaitlistable: boolean // Whether the primary teach method for the course is full
}

//
// API Responses
//

/** Pagination metadata on a course search response. */
export interface CoursePageInfo {
  hasNextPage: boolean // Whether the search query has another page of items
  hasPreviousPage: boolean // Whether the search query has a previous page of items
  itemsOnPage: number // How many items are on the current page
}

/**
 * Root shape of GET /courses/:code. A code like "csc108" can match several
 * distinct courses (e.g. CSC108H1 F/S/Y, CSC108H5), so this is a paginated
 * search result rather than a single course
 */
export interface CourseSearchResponse {
  courses: Course[] // The courses on the page
  totalPages: number // The total number of pages
  currentPage: number // The current number of pages
  total: number // The total number of courses across all pages
  searchTerm: string // The search query
  pageInfo: CoursePageInfo // The page info
}
