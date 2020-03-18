const planner = require("./planner");
const courses = require("./courseMockDataProvider");

test("max idle time?", () => {
    const timetables = [{"FRIDAY": [{"courseCode": "CSC108H5F","end": "35000","section": "L0101","start": "25000",},{"courseCode": "CSC148H5F","end": "25000","section": "L0101","start": "10000",}],"MONDAY": [{"courseCode": "CSC108H5F","end": "72800","section": "L0101","start": "61400",}, {"courseCode": "timesOff","end": "200","section": "timesOff","start": "100",}],"THURSDAY": [],"TUESDAY": [],"WEDNESDAY": [{"courseCode": "CSC108H5F","end": "54000","section": "L0101","start": "50400",}]}, { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [], }, { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [], }]
    expect(planner.idleTime(timetables, "MAX")).toStrictEqual({"FRIDAY": [{"courseCode": "CSC108H5F", "end": "35000", "section": "L0101", "start": "25000"}, {"courseCode": "CSC148H5F", "end": "25000", "section": "L0101", "start": "10000"}], "MONDAY": [{"courseCode": "CSC108H5F", "end": "72800", "section": "L0101", "start": "61400"}, {"courseCode": "timesOff", "end": "200", "section": "timesOff", "start": "100"}], "THURSDAY": [], "TUESDAY": [], "WEDNESDAY": [{"courseCode": "CSC108H5F", "end": "54000", "section": "L0101", "start": "50400"}]})
})
test("min idle time?", () => {
    const timetables = [{
        "FRIDAY": [
            {
                "courseCode": "CSC108H5F",
                "end": "35000",
                "section": "L0101",
                "start": "25000",
            },
            {
                "courseCode": "CSC148H5F",
                "end": "25000",
                "section": "L0101",
                "start": "10000",
            }],
        "MONDAY": [
            {
                "courseCode": "CSC108H5F",
                "end": "72800",
                "section": "L0101",
                "start": "61400",
            }, {
                "courseCode": "timesOff",
                "end": "200",
                "section": "timesOff",
                "start": "100",
            }],
        "THURSDAY": [],
        "TUESDAY": [],
        "WEDNESDAY": [
            {
                "courseCode": "CSC108H5F",
                "end": "54000",
                "section": "L0101",
                "start": "50400",
            }
        ]
    }, { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [], }, { "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [], }]
    expect(planner.idleTime(timetables, "MIN")).toStrictEqual({ "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [], });
})

test("create from single course", () => {
    // const timetable = {"FRIDAY": [], "MONDAY": [], "THURSDAY": [{"CSC108H5FP0119": [61200, 68400]}], "TUESDAY": [], "WEDNESDAY": [{"CSC108H5FL0107": [64800, 75600]}]}
    const timesOff = { "timesOff": {} };
    // expect(planner.createTimetable(courses.course, timesOff)).toStrictEqual(timetable);
    console.log(planner.createTimetable(courses.course, timesOff));

})
test("create from multiple courses", () => {
    const timesOff = { "timesOff": {} };
    console.log(planner.createTimetable(courses.courses, timesOff));

})