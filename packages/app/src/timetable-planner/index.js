import { courseCombinations, sortCourseSection, } from "./combinations/combinations";
/**
 *
 * Helper function for OverlapExist
 * @param {Timetable} timetable
 * @param {string} day
 * @returns
 */
const checkOverlapForDay = (timetable, day) => {
    let section = 0;
    while (section < timetable[day].length) {
        let section2 = +section + +1;
        while (section2 < timetable[day].length) {
            if ((timetable[day][section].start >= timetable[day][section2].start &&
                timetable[day][section].start < timetable[day][section2].end) ||
                (timetable[day][section].end > timetable[day][section2].start &&
                    timetable[day][section].end <= timetable[day][section2].end)) {
                return true;
            }
            section2++;
        }
        section++;
    }
    return false;
};
/**
 *
 * Checks overlap of course times for each day in a timetable
 * @param {Timetable} timetable
 * @returns {boolean}
 */
const overlapExists = (timetable) => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    let exists = false;
    for (const day of days) {
        exists = exists || checkOverlapForDay(timetable, day);
    }
    return exists;
};
/**
 *
 * Creates timetable by parse the meetingSections into each day and check for validity
 * @param {MeetingSection[]} courseSection
 * @returns {Timetable}
 */
const createTimetable = (courseSection) => {
    let timetable = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: []
    };
    // loop through each course for their lecture and check if the lectures are valid
    const lectureCombo = (courseSection, whichArray = 0, output = []) => {
        courseSection[whichArray].lecture.forEach((arrayElement) => {
            if (whichArray === courseSection.length - 1) {
                // Base case...
                const temp = [...output];
                temp.push(arrayElement);
                for (const lec of temp) {
                    for (const time of lec.times) {
                        const timetableSection = {
                            code: lec.comboCode.substring(0, lec.comboCode.length - 5),
                            sectionCode: lec.sectionCode,
                            instructors: lec.instructors,
                            ...time,
                        };
                        timetable[time.day].push(timetableSection);
                    }
                }
                //if its invalid, clear the timetable and start again
                if (overlapExists(timetable)) {
                    timetable = {
                        MONDAY: [],
                        TUESDAY: [],
                        WEDNESDAY: [],
                        THURSDAY: [],
                        FRIDAY: []
                    };
                }
                else {
                    //check if any course in the combo contains practical
                    let pra = 0
                    for (const section of courseSection) {
                        if (section.practical.length != 0) {
                            pra = courseSection.indexOf(section)
                            break
                        }
                    }
                    if (pra) {
                        //loop through each course for their practical and check if the practicals are valid with the lecture above
                        const practicalCombo = (courseSection, whichArray2 = pra, output2 = []) => {
                            const lecTimetable = Object.assign({}, timetable)
                            courseSection[whichArray2].practical.forEach((arrayElement2) => {
                                if (whichArray2 === courseSection.length - 1) {
                                    // Base case...
                                    const temp = [...output2];
                                    temp.push(arrayElement2);
                                    for (const pra of temp) {
                                        for (const time of pra.times) {
                                            const timetableSection = {
                                                code: pra.comboCode.substring(0, pra.comboCode.length - 5),
                                                sectionCode: pra.sectionCode,
                                                instructors: pra.instructors,
                                                ...time,
                                            };
                                            timetable[time.day].push(timetableSection);
                                        }
                                    }
                                    if (overlapExists(timetable)) {
                                        timetable = lecTimetable
                                    }
                                    else {
                                        let tut = 0
                                        for (const section of courseSection) {
                                            if (section.tutorial.length != 0) {
                                                tut = courseSection.indexOf(section)
                                                break
                                            }
                                        }
                                        if(tut){
                                        const tutorialCombo = (courseSection, whichArray3 = tut, output3 = []) => {
                                            const lecTimetable = Object.assign({}, timetable)
                                            courseSection[whichArray3].tutorial.forEach((arrayElement3) => {
                                                if (whichArray3 === courseSection.length - 1) {
                                                    // Base case...
                                                    const temp = [...output3];
                                                    temp.push(arrayElement3);
                                                    for (const tut of temp) {
                                                        for (const time of pra.times) {
                                                            const timetableSection = {
                                                                code: pra.comboCode.substring(0, tut.comboCode.length - 5),
                                                                sectionCode: tut.sectionCode,
                                                                instructors: tut.instructors,
                                                                ...time,
                                                            };
                                                            timetable[time.day].push(timetableSection);
                                                        }
                                                    }
                                                    if (overlapExists(timetable)) {
                                                        timetable = lecTimetable
                                                    }
                                                    else {
                                                        return
                                                    }
                                                } else {
                                                    // Recursive case...
                                                    const temp = [...output3];
                                                    temp.push(arrayElement3);
                                                    tutorialCombo(courseSection, whichArray3 + 1, temp);
                                                }
                                            })
                                        }
                                    }
                                    else{
                                        return
                                    }
                                        tutorialCombo(courseSection)
                                    }
                                } else {
                                    // Recursive case...
                                    const temp = [...output2];
                                    temp.push(arrayElement2);
                                    practicalCombo(courseSection, whichArray2 + 1, temp);
                                }
                            })
                        }
                        practicalCombo(courseSection)
                    } else {
                        let tut = 0
                        for (const section of courseSection) {
                            if (section.tutorial.length != 0) {
                                tut = courseSection.indexOf(section)
                                break
                            }
                        }
                        //loop through each course for their tutorial and check if the tutorials are valid with the lecture above
                        const tutorialCombo = (courseSection, whichArray3 = tut, output3 = []) => {
                            const lecTimetable = Object.assign({}, timetable)
                            courseSection[whichArray3].tutorial.forEach((arrayElement3) => {
                                if (whichArray3 === courseSection.length - 1) {
                                    // Base case...
                                    const temp = [...output3];
                                    temp.push(arrayElement3);
                                    for (const tut of temp) {
                                        for (const time of pra.times) {
                                            const timetableSection = {
                                                code: tut.comboCode.substring(0, tut.comboCode.length - 5),
                                                sectionCode: tut.sectionCode,
                                                instructors: tut.instructors,
                                                ...time,
                                            };
                                            timetable[time.day].push(timetableSection);
                                        }
                                    }
                                    if (overlapExists(timetable)) {
                                        timetable = lecTimetable
                                    }
                                    else {
                                        return
                                    }
                                } else {
                                    // Recursive case...
                                    const temp = [...output3];
                                    temp.push(arrayElement3);
                                    tutorialCombo(courseSection, whichArray3 + 1, temp);
                                }
                            })
                        }
                        tutorialCombo(courseSection)
                    }
                }
            }
            else {
                // Recursive case...
                const temp = [...output];
                temp.push(arrayElement);
                lectureCombo(courseSection, whichArray + 1, temp);
            }
        });
    };

    lectureCombo(courseSection);
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    for (const day of days) {
        timetable[day].sort((a, b) => {
            return a.start - b.start;
        });
    }
};
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
const generateTimetables = (courses) => {
    // Generate all valid combinations of MeetingSections for a course
    const courseSections = courses.map(course => sortCourseSection(course));
    return createTimetable(courseSections);
};
export { generateTimetables, createTimetable, overlapExists };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGdDQUFnQyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbkc7Ozs7OztHQU1HO0FBQ0gsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQW9CLEVBQUUsR0FBVyxFQUFFLEVBQUU7SUFDN0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsT0FBTyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNwQyxJQUFJLFFBQVEsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM1QixPQUFPLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLO2dCQUNoRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQzdELENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSztvQkFDekQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xFLE9BQU8sSUFBSSxDQUFBO2FBQ2Q7WUFDRCxRQUFRLEVBQUUs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