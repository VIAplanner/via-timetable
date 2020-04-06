import test from 'ava';
import { generateTimetables, createTimetable } from './index'


const ONE_COURSE_L1_P2: Course[] = [{
    "code": "CSC108H5F",
    "meeting_sections": [
        {
            "code": "L0101",
            "instructors": ["A Petersen"],
            "times": [
                {
                    "day": "MONDAY",
                    "start": 32400,
                    "end": 36000,
                    "duration": 3600,
                    "location": "MN 1270"
                }, {
                    "day": "WEDNESDAY",
                    "start": 32400,
                    "end": 36000,
                    "duration": 3600,
                    "location": "MN 1270"
                }, {
                    "day": "FRIDAY",
                    "start": 32400,
                    "end": 36000,
                    "duration": 3600,
                    "location": "MN 1270"
                }
            ],
        }, {
            "code": "P0101",
            "instructors": [],
            "times": [
                {
                    "day": "MONDAY",
                    "start": 32400,
                    "end": 39600,
                    "duration": 7200,
                    "location": "DH 2010"
                }
            ],
        }, {
            "code": "P0102",
            "instructors": [],
            "times": [
                {
                    "day": "MONDAY",
                    "start": 39600,
                    "end": 46800,
                    "duration": 7200,
                    "location": "DH 2010"
                }
            ],
        }
    ]
}]
const TWO_COURSE_L1_P2: Course[] = [
    {
        "code": "CSC108H5F",
        "meeting_sections": [
            {
                "code": "L0101",
                "instructors": ["A Petersen"],
                "times": [
                    {
                        "day": "MONDAY",
                        "start": 32400,
                        "end": 36000,
                        "duration": 3600,
                        "location": "MN 1270"
                    }, {
                        "day": "WEDNESDAY",
                        "start": 32400,
                        "end": 36000,
                        "duration": 3600,
                        "location": "MN 1270"
                    }, {
                        "day": "FRIDAY",
                        "start": 32400,
                        "end": 36000,
                        "duration": 3600,
                        "location": "MN 1270"
                    }
                ],
            }, {
                "code": "P0101",
                "instructors": [],
                "times": [
                    {
                        "day": "MONDAY",
                        "start": 32400,
                        "end": 39600,
                        "duration": 7200,
                        "location": "DH 2010"
                    }
                ],
            }, {
                "code": "P0102",
                "instructors": [],
                "times": [
                    {
                        "day": "MONDAY",
                        "start": 39600,
                        "end": 46800,
                        "duration": 7200,
                        "location": "DH 2010"
                    }
                ],
            }
        ]
    },
    {
        "code": "CSC318H5S",
        "meeting_sections": [
            {
                "code": "L0101",
                "instructors": ["D Wigdor"],
                "times": [
                    {
                        "day": "TUESDAY",
                        "start": 68400,
                        "end": 75600,
                        "duration": 7200,
                        "location": "MN 2190"
                    }, {
                        "day": "WEDNESDAY",
                        "start": 68400,
                        "end": 75600,
                        "duration": 7200,
                        "location": "MN 2190"
                    }
                ],
            }, {
                "code": "T0101",
                "instructors": [],
                "times": [
                    {
                        "day": "THURSDAY",
                        "start": 68400,
                        "end": 75600,
                        "duration": 7200,
                        "location": "MN 2190"
                    }
                ],
            }
        ]
    }
]
const RESULT_2_L1_P2: Timetable[] = [
    {
        FRIDAY: [
            {
                sectionCode: 'L0101',
                code: 'CSC108H5F',
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
                sectionCode: 'L0101',
                code: 'CSC108H5F',
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
                sectionCode: 'P0102',
                code: 'CSC108H5F',
                day: 'MONDAY',
                duration: 7200,
                end: 46800,
                instructors: [],
                location: 'DH 2010',
                start: 39600,
            },
        ],
        THURSDAY: [
            {
                sectionCode: 'T0101',
                code: 'CSC318H5S',
                day: 'THURSDAY',
                duration: 7200,
                end: 75600,
                instructors: [],
                location: 'MN 2190',
                start: 68400,
            },
        ],
        TUESDAY: [
            {
                code: 'CSC318H5S',
                sectionCode: 'L0101',
                day: 'TUESDAY',
                duration: 7200,
                end: 75600,
                instructors: [
                    'D Wigdor',
                ],
                location: 'MN 2190',
                start: 68400,
            },
        ],
        WEDNESDAY: [
            {
                sectionCode: 'L0101',
                code: 'CSC108H5F',
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                instructors: [
                    'A Petersen',
                ],
                location: 'MN 1270',
                start: 32400,
            },
            {
                code: 'CSC318H5S',
                sectionCode: 'L0101',
                day: 'WEDNESDAY',
                duration: 7200,
                end: 75600,
                instructors: [
                    'D Wigdor',
                ],
                location: 'MN 2190',
                start: 68400,
            },
        ],
    },
]
const RESULT_1_L1_P2: Timetable[] = [
    {
        FRIDAY: [
            {
                sectionCode: 'L0101',
                code: 'CSC108H5S',
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
                code: 'CSC108H5FL0101',
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
]
const SECTION_L1_P2: MeetingSection[] = [
    {
        code: 'L0101',
        instructors: [
            'A Petersen',
        ],
        times: [
            {
                day: 'MONDAY',
                duration: 3600,
                end: 36000,
                location: 'MN 1270',
                start: 32400,
            },
            {
                day: 'WEDNESDAY',
                duration: 3600,
                end: 36000,
                location: 'MN 1270',
                start: 32400,
            },
            {
                day: 'FRIDAY',
                duration: 3600,
                end: 36000,
                location: 'MN 1270',
                start: 32400,
            },
        ],
    },
    {
        code: 'P0102',
        instructors: [],
        times: [
            {
                day: 'MONDAY',
                duration: 7200,
                end: 46800,
                location: 'DH 2010',
                start: 39600,
            },
        ],
    },
]
const resultTimetable: Timetable = {
    FRIDAY: [
        {
            sectionCode: 'L0101',
            code: "CSC108H5F",
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
            sectionCode: 'L0101',
            code: "CSC108H5F",

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
            sectionCode: 'P0102',
            code: "CSC108H5F",

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
            sectionCode: 'L0101',
            code: "CSC108H5F",
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
}
test('Test create timetable', async t => {
    const timetable = createTimetable(SECTION_L1_P2)
    t.deepEqual(timetable, resultTimetable)
})

test('Test timetable generator', async t => {
    const timetable = generateTimetables(ONE_COURSE_L1_P2)
    t.deepEqual(timetable, RESULT_1_L1_P2);
    const timetable2 = generateTimetables(TWO_COURSE_L1_P2)
    t.deepEqual(timetable2, RESULT_2_L1_P2);
});
