declare interface SymbolConstructor {
  readonly observable: symbol;
}
interface MeetingSection {
  sectionCode: string;
  instructors: string[];
  times: MeetingSectionTime[];
}
interface MeetingSectionTime {
  day: string;
  start: number;
  end: number;
  duration: number;
  location: string;
}
interface TimetableSection {
  code: string;
  sectionCode: string;
  day: string;
  start: number;
  end: number;
  duration: number;
  instructors: string[];
  location: string;
}
interface Timetable {
  MONDAY: TimetableSection[];
  TUESDAY: TimetableSection[];
  WEDNESDAY: TimetableSection[];
  THURSDAY: TimetableSection[];
  FRIDAY: TimetableSection[];
}
interface Course {
  courseCode: string;
  meeting_sections: MeetingSection[];
}
interface CourseMeetingSectionCombinations {
  code: string;
  combinations: MeetingSection[][];
}
