// this is a test file for the algo


const generateTimetables = require("./index").generateTimetables;

const fallCourses = [
    {
        name: `Locked Section`,
        courseCode: `LockMONDAY57600`,
        meeting_sections: [
            {
                sectionCode: "L0001",
                instructors: ["NA"],
                times: [
                    {
                        day: "MONDAY",
                        start: 54000,
                        end: 57600,
                        location: "NA",
                    },
                ],
            },
        ],
    },
    {
        courseCode: "ANT102H5Y",
        meeting_sections: [
            {
                sectionCode: "L0101",
                instructors: ["NA"],
                times: [
                    {
                        day: "MONDAY",
                        start: 54000,
                        end: 57600,
                        location: "IB110",
                    },
                ],
            },
            {
                sectionCode: "L0102",
                instructors: ["NA"],
                times: [
                    {
                        day: "MONDAY",
                        start: 57600,
                        end: 61200,
                        location: "IB110",
                    },
                ],
            },
        ],
    },
];
const winterCourses = [
    {
        courseCode: "ANT102H5Y",
        meeting_sections: [
            {
                sectionCode: "L0101",
                instructors: ["NA"],
                times: [
                    {
                        day: "MONDAY",
                        start: 54000,
                        end: 57600,
                        location: "IB110",
                    },
                ],
            },
            {
                sectionCode: "L0102",
                instructors: ["NA"],
                times: [
                    {
                        day: "MONDAY",
                        start: 57600,
                        end: 61200,
                        location: "IB110",
                    },
                ],
            },
        ],
    },
];


const timetable = generateTimetables(fallCourses, [], winterCourses, []);
console.log(timetable[0].MONDAY, timetable[1].MONDAY)
