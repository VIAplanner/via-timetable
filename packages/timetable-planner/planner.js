/*Given a set of courses, is there a valid timetable?
What is a valid timetable?
A valid timetable has no conflicts

Next step is to determine if there is a conflict, given a set of courses

Notes
We'll be using info from the meeting sections field of the course JSON
The start and end times are in seconds from 12:00am 


To check conflict, compare the start time of each course to see if it is overlapped by other courses:
A function that determine whether overlapping exists
input: A set of course objects with its corresponding start and end time
courseList = {"CSC108H5F2019LEC0101":[{"Monday":[ "61400", "72800"], "Wednesday":["50400", "54000"],"Friday":["50400", "54000"]}]}
timetable = {"Monday":[[]], "Tuesday":[[]],"Wednesday":[[]],"Thursday":[[]],"Friday":[[]]}
add all the course time to each correspond date, and then compare within the list
if any conflict appears, return invalid
else return valid
for each time interval in the list, take the start time, loop through the list to check if the time is inside the interval of other element
 
If I'm looking at a course json
Determine the types of unique meeting sections
Create a configuration
*/
function overlap(timetable) {
    /**
    @param timetable: dictionary of date as the key, time intervals as the value 
    {"MONDAY":[[]], "TUESDAY":[[]],"WEDNESDAY":[[]],"THURSDAY":[[]],"FRIDAY":[[]]}
    */
    for (var day in timetable) {
        for (var time in timetable[day]) {
            if (timetable[day].length > 1) {
                var time2 = +time + 1;
                while (time2 < timetable[day].length) {
                    var timeStart = timetable[day][time][0];
                    var timeEnd = timetable[day][time][1];
                    var time2Start = timetable[day][time2][0];
                    var time2End = timetable[day][time2][1];
                    if ((timeStart >= time2Start && timeStart < time2End) || (timeEnd > time2Start && timeEnd <= time2End)) {
                        return false;
                    }
                    time2++;
                }
            }
        }
    }
    return true;

}

function bucketCourseByDay(courseList, timesOff) {
    /**
    @returns timetable = {"MONDAY":[], "TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[]}
    @param courseList: map of courses as the key with their time sections as the value  {"title":{"day":[time]}}
    @param timesOff: map of times off section for each day {"timesOff":{"day":[[time]]}}
    day: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]
    time: [start, end] start, end: int in seconds STARTING FROM 12:00AM
    title: String (should not affect the function for now)
    */
    var timetable = { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [] }
    for (var title in courseList) {
        for (var day in courseList[title]) {
            timetable[day].push(courseList[title][day]);
        }
    }
    for (var day in timesOff["timesOff"]) {
        for (var time_section in timesOff["timesOff"][day]) {
            timetable[day].push(timesOff["timesOff"][day][time_section])
        }
    }
    if (overlap(timetable)) {
        return "Valid Timetable";
    } else {
        return "inValid Timetable";
    }
}

function idleTime(setTimetable, maxOrMin) {
    /**
     @param setTimetable: A list of timetable
     [{"MONDAY":[Time Sections], ...}]
     @param maxOrMin: A string 
     "MAX"/"MIN"
     */
    var total = [];
    for (timetable in setTimetable) {
        //sum up all the idle time and store the index
        var sum = 0;
        for (day in setTimetable[timetable]) {
            if (setTimetable[timetable][day].length > 1) {
                for (var time in setTimetable[timetable][day]) {
                    var time2 = +time + 1;
                    while (time2 < setTimetable[timetable][day].length) {
                        var timeEnd = setTimetable[timetable][day][time][1];
                        var time2Start = setTimetable[timetable][day][time2][0];
                        sum += (timeEnd - time2Start);
                        time2++;
                    }

                }
            }

        }
        total.push(sum);

    }
    const indexOfMaxIdletime = total.indexOf(Math.max(total));
    // check for the max and min of the idletimes
    // return based on maxOrMin
    return setTimetable[indexOfMaxIdletime];
}

module.exports = bucketCourseByDay;
