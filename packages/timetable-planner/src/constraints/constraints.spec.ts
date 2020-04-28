import test from 'ava';
import { timeOffs, idleTime } from './constraints';

const timetables: Timetable[] = [
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
    MONDAY: [
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
    MONDAY: [],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    FRIDAY: [],
  }]
const timetables2: Timetable[] = [
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
    MONDAY: [
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
    MONDAY: [],
    THURSDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    FRIDAY: [],
  }]
const timeOff: Timetable = {
  MONDAY: [],
  THURSDAY: [],
  TUESDAY: [],
  WEDNESDAY: [],
  FRIDAY: [],
}
const timeOffMonday: Timetable = {
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
}
const timeOffsMondayResult: Timetable[] = [
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
  }]
const timeOffsResult: Timetable[] = [
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
    MONDAY: [
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
  }]
const idleTimeMaxResult: Timetable = {
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
}
const idleTimeMinResult: Timetable = {
  MONDAY: [],
  THURSDAY: [],
  TUESDAY: [],
  WEDNESDAY: [],
  FRIDAY: [],
}

test('Test timeoffs', async t => {
  const timetable = timeOffs(timetables, timeOff)
  t.deepEqual(timetable, timeOffsResult)
  const timetableMondayOff = timeOffs(timetables, timeOffMonday)
  t.deepEqual(timetableMondayOff, timeOffsMondayResult)
})
test('Test max idle time', async t => {
  const timetable = idleTime(timetables2, "MAX")
  t.deepEqual(timetable, idleTimeMaxResult)
})
test('Test min idle time', async t => {
  const timetable = idleTime(timetables2, "MIN")
  t.deepEqual(timetable, idleTimeMinResult)
})