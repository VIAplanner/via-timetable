import { courseCombinations, courseMeetingSectionCombinations, } from "./combinations/combinations"

const checkOverlap = (timetable: Timetable): boolean => {
    let section = 0
    while (section < timetable.MONDAY.length) {
        let section2 = +section + +1
        while (section2 < timetable.MONDAY.length) {
            if ((timetable.MONDAY[section].start >= timetable.MONDAY[section2].start &&
                timetable.MONDAY[section].start < timetable.MONDAY[section2].end) ||
                (timetable.MONDAY[section].end > timetable.MONDAY[section2].start &&
                    timetable.MONDAY[section].end <= timetable.MONDAY[section2].end)) {
                return false
            }
            section2++
        }
        section++
    }
    section = 0
    while (section < timetable.TUESDAY.length) {
        let section2 = +section + +1
        while (section2 < timetable.TUESDAY.length) {
            if ((timetable.TUESDAY[section].start >= timetable.TUESDAY[section2].start &&
                timetable.TUESDAY[section].start < timetable.TUESDAY[section2].end) ||
                (timetable.TUESDAY[section].end > timetable.TUESDAY[section2].start &&
                    timetable.TUESDAY[section].end <= timetable.TUESDAY[section2].end)) {
                return false
            }
            section2++
        }
        section++
    }
    section = 0
    while (section < timetable.WEDNESDAY.length) {
        let section2 = +section + +1
        while (section2 < timetable.WEDNESDAY.length) {
            if ((timetable.WEDNESDAY[section].start >= timetable.WEDNESDAY[section2].start &&
                timetable.WEDNESDAY[section].start < timetable.WEDNESDAY[section2].end) ||
                (timetable.WEDNESDAY[section].end > timetable.WEDNESDAY[section2].start &&
                    timetable.WEDNESDAY[section].end <= timetable.WEDNESDAY[section2].end)) {
                return false
            }
            section2++
        }
        section++
    }
    section = 0
    while (section < timetable.THURSDAY.length) {
        let section2 = +section + +1
        while (section2 < timetable.THURSDAY.length) {
            if ((timetable.THURSDAY[section].start >= timetable.THURSDAY[section2].start &&
                timetable.THURSDAY[section].start < timetable.THURSDAY[section2].end) ||
                (timetable.THURSDAY[section].end > timetable.THURSDAY[section2].start &&
                    timetable.THURSDAY[section].end <= timetable.THURSDAY[section2].end)) {
                return false
            }
            section2++
        }
        section++
    }
    section = 0
    while (section < timetable.FRIDAY.length) {
        let section2 = +section + +1
        while (section2 < timetable.FRIDAY.length) {
            if ((timetable.FRIDAY[section].start >= timetable.FRIDAY[section2].start &&
                timetable.FRIDAY[section].start < timetable.FRIDAY[section2].end) ||
                (timetable.FRIDAY[section].end > timetable.FRIDAY[section2].start &&
                    timetable.FRIDAY[section].end <= timetable.FRIDAY[section2].end)) {
                return false
            }
            section2++
        }
        section++
    }
    return true

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
    if (checkOverlap(timetable)) {
        return timetable
    }
    else {
        return null
    }
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
    checkOverlap
}