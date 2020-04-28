/**
 *
 * Checks overlap of course times for each day in a timetable
 * @param {Timetable} timetable
 * @returns {boolean}
 */
declare const overlapExists: (timetable: Timetable) => boolean;
/**
 *
 * Creates timetable by parse the meetingSections into each day and check for validity
 * @param {MeetingSection[]} meetingSectionCombo
 * @returns {Timetable}
 */
declare const createTimetable: (meetingSectionCombo: MeetingSection[]) => Timetable;
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
declare const generateTimetables: (courses: Course[]) => Timetable[];
export { generateTimetables, createTimetable, overlapExists };
