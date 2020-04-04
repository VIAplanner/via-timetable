import {switchSection, lockSections} from "./selects"
import test from "ava"

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
const emptyTimetable: Timetable = {
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[]
}

const resultEmptyTimetable: Timetable = {
    MONDAY:[ {
        code: 'CSC108H5FL0101',

         day: 'MONDAY',
         duration: 3600,
         end: 36000,
         instructors: [
          'A Petersen',
         ],
         location: 'MN 1270',
         start: 32400,
       },],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[ {
        code: 'CSC108H5FL0101',

         day: 'WEDNESDAY',
         duration: 3600,
         end: 36000,
         instructors: [
          'A Petersen',
         ],
         location: 'MN 1270',
         start: 32400,
       },],
    FRIDAY:[ {
        code: 'CSC108H5FL0101',

         day: 'FRIDAY',
         duration: 3600,
         end: 36000,
         instructors: [
          'A Petersen',
         ],
         location: 'MN 1270',
         start: 32400,
       },]
}

const switchPracticeTimetable: Timetable = {
    MONDAY:[{
               code: 'CSC108H5FP0101',
               day: 'MONDAY',
               duration: 7200,
               end: 39600,
               instructors: [],
               location: 'DH 2010',
               start: 32400,
             },],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[]
}
const resultSwitchPracticeTimetable: Timetable = {
    MONDAY:[{
               code: 'CSC108H5FP0102',
               day: 'MONDAY',
               duration: 7200,
               end: 46800,
               instructors: [],
               location: 'DH 2010',
               start: 39600,
             },],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[]
}

const lockSection: string[] = [
    "CSC108H5FP0102"
]
const lockTimetables: Timetable[] = [
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
        MONDAY: [
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
            code: 'CSC108H5FP0101',
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
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[],
}]
const resultLockTimetables: Timetable[] = [
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
]

test('Test switch section', async t => {
    const switchtoEmpty = switchSection(emptyTimetable,"CSC108H5FL0101", COURSE_L1_P2)
    t.deepEqual(switchtoEmpty, resultEmptyTimetable)
    const switchPractice = switchSection(switchPracticeTimetable,"CSC108H5FP0102", COURSE_L1_P2)
    t.deepEqual(switchPractice, resultSwitchPracticeTimetable)
})

test('Test Lock section', async t => {
    const lockSec = lockSections(lockSection, lockTimetables)
    t.deepEqual(lockSec, resultLockTimetables)

})