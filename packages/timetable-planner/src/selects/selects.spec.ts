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
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[]
}

const switchPracticeTimetable: Timetable = {
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[]
}
const resultSwitchPracticeTimetable: Timetable = {
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[]
}

const lockSection: string[] = [

]
const lockTimetables: Timetable[] = [

] 
const resultLockTimetables: Timetable[] = [

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