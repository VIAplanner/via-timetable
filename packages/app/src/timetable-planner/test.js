const generateTimetables = require("./index").generateTimetables;

const courses = [
    {
        name: `Locked Section`,
        courseCode: `LockMONDAY15`,
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
        name: "Anthro",
        courseCode: "ANT101H5S",
        meeting_sections: [
            {
                sectionCode: "L0101",
                instructors: ["NA"],
                times: [
                    {
                        day: "MONDAY",
                        start: 54000,
                        end: 57600,
                        location: "NA",
                    },
                    {
                        day: "WEDNESDAY",
                        start: 54000,
                        end: 57600,
                        location: "NA",
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
                        location: "NA",
                    },
                    {
                        day: "WEDNESDAY",
                        start: 57600,
                        end: 61200,
                        location: "NA",
                    },
                ],
            },
            {
                sectionCode: "P0101",
                instructors: ["NA"],
                times: [
                    {
                        day: "THURSDAY",
                        start: 32400,
                        end: 36000,
                        location: "NA",
                    },
                ],
            },
        ],
    },
];

const timeTable = generateTimetables(courses, []);
console.log(timeTable)
