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
course_list = {"CSC108H5F2019LEC0101":[{"Monday":[ "61400", "72800"], "Wednesday":["50400", "54000"],"Friday":["50400", "54000"]}]}
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
    //parameter: dictionary of date as the key, time intervals as the value 
    //timetable = {"MONDAY":[[]], "TUESDAY":[[]],"WEDNESDAY":[[]],"THURSDAY":[[]],"FRIDAY":[[]]}
    for (var day in timetable) {
        for (var time in timetable[day]) {
            if (timetable[day].length > 1) {
                var time_2 = +time + 1;
                while (time_2 < timetable[day].length) {
                    var time_1_0 = timetable[day][time][0];
                    var time_1_1 = timetable[day][time][1];
                    var time_2_0 = timetable[day][time_2][0];
                    var time_2_1 = timetable[day][time_2][1];
                    if ((time_1_0 >= time_2_0 && time_1_0 < time_2_1) || (time_1_1 > time_2_0 && time_1_1 <= time_2_1)) {
                        return false;
                    }
                    time_2 ++;
                }
            }
        }
    }
    return true;

}

function bucket_course_by_day(course_list, invalid_time) {
    /*
    return: timetable = {"MONDAY":[], "TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[]}
    parameter: dictionary of courses as the key with their time as the value 
    course_list: {"title":{"day":[time]}}
    invalid_time: {"invalid_time":{"day1":[[time]]}}
    day: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]
    time: [start, end] start, end: int in seconds STARTING FROM 12:00AM
    title: String (should not affect the function for now)
    */
    var timetable = { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [] }
    for (var title in course_list) {
        for (var day in course_list[title]) {
            timetable[day].push(course_list[title][day]);
        }
    }
    for (var day in invalid_time["invalid_time"]) {
        for (var time_section in invalid_time["invalid_time"][day]) {
            timetable[day].push(invalid_time["invalid_time"][day][time_section])
        }
    }
    if (overlap(timetable)) {
        return "Valid Timetable";
    } else {
        return "inValid Timetable";
    }
}

module.exports = bucket_course_by_day;
