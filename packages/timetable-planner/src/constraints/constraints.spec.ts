import test from 'ava';
import {timeOffs, idleTime} from './constraints';

const timetables1: Timetable[] = [{
    FRIDAY: [
        {
            
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {
            
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
const timetables2: Timetable[] = [{
    FRIDAY: [
        {
            
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {
            
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
const timetables3: Timetable[] = [{
    FRIDAY: [
        {
            
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {
            
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
const timeOff2: Timetable = {
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[{
            
        day: 'FRIDAY',
        duration: 3600,
        end: 36000,
        location: 'MN 1270',
        start: 32400,
    },],
}
const timeOffsResult2: Timetable[] = [
{
    MONDAY:[],
    THURSDAY:[],
    TUESDAY:[],
    WEDNESDAY:[],
    FRIDAY:[{
            
        day: 'FRIDAY',
        duration: 3600,
        end: 36000,
        location: 'MN 1270',
        start: 32400,
    },],
}]
const timeOffsResult: Timetable[] = [
    {
    FRIDAY: [
        {
            
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {

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
            
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
    ],
    MONDAY: [
        {
            
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
        },
        {
            
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
    const timetable = timeOffs(timetables1, timeOff)
    t.deepEqual(timetable, timeOffsResult)
    const timetable2 = timeOffs(timetables1, timeOff2)
    t.deepEqual(timetable2, timeOffsResult2)
})
test('Test max idle time', async t => {
    const timetable = idleTime(timetables2, "MAX")
    t.deepEqual(timetable, idleTimeMaxResult)
})
test('Test min idle time', async t => {
    const timetable = idleTime(timetables3, "MIN")
    t.deepEqual(timetable, idleTimeMinResult)
})