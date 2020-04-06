import { courseCombinations, courseMeetingSectionCombinations, } from "./combinations/combinations"

/**
 *
 * Helper function for OverlapExist
 * @param {Timetable} timetable
 * @param {string} day
 * @returns
 */
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

/**
 *
 * Checks overlap of course times for each day in a timetable
 * @param {Timetable} timetable
 * @returns {boolean}
 */
const overlapExists = (timetable: Timetable): boolean => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    let exists = false
    for (const day of days) {
        exists = exists || checkOverlapForDay(timetable, day)
    }
    return exists
}


/**
 *
 * Creates timetable by parse the meetingSections into each day and check for validity
 * @param {MeetingSection[]} meetingSectionCombo
 * @returns {Timetable}
 */
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
            const timetabletime: TimetableSection = {
                code: meetingSection.meetingSectionCode,
                instructors: meetingSection.instructors,
                ...time
            }
            timetable[time.day].push(timetabletime)
        }
    }
    if (overlapExists(timetable)) {
        return null
    }
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    for (const day of days) {
        timetable[day].sort((a, b) => {
            return a.start - b.start
        })
    }
    return timetable
}

/**
 *
 * The main function.
 * Starts from produce all section combinations of each course
 * Produce the combinations of the courses' section combinations
 * Create Timetable for each combinations of section combinations
 * Returns the master list of Timetables
 * @param {Course[]} courses
 * @returns {Timetable[]}
 */
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