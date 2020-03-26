import { checkOverlap } from "../index"
const timeOffs = (timetables: Timetable[], timeOffs: Timetable): Timetable[] => {
    const resultTimetables: Timetable[] = []
    for (const timetable of timetables) {
        timetable.MONDAY.push(...timeOffs.MONDAY)
        timetable.TUESDAY.push(...timeOffs.TUESDAY)
        timetable.WEDNESDAY.push(...timeOffs.WEDNESDAY)
        timetable.THURSDAY.push(...timeOffs.THURSDAY)
        timetable.FRIDAY.push(...timeOffs.FRIDAY)
        if (checkOverlap(timetable)) {
            resultTimetables.push(timetable)
        }
    }
    return resultTimetables
}

const idleTime = (timetables: Timetable[], option: String): Timetable => {
    const totalSumList = []
    for (const timetable of timetables) {
        let sum = 0
        let section = 0
        while (section < timetable.MONDAY.length) {
            let section2 = +section + +1
            while (section2 < timetable.MONDAY.length) {
                if (timetable.MONDAY[section].end <
                    timetable.MONDAY[section2].start) {
                    sum += (+timetable.MONDAY[section2].start -
                        +timetable.MONDAY[section].end)
                }
                else {
                    sum += (+timetable.MONDAY[section].start -
                        +timetable.MONDAY[section2].end)
                }
                section2++
            }
            section++
        }
        totalSumList.push(sum)
    }
    let indexOfList = -1
    if (option == "MAX") {
        indexOfList = totalSumList.indexOf(Math.max(...totalSumList))
    }
    else if (option == "MIN") {
        indexOfList = totalSumList.indexOf(Math.max(...totalSumList))
    }
    return timetables[indexOfList]


}