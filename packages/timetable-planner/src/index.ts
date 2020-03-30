import { courseCombinations, courseMeetingSectionCombinations, } from "./combinations/combinations"

const checkOverlapForDay = (timetable: Timetable, day: string) => {
    let section = 0
    while (section < timetable[day].length) {
        let section2 = +section + +1
        while (section2 < timetable[day].length) {
            if ((timetable[day][section].start >= timetable[day][section2].start &&
                timetable[day][section].start < timetable[day][section2].end) ||
                (timetable[day][section].end > timetable[day][section2].start &&
                    timetable[day][section].end <= timetable[day][section2].end)) {
                return true
            }
            section2++
        }
        section++
    }
    return false
}

const overlapExists = (timetable: Timetable): boolean => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    let exists = false
    for (const day of days) {
        exists = exists || checkOverlapForDay(timetable, day)
    }
    return exists
}

const createTimetable = (meetingSectionCombo: MeetingSection[]): Timetable => {
    const timetable: Timetable = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: []
    }
    for (const meetingSection of meetingSectionCombo) {
        for (const time of meetingSection.times) {
            timetable[time.day].push(time)
        }
    }
    if (overlapExists(timetable)) {
        return null
    }
    return timetable
}

const generateTimetables = (courses: Course[]): Timetable[] => {

    // Generate all valid combinations of MeetingSections for a course
    const courseMeetingSectionCombos = courses.map(course => courseMeetingSectionCombinations(course))

    const coursesCombinations = courseCombinations(courseMeetingSectionCombos);
    const timetables: Timetable[] = []

    for (const coursesCombo of coursesCombinations) {
        const timetable = createTimetable(coursesCombo)
        if (timetable != null) {
            timetables.push(timetable)
        }
    }

    return timetables
}
export {
    generateTimetables,
    createTimetable,
    overlapExists
}