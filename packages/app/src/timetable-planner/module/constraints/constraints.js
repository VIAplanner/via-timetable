import { overlapExists } from "../index";
/**
 *
 * Append timeOffs sections to each timetable and check for their validity again
 * @param {Timetable[]} timetables
 * @param {Timetable} timeOffs
 * @returns {Timetable[]}
 */
const timeOffs = (timetables, timeOffs) => {
    const resultTimetables = [];
    for (const timetable of timetables) {
        timetable.MONDAY.push(...timeOffs.MONDAY);
        timetable.TUESDAY.push(...timeOffs.TUESDAY);
        timetable.WEDNESDAY.push(...timeOffs.WEDNESDAY);
        timetable.THURSDAY.push(...timeOffs.THURSDAY);
        timetable.FRIDAY.push(...timeOffs.FRIDAY);
        if (!overlapExists(timetable)) {
            resultTimetables.push(timetable);
        }
    }
    return resultTimetables;
};
/**
 *
 * Helper function of idleTime
 * @param {Timetable} timetable
 * @param {string} day
 * @returns {number}
 */
const idleTimeForDay = (timetable, day) => {
    let sum = 0;
    let section = 0;
    while (section < timetable[day].length) {
        let section2 = +section + +1;
        while (section2 < timetable[day].length) {
            if (timetable[day][section].end <
                timetable[day][section2].start) {
                sum += (+timetable[day][section2].start -
                    +timetable[day][section].end);
            }
            else {
                sum += (+timetable[day][section].start -
                    +timetable[day][section2].end);
            }
            section2++;
        }
        section++;
    }
    return sum;
};
/**
 *
 * Based on the option returns the max or min idle time at school timetable from the timetables
 * @param {Timetable[]} timetables
 * @param {string} option
 * @returns {Timetable}
 */
const idleTime = (timetables, option) => {
    const totalSumList = [];
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    for (const timetable of timetables) {
        let sum = 0;
        for (const day of days) {
            sum += idleTimeForDay(timetable, day);
        }
        totalSumList.push(sum);
    }
    if (option == "MAX") {
        return timetables[totalSumList.indexOf(Math.max(...totalSumList))];
    }
    else {
        return timetables[totalSumList.indexOf(Math.min(...totalSumList))];
    }
};
export { timeOffs, idleTime };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RyYWludHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29uc3RyYWludHMvY29uc3RyYWludHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUN4Qzs7Ozs7O0dBTUc7QUFDSCxNQUFNLFFBQVEsR0FBRyxDQUFDLFVBQXVCLEVBQUUsUUFBbUIsRUFBZSxFQUFFO0lBQzNFLE1BQU0sZ0JBQWdCLEdBQWdCLEVBQUUsQ0FBQTtJQUN4QyxLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtRQUNoQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN6QyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMzQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUMvQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUM3QyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNCLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUNuQztLQUNKO0lBQ0QsT0FBTyxnQkFBZ0IsQ0FBQTtBQUMzQixDQUFDLENBQUE7QUFDRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQW9CLEVBQUUsR0FBVyxFQUFVLEVBQUU7SUFDakUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBO0lBQ1gsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsT0FBTyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNwQyxJQUFJLFFBQVEsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM1QixPQUFPLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUc7Z0JBQzNCLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEdBQUcsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUs7b0JBQ25DLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ3BDO2lCQUNJO2dCQUNELEdBQUcsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUs7b0JBQ2xDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ3JDO1lBQ0QsUUFBUSxFQUFFLENBQUE7U0FDYjtRQUNELE9BQU8sRUFBRSxDQUFBO0tBQ1o7SUFDRCxPQUFPLEdBQUcsQ0FBQTtBQUNkLENBQUMsQ0FBQTtBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sUUFBUSxHQUFHLENBQUMsVUFBdUIsRUFBRSxNQUFjLEVBQWEsRUFBRTtJQUNwRSxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUE7SUFDdkIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDckUsS0FBSyxNQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUU7UUFDaEMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUM7WUFDbkIsR0FBRyxJQUFJLGNBQWMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUE7U0FDeEM7UUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3pCO0lBQ0QsSUFBSSxNQUFNLElBQUksS0FBSyxFQUFFO1FBQ2pCLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNyRTtTQUNHO1FBQ0EsT0FBTyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3JFO0FBQ0wsQ0FBQyxDQUFBO0FBQ0QsT0FBTyxFQUNILFFBQVEsRUFDUixRQUFRLEVBQ1gsQ0FBQSJ9