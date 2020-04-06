import test from 'ava';
import { timeOffs, idleTime } from './constraints';
const timetables = [
    {
        FRIDAY: [
            {
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FP0102',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FP0102',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FP0102',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FP0102',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                day: "MONDAY",
                start: 0,
                end: 1000000,
                duration: 1000000,
                instructors: [],
                location: ""
            }
        ],
        THURSDAY: [{
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FP0102',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FP0102',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FL0101',
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
                code: 'CSC108H5FP0102',
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
                code: 'CSC108H5FL0101',
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
            code: 'CSC108H5FL0101',
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
            code: 'CSC108H5FL0101',
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
            code: 'CSC108H5FP0102',
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
            code: 'CSC108H5FL0101',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RyYWludHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25zdHJhaW50cy9jb25zdHJhaW50cy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRCxNQUFNLFVBQVUsR0FBZ0I7SUFDNUI7UUFDSSxNQUFNLEVBQUU7WUFDTjtnQkFDQyxJQUFJLEVBQUUsZ0JBQWdCO2dCQUVyQixHQUFHLEVBQUUsUUFBUTtnQkFDYixRQUFRLEVBQUUsSUFBSTtnQkFDZCxHQUFHLEVBQUUsS0FBSztnQkFDVixXQUFXLEVBQUU7b0JBQ1osWUFBWTtpQkFDWjtnQkFDRCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsS0FBSyxFQUFFLEtBQUs7YUFDYjtTQUNGO1FBQ0QsTUFBTSxFQUFFO1lBQ047Z0JBQ0MsSUFBSSxFQUFFLGdCQUFnQjtnQkFDckIsR0FBRyxFQUFFLFFBQVE7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsV0FBVyxFQUFFO29CQUNaLFlBQVk7aUJBQ1o7Z0JBQ0QsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLEtBQUssRUFBRSxLQUFLO2FBQ2I7WUFDRDtnQkFDQyxJQUFJLEVBQUUsZ0JBQWdCO2dCQUNyQixHQUFHLEVBQUUsUUFBUTtnQkFDYixRQUFRLEVBQUUsSUFBSTtnQkFDZCxHQUFHLEVBQUUsS0FBSztnQkFDVixXQUFXLEVBQUUsRUFBRTtnQkFDZixRQUFRLEVBQUUsU0FBUztnQkFDbkIsS0FBSyxFQUFFLEtBQUs7YUFDYjtTQUNGO1FBQ0QsUUFBUSxFQUFFLEVBQUU7UUFDWixPQUFPLEVBQUUsRUFBRTtRQUNYLFNBQVMsRUFBRTtZQUNUO2dCQUNDLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3JCLEdBQUcsRUFBRSxXQUFX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