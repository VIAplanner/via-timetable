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
                        start: 57600,
                        end: 61200,
                        location: "NA",
                    },
                ],
            },
        ],
    },
    {
        name: "Introduction to Sociocultural and Linguistic Anthropology",
        courseCode: "ANT102H5F",
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
                    {
                        day: "WEDNESDAY",
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
                    {
                        day: "WEDNESDAY",
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
        name: `Locked Section`,
        courseCode: `LockMONDAY57600`,
        meeting_sections: [
            {
                sectionCode: "L0001",
                instructors: ["NA"],
                times: [
                    {
                        day: "MONDAY",
                        start: 57600,
                        end: 61200,
                        location: "NA",
                    },
                ],
            },
        ],
    },
    {
        name: "Introduction to Sociocultural and Linguistic Anthropology",
        courseCode: "ANT102H5S",
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
                    {
                        day: "WEDNESDAY",
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
                    {
                        day: "WEDNESDAY",
                        start: 57600,
                        end: 61200,
                        location: "IB110",
                    },
                ],
            },
        ],
    },
];

const timeTable = generateTimetables(fallCourses, ["LockMONDAY57600L0001"], winterCourses, ["LockMONDAY57600L0001"]);
console.log(timeTable)
