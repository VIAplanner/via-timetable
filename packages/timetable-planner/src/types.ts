declare interface SymbolConstructor {
    readonly observable: symbol;
}
interface MeetingSection {
    code: string,
    instructors: string[],
    times: MeetingSectionTime[]
}

interface MeetingSectionTime {
    day: string,
    start: number,
    end: number,
    duration: number,
    location: string
}

interface Course {
    code: string,
    meeting_sections: MeetingSection[]
}

interface CourseMeetingSectionCombinations {
    code: string,
    combinations: MeetingSection[][]
}