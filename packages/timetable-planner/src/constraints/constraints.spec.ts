import test from 'ava';
import {timeOffs, idleTime} from './constraints';

const timetables: Timetable[] = [{
    FRIDAY: [
        {
            code: "",
        instructors: [],
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            code: "",
        instructors: [],
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {
            code: "",
        instructors: [],
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
        },
    ],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [
        {
            code: "",
        instructors: [],
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
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
const timeOff: Timetable = {
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[],
}
const timeOffsResult: Timetable[] = [
    {
    FRIDAY: [
        {
            code: "",
        instructors: [],
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            code: "",
        instructors: [],
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {
            code: "",
        instructors: [],
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
        },
    ],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [
        {
            code: "",
        instructors: [],
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
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
const idleTimeMaxResult: Timetable = {
    FRIDAY: [
        {
            code: "",
        instructors: [],
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            code: "",
        instructors: [],
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {
            code: "",
        instructors: [],
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
        },
    ],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [
        {
            code: "",
        instructors: [],
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
}
const idleTimeMinResult: Timetable = {
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[],
}

test('Test timeoffs', async t => {
    const timetable = timeOffs(timetables, timeOff)
    t.deepEqual(timetable, timeOffsResult)
})
test('Test max idle time', async t => {
    const timetable = idleTime(timetables, "MAX")
    t.deepEqual(timetable, idleTimeMaxResult)
})
test('Test min idle time', async t => {
    const timetable = idleTime(timetables, "MIN")
    t.deepEqual(timetable, idleTimeMinResult)
})