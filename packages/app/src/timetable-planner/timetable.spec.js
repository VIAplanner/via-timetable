import test from 'ava';
import { generateTimetables, createTimetable } from './index';
const ONE_COURSE_L1_P2 = [{
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
    }];
const TWO_COURSE_L1_P2 = [
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
];
const RESULT_2_L1_P2 = [
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
        THURSDAY: [
            {
                code: 'CSC318H5ST0101',
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
                code: 'CSC318H5SL0101',
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
            {
                code: 'CSC318H5SL0101',
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
];
const RESULT_1_L1_P2 = [
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
];
const SECTION_L1_P2 = [
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
];
const resultTimetable = {
    FRIDAY: [
        {
            code: 'L0101',
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
            code: 'L0101',
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
            code: 'P0102',
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
            code: 'L0101',
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
test('Test create timetable', async (t) => {
    const timetable = createTimetable(SECTION_L1_P2);
    t.deepEqual(timetable, resultTimetable);
});
test('Test timetable generator', async (t) => {
    const timetable = generateTimetables(ONE_COURSE_L1_P2);
    t.deepEqual(timetable, RESULT_1_L1_P2);
    const timetable2 = generateTimetables(TWO_COURSE_L1_P2);
    t.deepEqual(timetable2, RESULT_2_L1_P2);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXRhYmxlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGltZXRhYmxlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFHN0QsTUFBTSxnQkFBZ0IsR0FBYSxDQUFDO1FBQ2hDLE1BQU0sRUFBRSxXQUFXO1FBQ25CLGtCQUFrQixFQUFFO1lBQ2hCO2dCQUNJLE1BQU0sRUFBRSxPQUFPO2dCQUNmLGFBQWEsRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDN0IsT0FBTyxFQUFFO29CQUNMO3dCQUNJLEtBQUssRUFBRSxRQUFRO3dCQUNmLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSxLQUFLO3dCQUNaLFVBQVUsRUFBRSxJQUFJO3dCQUNoQixVQUFVLEVBQUUsU0FBUztxQkFDeEIsRUFBRTt3QkFDQyxLQUFLLEVBQUUsV0FBVzt3QkFDbEIsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLEtBQUs7d0JBQ1osVUFBVSxFQUFFLElBQUk7d0JBQ2hCLFVBQVUsRUFBRSxTQUFTO3FCQUN4QixFQUFFO3dCQUNDLEtBQUssRUFBRSxRQUFRO3dCQUNmLE9BQU8sRUFBRSxLQUFLO3dCQUNkLEtBQUssRUFBRSxLQUFLO3dCQUNaLFVBQVUsRUFBRSxJQUFJO3dCQUNoQixVQUFVLEVBQUUsU0FBUztxQkFDeEI7aUJBQ0o7YUFDSixFQUFFO2dCQUNDLE1BQU0sRUFBRSxPQUFPO2dCQUNmLGFBQWEsRUFBRSxFQUFFO2dCQUNqQixPQUFPLEVBQUU7b0JBQ0w7d0JBQ0ksS0FBSyxFQUFFLFFBQVE7d0JBQ2YsT0FBTyxFQUFFLEtBQUs7d0JBQ2QsS0FBSyxFQUFFLEtBQUs7d0JBQ1osVUFBVSxFQUFFLElBQUk7d0JBQ2hCLFVBQVUsRUFBRSxTQUFTO3FCQUN4QjtpQkFD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