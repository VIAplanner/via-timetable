import { courseCombinations, courseMeetingSectionCombinations, } from "./combinations/combinations"

const checkOverlap = (timetable: Timetable): boolean => {
    let section = 0
    while (section < timetable.monday.length) {
        const section2 = section + +1
        while (section2 < timetable.monday.length) {
            if ((timetable.monday[section].start >= timetable.monday[section2].start &&
                timetable.monday[section].start < timetable.monday[section2].end) ||
                (timetable.monday[section].end > timetable.monday[section2].start &&
                    timetable.monday[section].end <= timetable.monday[section2].end)) {
                return false
            }
        }
    }
    section = 0
    while (section < timetable.tuesday.length) {
        const section2 = +section + +1
        while (section2 < timetable.tuesday.length) {
            if ((timetable.tuesday[section].start >= timetable.tuesday[section2].start &&
                timetable.tuesday[section].start < timetable.tuesday[section2].end) ||
                (timetable.tuesday[section].end > timetable.tuesday[section2].start &&
                    timetable.tuesday[section].end <= timetable.tuesday[section2].end)) {
                return false
            }
        }
    }
    section = 0
    while (section < timetable.wednesday.length) {
        const section2 = +section + +1
        while (section2 < timetable.wednesday.length) {
            if ((timetable.wednesday[section].start >= timetable.wednesday[section2].start &&
                timetable.wednesday[section].start < timetable.wednesday[section2].end) ||
                (timetable.wednesday[section].end > timetable.wednesday[section2].start &&
                    timetable.wednesday[section].end <= timetable.wednesday[section2].end)) {
                return false
            }
        }
    }
    section = 0
    while (section < timetable.thursday.length) {
        const section2 = +section + +1
        while (section2 < timetable.thursday.length) {
            if ((timetable.thursday[section].start >= timetable.thursday[section2].start &&
                timetable.thursday[section].start < timetable.thursday[section2].end) ||
                (timetable.thursday[section].end > timetable.thursday[section2].start &&
                    timetable.thursday[section].end <= timetable.thursday[section2].end)) {
                return false
            }
        }
    }
    section = 0
    while (section < timetable.friday.length) {
        const section2 = +section + +1
        while (section2 < timetable.friday.length) {
            if ((timetable.friday[section].start >= timetable.friday[section2].start &&
                timetable.friday[section].start < timetable.friday[section2].end) ||
                (timetable.friday[section].end > timetable.friday[section2].start &&
                    timetable.friday[section].end <= timetable.friday[section2].end)) {
                return false
            }
        }
    }
    return true

}

const createTimetable = (meetingSectionCombo: MeetingSection[]): Timetable => {
    const timetable: Timetable = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
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
            timetables.push()
        }
    }

    return timetables
}
export {
    generateTimetables,
    createTimetable
}