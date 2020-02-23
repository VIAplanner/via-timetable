const transform = require("./planner");

test("append correctly?", ()=>{
    var dic_courses = {"CSC108H5F2019LEC0101":[{"MONDAY":[ "61400", "72800"], "WEDNESDAY":["50400", "54000"],"FRIDAY":["25000", "35000"]}],"CSC148H5F2019LEC0101":[{FRIDAY:["20000", "30000"]}]};
    expect(transform(dic_courses)).toBe("inValid Timetable");
})
