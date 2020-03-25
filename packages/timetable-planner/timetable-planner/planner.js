// Given a set of courses, is there a valid timetable?
// What is a valid timetable?
// A valid timetable has no conflicts

// Next step is to determine if there is a conflict, given a set of courses

// Notes
// We'll be using info from the meeting sections field of the course JSON
// The start and end times are in seconds from 12:00am 


//To check conflict, compare the start time of each course to see if it is overlapped by other courses:
// A function that determine whether overlapping exists
// input: A set of course objects with its corresponding start and end time
// dic_courses = {"CSC108H5F2019LEC0101":[{"Monday":[ "61400", "72800"], "Wednesday":["50400", "54000"],"Friday":["50400", "54000"]}]}
// dic_timetable = {"Monday":[[]], "Tuesday":[[]],"Wednesday":[[]],"Thursday":[[]],"Friday":[[]]}
// add all the course time to each correspond date, and then compare within the list
// if any conflict appears, return invalid
// else return valid
// for each time interval in the list, take the start time, loop through the list to check if the time is inside the interval of other element
//  




// If I'm looking at a course json
// Determine the types of unique meeting sections
// Create a configuration

function overlap(dic_timetable) {
    //parameter: dictionary of date as the key, time intervals as the value 
    //dic_timetable = {"MONDAY":[[]], "TUESDAY":[[]],"WEDNESDAY":[[]],"THURSDAY":[[]],"FRIDAY":[[]]}
    for (var date in dic_timetable) {
        for (var time in dic_timetable[date]) {
            if (dic_timetable[date].length > 1) {
                for (var time_2 in dic_timetable[date]) {
                    time_2 = +time + +1;
                    if(time_2 < dic_timetable[date].length){
                        var time_1_0 = dic_timetable[date][time][0];
                        var time_1_1 = dic_timetable[date][time][1];
                        var time_2_0 = dic_timetable[date][time_2][0];
                        var time_2_1 = dic_timetable[date][time_2][1];
                        if ((time_1_0 >= time_2_0 && time_1_0 <= time_2_1) || (time_1_1 >= time_2_0 && time_1_1 <= time_2_1)) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;

}

function transform(dic_courses) {
    //return: dic_timetable = {"MONDAY":[], "TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[]}
    //parameter: dictionary of courses as the key with their time as the value 
    //dic_course: {"title":[{"date":[time]}]}
    //date: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]
    //time: [start, end] start, end: int in seconds STARTING FROM 12:00AM
    //title: String (should not affect the function for now)
    var dic_timetable = { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [] }
    for (var title in dic_courses) {
        for (var dates in dic_courses[title]) {
            for (var date in dic_courses[title][dates]) {
                if (date == "MONDAY") {
                    dic_timetable["MONDAY"].push(dic_courses[title][dates][date]);
                }
                if (date == "TUESDAY") {
                    dic_timetable["TUESDAY"].push(dic_courses[title][dates][date]);
                }
                if (date == "WEDNESDAY") {
                    dic_timetable["WEDNESDAY"].push(dic_courses[title][dates][date]);
                }
                if (date == "THURSDAY") {
                    dic_timetable["THURSDAY"].push(dic_courses[title][dates][date]);
                }
                if (date == "FRIDAY") {
                    dic_timetable["FRIDAY"].push(dic_courses[title][dates][date]);
                }
            }
        }
    }
    if (overlap(dic_timetable)) {
        return "Valid Timetable";
    } else {
        return "inValid Timetable";
    }

}

module.exports = transform;
