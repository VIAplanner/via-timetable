const planner = require("./planner");
const courses = require("./courseMockDataProvider");

test("append correctly?", () => {
    const coursesList = { "CSC108H5FL0101": { "MONDAY": ["61400", "72800"], "WEDNESDAY": ["50400", "54000"], "FRIDAY": ["25000", "35000"] }, "CSC148H5FL0101": { "FRIDAY": ["10000", "25000"] } };
    const timesOff = { "timesOff": { "MONDAY": [["100", "200"]] } }
    const timetable = {
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
    };
    expect(planner.bucketCourseByDay(coursesList, timesOff)).toStrictEqual(timetable);
});

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

test("parse single course", () => {
    // const timetable = {"FRIDAY": [], "MONDAY": [], "THURSDAY": [{"CSC108H5FP0119": [61200, 68400]}], "TUESDAY": [], "WEDNESDAY": [{"CSC108H5FL0107": [64800, 75600]}]}
    const timesOff = { "timesOff": {} };
    // expect(planner.parseNametoTimetable(courses.course, timesOff)).toStrictEqual(timetable);
    console.log(planner.parseNametoTimetable(courses.course, timesOff));

})
test("parse multiple courses", () => {
    const timesOff = { "timesOff": {} };
    console.log(planner.parseNametoTimetable(courses.courses, timesOff));

})