const bucketCourseByDay = require("./planner");

test("append correctly?", ()=>{
    var coursesList = {"CSC108H5F2019LEC0101":{"MONDAY":[ "61400", "72800"], "WEDNESDAY":["50400", "54000"],"FRIDAY":["25000", "35000"]},"CSC148H5F2019LEC0101":{"FRIDAY":["10000", "25000"]}};
    var timesOff = {"timesOff":{"MONDAY":[["100", "200"]]}}
    expect(bucketCourseByDay(coursesList, timesOff)).toBe("Valid Timetable");
});