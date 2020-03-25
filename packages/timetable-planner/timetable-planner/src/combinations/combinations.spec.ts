import test from 'ava';
import { courseMeetingSectionCombinations, courseCombinations } from "./combinations"


// const COURSE_L2_P4 = {
//     "code": "CSC108H5F",
//     "meeting_sections": [
//         {
//             "code": "L0101",
//             "instructors": ["A Petersen"],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 32400,
//                     "end": 36000,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "WEDNESDAY",
//                     "start": 32400,
//                     "end": 36000,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "FRIDAY",
//                     "start": 32400,
//                     "end": 36000,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }
//             ],
//             "size": 160,
//             "enrolment": 0
//         }, {
//             "code": "L0102",
//             "instructors": ["A Petersen"],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 36000,
//                     "end": 39600,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "WEDNESDAY",
//                     "start": 36000,
//                     "end": 39600,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "FRIDAY",
//                     "start": 36000,
//                     "end": 39600,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }
//             ],
//             "size": 160,
//             "enrolment": 0
//         }, {
//             "code": "P0101",
//             "instructors": [],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 32400,
//                     "end": 39600,
//                     "duration": 7200,
//                     "location": "DH 2010"
//                 }
//             ],
//             "size": 50,
//             "enrolment": 0
//         }, {
//             "code": "P0102",
//             "instructors": [],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 39600,
//                     "end": 46800,
//                     "duration": 7200,
//                     "location": "DH 2010"
//                 }
//             ],
//             "size": 50,
//             "enrolment": 0
//         }, {
//             "code": "P0103",
//             "instructors": [],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 46800,
//                     "end": 54000,
//                     "duration": 7200,
//                     "location": "DH 2010"
//                 }
//             ],
//             "size": 50,
//             "enrolment": 0
//         }, {
//             "code": "P0104",
//             "instructors": [],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 54000,
//                     "end": 61200,
//                     "duration": 7200,
//                     "location": "DH 2010"
//                 }
//             ],
//             "size": 50,
//             "enrolment": 0
//         },
//     ]
// }

// const COURSE_L2_P2 = {
//     "code": "CSC108H5F",
//     "meeting_sections": [
//         {
//             "code": "L0101",
//             "instructors": ["A Petersen"],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 32400,
//                     "end": 36000,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "WEDNESDAY",
//                     "start": 32400,
//                     "end": 36000,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "FRIDAY",
//                     "start": 32400,
//                     "end": 36000,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }
//             ],
//             "size": 160,
//             "enrolment": 0
//         }, {
//             "code": "L0102",
//             "instructors": ["A Petersen"],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 36000,
//                     "end": 39600,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "WEDNESDAY",
//                     "start": 36000,
//                     "end": 39600,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }, {
//                     "day": "FRIDAY",
//                     "start": 36000,
//                     "end": 39600,
//                     "duration": 3600,
//                     "location": "MN 1270"
//                 }
//             ],
//             "size": 160,
//             "enrolment": 0
//         }, {
//             "code": "P0101",
//             "instructors": [],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 32400,
//                     "end": 39600,
//                     "duration": 7200,
//                     "location": "DH 2010"
//                 }
//             ],
//             "size": 50,
//             "enrolment": 0
//         }, {
//             "code": "P0102",
//             "instructors": [],
//             "times": [
//                 {
//                     "day": "MONDAY",
//                     "start": 39600,
//                     "end": 46800,
//                     "duration": 7200,
//                     "location": "DH 2010"
//                 }
//             ],
//             "size": 50,
//             "enrolment": 0
//         }
//     ]
// }

const COURSE_L1_P2: Course = {
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
}

const SECTIONS_L1_P2: CourseMeetingSectionCombinations = {
    code: 'CSC108H5F',
    combinations: [
        [
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
                code: 'P0101',
                instructors: [],
                times: [
                    {
                        day: 'MONDAY',
                        duration: 7200,
                        end: 39600,
                        location: 'DH 2010',
                        start: 32400,
                    },
                ],
            },
        ],
        [
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
        ],
    ],
}

const COURSES_SECTION_L1_P2: MeetingSection[][] = [
    [
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
            code: 'P0101',
            instructors: [],
            times: [
                {
                    day: 'MONDAY',
                    duration: 7200,
                    end: 39600,
                    location: 'DH 2010',
                    start: 32400,
                },
            ],
        },
    ],
    [
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
    ],
]
test('Test Course Meeting Section Combinations', async t => {
    const courseMeetingSectionCombos = courseMeetingSectionCombinations(COURSE_L1_P2)
    t.deepEqual(courseMeetingSectionCombos, SECTIONS_L1_P2);
});
test('Test Course Combination', async t => {
    const courseCombination = courseCombinations([SECTIONS_L1_P2])
    t.deepEqual(courseCombination, COURSES_SECTION_L1_P2)
})