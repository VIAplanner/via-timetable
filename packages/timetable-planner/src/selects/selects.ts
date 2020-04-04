
/**
 *
 * Add the new selected section into the timetable and remove the duplicated section type of the same course 
 * @param {Timetable} timetable
 * @param {string} sectionName
 * @param {Course} course
 * @returns {Timetable}
 */
const switchSection = (timetable: Timetable, sectionName: string, course: Course): Timetable =>{
    
    let tempSections: TimetableSection[] = []
    // Search for the section in the course and convert to Timetable section format
    for (const section of course.meeting_sections){
        if (section.code === sectionName.substring(9)){
            for (const time of section.times){
                tempSections.push({code: course.code + section.code, instructors: section.instructors, ...time})
            }
        }
    }
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    // filter out the duplicate section type from the timetable
    for (const day of days){
        timetable[day] = timetable[day].filter(section => section.code.substring(0,10) != sectionName.substring(0,10))
    }
    for (const section of tempSections){
        timetable[section.day].push(section)
    }
    return timetable
}

/**
 *
 * Filter out the timetables that does not have the sections so the remaining timetables will "lock" the section selected
 * @param {string[]} sections
 * @param {Timetable[]} timetables
 * @returns {Timetable[]}
 */
const lockSections = (sections: string[], timetables: Timetable[]): Timetable[] => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
    const tempTimetables: Timetable[] = []
    for (const timetable of timetables){
        for (const day of days){
            for (const section of timetable[day]){
                if (sections.includes(section.code) && !tempTimetables.includes(timetable)){
                    tempTimetables.push(timetable)
                }
            }
        }
    }
    return tempTimetables
}
export{
    switchSection,
    lockSections
}