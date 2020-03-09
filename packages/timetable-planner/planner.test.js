const planner = require("./planner");
const courses = require("./courseMockDataProvider");

test("append correctly?", ()=>{
    var coursesList = {"CSC108H5FL0101":{"MONDAY":[ "61400", "72800"], "WEDNESDAY":["50400", "54000"],"FRIDAY":["25000", "35000"]},"CSC148H5FL0101":{"FRIDAY":["10000", "25000"]}};
    var timesOff = {"timesOff":{"MONDAY":[["100", "200"]]}}
    expect(planner.bucketCourseByDay(coursesList, timesOff)).toBe("Valid Timetable");
});

test("max idle time?", () => {
    var timetables = [{"MONDAY":[{"CSC108H5FL0101":[ "61400", "72800"]},{"CSC107H5FL0101":[ "11400", "22800"]}],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],}]
    expect(planner.idleTime(timetables, "MAX")).toStrictEqual({"MONDAY":[{"CSC108H5FL0101":[ "61400", "72800"]},{"CSC107H5FL0101":[ "11400", "22800"]}],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],});
})
test("min idle time?", () => {
    var timetables = [{"MONDAY":[{"CSC108H5FL0101":[ "61400", "72800"]},{"CSC107H5FL0101":[ "11400", "22800"]}],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],},{"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],}]
    expect(planner.idleTime(timetables, "MIN")).toStrictEqual({"MONDAY":[],"TUESDAY":[],"WEDNESDAY":[],"THURSDAY":[],"FRIDAY":[],});
})