/**
 *
 * Append timeOffs sections to each timetable and check for their validity again
 * @param {Timetable[]} timetables
 * @param {Timetable} timeOffs
 * @returns {Timetable[]}
 */
declare const timeOffs: (timetables: Timetable[], timeOffs: Timetable) => Timetable[];
/**
 *
 * Based on the option returns the max or min idle time at school timetable from the timetables
 * @param {Timetable[]} timetables
 * @param {string} option
 * @returns {Timetable}
 */
declare const idleTime: (timetables: Timetable[], option: string) => Timetable;
export { timeOffs, idleTime };
