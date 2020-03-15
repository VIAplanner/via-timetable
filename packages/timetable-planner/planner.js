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
for each time interval in the list, take the start time, loop through the list to check 
if the time is inside the interval of other element
 
If I'm looking at a course json
Determine the types of unique meeting sections
Create a configuration
*/
//helper functions:
function isEmpty(obj) {
    for (var i in obj) {
        return false;
    }
    return true;
}
/**
 * 
 * @param {the course dictionary containing all the sections} course 
 * (e.g. {"CSC108":{"CSC108L0101": times, "CSC108T0101": times, "CSC108T0102":times}}) 
 * 
 * @returns {a collection of the combination of the sections in the course} sectionCombinations 
 * (e.g. [{"CSC108L0101": times, "CSC108T0101":times}, {"CSC108L0101":times, "CSC108T0102":times}])
 * 
 *
 */
function courseSectionCombination(course) {
    var sectionCombinations = [];
    var sectionType = [];
    const courseName = Object.keys(course)[0]
    for (let section in course[courseName]) {
        const sectionName = Object.keys(course[courseName][section])[0];
        if (!(sectionType.includes(sectionName.charAt(9)))) {
            sectionType.push(sectionName.charAt(9));
        }
    }
    for (let section in course[courseName]) {
        const sectionName = Object.keys(course[courseName][section])[0];
        if (sectionName.charAt(9) == "L") {
            const lecture = {};
            lecture[sectionName] = course[courseName][section][sectionName];
            if (sectionType.includes("T")) {
                for (let section2 in course[courseName]) {
                    const sectionName2 = Object.keys(course[courseName][section2])[0];
                    if (sectionName2.charAt(9) == "T") {
                        const tutorial = {};
                        tutorial[sectionName2] = course[courseName][section2][sectionName2];
                        if (sectionType.includes("P")) {
                            for (let section3 in course[courseName]) {
                                const sectionName3 = Object.keys(course[courseName][section3])[0];
                                if (sectionName3.charAt(9) == "P") {
                                    const practice = {};
                                    practice[sectionName3] = course[courseName][section3][sectionName3];
                                    const combination = Object.assign({}, lecture, tutorial, practice);
                                    sectionCombinations.push(combination);
                                }
                            }
                        } else {
                            const combination = Object.assign({}, lecture, tutorial);
                            sectionCombinations.push(combination);
                        }
                    }
                }
            }
            else if (sectionType.includes("P")) {
                for (let section3 in course[courseName]) {
                    const sectionName3 = Object.keys(course[courseName][section3])[0];
                    if (sectionName3.charAt(9) == "P") {
                        const practice = {};
                        practice[sectionName3] = course[courseName][section3][sectionName3];
                        const combination = Object.assign({}, lecture,  practice);
                        sectionCombinations.push(combination);
                    }
                }
            }
            else {
                sectionCombinations.push(lecture);
            }
        }
    }
    return sectionCombinations;
}
/**
 * 
 *  @param {a collection of all the combination of the sections of the course } courseCombinationList 
 *  (e.g. [{"CSC108H5FL0101":times, "CSC108H5FT0101":times},{"CSC148H5FL0101":times, "CSC148H5FT0101":times}])
 *  @returns {a collection of the combination of the courses}
 * (e.g. [{"CSC108H5FL0101":times, "CSC108H5FT0101":times, "CSC148H5FL0101":times, "CSC148H5FT0101":times}])
 * Precondition: max of 5 course in the list
 * 
 */
function courseCombination(courseCombinationList) {
    var numCourses = courseCombinationList.length;
    courseCollection = [];
    for (let section in courseCombinationList[0]) {
        var courseList = courseCombinationList[0][section];
        if (1 < numCourses) {
            for (let section2 in courseCombinationList[1]) {
                Object.assign(courseList, courseCombinationList[1][section2])
                if (2 < numCourses) {
                    for (let section3 in courseCombinationList[2]) {
                        Object.assign(courseList, courseCombinationList[2][section3]);
                        if (3 < numCourses) {
                            for (let section4 in courseCombinationList[3]) {
                                Object.assign(courseList, courseCombinationList[3][section4]);
                                if (4 < numCourses) {
                                    for (let section5 in courseCombinationList[4]) {
                                        Object.assign(courseList, courseCombinationList[4][section5]);
                                        courseCollection.push(courseList);
                                    }
                                } else {
                                    courseCollection.push(courseList);
                                }
                            }
                        } else {
                            courseCollection.push(courseList);
                        }
                    }
                } else {
                    courseCollection.push(courseList);
                }
            }
        } else {
            courseCollection.push(courseList);
        }
    }
    return courseCollection;
}

/**
@param timetable: dictionary of date as the key, time intervals as the value 
{"MONDAY":[TimeSections], "TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[]}
*/
function overlap(timetable) {
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

/**
@returns timetable = {"MONDAY":[TimeSections], "TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[]}
@param courseList: map of courses as the key with their time sections as the value  {"title":{"day":[time]}}
@param timesOff: map of times off section for each day {"timesOff":{"day":[[time]]}}
day: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]
time: [start, end] start, end: int in seconds STARTING FROM 12:00AM
title: String (should not affect the function for now)
@precondition the courseList has no conflict
*/
function bucketCourseByDay(courseList, timesOff) {
    var timetableWithCourse = { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [] }
    for (var title in courseList) {
        for (var day in courseList[title]) {
            var course = {};
            course[title] = courseList[title][day];
            timetableWithCourse[day].push(course);
        }
    }
    for (var day in timesOff["timesOff"]) {
        for (var time_section in timesOff["timesOff"][day]) {
            timetableWithCourse[day].push({ "timesOff": timesOff["timesOff"][day][time_section] })
        }
    }
    if (overlap(timetableWithCourse)) {
        return timetableWithCourse;
    } else {
        return null;
    }
}

/**
 @param setTimetable: A list of timetable
 [{"MONDAY":[TimeSections], ...}]
 @param maxOrMin: A string 
 "MAX"/"MIN"
 */
function idleTime(setTimetable, maxOrMin) {
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
                        if (timeEnd < time2Start) {
                            sum += (+time2Start - +timeEnd);
                        }
                        else {
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
    if (maxOrMin == "MAX") {
        indexOfIdletime = total.indexOf(Math.max(...total));
    }
    else if (maxOrMin == "MIN") {
        indexOfIdletime = total.indexOf(Math.min(...total));
    }
    // check for the max and min of the idletimes
    // return based on maxOrMin
    return setTimetable[indexOfIdletime];
}


/**
 * @param courses: a list of course dictionary
 * 
 */
function parseNametoTimetable(courses, timesOff) {
    //stores the list of lectures from the courses
    var courseList = {};
    //stores the list of tutorial and practice from the courses
    for (var courseIndex in courses) {
        // console.log(courseIndex, courses[courseIndex],courses[courseIndex]["meeting_sections"])
        for (var section in courses[courseIndex]["meeting_sections"]) {
            var sec = courses[courseIndex]["meeting_sections"][section];
            var times = {};
            //set the times to map day as the key, and time section as the value
            for (var time in sec["times"]) {
                times[sec["times"][time]["day"]] = [sec["times"][time]["start"], sec["times"][time]["end"]];
            }
            //ex. "CSC108H5FL0101"
            var courseName = courses[courseIndex]["code"].concat(sec["code"])
            //map the times to the correspond course section
            var timeSection = {};
            timeSection[courseName] = times;
            //ex. "CSC108H5F"
            var courseTitle = courses[courseIndex]["code"];
            //map the course section to the course {courseCode:{courseSection:timeSection}}
            if (courseTitle in courseList) {
                courseList[courseTitle].push(timeSection);
            }
            else {
                courseList[courseTitle] = [timeSection];
            }

        }
    }
    var courseComb = [];
    //creates the combination out of the sections from each course
    for (let courseName in courseList) {
        const course = {}
        course[courseName] = courseList[courseName];
        courseComb.push(courseSectionCombination(course))
    }
    //creates the combination of the sections between the courses
    var courseCollections = courseCombination(courseComb);
    var timetables = []
    // map the course sections to timetable by day 
    for (let courseCollection in courseCollections) {
        var timetable = bucketCourseByDay(courseCollections[courseCollection], timesOff);
        if (timetable != null) {
            timetables.push(timetable);
        }
    }
    // console.log(courseList, courseComb, courseCollections, timetables)
    if (timetables.length > 0) {
        return timetables[0];
    }
    else {
        return null;
    }
}

module.exports = { bucketCourseByDay: bucketCourseByDay, idleTime: idleTime, parseNametoTimetable: parseNametoTimetable };