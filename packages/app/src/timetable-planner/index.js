import { sortCourseSection, } from "./combinations/combinations";

/**
 * Search for the first index of course that has type section
 * @param {*} courseSection 
 * @param {*} type 
 */
const searchForSectionIndex = (courseSection, type) => {
    let index = -1
    for (const section of courseSection) {
        if (section[type].length != 0) {
            index = courseSection.indexOf(section)
            break
        }
    }
    return index
}
/**
 * Search for the next index of course that has type section
 * @param {*} courseSection 
 * @param {*} type 
 * @param {*} prevIndex 
 */
const searchForSectionIndexContinue = (courseSection, type, prevIndex) => {
    let index = -1
    for (const section of courseSection) {
        if (section[type].length != 0 && courseSection.indexOf(section) > prevIndex) {
            index = courseSection.indexOf(section)
            break
        }
    }
    return index
}
/**
 * Adds the section to the timetable
 * @param {*} sections 
 * @param {*} timetable 
 */
const addSectionToTimetable = (sections, timetable) => {
    for (const section of sections) {
        for (const time of section.times) {
            const timetableSection = {
                code: section.comboCode.substring(0, section.comboCode.length - 5),
                sectionCode: section.sectionCode,
                instructors: section.instructors,
                ...time,
            };
            timetable[time.day].push(timetableSection);
        }
    }
}

/**
 * Make a complete shallow copy of a timetable
 * @param {*} timetable 
 */
const createShallowCopyOfTimetable = (timetable) => {
    let shallowCopy = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: []
    }
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    for (const day of days) {
        shallowCopy[day].push(...timetable[day])
    }
    return shallowCopy
}

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
    /**
     * How the following recursive work: Take a (lecture/practical/tutorial) section from a course add to a list,
       take another section from next course add to a list, repeat until the last course.
       Add to the current timetable out of the list and check for validity(if there is any conflict between sections)
       If there is a conflict:
            Revert the timetable to the previous state(the timetable without adding any new sections)
            and move to the next section of the courses
       If there is no conflict:  
            return true
        After lecture section, when there is a no conflict of the courses' lecture, it will move on to start append practical sections
         if there are any course that has practical, or else move to tutorial section if there are any, or else return true
        After practical section, if there are any course with tutorial, it will move to tutorial after check for validity
    */
    // lectureCombo.founded are used to terminate "some" function when it continues because of recursion 
    // but a valid timetable is already found
    const lectureCombo = (courseSection, whichArray = 0, output = []) => {
        lectureCombo.founded = 0
        return courseSection[whichArray].lecture.some((arrayElement) => {
            if (whichArray === courseSection.length - 1) {
                // Base case...
                const temp = [...output];
                temp.push(arrayElement);
                addSectionToTimetable(temp, timetable)
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
                    // check if any course in the combo contains practical
                    let pra = searchForSectionIndex(courseSection, "practical")
                    if (pra >= 0) {
                        const prevTimetable = createShallowCopyOfTimetable(timetable)
                        const practicalCombo = (courseSection, whichArray2 = pra, output2 = []) => {
                            let pra2 = searchForSectionIndexContinue(courseSection, "practical", whichArray2)
                            if (pra2 != -1) {
                                return courseSection[whichArray2].practical.some((arrayElement2) => {
                                    // Recursive case...
                                    if (lectureCombo.founded == 1) {
                                        return true
                                    }
                                    const temp = [...output2];
                                    temp.push(arrayElement2);
                                    practicalCombo(courseSection, pra2, temp);
                                })
                            } else {
                                return courseSection[whichArray2].practical.some((arrayElement2) => {
                                    // Base case when reach until the last course that has practical
                                    if (lectureCombo.founded == 1) {
                                        return true
                                    }
                                    const temp = [...output2];
                                    temp.push(arrayElement2);
                                    addSectionToTimetable(temp, timetable)
                                    if (overlapExists(timetable)) {
                                        timetable = createShallowCopyOfTimetable(prevTimetable)
                                    }
                                    else {
                                        let tut = searchForSectionIndex(courseSection, "tutorial")
                                        if (tut >= 0) {
                                            const prevTimetable = createShallowCopyOfTimetable(timetable)
                                            const tutorialCombo = (courseSection, whichArray2 = tut, output2 = []) => {
                                                let tut2 = searchForSectionIndexContinue(courseSection, "tutorial", whichArray2)
                                                if (tut2 != -1) {
                                                    return courseSection[whichArray2].tutorial.some((arrayElement2) => {
                                                        // Recursive case...
                                                        if (lectureCombo.founded == 1) {
                                                            return true
                                                        }
                                                        const temp = [...output2];
                                                        temp.push(arrayElement2);
                                                        tutorialCombo(courseSection, tut2, temp);
                                                    })
                                                } else {
                                                    return courseSection[whichArray2].tutorial.some((arrayElement2) => {
                                                        // Base case when reach until the last course that has tutorial
                                                        if (lectureCombo.founded == 1) {
                                                            return true
                                                        }
                                                        const temp = [...output2];
                                                        temp.push(arrayElement2);
                                                        addSectionToTimetable(temp, timetable)
                                                        if (overlapExists(timetable)) {
                                                            timetable = createShallowCopyOfTimetable(prevTimetable)
                                                        }
                                                        else {
                                                            lectureCombo.founded = 1
                                                            return true
                                                        }
                                                    })
                                                }
                                            }
                                            const tutResult = tutorialCombo(courseSection)
                                            if (tutResult) {
                                                return true
                                            }
                                            if (lectureCombo.founded == 1) {
                                                return true
                                            }
                                        }
                                        else {
                                            lectureCombo.founded = 1
                                            return true
                                        }
                                    }
                                })
                            }
                        }
                        const praResult = practicalCombo(courseSection)
                        if (praResult) {
                            lectureCombo.founded = 1
                            return true
                        }
                    } else {
                        let tut = searchForSectionIndex(courseSection, "tutorial")
                        if (tut >= 0) {
                            const prevTimetable = createShallowCopyOfTimetable(timetable)
                            const tutorialCombo = (courseSection, whichArray2 = tut, output2 = []) => {
                                let tut2 = searchForSectionIndexContinue(courseSection, "tutorial", whichArray2)
                                console.log(tut2)
                                if (tut2 != -1) {
                                    return courseSection[whichArray2].tutorial.some((arrayElement2) => {
                                            // Recursive case...
                                            if (lectureCombo.founded == 1) {
                                                return true
                                            }
                                            const temp = [...output2];
                                            temp.push(arrayElement2);
                                            tutorialCombo(courseSection, tut2, temp);
                                    })
                                } else {
                                    return courseSection[whichArray2].tutorial.some((arrayElement2) => {
                                        // Base case when reach until the last course that has tutorial
                                        if (lectureCombo.founded == 1) {
                                            return true
                                        }
                                        const temp = [...output2];
                                        temp.push(arrayElement2);
                                        addSectionToTimetable(temp, timetable)
                                        console.log(timetable)
                                        if (overlapExists(timetable)) {
                                            console.log("overlap")
                                            timetable = createShallowCopyOfTimetable(prevTimetable)
                                        }
                                        else {
                                            console.log("no overlap")
                                            lectureCombo.founded = 1
                                            return true
                                        }
                                    })
                                }
                            }
                            const tutResult = tutorialCombo(courseSection)
                            if (tutResult) {
                                console.log("tut good")
                                lectureCombo.founded = 1
                                return true
                            }
                        }
                        else {
                            return true
                        }
                        if (lectureCombo.founded == 1) {
                            return true
                        }
                    }
                }
                if (lectureCombo.founded == 1) {
                    return true
                }
            }
            else {
                // Recursive case...
                if (lectureCombo.founded == 1) {
                    return true
                }
                const temp = [...output];
                temp.push(arrayElement);
                lectureCombo(courseSection, whichArray + 1, temp);
            }
        });
    };
    lectureCombo(courseSection)

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    for (const day of days) {
        timetable[day].sort((a, b) => {
            return a.start - b.start;
        });
    }
    return timetable

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
    const timetable = createTimetable(courseSections)
    return [timetable];
};
export { generateTimetables, createTimetable, overlapExists };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGdDQUFnQyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbkc7Ozs7OztHQU1HO0FBQ0gsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQW9CLEVBQUUsR0FBVyxFQUFFLEVBQUU7SUFDN0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsT0FBTyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNwQyxJQUFJLFFBQVEsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM1QixPQUFPLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLO2dCQUNoRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQzdELENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSztvQkFDekQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xFLE9BQU8sSUFBSSxDQUFBO2FBQ2Q7WUFDRCxRQUFRLEVBQUUs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