import { courseCombinations, courseMeetingSectionCombinations, } from "./combinations/combinations";
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
 * @param {MeetingSection[]} meetingSectionCombo
 * @returns {Timetable}
 */
const createTimetable = (meetingSectionCombo) => {
    const timetable = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: []
    };
    for (const meetingSection of meetingSectionCombo) {
        for (const time of meetingSection.times) {
            const timetabletime = {
                code: meetingSection.meetingSectionCode,
                instructors: meetingSection.instructors,
                ...time
            };
            timetable[time.day].push(timetabletime);
        }
    }
    if (overlapExists(timetable)) {
        return null;
    }
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    for (const day of days) {
        timetable[day].sort((a, b) => {
            return a.start - b.start;
        });
    }
    return timetable;
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
    const courseMeetingSectionCombos = courses.map(course => courseMeetingSectionCombinations(course));
    const coursesCombinations = courseCombinations(courseMeetingSectionCombos);
    const timetables = [];
    for (const coursesCombo of coursesCombinations) {
        const timetable = createTimetable(coursesCombo);
        if (timetable != null) {
            timetables.push(timetable);
        }
    }
    return timetables;
};
export { generateTimetables, createTimetable, overlapExists };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGdDQUFnQyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbkc7Ozs7OztHQU1HO0FBQ0gsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQW9CLEVBQUUsR0FBVyxFQUFFLEVBQUU7SUFDN0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsT0FBTyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNwQyxJQUFJLFFBQVEsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM1QixPQUFPLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLO2dCQUNoRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQzdELENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSztvQkFDekQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xFLE9BQU8sSUFBSSxDQUFBO2FBQ2Q7WUFDRCxRQUFRLEVBQUUs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