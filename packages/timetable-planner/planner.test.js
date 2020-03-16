const planner = require("./planner");
const courses = require("./courseMockDataProvider");

test("append correctly?", ()=>{
    const coursesList = {"CSC108H5FL0101":{"MONDAY":[ "61400", "72800"], "WEDNESDAY":["50400", "54000"],"FRIDAY":["25000", "35000"]},"CSC148H5FL0101":{"FRIDAY":["10000", "25000"]}};
    const timesOff = {"timesOff":{"MONDAY":[["100", "200"]]}}
    const timetable = {"FRIDAY": [{"CSC108H5FL0101": ["25000", "35000"]}, {"CSC148H5FL0101": ["10000", "25000"]}], "MONDAY": [{"CSC108H5FL0101": ["61400", "72800"]}, {"timesOff": ["100", "200"]}], "THURSDAY": [], "TUESDAY": [], "WEDNESDAY": [{"CSC108H5FL0101": ["50400", "54000"]}]};
    expect(planner.bucketCourseByDay(coursesList, timesOff)).toStrictEqual(timetable);
});

test("max idle time?", () => {
    const timetables = [{"MONDAY":[{"CSC108H5FL0101":[ 61400, 72800]},{"CSC107H5FL0101":[ 11400, 22800]}],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],}]
    expect(planner.idleTime(timetables, "MAX")).toStrictEqual({"MONDAY":[{"CSC108H5FL0101":[ 61400, 72800]},{"CSC107H5FL0101":[ 11400, 22800]}],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],});
})
test("min idle time?", () => {
    const timetables = [{"MONDAY":[{"CSC108H5FL0101":[ 61400, 72800]},{"CSC107H5FL0101":[ 11400, 22800]}],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],}]
    expect(planner.idleTime(timetables, "MIN")).toStrictEqual({"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],});
})

test("parse single course", () =>{
    const timetable = {"FRIDAY": [], "MONDAY": [], "THURSDAY": [{"CSC108H5FP0119": [61200, 68400]}], "TUESDAY": [], "WEDNESDAY": [{"CSC108H5FL0107": [64800, 75600]}]}
    const timesOff = {"timesOff":{}};
    expect(planner.parseNametoTimetable(courses.course, timesOff)).toStrictEqual(timetable);

})
test("parse multiple courses", () =>{
    const timesOff = {"timesOff":{}};
    console.log(planner.parseNametoTimetable(courses.courses, timesOff));

})