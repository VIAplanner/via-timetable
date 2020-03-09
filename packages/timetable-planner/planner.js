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
courseList = {"CSC108H5F2019LEC0101":{"MONDAY":[ "61400", "72800"], "WEDNESDAY":["50400", "54000"],"FRIDAY":["50400", "54000"]}, "CSC369H5F2019LEC0101":{"MONDAY":[ "61400", "72800"], "THURSDAY":["50400", "54000"]}}
timetable = {"MONDAY":[[]], "TUESDAY":[[]],"WEDNESDAY":[[]],"THURSDAY":[[]],"FRIDAY":[[]]}
TimeSection = {"CSC108H5F2019LEC0101":[ "61400", "72800"]}
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
    {"MONDAY":[TimeSections], "TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[]}
    */
    for (var day in timetable) {
        for (var time in timetable[day]) {
            if (timetable[day].length > 1) {
                var time2 = +time + 1;
                while (time2 < timetable[day].length) {
                    courseTitle = Object.keys(timetable[day][time]);
                    courseTitle2 = Object.keys(timetable[day][time2]);
                    var timeStart = timetable[day][time][courseTitle][0];
                    var timeEnd = timetable[day][time][courseTitle][1];
                    var time2Start = timetable[day][time2][courseTitle2][0];
                    var time2End = timetable[day][time2][courseTitle2][1];
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
    @returns timetable = {"MONDAY":[TimeSections], "TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[]}
    @param courseList: map of courses as the key with their time sections as the value  {"title":{"day":[time]}}
    @param timesOff: map of times off section for each day {"timesOff":{"day":[[time]]}}
    day: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]
    time: [start, end] start, end: int in seconds STARTING FROM 12:00AM
    title: String (should not affect the function for now)
    */
    var timetableWithCourse = { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [] }
    for (var title in courseList) {
        for (var day in courseList[title]) {
            timetableWithCourse[day].push({title: courseList[title][day]});
        }
    }
    for (var day in timesOff["timesOff"]) {
        for (var time_section in timesOff["timesOff"][day]) {
            timetableWithCourse[day].push({"timesOff":timesOff["timesOff"][day][time_section]})
        }
    }
    if (overlap(timetableWithCourse)) {
        return true;
    } else {
        return false;
    }
}

function idleTime(setTimetable, maxOrMin) {
    /**
     @param setTimetable: A list of timetable
     [{"MONDAY":[TimeSections], ...}]
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
                        courseTitle = Object.keys(setTimetable[timetable][day][time]);
                        courseTitle2 = Object.keys(setTimetable[timetable][day][time2]);
                        var timeStart = setTimetable[timetable][day][time][courseTitle][0];
                        var timeEnd = setTimetable[timetable][day][time][courseTitle][1];
                        var time2Start = setTimetable[timetable][day][time2][courseTitle2][0];
                        var time2End = setTimetable[timetable][day][time2][courseTitle2][1];
                        if (timeEnd < time2Start){
                            sum += (+time2Start - +timeEnd);
                        }
                        else{
                            sum += (+timeStart - +time2End);
                        }
                        time2++;
                    }

                }
            }

        }
        total.push(sum);

    }
    
    var indexOfIdletime = -1;
    if (maxOrMin == "MAX"){
        indexOfIdletime = total.indexOf(Math.max(...total));
    }
    else if(maxOrMin == "MIN"){
        indexOfIdletime = total.indexOf(Math.min(...total));
    }
    // check for the max and min of the idletimes
    // return based on maxOrMin
    return setTimetable[indexOfIdletime];
}


function parseNametoSections(courses){
    var lecList = {};
    var tutList = {};
    for (courseIndex in courses){
        for (section in courses[courseIndex]["meeting_sections"]){
            var sec = courses[courseIndex]["meeting_sections"][section];
            if (sec["code"][0] == "L"){
                var times = {};
                for (time in sec["times"]){
                    times[sec["times"][time]["day"]] = [sec["times"][time]["start"], sec["times"][time]["end"]];
                }
                var courseName = courses["code"].concat(sec["code"])
                var timeSection = {courseName: times};
                var courseTitle = courses[courseIndex][code];
                if (courseTitle in tutList){
                    LecList[courseTitle].push(timeSection);
                }
                else{
                    lecList[courseTitle] = [timeSection];
                }
            }
            if (sec["code"][0] == "P" || sec["code"][0] == "T"){
                var times = {};
                for (time in sec["times"]){
                    times[sec["times"][time]["day"]] = [sec["times"][time]["start"], sec["times"][time]["end"]];
                }
                var courseName = courses["code"].concat(sec["code"])
                var timeSection = {courseName: times};
                var courseTitle = courses[courseIndex][code];
                if (courseTitle in tutList){
                    tutList[courseTitle].push(timeSection);
                }
                else{
                    tutList[courseTitle] = [timeSection];
                }
            }
        }
    }
}

module.exports = {bucketCourseByDay: bucketCourseByDay, idleTime:idleTime};