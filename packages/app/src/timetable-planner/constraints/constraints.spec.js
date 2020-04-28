import test from 'ava';
import { timeOffs, idleTime } from './constraints';
const timetables = [
    {
        FRIDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
        MONDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'MONDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC108H5F',
                sectionCode: 'P0102',
                day: 'MONDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },
        ],
        THURSDAY: [],
        TUESDAY: [],
        WEDNESDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        FRIDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
        MONDAY: [],
        THURSDAY: [{
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'THURSDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC108H5F',
                sectionCode: 'P0102',
                day: 'THURSDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },],
        TUESDAY: [],
        WEDNESDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        MONDAY: [],
        THURSDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        FRIDAY: [],
    }
];
const timetables2 = [
    {
        FRIDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
        MONDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'MONDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC108H5F',
                sectionCode: 'P0102',
                day: 'MONDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },
        ],
        THURSDAY: [],
        TUESDAY: [],
        WEDNESDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        FRIDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
        MONDAY: [],
        THURSDAY: [{
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'THURSDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC108H5F',
                sectionCode: 'P0102',
                day: 'THURSDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },],
        TUESDAY: [],
        WEDNESDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        MONDAY: [],
        THURSDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        FRIDAY: [],
    }
];
const timeOff = {
    MONDAY: [],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    FRIDAY: [],
};
const timeOffMonday = {
    MONDAY: [{
            code: "TimeOff",
            sectionCode: "TimeOff",
            day: "MONDAY",
            start: 0,
            end: 1000000,
            duration: 1000000,
            instructors: [],
            location: ""
        }],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    FRIDAY: [],
};
const timeOffsMondayResult = [
    {
        FRIDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
        MONDAY: [{
                code: "TimeOff",
                sectionCode: 'TimeOff',
                day: "MONDAY",
                start: 0,
                end: 1000000,
                duration: 1000000,
                instructors: [],
                location: ""
            }
        ],
        THURSDAY: [{
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'THURSDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC108H5F',
                sectionCode: 'P0102',
                day: 'THURSDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },],
        TUESDAY: [],
        WEDNESDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        MONDAY: [{
                code: "TimeOff",
                sectionCode: 'TimeOff',
                day: "MONDAY",
                start: 0,
                end: 1000000,
                duration: 1000000,
                instructors: [],
                location: ""
            }],
        THURSDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        FRIDAY: [],
    }
];
const timeOffsResult = [
    {
        FRIDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
        MONDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'MONDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC108H5F',
                sectionCode: "P0102",
                day: 'MONDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },
        ],
        THURSDAY: [],
        TUESDAY: [],
        WEDNESDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        FRIDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
        MONDAY: [],
        THURSDAY: [{
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'THURSDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC108H5F',
                sectionCode: "P0102",
                day: 'THURSDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },],
        TUESDAY: [],
        WEDNESDAY: [
            {
                code: 'CSC108H5F',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        MONDAY: [],
        THURSDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        FRIDAY: [],
    }
];
const idleTimeMaxResult = {
    FRIDAY: [
        {
            code: 'CSC108H5F',
            sectionCode: 'L0101',
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            instructors: [
                'A Petersen',
            ],
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            code: 'CSC108H5F',
            sectionCode: 'L0101',
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            instructors: [
                'A Petersen',
            ],
            location: 'MN 1270',
            start: 32400,
        },
        {
            code: 'CSC108H5F',
            sectionCode: "P0102",
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            instructors: [],
            location: 'DH 2010',
            start: 39600,
        },
    ],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [
        {
            code: 'CSC108H5F',
            sectionCode: 'L0101',
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            instructors: [
                'A Petersen',
            ],
            location: 'MN 1270',
            start: 32400,
        },
    ],
};
const idleTimeMinResult = {
    MONDAY: [],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    FRIDAY: [],
};
test('Test timeoffs', async (t) => {
    const timetable = timeOffs(timetables, timeOff);
    t.deepEqual(timetable, timeOffsResult);
    const timetableMondayOff = timeOffs(timetables, timeOffMonday);
    t.deepEqual(timetableMondayOff, timeOffsMondayResult);
});
test('Test max idle time', async (t) => {
    const timetable = idleTime(timetables2, "MAX");
    t.deepEqual(timetable, idleTimeMaxResult);
});
test('Test min idle time', async (t) => {
    const timetable = idleTime(timetables2, "MIN");
    t.deepEqual(timetable, idleTimeMinResult);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RyYWludHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25zdHJhaW50cy9jb25zdHJhaW50cy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxNQUFNLFVBQVUsR0FBZ0I7SUFDOUI7UUFDRSxNQUFNLEVBQUU7WUFDTjtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsV0FBVyxFQUFFLE9BQU87Z0JBQ3BCLEdBQUcsRUFBRSxRQUFRO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLEdBQUcsRUFBRSxLQUFLO2dCQUNWLFdBQVcsRUFBRTtvQkFDWCxZQUFZO2lCQUNiO2dCQUNELFFBQVEsRUFBRSxTQUFTO2dCQUNuQixLQUFLLEVBQUUsS0FBSzthQUNiO1NBQ0Y7UUFDRCxNQUFNLEVBQUU7WUFDTjtnQkFDRSxJQUFJLEVBQUUsV0FBVztnQkFDakIsV0FBVyxFQUFFLE9BQU87Z0JBQ3BCLEdBQUcsRUFBRSxRQUFRO2dCQUNiLFFBQVEsRUFBRSxJQUFJO2dCQUNkLEdBQUcsRUFBRSxLQUFLO2dCQUNWLFdBQVcsRUFBRTtvQkFDWCxZQUFZO2lCQUNiO2dCQUNELFFBQVEsRUFBRSxTQUFTO2dCQUNuQixLQUFLLEVBQUUsS0FBSzthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFdBQVcsRUFBRSxPQUFPO2dCQUNwQixHQUFHLEVBQUUsUUFBUTtnQkFDYixRQUFRLEVBQUUsSUFBSTtnQkFDZCxHQUFHLEVBQUUsS0FBSztnQkFDVixXQUFXLEVBQUUsRUFBRTtnQkFDZixRQUFRLEVBQUUsU0FBUztnQkFDbkIsS0FBSyxFQUFFLEtBQUs7YUFDYjtTQUNGO1FBQ0QsUUFBUSxFQUFFLEVBQUU7UUFDWixPQUFPLEVBQUUsRUFBRTtRQUNY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