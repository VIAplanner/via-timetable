import { overlapExists } from "../index"
/**
 *
 * Append timeOffs sections to each timetable and check for their validity again
 * @param {Timetable[]} timetables
 * @param {Timetable} timeOffs
 * @returns {Timetable[]}
 */
const timeOffs = (timetables: Timetable[], timeOffs: Timetable): Timetable[] => {
    const resultTimetables: Timetable[] = []
    for (const timetable of timetables) {
        timetable.MONDAY.push(...timeOffs.MONDAY)
        timetable.TUESDAY.push(...timeOffs.TUESDAY)
        timetable.WEDNESDAY.push(...timeOffs.WEDNESDAY)
        timetable.THURSDAY.push(...timeOffs.THURSDAY)
        timetable.FRIDAY.push(...timeOffs.FRIDAY)
        if (overlapExists(timetable)) {
            resultTimetables.push(timetable)
        }
    }
    return resultTimetables
}
/**
 *
 * Helper function of idleTime
 * @param {Timetable} timetable
 * @param {string} day
 * @returns {number}
 */
const idleTimeForDay = (timetable: Timetable, day: string): number => {
    let sum = 0
    let section = 0
    while (section < timetable[day].length) {
        let section2 = +section + +1
        while (section2 < timetable[day].length) {
            if (timetable[day][section].end <
                timetable[day][section2].start) {
                sum += (+timetable[day][section2].start -
                    +timetable[day][section].end)
            }
            else {
                sum += (+timetable[day][section].start -
                    +timetable[day][section2].end)
            }
            section2++
        }
        section++
    }
    return sum
}

/**
 *
 * Based on the option returns the max or min idle time at school timetable from the timetables  
 * @param {Timetable[]} timetables
 * @param {string} option
 * @returns {Timetable}
 */
const idleTime = (timetables: Timetable[], option: string): Timetable => {
    const totalSumList = []
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    for (const timetable of timetables) {
        let sum = 0;
        for (const day of days){
            sum += idleTimeForDay(timetable, day)
        }
        totalSumList.push(sum)
    }
    if (option == "MAX") {
        return timetables[totalSumList.indexOf(Math.max(...totalSumList))]
    }
    else {
        return timetables[totalSumList.indexOf(Math.min(...totalSumList))]
    }
}
export {
    timeOffs,
    idleTime
}