import test from 'ava';
import {generateTimetables} from './index'


const ONE_COURSE_L1_P2:Course[] = [{
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
        },{
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
const RESULT_L1_P2:Timetable[] = [{
    monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
}]

test('Test timetable generator', async t => {
    const timetable = generateTimetables(ONE_COURSE_L1_P2)
    t.is(timetable, RESULT_L1_P2);
});
