const bucket_course_by_day = require("./planner");

test("append correctly?", ()=>{
    var courses_list = {"CSC108H5F2019LEC0101":{"MONDAY":[ "61400", "72800"], "WEDNESDAY":["50400", "54000"],"FRIDAY":["25000", "35000"]},"CSC148H5F2019LEC0101":{FRIDAY:["20000", "30000"]}};
    var invalid_time = {"invalid_time":{"MONDAY":[["61400", "72800"]]}}
    expect(bucket_course_by_day(courses_list)).toBe("inValid Timetable");
});
npm run test